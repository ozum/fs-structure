/* eslint-disable no-useless-constructor */
import { relative } from "path";
import mapToObject from "array-map-to-object";
import Container from "./abstract/container";
import Item from "./abstract/item";

/** @ignore */
export default class Root extends Container {
  public constructor(path: string) {
    super(path);
  }

  public toObject(options: { includeChildren: boolean }): Record<string, any> {
    return options.includeChildren
      ? super.toObject(options)
      : mapToObject(this.children, (child) => [relative(this.path, child.path), child.toObject(options)]);
  }

  public flat(options: { includeDirs: boolean }): this {
    const newChildren: Item[] = [];
    this.children.forEach((child) => (child instanceof Container ? child.onFlat(newChildren, options) : newChildren.push(child)));
    this.children = newChildren.sort((a, b) => (a.path.toLocaleLowerCase() > b.path.toLocaleLowerCase() ? 1 : -1));
    return this;
  }
}
