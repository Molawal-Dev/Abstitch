import type { Metadata } from "next";
import SiteLayout from "@/components/layout/SiteLayout";
import SchoolListPage from "@/components/shop/SchoolListPage";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Academy Schools | Abstitch School Wear",
  description:
    "Browse school uniforms for Aberdeen academy schools. Click your school to view available uniform items.",
};

async function getAcademySchools() {
  try {
    const supabase = createServerSupabaseClient();
    const { data: parentCat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "academy-schools")
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

export default async function AcademySchoolsPage() {
  const schools = await getAcademySchools();

  return (
    <SiteLayout>
      <SchoolListPage
        title="Academy Schools"
        subtitle="Select your academy to view available uniform items"
        schools={schools}
        baseHref="/shop/school-wear/academy-schools"
        backHref="/shop/school-wear"
        backLabel="School Wear"
      />
    </SiteLayout>
  );
}