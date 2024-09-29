"use client";
import CardImg from "../../../public/main image.jpg";

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

// Assume you have a Card component imported
// import { Card } from "@/components/ui/card"

interface NFT {
  id: string;
  title: string;
  image: string;
  price: string;
}

const ITEMS_PER_PAGE = 8;

export default function NFTCollection() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Simulated data fetch
  useEffect(() => {
    // Replace this with your actual data fetching logic
    const fetchedNfts: NFT[] = [
      {
        id: "1",
        title: "NFT 1",
        image: "/placeholder.svg",
        price: "1.48 AVAX",
      },
      {
        id: "2",
        title: "NFT 2",
        image: "/placeholder.svg",
        price: "1.48 AVAX",
      },
      // ... add more NFTs
    ];
    setNfts(fetchedNfts);
  }, []);

  const filteredNfts = nfts.filter((nft) =>
    nft.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedNfts = [...filteredNfts].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  const indexOfLastNft = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstNft = indexOfLastNft - ITEMS_PER_PAGE;
  const currentNfts = sortedNfts.slice(indexOfFirstNft, indexOfLastNft);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-hidden p-4">
      <AppBar />
      <div className="flex justify-between mb-4">
        <Input
          type="text"
          placeholder="Search NFTs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort order" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentNfts.map((nft) => (
          <div key={nft.id}>
            {/* Replace this div with your Card component */}
            <div className="border p-4 rounded">
              <img
                src={CardImg.src}
                alt={nft.title}
                className="w-full h-40 object-cover"
              />
              <h3 className="mt-2 font-bold">{nft.title}</h3>
              <p>{nft.price}</p>
            </div>
          </div>
        ))}
      </div>

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => paginate(currentPage - 1)} />
          </PaginationItem>
          {Array.from({
            length: Math.ceil(sortedNfts.length / ITEMS_PER_PAGE),
          }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => paginate(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => paginate(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
