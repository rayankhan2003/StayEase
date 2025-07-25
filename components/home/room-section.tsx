// components/home/RoomsSection.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const roomData = [
  {
    title: "Deluxe Room",
    guests: "2 Guests",
    bed: "1 King Bed",
    size: "400 sq ft",
    price: "$299",
    image:
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=2070&auto=format&fit=crop",
    link: "/booking?room=deluxe",
  },
  {
    title: "Executive Suite",
    guests: "2-3 Guests",
    bed: "1 King Bed",
    size: "650 sq ft",
    price: "$499",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop",
    link: "/booking?room=executive",
  },
  {
    title: "Presidential Suite",
    guests: "4 Guests",
    bed: "2 King Beds",
    size: "1200 sq ft",
    price: "$899",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=2070&auto=format&fit=crop",
    link: "/booking?room=presidential",
  },
];

export function RoomsSection() {
  return (
    <section id="rooms" className="py-16 bg-[#1a1a1a]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Luxurious Accommodations
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Choose from our selection of meticulously designed rooms and suites
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {roomData.map((room, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-lg bg-[#1e1e1e] border border-[#333] shadow-md hover:shadow-lg"
            >
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={room.image}
                  alt={room.title}
                  fill
                  className="object-cover hover:scale-105 transition-transform"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-white">{room.title}</h3>
                <div className="mt-2 flex items-center text-sm text-gray-400">
                  <Users className="mr-1 h-4 w-4" />
                  <span>{room.guests}</span>
                  <span className="mx-2">•</span>
                  <span>{room.bed}</span>
                  <span className="mx-2">•</span>
                  <span>{room.size}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-white">
                      {room.price}
                    </span>
                    <span className="text-sm text-gray-400"> / night</span>
                  </div>
                  <Link href={room.link}>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-primary px-4 py-2 rounded-md hover:bg-primary/90"
            >
              View All Rooms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
