import React, { useRef, useState } from "react";
import styles from "../styles/Video.module.css";
import Comments from "./Comments";
import SideBar from "./SideBar";
import Footer from "./Footer";

const Video = ({
  address,
  url,
  channel,
  likes,
  index,
  description,
  likeVideo,
  likesAddress,
  createComment,
  getComments,
  commentsCount,
  shares,
}) => {
  const [playing, setPlaying] = useState(false);
  const [showCommentModel, setShowCommentModel] = useState(false);
  const videoRef = useRef(null);

  const onVideoPress = () => {
    if (playing) {
      videoRef.current.pause();
      setPlaying(false);
    } else {
      videoRef.current.play();
      setPlaying(true);
    }
  };

  const hideComments = () => {
    setShowCommentModel(false);
  };

  const showComments = () => {
    setShowCommentModel(true);
  };

  return (
    <div className={styles.wrapper}>
      <video
        className={styles.videoPlayer}
        loop
        onClick={onVideoPress}
        ref={videoRef}
        src={url}
      />
      <Footer channel={channel} description={description} song={index}></Footer>

      <SideBar
        address={address}
        likes={likes}
        shares={shares}
        onShowComments={showComments}
        likeVideo={likeVideo}
        index={index}
        likesAddress={likesAddress}
        messages={commentsCount}
      ></SideBar>

      {showCommentModel && (
        <Comments
          onHide={hideComments}
          index={index}
          address={address}
          createComment={createComment}
          getComments={getComments}
          commentsCount={commentsCount}
        />
      )}
    </div>
  );
};

export default Video;
