/* eslint-disable no-useless-constructor */
import Container from "./abstract/container";
import Item from "./abstract/item";

/** @ignore */
export default class Root extends Container {
  public constructor(path: string) {
    super(path);
  }

  public flat(): this {
    const newChildren: Item[] = [];
    this.children.forEach((child) => (child instanceof Container ? child.onFlat(newChildren) : newChildren.push(child)));
    this.children = newChildren.sort((a, b) => (a.path.toLocaleLowerCase() > b.path.toLocaleLowerCase() ? 1 : -1));
    return this;
  }
}
