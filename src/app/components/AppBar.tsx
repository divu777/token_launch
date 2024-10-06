"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Menu, X } from "lucide-react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function AppBar() {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { publicKey, signMessage } = useWallet();

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Marketplace", href: "/marketplace" },
    { name: "Generator", href: "/generator" },
  ];

  if (publicKey) {
    navItems.push({ name: "Dashboard", href: "/dashboard" });
  }

  const signAndSend = async () => {
    if (!signMessage || !publicKey) return;
    const existingToken = localStorage.getItem("token");
    if (existingToken) return;

    try {
      const message = new TextEncoder().encode("Sign into mechanical turk");
      const signature = await signMessage(message);
      const res = await axios.post("/api/auth", {
        signature: Array.from(signature),
        publicKey: publicKey.toString(),
      });
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("Error signing message and sending request:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 1000); // Simulate loading
    signAndSend();
    return () => clearTimeout(timer);
  }, [publicKey]);

  const handleDisconnect = () => {
    localStorage.removeItem("token");
  };

  if (!isMounted) {
    return (
      <div className="bg-white  z-50 fixed top-0 left-0 right-0">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Skeleton className="h-8 w-32" />
            <div className="hidden md:flex space-x-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-8 w-24" />
              ))}
            </div>
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </div>
    );
  }

  const walletButtonStyle = {
    backgroundColor: "black",
    color: "white",
    padding: "10px 20px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
    transition: "all 0.2s ease-in-out",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-sm z-50 fixed top-0 left-0 right-0 shadow-sm"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:flex items-baseline space-x-4">
              <AnimatePresence>
                {navItems.map((item) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ease-in-out ${
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
          <div className="hidden md:block">
            {publicKey ? (
              <WalletDisconnectButton
                className="!bg-primary hover:!bg-primary/90 text-primary-foreground transition-all duration-200 ease-in-out"
                style={walletButtonStyle}
                onClick={handleDisconnect}
              />
            ) : (
              <WalletMultiButton
                className="!bg-primary hover:!bg-primary/90 text-primary-foreground transition-all duration-200 ease-in-out"
                style={walletButtonStyle}
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
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/90 backdrop-blur-sm"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navItems.map((item) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ease-in-out ${
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="pt-4 pb-3 border-t border-accent">
              <div className="px-2">
                <WalletMultiButton className="!bg-primary hover:!bg-primary/90 text-primary-foreground w-full transition-all duration-200 ease-in-out" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
