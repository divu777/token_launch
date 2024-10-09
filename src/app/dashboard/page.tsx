"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet, Coins, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppBar from "../components/AppBar"
import Footer from "../components/Footer"
import NameUpdatePopup from "../components/NameUpdateProp"

interface UserDetails {
  name: string;
  email: string;
  avatar: string;
  profilePic: string;
}

interface Token {
  id: number
  name: string
  symbol: string
  amount: number
  imageUrl: string
  change?: number // Make change optional
}

export default function Component() {
  const [isNameUpdateOpen, setIsNameUpdateOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)


  const handleUpdateName = (newName:String) => {
    setUserDetails(prev => prev ? { ...prev, name: newName } : null);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch('/api/user/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }
        const data = await response.json()
        console.log(data.userInfo)
        setUserDetails(data.userInfo)
        setSolanaBalance(data.walletBalance)
        setTokens(data.userInfo.tokens)
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Skeleton className="w-[600px] h-[400px] rounded-lg bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50   flex items-center justify-center">
      <AppBar />
      <main className="container mx-auto p-6 space-y-6  h-full ">
        <Card className="bg-white border-gray-200 shadow-md overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="h-24 w-24 md:h-32 md:w-32">
                 <Image
      src={userDetails!.profilePic}
      alt={userDetails?.name || 'User'}
      fill
      sizes="(max-width: 768px) 96px, 128px"
      className="object-cover"
    />
                {/* <AvatarFallback>
                  {userDetails?.name?.charAt(0) ?? "U"}
                </AvatarFallback> */}
              </Avatar>

              <div className="flex-grow space-y-4 text-center md:text-left">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-3xl font-bold text-gray-800">
                      {userDetails?.name}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsNameUpdateOpen(true)}
                      className="ml-2"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Card className="bg-primary text-primary-foreground flex-1 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <Wallet className="mr-2 h-4 w-4" /> SOL Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {solanaBalance?.toFixed(2) ?? 0} SOL
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-secondary text-secondary-foreground flex-1 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm">
                        <Coins className="mr-2 h-4 w-4" /> Unique Tokens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{tokens.length}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-800">
              Your Tokens
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tokens.map((token) => (
                  <motion.div
                    key={token.id}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 relative w-12 h-12">
                            <Image
                              src={token.imageUrl}
                              alt={token.name}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <p className="font-semibold text-gray-800">
                              {token.name}
                            </p>
                            <p className="text-sm text-gray-600 truncate">
                              {token.amount.toFixed(2)} {token.symbol}
                            </p>
                          </div>
                          {token.change !== undefined && (
                            <div
                              className={`flex items-center flex-shrink-0 ${
                                token.change >= 0
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {token.change >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                              )}
                              <span className="text-sm font-medium">
                                {token.change.toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600">No tokens found in your wallet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      {userDetails && (
        <NameUpdatePopup
          isOpen={isNameUpdateOpen}
          onClose={() => setIsNameUpdateOpen(false)}
          currentName={userDetails.name}
          onUpdateName={handleUpdateName}
        />
      )}
    </div>
  );
}