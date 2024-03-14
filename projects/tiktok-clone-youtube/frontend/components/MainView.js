import React, { useEffect, useState } from "react";
import Signup from "./Signup";
import useAccount from "../hooks/useAccount";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils";
import useTikTok from "../hooks/useTiktok";
import UploadModel from "./UploadModel";
import Video from "./Video";
import BottomBar from "./BottomBar";
import styles from "../styles/MainView.module.css";

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
  const [newVideoShow, setNewVideoShow] = useState(false);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [userDetail, setUserDetail] = useState();

  const { signup } = useAccount();
  const { getTiktoks, likeVideo, createComment, getComments, newVideo } =
    useTikTok(
      setTiktoks,
      userDetail,
      videoUrl,
      description,
      setDescription,
      setVideoUrl,
      setNewVideoShow
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
      console.log(userInfo);
    } catch (error) {
      setAccount(false);
      console.error(error);
    }
  };

  return (
    <>
      {isAccount ? (
        <div>
          {newVideoShow && (
            <UploadModel
              description={description}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              newVideo={newVideo}
              setDescription={setDescription}
              setNewVideoShow={setNewVideoShow}
            />
          )}
          <div className={styles.appVideos}>
            {!tiktoks || tiktoks.length === 0 ? (
              <h1>no Videos</h1>
            ) : (
              tiktoks.map((tiktok, id) => {
                return (
                  <Video
                    key={id}
                    address={tiktok.publicKey.toBase58()}
                    url={tiktok.account.videoUrl}
                    channel={tiktok.account.creatorName}
                    index={tiktok.account.index.toNumber()}
                    likes={tiktok.account.likes}
                    description={tiktok.account.description}
                    likeVideo={likeVideo}
                    likesAddress={tiktok.account.peopleWhoLiked}
                    createComment={createComment}
                    getComments={getComments}
                    commentsCount={tiktok.account.commentCount.toNumber()}
                    shares={tiktok.account.shares}
                  />
                );
              })
            )}
          </div>
          <BottomBar
            setNewVideoShow={setNewVideoShow}
            getTiktoks={getTiktoks}
          />
        </div>
      ) : (
        <Signup signup={signup} wallet={wallet.publicKey.toBase58()} />
      )}
    </>
  );
};

export default MainView;
