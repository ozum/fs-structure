import lodashIsPlainObject from "lodash.isplainobject";
import { PlainItem } from "./types";
import Item from "../nodes/abstract/item";

/**
 * Deletes undefined and null values from object.
 *
 * @ignore
 * @param object is the object to clear.
 * @returns given object without undefined and null values.
 */
export function clearEmptyKeys<T extends Record<string, any>>(object: T): T {
  Object.entries(object)
    .filter(([key, value]) => value === undefined || value === null) // eslint-disable-line @typescript-eslint/no-unused-vars
    .forEach(([emptyKey]) => delete object[emptyKey]); // eslint-disable-line no-param-reassign
  return object;
}

/**
 * Executes given function and ignores error with given code.
 *
 * @ignore
 * @param code is the code of Error to ignore.
 * @param func is the function to execute.
 */
export async function ignoreError<T>(codes: string | string[], func: (...args: any[]) => Promise<T>): Promise<T | undefined> {
  const codeList = Array.isArray(codes) ? codes : [codes];
  try {
    return await func();
  } catch (error) {
    if (!codeList.includes(error.code)) throw error;
    return undefined;
  }
}

export function isPlainObject(input: unknown): input is Record<string, any> {
  return lodashIsPlainObject(input) && input !== null;
}

export function isPlainItem<T extends Item>(input: unknown): input is PlainItem<T> {
  return isPlainObject(input) && input.$type !== undefined;
}
