"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import MarketplaceSkeleton from "../components/MarketplaceSkeleton";
import Footer from "../components/Footer";
import AppBar from "../components/AppBar";
import Image from "next/image";

interface NFT {
  id: number;
  name: string;
  symbol: string;
  description: string;
  imageUrl: string;
  amount: number;
  decimals: number;
  creatorId: number;
}

const ITEMS_PER_PAGE = 8;

export default function NFTCollection() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNfts = async (page: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(
        `/api/tokens?page=${page}&limit=${ITEMS_PER_PAGE}`
      );
      const data = await response.json();
      if (response.ok) {
        setNfts(data.tokens || []);
        setTotalPages(Math.max(1, data.totalPages || 1));
      } else {
        setError(data.message || "Failed to fetch Tokens");
      }
    } catch (error) {
      setError("Error fetching Tokens");
      console.error("Error fetching Tokens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNfts(currentPage);
  }, [currentPage]);

  const filteredNfts = nfts.filter((nft) =>
    nft.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNfts = [...filteredNfts].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  const currentNfts = sortedNfts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  if (isLoading) {
    return <MarketplaceSkeleton />;
  }

  if (error) {
    return (
      <div className="overflow-x-hidden">
        <AppBar />
        <div className="w-screen flex justify-center items-center h-screen">
          <p className="text-red-500">{error}</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden">
      <AppBar />
      <div className="container mx-auto px-4 py-12 mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start mb-16">
          <div className="max-w-2xl w-full md:w-auto mb-8 md:mb-0">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Discover unique SPL tokens
            </h1>
            <p className="text-lg mb-8 text-gray-600">
              Explore {nfts.length} available items
            </p>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Input
                type="text"
                placeholder="Search Tokens..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow text-base h-12 rounded-full"
              />
              <Select
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger className="w-full sm:w-[180px] h-12 rounded-full">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">A-Z</SelectItem>
                  <SelectItem value="desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="text-right w-full md:w-auto">
            <p className="text-base mb-3 text-gray-600">
              Get 15% discount on your first Mainnet Token
            </p>
            <Button size="lg" className="rounded-full px-8 h-12">
              Under Dev
            </Button>
          </div>
        </div>

        {sortedNfts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">No Tokens found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentNfts.map((nft) => (
              <Link key={nft.id} href={`/marketplace/${nft.id}`}>
                <div className="relative group overflow-hidden rounded-lg aspect-[3/4]">
                  <Image
                    src={nft.imageUrl}
                    alt={nft.name}
                    width={300} // Specify the desired width
                    height={400} // Specify the desired height
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-end p-6">
                    <div className="w-full flex justify-between items-center">
                      <div className="text-white">
                        <h3 className="text-xl font-semibold mb-1">
                          {nft.name}
                        </h3>
                        <p className="text-sm">
                          {nft.amount} {nft.symbol}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 12H19M19 12L12 5M19 12L12 19"
                            stroke="black"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <Pagination className="mt-12">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => paginate(currentPage - 1)}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }).map((_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  onClick={() => paginate(index + 1)}
                  isActive={currentPage === index + 1}
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => paginate(currentPage + 1)}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <Footer />
    </div>
  );
}
