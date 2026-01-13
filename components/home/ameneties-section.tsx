// components/home/AmenitiesSection.tsx
import Image from "next/image";

const amenities = [
  {
    title: "24/7 Room Service",
    desc: "Order meals and essentials anytime with our reliable room service.",
    image: "/room-service.jpg",
  },
  {
    title: "Fine Dining",
    desc: "Savor exquisite cuisine prepared by our award-winning chefs.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Uninterrupted Power Supply",
    desc: "Enjoy a comfortable stay with full power backup during outages.",
    image: "/hotel-backup-diesel-generator.jpg",
  },
  {
    title: "Secure Parking",
    desc: "24/7 secure parking facility with CCTV monitoring for your peace of mind.",
    image: "/parking.jpg",
  },
];

export function AmenitiesSection() {
  return (
    <section id="amenities" className="py-16 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white">Premium Amenities</h2>
          <p className="mt-4 text-lg text-gray-400">
            Indulge in our world-class facilities designed for your comfort and
            enjoyment
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {amenities.map((amenity, index) => (
            <div
              key={index}
              className="group overflow-hidden rounded-lg bg-[#1e1e1e] border border-[#333] shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={amenity.image}
                  alt={amenity.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-white">
                  {amenity.title}
                </h3>
                <p className="mt-2 text-sm text-gray-400">{amenity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
