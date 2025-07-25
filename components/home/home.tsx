import { BookingSearchForm } from "../booking/booking-search-form";
import { AmenitiesSection } from "./ameneties-section";
import { CallToAction } from "./call-to-action";
import { FeaturesSection } from "./features-section";
import { HeroHeader } from "./hero-header";
import { RoomsSection } from "./room-section";
import { SiteFooter } from "./site-footer";
import { TestimonialsSection } from "./testimonial-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212] text-white">
      <HeroHeader />
      <div className="relative z-20 mx-auto -mt-16 max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-xl bg-[#1a1a1a] p-4 shadow-lg border border-[#333]">
          <BookingSearchForm />
        </div>
      </div>
      <FeaturesSection />
      <RoomsSection />
      <AmenitiesSection />
      <TestimonialsSection />
      <CallToAction />
      <SiteFooter />
    </div>
  );
}
