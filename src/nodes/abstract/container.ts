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

  // public toObject({ includeChildren = true }): Record<string, any> {
  //   return includeChildren ? mapToObject(this.children, (child) => [relative(this.path, child.path), child.toObject()]) : super.toObject();
  // }

  public toObject(options: { includeChildren: boolean }): Record<string, any> {
    return options.includeChildren
      ? mapToObject(this.children, (child) => [relative(this.path, child.path), child.toObject(options)])
      : { $type: this.constructor.name };
  }

  public onFlat(newRootChildren: Item[], options: { includeDirs?: boolean }): void {
    if (options.includeDirs) newRootChildren.push(this);
    this.children.forEach((child) => (child instanceof Container ? child.onFlat(newRootChildren, options) : newRootChildren.push(child)));
  }
}
