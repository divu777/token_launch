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
  {
    id: 1,
    title: "Elegant Simplicity",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmeBL55bYYW7ogGP5u1qYtyDXH4B2RNCP4S8gpwcMSHKEU",
  },
  {
    id: 2,
    title: "Modern Comfort",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmafHY35q2Ursf8dtN2kas1rm3LNZNTngRGBnbo5xuwLL7",
  },
  {
    id: 3,
    title: "Timeless Design",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmPHB7RS57nxyBsf9YDWuQ3NndmTuxxfUbhGZUmfg137ta",
  },
  {
    id: 4,
    title: "Luxurious Details",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmRFXXiXZ1o9Tz9mpBW46aoQTdxMjwT7nSPiXK1FwFUZNh",
  },
  {
    id: 5,
    title: "Minimalist Beauty",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmbhwYg4BBcRR84bcrHXxPVdjGqZHtdrpaYJaiNELQTtCD",
  },
  {
    id: 6,
    title: "Classic Charm",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmQisRbKyiCD8vvxW8tRmDM5NRkvu87oKkA6wnGCy2gwWy",
  },
  {
    id: 7,
    title: "Contemporary Edge",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/Qmd1FJieiugSnMrR6PNyDvck8zq6RVjhvPuwC8mgCYCf6h",
  },
  {
    id: 8,
    title: "Sophisticated Style",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmZ2wK3j8vFHRU4WQFVHWmqKfrpf3LTqUoRq54JcSKERFy",
  },
  {
    id: 9,
    title: "Refined Elegance",
    image:
      "https://red-advisory-catfish-400.mypinata.cloud/ipfs/QmYUfHsEUqMKEtgbKqPYGZWRvTTqkXFWsoNhVWxv48bZNJ",
  },
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
