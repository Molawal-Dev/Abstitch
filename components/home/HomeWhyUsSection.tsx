import { Shield, Clock, Award, Truck, Users, Star } from "lucide-react";

const reasons = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "20+ Years Experience",
    description: "Trusted by Aberdeen families and schools for over two decades.",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Quality Guaranteed",
    description: "Every garment meets our strict quality standards before it leaves our premises.",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "50+ Local Schools",
    description: "Serving the majority of Aberdeen's primary and secondary schools.",
  },
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Fast Delivery",
    description: "Standard 3–5 day UK delivery. Free on orders over £75.",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Quick Turnaround",
    description: "Most embroidered orders completed within 5–7 working days.",
  },
  {
    icon: <Star className="w-6 h-6" />,
    title: "5-Star Service",
    description: "Hundreds of satisfied customers across Aberdeen and Scotland.",
  },
];

export default function HomeWhyUsSection() {
  return (
    <section className="py-16 md:py-20 bg-cream-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-700 mb-2">
            Why Choose Us
          </p>
          <h2 className="section-title">The Abstitch Difference</h2>
          <p className="section-subtitle mx-auto">
            Aberdeen&apos;s most trusted school wear supplier — quality, service, and value since the 1970s.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((r) => (
            <div
              key={r.title}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:border-burgundy-200 hover:shadow-sm transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-burgundy-50 flex items-center justify-center text-burgundy-800 mb-4">
                {r.icon}
              </div>
              <h3 className="font-serif text-lg font-bold text-gray-900 mb-2">
                {r.title}
              </h3>
              <p className="font-sans text-sm text-gray-500 leading-relaxed">
                {r.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
