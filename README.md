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
    - [FileContent](#filecontent)
    - [ItemLike](#itemlike)
    - [PlainContainerShortcut](#plaincontainershortcut)
    - [PlainItem](#plainitem)
    - [PlainItemOptions](#plainitemoptions)
    - [PlainItemType](#plainitemtype)
    - [ShortcutValue](#shortcutvalue)
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
- Deletes empty directories. Change with `remove(tree, { deleteEmptyUp: undefined });
- Loads tree from file system.
- Provides `flat()` function for easy comparison in tests.

<!-- usage -->

<!-- commands -->

<a name="readmemd"></a>

fs-structure

# fs-structure

## Table of contents

### Type aliases

- [FileContent](#filecontent)
- [ItemLike](#itemlike)
- [PlainContainerShortcut](#plaincontainershortcut)
- [PlainItem](#plainitem)
- [PlainItemOptions](#plainitemoptions)
- [PlainItemType](#plainitemtype)
- [ShortcutValue](#shortcutvalue)

### Functions

- [create](#create)
- [flat](#flat)
- [load](#load)
- [remove](#remove)
- [symlink](#symlink)
- [tempDir](#tempdir)

## Type aliases

### FileContent

Ƭ **FileContent**: _string_ \| _number_ \| Uint8Array

Content which will be written to file.

Defined in: [utils/types.ts:5](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L5)

---

### ItemLike

Ƭ **ItemLike**<T\>: [_PlainItem_](#plainitem)<T\> \| [_PlainContainerShortcut_](#plaincontainershortcut)<T\>

An or object structure convertible to .

#### Type parameters:

| Name | Type |
| ---- | ---- |
| `T`  | Item |

Defined in: [utils/types.ts:22](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L22)

---

### PlainContainerShortcut

Ƭ **PlainContainerShortcut**<T\>: { [filePath: string]: [_ShortcutValue_](#shortcutvalue)<T\>; }

and items in it.

#### Example

```typescript
const dir = {
  "path/to/index.js": "console.log(1);",
  "path/to/symlink": { $type: "Symlink", target: "./a" },
};
```

#### Type parameters:

| Name | Type |
| ---- | ---- |
| `T`  | Item |

Defined in: [utils/types.ts:19](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L19)

---

### PlainItem

Ƭ **PlainItem**<T\>: { `$type`: [_PlainItemType_](#plainitemtype) } & [_PlainItemOptions_](#plainitemoptions)<T\>

Plain object convertible to an .

#### Example

```typescript
const symlink = { $type: "Symlink", target: "./a" }
const dir = { $type: "Dir", children: [...] }
```

#### Type parameters:

| Name | Type |
| ---- | ---- |
| `T`  | Item |

Defined in: [utils/types.ts:45](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L45)

---

### PlainItemOptions

Ƭ **PlainItemOptions**<T\>: _Omit_<_Exclude_<T[*ConstructorOptions*], _undefined_\>, _cwd_ \| _parent_\>

Options for function to create plain item.

#### Example

```typescript
const dir = {
  "path/to/symlink2": Symlink.toObject({ target: "./a" }), // This builder is equal to below.
  "path/to/symlink": { $type: "Symlink", target: "./a" },
};
```

#### Type parameters:

| Name | Type |
| ---- | ---- |
| `T`  | Item |

Defined in: [utils/types.ts:33](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L33)

---

### PlainItemType

Ƭ **PlainItemType**: _File_ \| _Symlink_

Plain item type.

Defined in: [utils/types.ts:36](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L36)

---

### ShortcutValue

Ƭ **ShortcutValue**<T\>: [_FileContent_](#filecontent) \| [_PlainItem_](#plainitem)<T\> \| [_PlainContainerShortcut_](#plaincontainershortcut)<T\> \| _undefined_

Value type for Container/Dir shortcuts. See

#### Type parameters:

| Name | Type |
| ---- | ---- |
| `T`  | Item |

Defined in: [utils/types.ts:8](https://github.com/ozum/fs-structure/blob/9e6e49a/src/utils/types.ts#L8)

## Functions

### create

▸ **create**(`input`: [_ItemLike_](#itemlike)<Root\>, `options?`: CreateOptions): _Promise_<_void_\>

Creates files and directories in file system using given tree.

#### Example

```typescript
await create({ a: 1, src: { b: 2, c: 2 } });
```

#### Parameters:

| Name      | Type                           | Default value | Description                                |
| --------- | ------------------------------ | ------------- | ------------------------------------------ |
| `input`   | [_ItemLike_](#itemlike)<Root\> | -             | is the file tree to create in file system. |
| `options` | CreateOptions                  | ...           | -                                          |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:113](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L113)

---

### flat

▸ **flat**(`input`: [_ItemLike_](#itemlike)<Root\>, `__namedParameters?`: { `cwd?`: _string_ }): [_ItemLike_](#itemlike)<Root\>

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

| Name                | Type                           | Default value | Description        |
| ------------------- | ------------------------------ | ------------- | ------------------ |
| `input`             | [_ItemLike_](#itemlike)<Root\> | -             | is the input tree. |
| `__namedParameters` | { `cwd?`: _string_ }           | ...           | -                  |

**Returns:** [_ItemLike_](#itemlike)<Root\>

flat object for file system.

Defined in: [main.ts:149](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L149)

---

### load

▸ **load**(`path`: _string_, `__namedParameters?`: { `ignoreJunk`: }): _Promise_<[_ItemLike_](#itemlike)<Root\>\>

Loads file tree from file system and makes it flat.

#### Parameters:

| Name                | Type              | Default value | Description                         |
| ------------------- | ----------------- | ------------- | ----------------------------------- |
| `path`              | _string_          | -             | is the path to load file tree from. |
| `__namedParameters` | { `ignoreJunk`: } | ...           | -                                   |

**Returns:** _Promise_<[_ItemLike_](#itemlike)<Root\>\>

file tree.

Defined in: [main.ts:100](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L100)

---

### remove

▸ **remove**(`input`: [_ItemLike_](#itemlike)<Root\>, `options?`: RemoveOptions): _Promise_<_void_\>

Removes files and directories from file system using given tree. Also deletes empty directories.

#### Example

```typescript
await remove({ a: 1, src: { b: 2, c: 2 } });
```

#### Parameters:

| Name      | Type                           | Default value | Description                                  |
| --------- | ------------------------------ | ------------- | -------------------------------------------- |
| `input`   | [_ItemLike_](#itemlike)<Root\> | -             | is the file tree to remove from file system. |
| `options` | RemoveOptions                  | ...           | -                                            |

**Returns:** _Promise_<_void_\>

Defined in: [main.ts:127](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L127)

---

### symlink

▸ **symlink**(`options`: [_PlainItemOptions_](#plainitemoptions)<Symlink\>): [_PlainItem_](#plainitem)<Symlink\>

Generates a symlink to be used in file tree.

#### Example

```typescript
await create({
  "src/index.js": "console.log('a')";
  "node_modules": symlink({ target: "./node_modules.nosync" });
})
```

#### Parameters:

| Name      | Type                                              | Description      |
| --------- | ------------------------------------------------- | ---------------- |
| `options` | [_PlainItemOptions_](#plainitemoptions)<Symlink\> | are the options. |

**Returns:** [_PlainItem_](#plainitem)<Symlink\>

object to create a symlink.

Defined in: [main.ts:164](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L164)

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

Defined in: [main.ts:178](https://github.com/ozum/fs-structure/blob/9e6e49a/src/main.ts#L178)
