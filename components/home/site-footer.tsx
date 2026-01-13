// components/home/SiteFooter.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] py-12 text-white border-t border-[#333]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <h3 className="text-lg font-bold">Luxe Haven</h3>
          <p className="mt-4 text-sm text-gray-400">
            Experience luxury like never before at our 5-star hotel, where
            exceptional service meets unparalleled comfort.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2">
            {[
              { label: "Rooms & Suites", href: "#rooms" },
              { label: "Amenities", href: "#amenities" },
              { label: "Testimonials", href: "#testimonials" },
              { label: "Book Now", href: "/booking" },
            ].map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-gray-400 hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li className="flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Saddar, Peshawar, PES 25000
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              +92 (340) 095-8353
            </li>
            <li className="flex items-center">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@galahotel.com
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider">
            Subscribe
          </h4>
          <p className="mt-4 text-sm text-gray-400">
            Subscribe to our newsletter for exclusive offers and updates.
          </p>
          <div className="mt-4 flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-l-md border-0 bg-[#2a2a2a] px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button className="rounded-l-none bg-primary hover:bg-primary/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-12 border-t border-[#333] pt-8 text-center">
        <p className="text-sm text-gray-400">
          © {new Date().getFullYear()} Gala Hotel. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
