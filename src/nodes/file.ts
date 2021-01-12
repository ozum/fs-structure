import { promises as fs } from "fs";
import Item, { ItemOptions, CreateOptions } from "./abstract/item";
import { ignoreError } from "../utils/helper";

/** @ignore */
type Data = Parameters<typeof fs["writeFile"]>[1] | number;

/** @ignore */
export interface FileOptions extends ItemOptions {
  data?: Data;
}

export default class File extends Item {
  public readonly ConstructorOptions?: FileOptions;
  readonly #data: string;

  public constructor(path: string, options: FileOptions) {
    super(path, options);
    this.#data = options.data?.toString() ?? "";
  }

  public async create(options: CreateOptions): Promise<void> {
    const flagOptions = options.overwrite ? {} : { flag: "wx" };
    await this.mkdirOf(this.path);
    await ignoreError("EEXIST", () => fs.writeFile(this.path, this.#data, { ...flagOptions }));
  }

  public toObject(): string {
    return this.#data.toString();
  }
}
