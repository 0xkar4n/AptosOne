// File: app/api/wallet/route.ts

import { NextResponse } from 'next/server';
import { AptosAccount } from 'aptos';
import crypto from 'crypto';

/**
 * Encrypts the provided text (private key) using AES-256-CBC.
 * Make sure to set the ENCRYPTION_PASSWORD environment variable.
 */
function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  // Derive a key from the password; adjust salt as needed
  const key = crypto.scryptSync(process.env.ENCRYPTION_PASSWORD || 'default_password', 'salt', 32);
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  // Prepend the iv to the encrypted text (separated by a colon) so it can be used for decryption later
  return iv.toString('hex') + ':' + encrypted;
}

/**
 * POST API route to create a new Aptos wallet.
 */
export async function POST(req: Request) {
  try {
    // Create a new Aptos wallet account.
    //const userWalletAddress=await req.json();
    //console.log(userWalletAddress)
    const newAccount = new AptosAccount();

    // Get the wallet's public address and private key.
    // Adjust the methods based on your Aptos SDK version if needed.
    const walletAddress = newAccount.address().toString();
    const privateKey = newAccount.toPrivateKeyObject().privateKeyHex;

    // Encrypt the private key before sending it.
    const encryptedPrivateKey = encrypt(privateKey);

    // Return the wallet details to the frontend.
    return NextResponse.json({
      success: true,
      wallet: {
        walletAddress,
        encryptedPrivateKey,
      },
    });
  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
