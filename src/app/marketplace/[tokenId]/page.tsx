"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  creator?: {
    id: number;
    name: string | null;
    wallet: string;
  };
}

export default function TokenDetail() {
  const params = useParams();
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // In a real application, replace this with an actual API call
        const response = await fetch(`/api/tokens/${params.tokenId}`);
        if (!response.ok) throw new Error("Failed to fetch token");
        const data = await response.json();
        setToken(data);
      } catch (error) {
        console.error("Error fetching token:", error);
        setError("Failed to load token details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [params.tokenId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen">
        Token not found
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
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
              {token.name} ({token.symbol})
            </CardTitle>
            <CardDescription>Token ID: {token.id}</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div>
              <Image
                src={token.imageUrl}
                alt={token.name}
                width={400}
                height={400}
                className="rounded-lg object-cover w-full"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Description</h3>
                <p>{token.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Total Supply</h3>
                <p className="text-2xl font-bold">
                  {formattedAmount} {token.symbol}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Decimals</h3>
                <p>{token.decimals}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Creator</h3>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <p>{token.creator?.name || "Anonymous"}</p>
                </div>
                <p className="font-mono text-sm mt-1">
                  {token.creator?.wallet || "Unknown"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Created At</h3>
                <p>{new Date(token.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Last Updated</h3>
                <p>{new Date(token.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Transfer Token</Button>
            <Button>Buy Token</Button>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
