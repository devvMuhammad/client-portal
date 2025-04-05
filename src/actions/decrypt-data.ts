"use server";
import { getAuth } from "@/lib/auth";
import { BuyRedirectArgsType } from "@/types";
import { createDecipheriv, createHash } from "crypto";

export async function decryptData(encryptedData: string, iv: string) {
  const session = await getAuth();
  if (!session) {
    throw new Error("You must be logged in to access this data");
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    throw new Error("NEXTAUTH_SECRET is not set");
  }

  // Derive the key using the same method as in encryption
  const key = createHash("sha256")
    .update(String(secret))
    .digest("hex")
    .slice(0, 32);

  // Create decipher using AES-256-CBC algorithm
  const decipher = createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );

  // Decrypt the data
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");

  // Parse the decrypted JSON string back into an object
  return JSON.parse(decrypted);
}
