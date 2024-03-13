import * as anchor from "@project-serum/anchor";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { TIKTOK_PROGRAM_ID, TIKTOK_IDL } from "./const";

export function getProgramInstance(connection, wallet) {
  if (!wallet.publicKey) {
    throw new WalletNotConnectedError();
  }
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    anchor.AnchorProvider.defaultOptions()
  );
  const program = new anchor.Program(TIKTOK_IDL, TIKTOK_PROGRAM_ID, provider);
  return program;
}
