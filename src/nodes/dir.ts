import rmUp from "rm-up";
import { promises as fs } from "fs";
import { dirname } from "path";
import Container from "./abstract/container";
import type { CreateOptions, RemoveOptions } from "./abstract/item";
import { ignoreError } from "../utils/helper";

/** @ignore */
export default class Dir extends Container {
  public async create(options: CreateOptions): Promise<void> {
    await fs.mkdir(this.path, { recursive: true });
    await super.create(options);
  }

  public async remove(options: RemoveOptions): Promise<void> {
    const ignoredErrors = options.ignoreNotEmpty ? ["ENOTEMPTY", "ENOENT"] : ["ENOENT"];
    await super.remove(options); // Delete created contents first.
    await ignoreError(ignoredErrors, () => fs.rmdir(this.path));
    if (options.rmUp !== undefined) await rmUp(dirname(this.path), { stop: options.rmUp, force: true });
  }
}
