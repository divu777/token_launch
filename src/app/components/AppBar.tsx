"use client";
import "@solana/wallet-adapter-react-ui/styles.css";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";






export default function AppBar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
    { name: "Home", href: "/landing" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Generator", href: "/generator" },
  ];

  const { publicKey, signMessage } = useWallet();

  const signAndSend = async () => {
    if (!signMessage || !publicKey) return;

    // Check if a token is already stored
    const existingToken = localStorage.getItem("token");
    if (existingToken) return; // Exit if already signed in

    try {
      const message = new TextEncoder().encode("Sign into mechanical turk");
      const signature = await signMessage(message);
      const res = await axios.post("/api/auth", {
        signature: Array.from(signature), // Convert Uint8Array to Array
        publicKey: publicKey.toString(),
      });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Error signing message and sending request:", error);
    }
  };

  useEffect(() => {
     setIsMounted(true);
    signAndSend(); // Call signAndSend if publicKey is present
  }, [publicKey]);


  const handleDisconnect = () => {
    // Remove the token from local storage
    localStorage.removeItem("token");
  };
if (!isMounted) {
  return null;
}
  return (
    <div className="bg-white z-50 relative">
      <div className="mx-auto px-4 sm:px-6 lg:px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            {publicKey ? (
              <WalletDisconnectButton
                className="!bg-primary hover:!bg-primary/90 text-primary-foreground"
                style={{
                  backgroundColor: "black",
                  
                }}
                onClick={handleDisconnect}
              />
            ) : (
              <WalletMultiButton
                className="!bg-primary hover:!bg-primary/90 text-primary-foreground"
                style={{
                  backgroundColor: "black",
                }}
              />
            )}
          </div>
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-accent">
            <div className="px-2">
              <WalletMultiButton className="!bg-primary hover:!bg-primary/90 text-primary-foreground w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
