"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AppBar from "../../components/AppBar";
import Footer from "../../components/Footer";

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
    profilePic:string;
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
      <div className="min-h-screen bg-white">
        <AppBar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[calc(100vh-64px)]">
          <p className="text-lg">Loading token details...</p>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="min-h-screen bg-white">
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
  );const creationYear = new Date(token.createdAt).getFullYear()

  return (
    <div className="min-h-screen bg-white">
      <AppBar />
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2" />
          Back to Marketplace
        </Link>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 relative aspect-square bg-black overflow-hidden">
            <Image
              src={token.imageUrl}
              alt={token.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-5xl font-black uppercase mb-2 ">
                {token.name}
              </h1>
              <div className="flex items-center space-x-2">
                <Image
                  src={token.creator.profilePic || "/placeholder.svg"}
                  alt={token.creator?.name || "Anonymous"}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p className="text-gray-600 font-medium">
                  {token.creator?.name || "Anonymous"}
                </p>
              </div>
            </div>
           
            <div className="flex items-center justify-between h-20 border-y border-gray-200 border-solid">
              <p className="text-4xl font-bold w-1/2">${formattedAmount}</p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-6 py-2 h-full w-1/2">
                SOL
              </Button>
            </div>
            
           <div>
              <h2 className="text-2xl font-bold uppercase mb-4">DETAILS</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>Description:</strong> {token.description}</li>
                <li><strong>Provenance:</strong> {token.provenance || "No provenance information available."}</li>
                <li><strong>Token ID:</strong> {token.id}</li>
                <li><strong>Symbol:</strong> {token.symbol}</li>
                <li><strong>Total Supply:</strong> {token.amount}</li>
                <li><strong>Decimals:</strong> {token.decimals}</li>
                <li><strong>Blockchain:</strong> Solana</li>
                <li><strong>Created:</strong> {new Date(token.createdAt).toLocaleDateString()}</li>
                <li><strong>Last Updated:</strong> {new Date(token.updatedAt).toLocaleDateString()}</li>
              </ul>
            </div>
            <Separator className="bg-gray-200" />
            <div>
              <h2 className="text-2xl font-bold uppercase mb-4">YEAR</h2>
              <p className="text-gray-700">{creationYear}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
