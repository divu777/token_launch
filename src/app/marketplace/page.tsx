"use client";
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
import { useState, useEffect } from "react";
import AppBar from "../components/AppBar";
import Footer from "../components/Footer";


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
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to fetch NFTs');
      }
    } catch (error) {
      setError('Error fetching NFTs');
      console.error("Error fetching NFTs:", error);
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
    return (
      <div className="overflow-x-hidden">
        <AppBar />
        <div className="w-screen flex justify-center items-center h-screen">
          <p>Loading NFTs...</p>
        </div>
        <Footer />
      </div>
    );
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
      <div className="w-screen flex flex-col justify-between px-20 py-5">
        <div className="flex justify-between items-end mb-4">
          <div className="flex flex-col w-2/3 gap-10">
            <div className="flex justify-start gap-10 items-end">
              <h1 className="text-6xl font-bold uppercase">Explore</h1>
              <h3>{nfts.length} items available</h3>
            </div>
            <Input
              type="text"
              placeholder="Search NFTs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-2/3 h-20 text-lg px-10 rounded-full"
            />
          </div>
          <Select
            onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
          >
            <SelectTrigger className="w-[180px] h-20 text-lg px-10 rounded-full">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asc">A-Z</SelectItem>
              <SelectItem value="desc">Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {sortedNfts.length === 0 ? (
          <div className="text-center py-10">
            <p>No NFTs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
            {sortedNfts.map((nft) => (
              <Link key={nft.id} href={`/marketplace/${nft.id}`}>
                <div className="border p-4 rounded">
                  <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-72 object-cover"
                  />
                  <h3 className="mt-2 font-bold">{nft.name}</h3>
                  <p>{nft.amount } {nft.symbol}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
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
                  disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
      <Footer />
    </div>
  );
}