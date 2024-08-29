"use client";
import { useState, useEffect } from "react";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";

export default function WalletContent() {
  const [balance, setBalance] = useState<number | null>(null);
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (connection && publicKey) {
      const getInfo = async () => {
        try {
          const walletInfo = await connection.getAccountInfo(publicKey);
          if (walletInfo) {
            setBalance(walletInfo.lamports / LAMPORTS_PER_SOL);
          }
        } catch (error) {
          console.error("Failed to fetch account info:", error);
        }
      };
      getInfo();
    } else {
      setBalance(0);
    }
  }, [connection, publicKey]);

  return (
    <main className="min-h-screen text-white">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] h-60 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">account info ✨</h2>
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>

          <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
            <ul className="p-2">
              <li className="flex justify-between">
                <p className="tracking-wider">Wallet is connected</p>
                <p className="text-helius-orange italic font-semibold">
                  {publicKey ? "yes" : "no"}
                </p>
              </li>

              <li className="text-sm mt-4 flex justify-between">
                <p className="tracking-wider">Balance</p>
                <p className="text-helius-orange italic font-semibold">
                  {balance ? balance : "Connect First"}
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
