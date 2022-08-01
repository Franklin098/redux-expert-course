import { isEven } from "./math";

describe("isEven", () => {
  it("should return true if given an even number", () => {
    // System Under Test SUT
    const result = isEven(2);
    expect(result).toEqual(true);
  });

  it("should return false if given an odd number", () => {
    // System Under Test SUT
    const result = isEven(7);
    expect(result).toEqual(false);
  });
});
