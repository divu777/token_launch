"use client";

import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import {
  CarouselPrevious,
  CarouselNext,
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Image from "next/image"; // Ensure you import Image

const carouselItems = [
  {
    src: "https://ibb.co/ZY7MLZ2",
    alt: "Elegant Simplicity",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmafHY35q2Ursf8dtN2kas1rm3LNZNTngRGBnbo5xuwLL7",
    alt: "Modern Comfort",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmPHB7RS57nxyBsf9YDWuQ3NndmTuxxfUbhGZUmfg137ta",
    alt: "Timeless Design",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmRFXXiXZ1o9Tz9mpBW46aoQTdxMjwT7nSPiXK1FwFUZNh",
    alt: "Luxurious Details",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmbhwYg4BBcRR84bcrHXxPVdjGqZHtdrpaYJaiNELQTtCD",
    alt: "Minimalist Beauty",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmQisRbKyiCD8vvxW8tRmDM5NRkvu87oKkA6wnGCy2gwWy",
    alt: "Classic Charm",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/Qmd1FJieiugSnMrR6PNyDvck8zq6RVjhvPuwC8mgCYCf6h",
    alt: "Contemporary Edge",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmZ2wK3j8vFHRU4WQFVHWmqKfrpf3LTqUoRq54JcSKERFy",
    alt: "Sophisticated Style",
  },
  {
    src: "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmYUfHsEUqMKEtgbKqPYGZWRvTTqkXFWsoNhVWxv48bZNJ",
    alt: "Refined Elegance",
  },
];

export function CarouselDemo() {
  return (
    <Carousel
      className="w-full max-w-5xl mx-auto"
      plugins={[Autoplay({ delay: 3000 })]}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {carouselItems.map((item, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3">
            <Card className="overflow-hidden">
              <CardContent className="p-0 aspect-[3/4] relative group">
                <Image
                src={item.src}
                 alt={item.alt}
                 fill // use 'fill' instead of 'layout="fill"'
                 style={{ objectFit: "cover" }} // use style for objectFit
                  className="transition-transform duration-300 group-hover:scale-110"
                  />

                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                  <h3 className="text-white text-xl font-semibold text-center">
                    {item.alt}
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
