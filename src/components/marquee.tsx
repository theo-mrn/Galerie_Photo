"use client";
import { ThreeDMarquee } from "@/components/3d-marquee";
import { useMemo } from "react";

export function ThreeDMarqueeDemo() {
  // Optimized: Reduce initial images and prioritize high-quality ones
  const allImages = useMemo(() => [
    // Priority images (loaded first)
    "/images/milano/duomo/img8.jpeg",
    "/images/milano/duomo/img7.jpeg",
    "/images/balbielano/img1.jpeg",
    "/images/come/img1.jpeg",
    
    // Secondary images (loaded after)
    "/images/milano/duomo/img6.jpeg",
    "/images/milano/duomo/img5.jpeg",
    "/images/balbielano/img2.jpeg",
    "/images/balbielano/img3.jpeg",
    "/images/come/img2.jpeg",
    "/images/come/img3.jpeg",
    
    // Tertiary images (loaded last)
    "/images/milano/duomo/img4.jpeg",
    "/images/milano/duomo/img3.png",
    "/images/milano/duomo/img2.png",
    "/images/milano/duomo/img1.png",
    "/images/balbielano/img4.jpeg",
    "/images/balbielano/img5.jpeg",
    "/images/balbielano/img6.jpeg",
    "/images/balbielano/img7.jpeg",
    "/images/balbielano/img8.jpeg",
    "/images/balbielano/img9.jpeg",
    "/images/balbielano/img11.jpeg",
    "/images/balbielano/img12.jpeg",
    "/images/balbielano/img13.jpeg",
    "/images/balbielano/img14.png",
    "/images/balbielano/img15.png",
    "/images/balbielano/img16.png",
    "/images/come/img9.jpeg",
    "/images/come/img10.jpeg",
    "/images/come/img11.jpeg",
    "/images/come/img12.jpeg",
    "/images/come/img13.jpeg",
    "/images/come/img14.jpeg",
  ], []);

  return (
    <div className="mx-auto my-10 max-w-7xl rounded-3xl bg-gray-950/5 p-2 ring-1 ring-neutral-700/10 dark:bg-neutral-800">
      <ThreeDMarquee images={allImages} />
    </div>
  );
}
