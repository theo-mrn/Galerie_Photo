"use client";

import React from "react";
import { Carousel, Card } from "@/components/apple-cards-carousel";

export function AppleCardsCarouselDemo() {
  const cards = data.map((card) => (
    <Card key={card.src} card={card} />
  ));

  return (
    <div className="w-full h-full py-20">
      <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
        Lac de Côme
      </h2>
      <Carousel items={cards} />
    </div>
  );
}



const data = [
  {
    category: "",
    title: "",
    src: "/images/come/img17.png",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img18.png",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img13.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img2.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img3.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img9.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img10.jpeg",
    content: <div>test</div>,
  },

  {
    category: "",
    title: "",
    src: "/images/come/img11.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img12.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img13.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img14.jpeg",
    content: <div>test</div>,
  },
  {
    category: "",
    title: "",
    src: "/images/come/img16.jpeg",
    content: <div>test</div>,
  },

  {
    category: "",
    title: "",
    src: "/images/come/img1.jpeg",
    content: <div>test</div>,
  },
];
