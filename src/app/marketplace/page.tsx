"use client";
import CardImg from "../../../public/main image.jpg";
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
      {
        id: "3",
        title: "NFT 3",
        image: "/placeholder.svg",
        price: "3.48 AVAX",
      },
      {
        id: "4",
        title: "NFT 4",
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

  const totalPages = Math.ceil(sortedNfts.length / ITEMS_PER_PAGE);

  const paginate = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 py-10">
          {currentNfts.map((nft) => (
            <Link key={nft.id} href={`/marketplace/${nft.id}`}>
              <div className="border p-4 rounded">
                <img
                  src={nft.image} // Use nft.image for dynamic images
                  alt={nft.title}
                  className="w-full h-72 object-cover"
                />
                <h3 className="mt-2 font-bold">{nft.title}</h3>
                <p>{nft.price}</p>
              </div>
            </Link>
          ))}
        </div>

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
                <PaginationLink onClick={() => paginate(index + 1)}>
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
      </div>
      <Footer />
    </div>
  );
}
