import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import HeroSlider from "@/components/home/HeroSlider";
import HomeFeaturedSection from "@/components/home/HomeFeaturedSection";
import HomeSchoolWearSection from "@/components/home/HomeSchoolWearSection";
import HomeServicesSection from "@/components/home/HomeServicesSection";
import HomeWhyUsSection from "@/components/home/HomeWhyUsSection";
import HomeCTABanner from "@/components/home/HomeCTABanner";
import HomeCategorySlideshow from "@/components/home/HomeCategorySlideshow";
import HomeVideoSection from "@/components/home/HomeVideoSection";
import HomeVideoBanner from "@/components/home/HomeVideoBanner";
import DownloadBrochureButton from "@/components/home/DownloadBrochureButton";

export const metadata: Metadata = {
  title: "Abstitch | School Wear, Embroidery & Printing — Aberdeen",
  description:
    "Abstitch supplies quality school uniforms, embroidery, printing, and workwear across Aberdeen and Scotland. Over 50 years of trusted service.",
};

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSlider />
      <HomeSchoolWearSection />
      <HomeVideoSection />
      <HomeVideoBanner />
      <HomeFeaturedSection />
      <HomeCategorySlideshow />
      <HomeServicesSection />
      <HomeWhyUsSection />
      <HomeCTABanner />
      <DownloadBrochureButton />
    </SiteLayout>
  );
}