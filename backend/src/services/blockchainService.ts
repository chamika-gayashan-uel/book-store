
// import express, { Request, Response, NextFunction } from 'express';
import { ethers } from "ethers"

const CONTRACT_ADDRESS = "0x7140267F560C271fd0Ec2eDFf2A3a48f63bC5be8";
const RPC_URL = `https://16602.rpc.thirdweb.com/e8N86STjq8E4Hnukg4Um7d7MGvhLpQmHrnmrsZkpIifgriUctNosmL7sj53XXJDrTBTNsP8DcuZNTZjjt-_L9Q`;

const CONTRACT_ABI = [
  {
    "inputs": [],
    "name": "bookCount",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_title", "type": "string" },
      { "internalType": "uint256", "name": "_price", "type": "uint256" },
      { "internalType": "uint256", "name": "_royalty", "type": "uint256" },
      { "internalType": "string", "name": "_bookId", "type": "string" }
    ],
    "name": "mintBook",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_bookId", "type": "string" }],
    "name": "purchaseBook",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_bookId", "type": "string" }],
    "name": "getBook",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "bookId", "type": "string" },
          { "internalType": "string", "name": "title", "type": "string" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "uint256", "name": "royalty", "type": "uint256" },
          { "internalType": "uint256", "name": "totalSales", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" },
          { "internalType": "address payable", "name": "author", "type": "address" }
        ],
        "internalType": "struct BookStore.Book",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLicenses",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "bookId", "type": "string" },
          { "internalType": "address", "name": "licensee", "type": "address" },
          { "internalType": "uint256", "name": "purchasedDate", "type": "uint256" },
          { "internalType": "bool", "name": "isActive", "type": "bool" }
        ],
        "internalType": "struct BookStore.License[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "_user", "type": "address" },
      { "internalType": "string", "name": "_bookId", "type": "string" }
    ],
    "name": "checkAccess",
    "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getBalance",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

export async function mintBook({ title, price, royalty, bookId, WALLET_ADDRESS }: { title: string, price: string, royalty: string, bookId: string, WALLET_ADDRESS: string }) {
  // try {
  //   const priceInWei = ethers.parseEther(price.toString());

  //   const provider = new ethers.JsonRpcProvider(RPC_URL);
  //   const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  //   const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
  //   console.log('✅ Connected to blockchain');

  //   return contacts;

  // } catch (error: any) {
  //   console.error(error);
  //   return ("Error calling contract");
  // }

}


