// components/home/FeaturesSection.tsx
import { MapPin, Star, Check } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <MapPin className="h-6 w-6 text-primary" />,
      title: "Prime Location",
      desc: "Located in the heart of the city, with easy access to major attractions and business districts.",
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "5-Star Experience",
      desc: "Enjoy world-class amenities and personalized service that exceeds expectations.",
    },
    {
      icon: <Check className="h-6 w-6 text-primary" />,
      title: "Best Price Guarantee",
      desc: "We promise the best rates when you book directly through our website.",
    },
  ];

  return (
    <section className="py-16 bg-[#121212]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                {feature.icon}
              </div>
              <h3 className="mb-2 text-lg font-medium text-white">
                {feature.title}
              </h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
