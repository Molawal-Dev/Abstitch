import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminProductForm from "@/components/admin/AdminProductForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function EditProductPage({ params }: Props) {
  return (
    <AdminAuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-6 md:p-8 max-w-4xl">
          <div className="mb-6">
            <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-burgundy-800 transition-colors font-sans mb-3">
              <ChevronLeft size={15} />
              Back to Products
            </Link>
            <h1 className="font-serif text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
          <AdminProductForm productId={params.id} />
        </main>
      </div>
    </AdminAuthGuard>
  );
}
