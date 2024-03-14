import React, { useEffect, useState } from "react";
import styles from "../styles/SideBar.module.css";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MessageIcon from "@material-ui/icons/Message";
import { useWallet } from "@solana/wallet-adapter-react";

const SideBar = ({
  address,
  likes,
  shares,
  messages,
  onShowComments,
  likeVideo,
  index,
  likesAddress,
}) => {
  const [liked, setLiked] = useState(false);
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected) {
      if (likesAddress && likesAddress.includes(wallet.publicKey.toBase58())) {
        setLiked(true);
      }
    }
  }, [likesAddress, wallet]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarButton}>
        {liked ? (
          <FavoriteIcon
            fontSize="large"
            style={{ color: "red", stroke: "red" }}
          />
        ) : (
          <FavoriteIcon
            fontSize="large"
            onClick={(e) => {
              likeVideo(index);
            }}
          />
        )}
        <p className={styles.iconText}>{likes}</p>
      </div>
      <div className={styles.sidebarButton} onClick={onShowComments}>
        <MessageIcon fontSize="large" />
        <p className={styles.iconText}>{messages}</p>
      </div>
      <div className={styles.sidebarButton}>
        <ShareIcon fontSize="large" />
        <p className={styles.iconText}>{shares || 0}</p>
      </div>
    </div>
  );
};

export default SideBar;
