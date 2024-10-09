"use client";

import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

const carouselItems = [
  { id: 1, title: "Elegant Simplicity", image: "/card1.jpg" },
  { id: 2, title: "Modern Comfort", image: "/card2.jpg" },
  { id: 3, title: "Timeless Design", image: "/card3.jpg" },
  { id: 4, title: "Luxurious Details", image: "/card4.jpg" },
  { id: 5, title: "Minimalist Beauty", image: "/card5.jpg" },
  { id: 6, title: "Classic Charm", image: "/card6.jpg" },
  { id: 7, title: "Contemporary Edge", image: "/card7.jpg" },
  { id: 8, title: "Sophisticated Style", image: "/card8.jpg" },
  { id: 9, title: "Refined Elegance", image: "/card9.jpg" },
];

export default function EnhancedView() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  return (
    <div className="h-[120vh] flex flex-col items-center justify-center gap-10 my-20 px-4 ">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <h1 className="text-5xl md:text-6xl uppercase font-bold tracking-tight mb-4 md:mb-0">
            Explore our
            <br />
            collection
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-md">
            Discover timeless elegance and modern design in our curated
            token selection
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
          }}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {carouselItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3"
              >
                <Card className="overflow-hidden shadow-lg">
                  <CardContent className="p-0 aspect-[4/5] relative group">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                      <h3 className="text-white text-2xl font-semibold text-center">
                        {item.title}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-end mt-8">
            <div className="flex gap-4">
              <CarouselPrevious className="bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300 rounded-full p-3 transition-all duration-200 hover:scale-110">
                <ChevronLeft className="w-6 h-6" />
                <span className="sr-only">Previous slide</span>
              </CarouselPrevious>
              <CarouselNext className="bg-white hover:bg-gray-100 text-gray-800 border-2 border-gray-300 rounded-full p-3 transition-all duration-200 hover:scale-110">
                <ChevronRight className="w-6 h-6" />
                <span className="sr-only">Next slide</span>
              </CarouselNext>
            </div>
          </div>
        </Carousel>
      </div>
    </div>
  );
}
