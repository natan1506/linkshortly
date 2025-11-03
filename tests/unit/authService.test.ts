import { describe, it, expect } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

describe("Auth Service", () => {
  it("must be generate hash and validate password correct", async () => {
    const password = "123456";
    const hash = await bcrypt.hash(password, 10);
    const isValid = await bcrypt.compare(password, hash);
    expect(isValid).toBe(true);
  });

  it("must be generate token and validate", () => {
    const token = jwt.sign({ userId: 1 }, "test_secret", { expiresIn: "1h" });
    const decoded = jwt.verify(token, "test_secret");
    expect(decoded).toHaveProperty("userId", 1);
  });
});
