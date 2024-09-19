"use client";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
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
  const { publicKey, signMessage } = useWallet();

  const signAndSend = async () => {
    if (!signMessage) return;

    try {
      const message = new TextEncoder().encode("Sign into mechanical turk");
      const signature = await signMessage(message);

      const res = await axios.post("/api/auth", {
        signature: Array.from(signature), // Convert Uint8Array to Array
        publicKey: publicKey?.toString(),
      });

      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Error signing message and sending request:", error);
    }
  };
  useEffect(() => {
    if (publicKey) {
      signAndSend();
    }
  }, [publicKey]);
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-3xl font-semibold">account info ✨</div>
        {publicKey ? (
          <WalletDisconnectButtonDynamic />
        ) : (
          <WalletMultiButtonDynamic />
        )}
      </div>
    </div>
  );
};

export default AppBar;
