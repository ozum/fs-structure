import { relative } from "path";
import mapToObject from "array-map-to-object";
import Item, { CreateOptions, RemoveOptions } from "./item";

/** @ignore */
export default abstract class Container extends Item {
  public children: Item[] = [];

  public add(item: Item): void {
    this.children.push(item);
  }

  public async create(options: CreateOptions): Promise<void> {
    await Promise.all(this.children.map((child) => child.create(options)));
  }

  public async remove(options: RemoveOptions): Promise<any> {
    return Promise.all(this.children.map((child) => child.remove(options)));
  }

  public toObject(): Record<string, any> {
    return mapToObject(this.children, (child) => [relative(this.path, child.path), child.toObject()]);
  }

  public onFlat(newRootChildren: Item[]): void {
    this.children.forEach((child) => (child instanceof Container ? child.onFlat(newRootChildren) : newRootChildren.push(child)));
  }
}
