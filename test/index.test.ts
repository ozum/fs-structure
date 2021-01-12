import { join } from "path";
import { promises as fs, existsSync } from "fs";
import { load, create, remove, flat, symlink, tempDir } from "../src/index";

let cwd: string;
const tree = {
  "README.md": "//",
  "bin/index.js": "//",
  "bin/utils/u/s/index.js": "//",
  "node_modules/lodash/index.js": undefined,
  "node_modules/lodash/src/index.js": "//",
  dir: {
    "a1.txt": 1,
    c1: symlink({ target: "./a" }),
  },
};

beforeEach(async () => {
  cwd = await tempDir();
});

afterEach(async () => {
  await fs.rmdir(cwd, { recursive: true });
});

describe("fs-structure", () => {
  it("should create tree to file system.", async () => {
    await create(tree, { cwd });
    const loadedTree = await load(join(cwd));
    await expect(loadedTree).toEqual(flat(tree));
  });

  it("should remove tree from file system.", async () => {
    await create(tree, { cwd });
    await remove(tree, { cwd });
    await expect(await fs.readdir(cwd)).toEqual([]);
  });

  it("should throw non empty dirs when removing tree from file system.", async () => {
    await create(tree, { cwd });
    await fs.writeFile(join(cwd, "dir/extra"), "extra");
    await expect(() => remove(tree, { cwd })).rejects.toThrow("ENOTEMPTY");
  });

  it("should ignore non empty dirs when removing tree from file system with 'ignoreNotEmpty'.", async () => {
    await create(tree, { cwd });
    await fs.writeFile(join(cwd, "dir/extra"), "extra");
    await remove(tree, { cwd, ignoreNotEmpty: true });
    const currentFiles = await fs.readdir(join(cwd, "dir"));
    expect(currentFiles).toEqual(["extra"]);
  });

  it("should not delete empty dirs when remove tree from file system without 'deleteEmptyUp'.", async () => {
    await create(tree, { cwd });
    await remove(tree, { cwd, deleteEmptyUp: undefined });
    await expect(await fs.readdir(cwd)).toEqual(["bin", "node_modules"]);
  });

  it("should delete empty dirs when remove tree from file system.", async () => {
    const oldCwd = process.cwd();
    process.chdir(cwd);
    await create(tree);
    await remove(tree);
    expect([existsSync(cwd), existsSync(join(cwd, "bin"))]).toEqual([true, false]);
    process.chdir(oldCwd);
  });

  it("should ignore system junk files.", async () => {
    await create({ ...tree, "bin/Thumbs.db": "" }, { cwd });
    const loadedTree = await load(join(cwd));
    expect(loadedTree).toEqual(flat(tree));
  });

  it("should ignore 'ENOENT' if path of symlink exists.", async () => {
    await fs.mkdir(join(cwd, "dir"));
    await fs.writeFile(join(cwd, "dir/c1"), "");
    await create(tree, { cwd });
    const loadedTree = await load(join(cwd));
    expect(loadedTree).toEqual(flat(tree));
  });

  it("should throw 'EEXIST' if path of symlink exists without 'overwrite'.", async () => {
    await fs.mkdir(join(cwd, "dir"), { recursive: true });
    await fs.writeFile(join(cwd, "dir/c1"), "");
    await expect(() => create(tree, { cwd, overwrite: false })).rejects.toThrow("EEXIST");
  });

  it("should throw if an item with absolute path added to a dir.", () => {
    expect(() => flat({ a: { "/x": "1" } })).toThrow("Children cannot have absolute paths.");
  });
});
