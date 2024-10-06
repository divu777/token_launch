"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AppBar from "../../components/AppBar";
import Footer from "@/app/components/Footer";

interface Token {
  id: number;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  amount: number;
  decimals: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: number;
    name: string | null;
    wallet: string;
  };
  provenance?: string;
  year?: number;
}

export default function TokenDetail() {
  const params = useParams();
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (!params.tokenId) return;

      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tokens/${params.tokenId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch token");
        }

        setToken(data.token);
      } catch (error) {
        console.error("Error fetching token:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to load token details"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [params.tokenId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppBar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-lg">Loading token details...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-gray-100">
        <AppBar />
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/marketplace"
            className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2" />
            Back to Marketplace
          </Link>
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="py-10">
              <p className="text-center text-red-500">
                {error || "Token not found"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formattedAmount = (token.amount / Math.pow(10, token.decimals)).toFixed(
    token.decimals
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" />
          Back to Marketplace
        </Link>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative aspect-square bg-black rounded-lg overflow-hidden">
            <Image
              src={token.imageUrl}
              alt={token.name}
              fill
              className="object-cover"
            />
            <div className="absolute top-0 left-0 w-full p-4 bg-gradient-to-b from-black to-transparent text-white">
              <h1 className="text-2xl font-bold">MUSIC TRANSCENDS</h1>
              <p className="text-sm">
                Creator: {token.creator?.name || "Anonymous"}
              </p>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black to-transparent text-white">
              <p className="text-sm">Release Year: {token.year || "N/A"}</p>
              <p className="text-sm">Blockchain: Solana</p>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold">{token.name}</h2>
              <p className="text-gray-600">
                by {token.creator?.name || "Anonymous"}
              </p>
            </div>
            <div className="bg-orange-500 text-white p-6 rounded-lg">
              <p className="text-5xl font-bold">${formattedAmount}</p>
              <Button className="w-full mt-4 bg-white text-orange-500 hover:bg-gray-100">
                BUY NOW
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Description</h3>
              <p>{token.description}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Provenance</h3>
              <p>
                {token.provenance || "No provenance information available."}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Details</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Token ID: {token.id}</li>
                <li>Symbol: {token.symbol}</li>
                <li>Total Supply: {token.amount}</li>
                <li>Decimals: {token.decimals}</li>
                <li>
                  Created: {new Date(token.createdAt).toLocaleDateString()}
                </li>
                <li>
                  Last Updated: {new Date(token.updatedAt).toLocaleDateString()}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
