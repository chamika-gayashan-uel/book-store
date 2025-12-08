import express, { Request, Response, NextFunction } from 'express';
import { ethers } from "ethers"

const CONTRACT_ADDRESS = "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512";
const RPC_URL = "http://localhost:8545";

const ABI = [
  {
    "inputs": [],
    "name": "getContacts",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "name", "type": "string" },
          { "internalType": "address", "name": "wallet", "type": "address" }
        ],
        "internalType": "struct Contract.Contact[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];


const router = express.Router();

// Route for Save a new Book
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

    const contacts = await contract.getContacts();

    res.json(contacts);

  } catch (error: any) {
    console.error(error);
    res.status(500).send("Error calling contract");
  }
});

export default router;
