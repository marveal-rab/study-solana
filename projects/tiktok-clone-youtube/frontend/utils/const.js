import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import idl from "./tiktok_solana.json";

export const SOLANA_HOST = clusterApiUrl("devnet");

export const TIKTOK_PROGRAM_ID = new PublicKey(
  "9ioCycbsGo13WasTZDxZ3cYP95HdhZPkYZRwM4NeVqvD"
);

export const TIKTOK_IDL = idl;
