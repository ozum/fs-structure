/* eslint-disable no-use-before-define */
import Item from "../nodes/abstract/item";

/** Content which will be written to file. */
export type FileContent = string | number | Uint8Array;

/** Value type for Container/Dir shortcuts. See {{PlainContainerShortcut}} */
export type ShortcutValue<T extends Item> = FileContent | PlainItem<T> | PlainContainerShortcut<T> | undefined;

/**
 * {{Container}} and items in it.
 *
 * @example
 * const dir = {
 *   "path/to/index.js": "console.log(1);",
 *   "path/to/symlink": { $type: "Symlink", target: "./a" },
 * }
 */
export type PlainContainerShortcut<T extends Item> = { [filePath: string]: ShortcutValue<T> };

/** An {{Item}} or object structure convertible to {{Item}}. */
export type ItemLike<T extends Item> = PlainItem<T> | PlainContainerShortcut<T>;

/**
 * Options for function to create plain item.
 *
 * @example
 * const dir = {
 *   "path/to/symlink2": Symlink.toObject({ target: "./a" }), // This builder is equal to below.
 *   "path/to/symlink": { $type: "Symlink", target: "./a" },
 * }
 */
export type PlainItemOptions<T extends Item> = Omit<Exclude<T["ConstructorOptions"], undefined>, "cwd" | "parent">;

/** Plain item type. */
export type PlainItemType = "File" | "Symlink";

/**
 * Plain object convertible to an {{Item}}.
 *
 * @example
 * const symlink = { $type: "Symlink", target: "./a" }
 * const dir = { $type: "Dir", children: [...] }
 */
export type PlainItem<T extends Item> = { $type: PlainItemType } & PlainItemOptions<T>;
