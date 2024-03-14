import React, { useEffect, useState } from "react";
import styles from "../styles/Comments.module.css";
import CommentCard from "./CommentCard";

const Comments = ({
  address,
  onHide,
  createComment,
  index,
  getComments,
  commentsCount,
}) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const gettingComments = async () => {
    const commentList = await getComments(index, commentsCount);
    if (commentList && commentList.length !== 0) {
      commentList.sort(
        (a, b) => b.videoTime.toNumber() - a.videoTime.toNumber()
      );
      setComments(commentList);
    }
  };

  useEffect(() => {
    gettingComments();
  }, [index]);

  const onClickReply = async () => {
    await createComment(index, newComment, commentsCount);
    setNewComment("");
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.commentsHeader}>
        <p>{commentsCount} comments</p>
        <p className={styles.closeButton} onClick={onHide}>
          &times;
        </p>
      </div>
      {comments.map((comment) => {
        return (
          <CommentCard
            key={comment.index.toNumber()}
            username={comment.commenterName}
            comment={comment.text}
            avatar={comment.commenterUrl}
            timestamp={comment.videoTime.toNumber()}
          ></CommentCard>
        );
      })}
      <div className={styles.commentInputWrapper}>
        <input
          type="text"
          placeholder="Add a public comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button className={styles.button} onClick={onClickReply}>
          Reply
        </button>
      </div>
    </div>
  );
};

export default Comments;
