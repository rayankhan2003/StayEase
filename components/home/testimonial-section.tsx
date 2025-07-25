// components/home/TestimonialsSection.tsx
import Image from "next/image";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah J.",
    quote:
      "An absolutely incredible experience. The staff went above and beyond to make our anniversary special. The room was immaculate and the views were breathtaking.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop",
  },
  {
    name: "Michael T.",
    quote:
      "As a business traveler, I appreciate efficiency and comfort. This hotel delivers both flawlessly. The executive suite was perfect for working and relaxing.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop",
  },
  {
    name: "Emily R.",
    quote:
      "The spa treatments were divine and the infinity pool is even more beautiful than the pictures. I've already booked my return visit!",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
  },
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 bg-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">Guest Experiences</h2>
          <p className="mt-4 text-lg text-gray-400">
            Hear what our guests have to say about their stay with us
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="rounded-lg bg-[#1e1e1e] border border-[#333] p-6 shadow-md"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">{item.name}</h4>
                  <div className="flex text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-400">"{item.quote}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
