"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Room } from "@/lib/api/rooms";

export function RoomsSection() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("status", "available")
        .order("price", { ascending: true })
        .limit(3);

      if (!error && data) {
        setRooms(data);
      }

      setLoading(false);
    }

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-[#1a1a1a] text-center text-gray-400">
        Loading rooms...
      </section>
    );
  }

  if (rooms.length === 0) {
    return null;
  }

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
          {rooms.map((room) => {
            const imageUrl =
              Array.isArray(room.image_urls) && room.image_urls.length > 0
                ? room.image_urls[0]
                : "/room-placeholder.jpg";
            return (
              <div
                key={room.id}
                className="overflow-hidden rounded-lg bg-[#1e1e1e] border border-[#333] shadow-md hover:shadow-lg"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={`Room ${room.number}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform"
                  />
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white">
                    {room.type.charAt(0).toUpperCase() + room.type.slice(1)}{" "}
                    Room
                  </h3>

                  <div className="mt-2 flex items-center text-sm text-gray-400">
                    <Users className="mr-1 h-4 w-4" />
                    <span>{room.max_guests} Guests</span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-white">
                        PKR {room.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-400"> / night</span>
                    </div>

                    <Link href={`/booking?roomType=${room.type}`}>
                      <Button className="bg-primary hover:bg-primary/90 text-white">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
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
