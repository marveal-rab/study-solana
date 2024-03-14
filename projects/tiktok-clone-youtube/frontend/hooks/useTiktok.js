import { useWallet } from "@solana/wallet-adapter-react";
import { getProgramInstance } from "../utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOLANA_HOST } from "../utils/const";

const anchor = require("@project-serum/anchor");
const utf8 = anchor.utils.bytes.utf8;
const { BN, web3 } = anchor;
const { SystemProgram } = web3;

const defaultAccount = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

const useTikTok = (
  setTiktoks,
  userDetail,
  videoUrl,
  description,
  setDescription,
  setVideoUrl,
  setNewVideoShow
) => {
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const program = getProgramInstance(connection, wallet);

  const getTiktoks = async () => {
    const videos = await program.account.videoAccount.all();
    setTiktoks(videos);
    console.log(videos);
  };

  const likeVideo = async (address) => {};

  const createComment = async (address, comment, count) => {};

  const newVideo = async () => {
    const randomKey = anchor.web3.Keypair.generate().publicKey;

    let [video_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("video"), randomKey.toBuffer()],
      program.programId
    );

    const tx = await program.rpc.createVideo(
      description,
      videoUrl,
      userDetail.userName,
      userDetail.userProfileImageUrl,
      {
        accounts: {
          video: video_pda,
          randomkey: randomKey,
          authority: wallet.publicKey,
          ...defaultAccount,
        },
      }
    );

    setDescription("");
    setVideoUrl("");
    setNewVideoShow(false);
  };

  const getComments = async (address, count) => {};

  return {
    getTiktoks,
    likeVideo,
    createComment,
    newVideo,
    getComments,
  };
};

export default useTikTok;
