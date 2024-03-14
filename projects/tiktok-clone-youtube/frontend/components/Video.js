import React, { useRef, useState } from "react";
import styles from "../styles/Video.module.css";
import Comments from "./Comments";

const Video = (
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
  commentsCount
) => {
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
      {showCommentModel && <Comments />}
    </div>
  );
};

export default Video;
