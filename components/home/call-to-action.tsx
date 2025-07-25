// components/home/CallToAction.tsx
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="py-16 relative">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury Hotel View"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Experience Luxury Today
        </h2>
        <p className="mt-4 text-xl text-white/80 max-w-2xl mx-auto">
          Book your stay now and enjoy exclusive benefits when you reserve
          directly through our website.
        </p>
        <div className="mt-8">
          <Link href="/booking">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Book Your Stay
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
