import { promises as fs } from "fs";
import Item, { ItemOptions, CreateOptions } from "./abstract/item";
import { clearEmptyKeys, ignoreError } from "../utils/helper";

/** @ignore */
type Type = Parameters<typeof fs["symlink"]>[2];

/** @ignore */
export interface SymlinkOptions extends ItemOptions {
  target: string;
  type?: Type;
}

/** @ignore */
export default class Symlink extends Item {
  public readonly ConstructorOptions?: SymlinkOptions;
  readonly #target: string;
  readonly #type?: Type;

  public constructor(path: string, options: SymlinkOptions) {
    super(path, options);
    this.#target = options.target;
    this.#type = options.type;
  }

  public async create(options: CreateOptions): Promise<void> {
    const ignoredErrors = options.overwrite ? ["EEXIST"] : [];
    if (options.overwrite) await ignoreError("ENOENT", () => fs.unlink(this.path));
    await this.mkdirOf(this.path);
    await ignoreError(ignoredErrors, () => fs.symlink(this.#target, this.path, this.#type));
  }

  public toObject(): { $type: "Symlink"; target: string; type: Type } {
    return clearEmptyKeys({ $type: "Symlink", target: this.#target, type: this.#type });
  }
}
