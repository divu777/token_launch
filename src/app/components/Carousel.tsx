"use client";
import { Card, CardContent } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import CardImg2 from "../../../public/img2.png";
export function Example() {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      // ...
    </Carousel>
  );
}

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

export function CarouselDemo() {
  return (
    <Carousel
      className="w-4/5 "
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {Array.from({ length: 9 }).map((_, index) => (
          <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/3">
            <div className="p-1 h-[600px]">
              <Card className="h-full">
                <CardContent className="flex aspect-rectangle items-center justify-center p-6">
                  <img src={CardImg2.src} alt="" />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
