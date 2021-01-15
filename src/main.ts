/* eslint-disable no-await-in-loop, no-restricted-syntax */

import { join, resolve, sep } from "path";
import { promises as fs } from "fs";
import junk from "junk";
import { tmpdir } from "os";
import { isPlainObject, isPlainItem } from "./utils/helper";
import Item, { CreateOptions, RemoveOptions } from "./nodes/abstract/item";
import Container from "./nodes/abstract/container";
import Dir from "./nodes/dir";
import File from "./nodes/file";
import Symlink from "./nodes/symlink";
import Root from "./nodes/root";

import type { ItemLike, ShortcutValue, PlainItemOptions, PlainContainerShortcut, PlainItem } from "./utils/types";

/** @ignore */
const TYPEOF = { File, Symlink };

/**
 * Get {{Item}} for given plain object by creating {{Item}} instance.
 *
 * @ignore
 * @param path is the path to get item for.
 * @param value is the value of the item. (i.e. content for files, files for directories etc.)
 * @param cwd is the current working directory.
 * @param parent is the parent {{Container}} for created {{Item}}.
 * @returns created {{Item}}.
 */
function getItem(path: string, value: ItemLike<Item> | Item | ShortcutValue<Item>, parent: Container): Item {
  let item: Item;
  if (isPlainItem(value)) item = new TYPEOF[value.$type](path, { parent, ...(value as any) });
  else if (isPlainObject(value)) item = new Dir(path, { parent });
  else item = new File(path, { data: value as any, parent });
  return item;
}

/**
 * Converts given plain object into {{Item}} and adds it to parent.
 *
 * @ignore
 * @param input is the item like object which will be converted to {{Item}} to be added to parent.
 * @param parent is the parent {{Container}}.
 * @returns the parent {{Container}} with added {{Item}}.
 */
function addToParent<T extends Container>(input: ItemLike<Item>, parent: T): T {
  Object.entries(input).forEach(([path, value]) => {
    const item = getItem(path, value, parent);
    if (item instanceof Container) addToParent(value as PlainContainerShortcut<Item>, item);
    parent.add(item);
  });

  return parent;
}

/**
 * Creates {{Item}} tree from given plain object.
 *
 * @ignore
 * @param input is the input object to create tree from.
 * @param cwd is the current working directory.
 * @returns the root {{Container}}.
 */
function getItemTree(input: ItemLike<Container>, cwd = ""): Root {
  const root = new Root(resolve(cwd));
  return addToParent(input, root);
}

/**
 * Loads given path into parent item.
 *
 * @ignore
 * @param path is the path to load.
 * @param parent is the parent item to load file tree.
 * @param options are the options.
 */
async function loadIntoParent<T extends Container>(path: string, parent: T, options: { ignoreJunk?: boolean }): Promise<T> {
  const files = await fs.readdir(path, { withFileTypes: true });
  for (const file of files) {
    if (options.ignoreJunk && junk.is(file.name)) continue; // eslint-disable-line no-continue
    const currentPath = join(path, file.name);
    if (file.isDirectory()) {
      const currentContainer = new Dir(file.name, { parent });
      await loadIntoParent(currentPath, currentContainer, options);
      parent.add(currentContainer);
    } else if (file.isSymbolicLink()) parent.add(new Symlink(file.name, { parent, target: await fs.readlink(currentPath) }));
    else parent.add(new File(file.name, { parent, data: await fs.readFile(currentPath) }));
  }

  return parent;
}

/**
 * Loads file tree from file system and makes it flat.
 *
 * @param path is the path to load file tree from.
 * @param ignoreJunk is whether to ignore system junk files such as `.DS_Store` and `Thumbs.db` etc.
 * @returns file tree.
 */
export async function load(path: string, { ignoreJunk = true } = {}): Promise<ItemLike<Root>> {
  return (await loadIntoParent(path, new Root(path), { ignoreJunk })).flat().toObject();
}

/**
 * Creates files and directories in file system using given tree.
 *
 * @param input is the file tree to create in file system.
 * @param overwrite is whether to overwrite existing files.
 * @param cwd is the current working directory, which is used as path of the {{Root}} item.
 * @example
 * await create({ a: 1, src: { "b": 2, "c": 2 } });
 */
export async function create(input: ItemLike<Root>, options: CreateOptions = {}): Promise<void> {
  const optionsWithDefaults = { overwrite: true, ...options };
  return getItemTree(input, optionsWithDefaults.cwd).create(optionsWithDefaults);
}

/**
 * Removes files and directories from file system using given tree. Also deletes empty directories.
 *
 * @param input is the file tree to remove from file system.
 * @param deleteEmptyUpTo is limit to delete empty directories. All empty directories are deleted up to given limit. By default it uses given `cwd` or `process.cwd`. Empty string means `process.cwd`.
 * @param cwd is the current working directory, which is used as path of the {{Root}} item.
 * @example
 * await remove({ a: 1, src: { "b": 2, "c": 2 } });
 */
export async function remove(input: ItemLike<Root>, options: RemoveOptions = {}): Promise<void> {
  const optionsWithDefaults = { deleteEmptyUp: options.cwd ?? "", ...options };
  return getItemTree(input, optionsWithDefaults.cwd).remove(optionsWithDefaults);
}

/**
 * Converts given tree to a flat structure. May be used to compare two file tree easily.
 *
 * @param input is the input tree.
 * @param cwd is the current working directory, which is used as path of the {{Root}} item.
 * @returns flat object for file system.
 * @example
 * const tree = {
 *   a: "1"
 *   src: {
 *     b: "2",
 *     c: "3",
 *   },
 * };
 *
 * const flatObject = flat(tree); // { a: 1, "src/b": 2, "src/c": 2 }
 */
export function flat(input: ItemLike<Root>, { cwd }: { cwd?: string } = {}): ItemLike<Root> {
  return getItemTree(input, cwd).flat().toObject();
}

/**
 * Generates a symlink to be used in file tree.
 *
 * @param options are the options.
 * @returns object to create a symlink.
 * @example
 * await create({
 *   "src/index.js": "console.log('a')";
 *   "node_modules": symlink({ target: "./node_modules.nosync" });
 * })
 */
export function symlink(options: PlainItemOptions<Symlink>): PlainItem<Symlink> {
  return Symlink.toObject(options);
}

/**
 * Creates a random named directory in OS temporary directory.
 *
 * @example
 * let TEMPDIR: string;
 *
 * beforeAll(async () => {
 *   TEMPDIR = await tempDir();
 * });
 */
export async function tempDir(): Promise<string> {
  return fs.mkdtemp(`${tmpdir()}${sep}`);
}
