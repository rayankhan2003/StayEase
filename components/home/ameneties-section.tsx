// components/home/AmenitiesSection.tsx
import Image from "next/image";

const amenities = [
  {
    title: "Luxury Spa",
    desc: "Rejuvenate your body and mind with our premium spa treatments.",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop",
  },
  {
    title: "Infinity Pool",
    desc: "Swim in our stunning infinity pool with panoramic city views.",
    image:
      "https://images.unsplash.com/photo-1468824357306-a439d58ccb1c?q=80&w=2069&auto=format&fit=crop",
  },
  {
    title: "Fitness Center",
    desc: "Stay fit with our state-of-the-art equipment and personal trainers.",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop",
  },
  {
    title: "Fine Dining",
    desc: "Savor exquisite cuisine prepared by our award-winning chefs.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=2070&auto=format&fit=crop",
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
