"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function HeroHeader() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-image.png"
          alt="Luxury Hotel"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Header Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Gala Hotel</h1>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Rooms", "Amenities", "Testimonials", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-medium text-white hover:text-white/80"
              >
                {item}
              </Link>
            ))}
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="bg-white/10 text-white hover:bg-white/20 border-white/20"
              >
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>

        {/* Hero Text */}
        <div className="py-24 md:py-32 lg:py-40">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              Experience Luxury Like Never Before
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-white/80">
              Indulge in the epitome of luxury at our 5-star hotel, where
              exceptional service meets unparalleled comfort.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white"
              >
                Book Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center space-y-6 text-white px-4">
          {["Rooms", "Amenities", "Testimonials", "Contact"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-semibold"
            >
              {item}
            </Link>
          ))}
          <Link href="/dashboard">
            <Button
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
            >
              Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="absolute top-6 right-6 text-white text-2xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            ✕
          </Button>
        </div>
      )}
    </header>
  );
}
