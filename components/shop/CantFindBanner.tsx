import Link from "next/link";
import Image from "next/image";
import {
  Package,
  UserCheck,
  Tag,
  Scissors,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

type Variant = "safety" | "school";

const CONTENT = {
  safety: {
    headingLine1: "CAN'T FIND",
    headingLine2: "WHAT YOU NEED?",
    para1:
      "We stock thousands of workwear, PPE and safety products from leading brands. If you can't find the exact product you're looking for, our team can source it for you.",
    para2:
      "From specialist items to bulk orders, we'll help you find the right solution.",
    imageSrc: "/portwest/safety-im.PNG",
    benefits: [
      {
        Icon: Package,
        title: "THOUSANDS OF PRODUCTS",
        body: "Access to a huge range from trusted suppliers.",
      },
      {
        Icon: UserCheck,
        title: "EXPERT ADVICE",
        body: "Our team are here to help you find the right product.",
      },
      {
        Icon: Tag,
        title: "COMPETITIVE PRICES",
        body: "Great value on quality products, every time.",
      },
      {
        Icon: Scissors,
        title: "EMBROIDERY & PRINTING",
        body: "Add your logo for a professional finish.",
      },
    ],
  },
  school: {
    headingLine1: "CAN'T FIND YOUR",
    headingLine2: "SCHOOL ITEM?",
    para1:
      "We supply school uniforms for schools across Aberdeen and Scotland. If you can't find your school listed, our team can source the right uniform for you.",
    para2:
      "From individual items to full school outfits, we'll ensure every child is dressed for success.",
    imageSrc: "/school-wear-img.png",
    benefits: [
      {
        Icon: Package,
        title: "HUNDREDS OF SCHOOLS",
        body: "We supply uniforms for schools all across Aberdeen.",
      },
      {
        Icon: UserCheck,
        title: "EXPERT ADVICE",
        body: "Our team are here to help you find the right uniform.",
      },
      {
        Icon: Tag,
        title: "COMPETITIVE PRICES",
        body: "Great value uniforms you can trust, every time.",
      },
      {
        Icon: Scissors,
        title: "EMBROIDERY & PRINTING",
        body: "School crests and logos expertly stitched.",
      },
    ],
  },
};

const CONTACT_ITEMS = [
  {
    Icon: MessageCircle,
    title: "LET'S FIND IT TOGETHER",
    body: "Contact the Abstitch team today – we're happy to help.",
    href: "/contact",
  },
  {
    Icon: Phone,
    title: "CALL US",
    body: "01224 639152",
    href: "tel:01224639152",
  },
  {
    Icon: Mail,
    title: "EMAIL US",
    body: "sales@abstitch.co.uk",
    href: "mailto:sales@abstitch.co.uk",
  },
  {
    Icon: MapPin,
    title: "VISIT US",
    body: "35 Ann Street, Aberdeen AB25 3LH",
    href: "https://maps.google.com/?q=35+Ann+Street+Aberdeen+AB25+3LH",
  },
];

export default function CantFindBanner({ variant }: { variant: Variant }) {
  const content = CONTENT[variant];

  return (
    <div className="my-12 rounded-xl overflow-hidden border border-gray-200 shadow-sm">

      <div className="flex flex-col lg:flex-row bg-white">

        <div className="lg:w-[38%] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">

          <div className="flex items-start gap-4 mb-2">
            <div className="flex-shrink-0 mt-1 w-[54px] h-[54px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
              <Package size={26} className="text-gray-500" />
            </div>
            <h3 className="font-sans font-extrabold text-gray-900 leading-[1.1]"
              style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}>
              <span className="block">{content.headingLine1}</span>
              <span className="block">{content.headingLine2}</span>
            </h3>
          </div>

          <div className="h-[3px] w-12 bg-burgundy-700 rounded-full mb-5" style={{ marginLeft: "70px" }} />

          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-3">
            {content.para1}
          </p>
          <p className="font-sans text-sm text-gray-600 leading-relaxed mb-5">
            {content.para2}
          </p>
          <Link
            href="/contact"
            className="font-sans text-sm font-bold text-burgundy-700 hover:text-burgundy-900 hover:underline transition-colors"
          >
            Get in touch with Abstitch for any enquiries.
          </Link>
        </div>

        {/* MIDDLE: 4 benefit items stacked vertically */}
        <div className="lg:w-[32%] p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="space-y-5">
            {content.benefits.map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-3">
                {/* Circular icon badge */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                  <Icon size={15} className="text-gray-500" />
                </div>
                <div>
                  <p className="font-sans text-xs font-bold tracking-wide uppercase text-gray-800 leading-snug mb-0.5">
                    {title}
                  </p>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Product image */}
        <div className="hidden lg:block flex-1 relative min-h-[260px] bg-gray-100 overflow-hidden">
          {content.imageSrc ? (
            <Image
              src={content.imageSrc}
              alt={
                variant === "safety"
                  ? "Safety wear and PPE products"
                  : "School uniform products"
              }
              fill
              className="object-cover object-center"
              sizes="30vw"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
              <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">
                <Package size={22} className="text-gray-400" />
              </div>
              <p className="font-sans text-xs text-gray-400 text-center leading-relaxed">
                Add your product image URL to
                <br />
                <code className="text-[10px] bg-gray-200 px-1 py-0.5 rounded">
                  CONTENT.{variant}.imageSrc
                </code>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_ITEMS.map(({ Icon, title, body, href }) => (
          <a
            key={title}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="flex items-center gap-4 px-5 py-4 border-b sm:border-b-0 border-slate-800 lg:border-r last:border-0 hover:bg-slate-800 transition-colors group"
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#7B1118" }}
            >
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-white mb-0.5 leading-snug">
                {title}
              </p>
              <p className="font-sans text-xs text-slate-400 leading-snug group-hover:text-slate-300 transition-colors">
                {body}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}