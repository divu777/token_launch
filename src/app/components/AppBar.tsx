"use client"
import React from "react";
import dynamic from "next/dynamic";
const WalletDisconnectButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletDisconnectButton,
  { ssr: false }
);
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const AppBar = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-semibold">account info ✨</div>

        <WalletMultiButtonDynamic />
        <WalletDisconnectButtonDynamic />
      </div>
    </div>
  );
};

export default AppBar;
