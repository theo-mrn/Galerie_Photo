"use client";
import Carousel from "@/components/ui/carousel";
export function Caroussellandscape() {
  const slideData = [
    {
      title: "Milan",
      button: "Voir les images",
      href: "/images/milano",
      src: "/images/milano/duomo/img8.jpeg",
    },
    {
      title: "Come",
      button: "Voir les images",
      href: "/images/come",
      src: "/images/come/img15.jpeg",
    },
  
    {
      title: "Villa balbianello",
      button: "Voir les images",
      href: "/images/balbielano",
      src: "/images/balbielano/img6.jpeg",
    },
    {
      title: "Autre",
      button: "Voir les images",
      href: "/images/varenna",
      src: "/images/varenna/img5.png",
    },
  ];
  return (
    <div className="relative overflow-hidden w-full h-full py-20">
      <Carousel slides={slideData} />
    </div>
  );
}
