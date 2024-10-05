"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Wallet, Coins, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import AppBar from "../components/AppBar"
import Footer from "../components/Footer"
interface UserDetails {
  name: string
  email: string
  avatar: string
}

interface Token {
  id: number
  name: string
  symbol: string
  amount: number
  imageUrl: string
}

export default function Component() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [solanaBalance, setSolanaBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

    useEffect(() => {
      const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Retrieve the token from local storage

      try {
        const response = await fetch('/api/user/info', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
            'Content-Type': 'application/json', // Set the content type if needed
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
          const data = await response.json();
          console.log(data);
          setUserDetails(data.userInfo);
          setSolanaBalance(data.walletBalance);
          setTokens(data.userInfo.tokens); // Set tokens from userInfo
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }, []);


  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Skeleton className="w-[600px] h-[400px] rounded-lg bg-gray-200" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
    <AppBar />
      <main className="p-6 space-y-6">
        <Card className="bg-white border-gray-200 shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-32 w-32">
                  <AvatarImage src={userDetails?.avatar} alt={userDetails?.name} />
                  <AvatarFallback>{userDetails?.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">{userDetails?.name}</h2>
                  <p className="text-gray-600">{userDetails?.email}</p>
                </div>
                <div className="flex gap-4">
                  <Card className="bg-gray-50 border-gray-200 flex-1 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm text-gray-700">
                        <Wallet className="mr-2 h-4 w-4" /> SOL Balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">{solanaBalance ?? 0} SOL</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-50 border-gray-200 flex-1 shadow-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center text-sm text-gray-700">
                        <Coins className="mr-2 h-4 w-4" /> Unique Tokens
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-gray-900">{Array.isArray(tokens) ? tokens.length : 0}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-gray-200 shadow-md">
          <CardHeader>
            <CardTitle className="text-gray-800">Your Tokens</CardTitle>
          </CardHeader>
          <CardContent>
            {tokens.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tokens.map((token) => (
                  <Card key={token.id} className="bg-gray-50 border-gray-200 shadow-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12">
                          <Image
                            src={token.imageUrl}
                            alt={token.name}
                            width={48}
                            height={48}
                            className="rounded-full"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{token.name}</p>
                          <p className="text-sm text-gray-600">
                            {token.amount} {token.symbol}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
     
    </div>
  )
}