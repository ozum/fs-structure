import { ignoreError } from "../../src/utils/helper";

async function thrower(code: string): Promise<void | "success"> {
  const error: Error & { code?: string } = new Error("Message");
  error.code = code;
  return new Promise((resolve, reject) => setTimeout(() => reject(error), 1));
}

describe("ignoreError", () => {
  it("should throw error not in list", async () => {
    await expect(ignoreError("x", () => thrower("y"))).rejects.toThrow("Message");
  });

  it("should not throw error in list", async () => {
    const result = await ignoreError(["x", "y"], () => thrower("y"));
    expect(result).toBeUndefined();
  });
});
