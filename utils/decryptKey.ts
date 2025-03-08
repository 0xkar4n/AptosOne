import crypto from "crypto";

export default function decryptKey(encryptedText: string): string {
    const algorithm = "aes-256-cbc";
    const encryptionPassword = process.env.ENCRYPTION_PASSWORD;
    if (!encryptionPassword) {
      throw new Error("ENCRYPTION_PASSWORD environment variable is not set.");
    }
  
    const key = crypto.scryptSync(encryptionPassword, "salt", 32);
    // Split the stored string into IV and encrypted content
    const parts = encryptedText.split(":");
    if (parts.length !== 2) {
      throw new Error("Invalid encrypted text format");
    }
    const iv = Buffer.from(parts[0], "hex");
    const encrypted = parts[1];
  
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }