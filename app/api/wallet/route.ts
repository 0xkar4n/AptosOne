// File: app/api/wallet/route.ts

import { NextResponse } from 'next/server';
import { AptosAccount } from 'aptos';
import crypto from 'crypto';
import { prisma } from '@/utils/prisma';


function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc';
  const encryptionPassword = process.env.ENCRYPTION_PASSWORD;
  if (!encryptionPassword) {
    throw new Error("ENCRYPTION_PASSWORD environment variable is not set.");
  }

  const key = crypto.scryptSync(encryptionPassword , 'salt', 32);
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
    
    const {userWalletAddress }=await req.json();  
    if (!userWalletAddress) {
      return NextResponse.json(
        { error: "Missing userWalletAddress in request body" },
        { status: 400 }
      );
    }
    console.log(userWalletAddress)

    const existingRecord = await prisma.userWallet.findUnique({
      where: { walletAddress: userWalletAddress },
    });
    if (existingRecord) {
      return NextResponse.json(
        { error: "A record already exists for this userWalletAddress." },
        { status: 400 }
      );
    }

    const newAccount = new AptosAccount();
    const aptosOneWalletAddress  = newAccount.address().toString();
    const privateKey = newAccount.toPrivateKeyObject().privateKeyHex;
    
    const encryptedPrivateKey = encrypt(privateKey);

    const createdRecord = await prisma.userWallet.create({
      data: {
        walletAddress: userWalletAddress,
        aptosOneWalletAddress,
        encryptedPrivateKey,
      },
    });

    return Response.json({
      success: true,
      status:200,
      createdRecord,
      privateKey
    });

  } catch (error) {
    console.error('Error creating wallet:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}


export async function GET(req: Request) {
  try {
    // Parse the query parameter from the request URL
    const { searchParams } = new URL(req.url);
    const userWalletAddress = searchParams.get("userWalletAddress");

    console.log(userWalletAddress)

    if (!userWalletAddress) {
      return NextResponse.json(
        { error: "Missing userWalletAddress query param" },
        { status: 400 }
      );
    }

    // Find the record in the database
    const record = await prisma.userWallet.findUnique({
      where: { walletAddress: userWalletAddress },
    });

    if (!record) {
      return NextResponse.json(
        { error: "No record found for the provided userWalletAddress" },
        { status: 404 }
      );
    }
    console.log(record)

    // Return the record
    return NextResponse.json({
      success: true,
      status:200,
      data: {
        aptosOneWalletAddress: record.aptosOneWalletAddress,
        encryptedPrivateKey: record.encryptedPrivateKey,
        createdTime: record.createdTime,
      },
    });
  } catch (error) {
    console.error("Error fetching AptosOne wallet:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}