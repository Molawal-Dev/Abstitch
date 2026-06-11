import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import SchoolWearCards from "@/components/shop/SchoolWearCards";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "School Wear | Abstitch",
  description:
    "Browse school uniforms for Aberdeen's primary and secondary schools. Embroidered with your school crest. Quality guaranteed.",
};

const ACADEMY_NAMES = [
  "Bridge of Don Academy", "Bucksburn Academy", "Cults Academy",
  "Dyce Academy", "Harlaw Academy", "Hazlehead Academy",
  "Lochside Academy", "Northfield Academy", "Oldmachar Academy",
  "St Machar Academy",
];

async function getSchoolCounts() {
  try {
    const supabase = createServerSupabaseClient();

    const { data: primaryParent } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "primary-schools")
      .single();

    const { data: academyParent } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "academy-schools")
      .single();

    const [{ count: primaryCount }, { count: academyCount }] = await Promise.all([
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("parent_id", primaryParent?.id || ""),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true })
        .eq("parent_id", academyParent?.id || ""),
    ]);

    return {
      primaryCount: primaryCount || 0,
      academyCount: academyCount || 0,
    };
  } catch {
    return { primaryCount: 0, academyCount: 0 };
  }
}

export default async function SchoolWearPage() {
  const { primaryCount, academyCount } = await getSchoolCounts();

  return (
    <SiteLayout>
      <section className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-16">
        <div className="container-custom text-center">
          <p className="font-sans text-xs tracking-[0.3em] uppercase text-burgundy-300 mb-3">
            Browse
          </p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            School Wear
          </h1>
          <p className="font-sans text-white/75 max-w-xl mx-auto text-base">
            Quality school uniforms for every Aberdeen school — embroidered,
            printed, and delivered with care.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-custom">
          <SchoolWearCards
            primaryCount={primaryCount}
            academyCount={academyCount}
          />
        </div>
      </section>
    </SiteLayout>
  );
}