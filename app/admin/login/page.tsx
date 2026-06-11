"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<AdminLoginValues>({ resolver: zodResolver(adminLoginSchema) });

  const handleSubmit = async (values: AdminLoginValues) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (authErr) throw new Error(authErr.message);

      const { data: profile, error: profileErr } = await supabase
        .from("admin_profiles")
        .select("role")
        .eq("id", data.user?.id)
        .single();

      if (profileErr || !profile) {
        await supabase.auth.signOut();
        throw new Error("Access denied. You do not have admin privileges.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-burgundy-950 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold text-white tracking-wider">
            ABSTITCH
          </span>
          <p className="font-sans text-xs tracking-widest text-white/50 mt-1 uppercase">
            Admin Panel
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-burgundy-50 flex items-center justify-center">
              <Lock size={15} className="text-burgundy-800" />
            </div>
            <h1 className="font-serif text-xl font-bold text-gray-900">Sign In</h1>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-sans text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                {...form.register("email")}
                type="email"
                className="input-field"
                placeholder="admin@abstitch.com"
                autoComplete="email"
              />
              {form.formState.errors.email && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...form.register("password")}
                  type={showPass ? "text" : "password"}
                  className="input-field pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center font-sans text-xs text-white/30 mt-6">
          Authorised personnel only
        </p>
      </div>
    </div>
  );
}
