/* eslint-disable class-methods-use-this, no-use-before-define */
import { resolve, dirname, isAbsolute, join } from "path";
import { promises as fs } from "fs";
import type { Class } from "type-fest"; // eslint-disable-line import/no-unresolved
import rmUp from "rm-up";
import { PlainItemType, PlainItem, PlainItemOptions } from "../../utils/types";

import { ignoreError } from "../../utils/helper";

/** @ignore */
export interface ItemOptions {
  parent?: Item;
}

/* Options for creating file tree. */
export interface CreateOptions {
  /** Whether to overwrite already existing files. */
  overwrite?: boolean;
  /** Current working directory. */
  cwd?: string;
}

/* Options for removing file tree. */
export interface RemoveOptions {
  /** Delete empty directories up to given path. */
  rmUp?: string;
  /** If true, do not throw if directory to be deleted is not empty. Does not delete directory. */
  ignoreNotEmpty?: boolean;
  /** Current working directory. */
  cwd?: string;
}

/** @ignore */
export default abstract class Item {
  public readonly ConstructorOptions?: ItemOptions;
  public abstract create(options?: CreateOptions): Promise<void>;
  public abstract toObject(): Record<string, any> | string;

  public path: string;

  public constructor(path: string, options: ItemOptions = {}) {
    const { parent } = options;
    if (parent && isAbsolute(path)) throw new Error(`Children cannot have absolute paths. Parent: "${parent.path}" Path: "${path}"`);
    this.path = resolve(parent?.path ? join(parent.path, path) : path);
  }

  protected async mkdirOf(path: string): ReturnType<typeof fs["mkdir"]> {
    return ignoreError("EEXIST", () => fs.mkdir(dirname(path), { recursive: true }));
  }

  public async remove(options: RemoveOptions): Promise<void> {
    await ignoreError("ENOENT", () => fs.unlink(this.path));
    if (options.rmUp !== undefined) await rmUp(dirname(this.path), { stop: options.rmUp, force: true });
  }

  //
  // ─── STATIC METHODS ─────────────────────────────────────────────────────────────
  //
  public static toObject<T extends Item = Item>(this: Class<T>, options: PlainItemOptions<T>): PlainItem<T> {
    return { $type: this.name as PlainItemType, ...options };
  }
}
