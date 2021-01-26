# fs-structure

Create and delete files and folders in any structure using object syntax or JSON.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Installation](#installation)
- [Synopsis](#synopsis)
- [Details](#details)
- [fs-structure](#fs-structure)
  - [Table of contents](#table-of-contents)
    - [Type aliases](#type-aliases)
    - [Functions](#functions)
  - [Type aliases](#type-aliases-1)
    - [Tree](#tree)
  - [Functions](#functions-1)
    - [create](#create)
    - [flat](#flat)
    - [load](#load)
    - [remove](#remove)
    - [symlink](#symlink)
    - [tempDir](#tempdir)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Installation

# Synopsis

```ts
import { load, create, remove, flat, symlink } from "fs-structure";
```

```ts
const tree = {
  // Flat style (path as key)
  "README.md": "Write here README content.",
  "src/index.js": "console.log('Hello');",
  "src/helper/util.js": "...",
  "src/helper/main.js": "...",
  "some-link": symlink({ target: "/path/to/some" }), // Using helepr function.
  "other-link": { $type: "Symlink", target: "/path/to/other" }, // Using object.

  // Below files are added to "test" directory". Also paths can be used too.
  test: {
    "index.test.js": "...",
    "helper/util.test.js": "...",
    "helper/main.test.js": "...",
  },
};
```

```ts
await create(tree, { cwd: "/path/to/project" });

const loadedTree = await load("/path/to/project");

await remove(tree, { cwd: "/path/to/project" });

const flatTree = flat(tree);
```

```ts
expect(flatTree).toEqual(loadedTree);
```

# Details

`fs-structure` is a basic module to make it easier to create and delete file and folder structure. Structre can be defined as JS object or loaded from JSON.

- Ignores system files such as `.DS_Store` and `Thumbs.db`. Change with `load(path, { ignoreJunk: false })`
- Deletes empty directories. Change with `remove(tree, { rmUp: undefined });
- Loads tree from file system.
- Provides `flat()` function for easy comparison in tests.

<!-- usage -->

<!-- commands -->

<a name="readmemd"></a>

fs-structure

# fs-structure

## Table of contents

### Type aliases

- [Tree](#tree)

### Functions

- [create](#create)
- [flat](#flat)
- [load](#load)
- [remove](#remove)
- [symlink](#symlink)
- [tempDir](#tempdir)

## Type aliases

### Tree

Ƭ **Tree**: _ItemLike_<Root\>

Defined in: [main.ts:17](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L17)

## Functions

### create

▸ **create**(`input`: [_Tree_](#tree), `options?`: CreateOptions): _Promise_<_void_\>

Creates files and directories in file system using given tree.

#### Example

```typescript
await create({ a: 1, src: { b: 2, c: 2 } });
```

#### Parameters:

| Name      | Type            | Default value | Description                                |
| --------- | --------------- | ------------- | ------------------------------------------ |
| `input`   | [_Tree_](#tree) | -             | is the file tree to create in file system. |
| `options` | CreateOptions   | ...           | -                                          |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:119](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L119)

---

### flat

▸ **flat**(`input`: [_Tree_](#tree), `__namedParameters?`: { `cwd?`: _string_ ; `includeDirs?`: _boolean_ }): [_Tree_](#tree)

Converts given tree to a flat structure. May be used to compare two file tree easily.

#### Example

```typescript
const tree = {
  a: "1"
  src: {
    b: "2",
    c: "3",
  },
};

const flatObject = flat(tree); // { a: 1, "src/b": 2, "src/c": 2 }
```

#### Parameters:

| Name                | Type                                             | Default value | Description        |
| ------------------- | ------------------------------------------------ | ------------- | ------------------ |
| `input`             | [_Tree_](#tree)                                  | -             | is the input tree. |
| `__namedParameters` | { `cwd?`: _string_ ; `includeDirs?`: _boolean_ } | ...           | -                  |

**Returns:** [_Tree_](#tree)

flat object for file system.

Defined in: [main.ts:155](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L155)

---

### load

▸ **load**(`path`: _string_, `__namedParameters?`: { `ignoreJunk?`: _boolean_ ; `includeDirs?`: _boolean_ }): _Promise_<[_Tree_](#tree)\>

Loads file tree from file system and makes it flat.

#### Parameters:

| Name                | Type                                                     | Default value | Description                         |
| ------------------- | -------------------------------------------------------- | ------------- | ----------------------------------- |
| `path`              | _string_                                                 | -             | is the path to load file tree from. |
| `__namedParameters` | { `ignoreJunk?`: _boolean_ ; `includeDirs?`: _boolean_ } | ...           | -                                   |

**Returns:** _Promise_<[_Tree_](#tree)\>

file tree.

Defined in: [main.ts:103](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L103)

---

### remove

▸ **remove**(`input`: [_Tree_](#tree), `options?`: RemoveOptions): _Promise_<_void_\>

Removes files and directories from file system using given tree. Also deletes empty directories.

#### Example

```typescript
await remove({ a: 1, src: { b: 2, c: 2 } });
```

#### Parameters:

| Name      | Type            | Default value | Description                                  |
| --------- | --------------- | ------------- | -------------------------------------------- |
| `input`   | [_Tree_](#tree) | -             | is the file tree to remove from file system. |
| `options` | RemoveOptions   | ...           | -                                            |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:133](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L133)

---

### symlink

▸ **symlink**(`options`: _PlainItemOptions_<Symlink\>): _PlainItem_<Symlink\>

Generates a symlink to be used in file tree.

#### Example

```typescript
await create({
  "src/index.js": "console.log('a')";
  "node_modules": symlink({ target: "./node_modules.nosync" });
})
```

#### Parameters:

| Name      | Type                         | Description      |
| --------- | ---------------------------- | ---------------- |
| `options` | _PlainItemOptions_<Symlink\> | are the options. |

**Returns:** _PlainItem_<Symlink\>

object to create a symlink.

Defined in: [main.ts:170](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L170)

---

### tempDir

▸ **tempDir**(): _Promise_<_string_\>

Creates a random named directory in OS temporary directory.

#### Example

```typescript
let TEMPDIR: string;

beforeAll(async () => {
  TEMPDIR = await tempDir();
});
```

**Returns:** _Promise_<_string_\>

Defined in: [main.ts:184](https://github.com/ozum/fs-structure/blob/efe12fd/src/main.ts#L184)
