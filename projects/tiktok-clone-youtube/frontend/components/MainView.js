import React, { useEffect, useState } from "react";
import Signup from "./Signup";
import useAccount from "../hooks/useAccount";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils";
import useTikTok from "../hooks/useTiktok";

const anchor = require("@project-serum/anchor");
const utf8 = anchor.utils.bytes.utf8;
const { BN, web3 } = anchor;
const { SystemProgram } = web3;

const defaultAccount = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

const MainView = () => {
  const [isAccount, setAccount] = useState();
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const program = getProgramInstance(connection, wallet);

  const [tiktoks, setTiktoks] = useState();
  const [newVideoShow, SetNewVideoShow] = useState(false);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userDetail, setUserDetail] = useState();

  const { signup } = useAccount();
  const { getTiktoks, likeVideo, createComment, newVideo } = useTikTok(
    setTiktoks,
    userDetail,
    videoUrl,
    description,
    setDescription,
    setVideoUrl,
    SetNewVideoShow
  );

  useEffect(() => {
    if (wallet.connected) {
      checkAccount();
      getTiktoks();
    }
  }, [wallet.connected]);

  const checkAccount = async () => {
    let [user_pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [utf8.encode("user"), wallet.publicKey.toBuffer()],
      program.programId
    );
    try {
      const userInfo = await program.account.userAccount.fetch(user_pda);
      setUserDetail(userInfo);
      setAccount(true);
    } catch (error) {
      setAccount(false);
      console.error(error);
    }
  };

  return (
    <>
      {isAccount ? (
        <div>TikTok will go here</div>
      ) : (
        <Signup signup={signup} wallet={wallet.publicKey.toBase58()} />
      )}
    </>
  );
};

export default MainView;
