import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import SchoolListPage from "@/components/shop/SchoolListPage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Primary Schools | Abstitch School Wear",
  description:
    "Browse school uniforms for Aberdeen primary schools. Click your school to view available uniform items.",
};

async function getPrimarySchools() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: parentCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "primary-schools")
      .single();

    if (!parentCat) return [];

    const { data } = await supabase
      .from("categories")
      .select("id, name, slug")
      .eq("parent_id", parentCat.id)
      .order("name");

    return data || [];
  } catch {
    return [];
  }
}

export default async function PrimarySchoolsPage() {
  const schools = await getPrimarySchools();

  return (
    <SiteLayout>
      <SchoolListPage
        title="Primary Schools"
        subtitle="Select your school to view available uniform items"
        schools={schools}
        baseHref="/shop/school-wear/primary-schools"
        backHref="/shop/school-wear"
        backLabel="School Wear"
      />
    </SiteLayout>
  );
}