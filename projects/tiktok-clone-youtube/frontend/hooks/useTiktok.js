import { useWallet } from "@solana/wallet-adapter-react";
import { getProgramInstance } from "../utils";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { SOLANA_HOST } from "../utils/const";
import { PublicKey } from "@solana/web3.js";

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
  };

  const likeVideo = async (index) => {
    let [video_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("video"), new BN(index).toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    const tx = await program.rpc.likeVideo({
      accounts: {
        video: video_pda,
        authority: wallet.publicKey,
        ...defaultAccount,
      },
    });

    console.log("video liked!");
  };

  const createComment = async (index, comment, count) => {
    let [video_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("video"), new BN(index).toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    console.log(video_pda.toBase58());

    let [comment_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        utf8.encode("comment"),
        new BN(index).toArrayLike(Buffer, "be", 8),
        new BN(count).toArrayLike(Buffer, "be", 8),
      ],
      program.programId
    );

    console.log(comment_pda.toBase58());

    if (userDetail) {
      console.log(userDetail);
      const tx = await program.rpc.createComment(
        comment,
        userDetail.userName,
        userDetail.userProfileImageUrl,
        {
          accounts: {
            video: video_pda,
            comment: comment_pda,
            authority: wallet.publicKey,
            ...defaultAccount,
          },
        }
      );
      console.log("comment created!");
    }
  };

  const newVideo = async () => {
    const [state_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("state")],
      program.programId
    );

    const stateInfo = await program.account.stateAccount.fetch(state_pda);

    let [video_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("video"), stateInfo.videoCount.toArrayLike(Buffer, "be", 8)],
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
          state: state_pda,
          authority: wallet.publicKey,
          ...defaultAccount,
        },
      }
    );

    setDescription("");
    setVideoUrl("");
    setNewVideoShow(false);
  };

  const getComments = async (index, count) => {
    let commentSigners = [];

    for (let i = 0; i < count; i++) {
      let [comment_pda] = anchor.web3.PublicKey.findProgramAddressSync(
        [
          utf8.encode("comment"),
          new BN(index).toArrayLike(Buffer, "be", 8),
          new BN(i).toArrayLike(Buffer, "be", 8),
        ],
        program.programId
      );

      commentSigners.push(comment_pda);
    }

    const comments = await program.account.commentAccount.fetchMultiple(
      commentSigners
    );

    return comments;
  };

  return {
    getTiktoks,
    likeVideo,
    createComment,
    newVideo,
    getComments,
  };
};

export default useTikTok;
