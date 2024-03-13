import MainView from "../components/MainView";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function Home() {
  const { connected } = useWallet();
  return (
    <div className="app">
      {connected ? (
        <MainView />
      ) : (
        <div className="loginContainer">
          <div className="loginTitle">Log in to TikTok</div>
          <div className="loginSubtitle">
            Manage your account, check notifications, comments on video, more.
          </div>
          <WalletMultiButton />
        </div>
      )}
    </div>
  );
}
