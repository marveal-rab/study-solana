import React, { useState } from "react";
import styles from "../styles/Signup.module.css";

const Signup = ({ signup, wallet }) => {
  const [username, setUsername] = useState();
  const [profile, setProfile] = useState();

  const onClickSignup = () => {
    signup(username, profile);
  };

  return (
    <div className={styles.authContainer}>
      <h1>Sign up to TikTok</h1>
      <div className={styles.signupForm}>
        <div className={styles.inputField}>
          <div className={styles.inputTitle}>Username:</div>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className={styles.inputField}>
          <div className={styles.inputTitle}>Profile Image:</div>
          <div className={styles.inputContainer}>
            <input
              className={styles.input}
              type="text"
              placeholder="Profile Url"
              onChange={(e) => setProfile(e.target.value)}
            />
          </div>
        </div>
      </div>
      <button className={styles.signupButton} onClick={onClickSignup}>
        Sign up
      </button>
    </div>
  );
};

export default Signup;
