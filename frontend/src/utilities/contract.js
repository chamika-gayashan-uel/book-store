import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

export const client = createThirdwebClient({
    clientId: "a6a65d65098e579145be76d5e369638e",
});

export const contract = getContract({
    client,
    chain: defineChain(16602),
    address: "0xaD22b956267EdE88519b0F3Af504d96b5d219cf2",
});
