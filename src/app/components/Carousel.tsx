"use client";

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

export function CarouselDemo() {
  return (
    <Carousel
      className="w-full max-w-5xl mx-auto"
      plugins={[
        Autoplay({
          delay: 3000,
        }),
      ]}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {carouselItems.map((item) => (
          <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/3">
            <Card className="overflow-hidden">
              <CardContent className="p-0 aspect-[3/4] relative group">
                <Image
                  src={item.image}
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <h3 className="text-white text-xl font-semibold text-center">
                    {item.title}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}
