import { AnimatedTestimonials } from "@/components/ui/animated-testimonials";

export function Testimonials() {
  const testimonials = [
    {
      quote:
        "",
      name: "Palazzo delle Scuole Palatine",
      designation: "Milan",
      src: "/images/nous/img1.png",
    },
    {
      quote:
        "",
      name: "Navigli",
      designation: "Milan",
      src: "/images/nous/img2.png",
    },
    {
      quote:
        "",
      name: "Villa Balbianello",
      designation: "Lenno",
      src: "/images/nous/img3.png",
    },
    {
      quote:
        "",
      name: "Duomo di Milano",
      designation: "Milan",
      src: "/images/nous/img4.jpeg",
    },
    {
      quote:
        "",
      name: "Villa Balbianello",
      designation: "Lenno",
      src: "/images/nous/img5.jpeg",
    },
    {
      quote:
        "",
      name: "Villa Balbianello",
      designation: "Lenno",
      src: "/images/nous/img6.jpeg",
    },
    {
      quote:
        "",
      name: "Villa Balbianello",
      designation: "Lenno",
      src: "/images/nous/img7.jpeg",
    },
    {
      quote:
        "",
      name: "Villa Balbianello",
      designation: "Lenno",
      src: "/images/nous/img9.png",
    },
  ];
  return <AnimatedTestimonials testimonials={testimonials} />;
}
