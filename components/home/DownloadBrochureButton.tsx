"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, FileText, Loader2, X } from "lucide-react";
import {
  brochureRequestSchema,
  type BrochureRequestValues,
} from "@/lib/validations";
import { useToast } from "@/components/ui/Toaster";

const BROCHURE_FILE_PATH = "/documents/abstitch-brochure.pdf";

export default function DownloadBrochureButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<BrochureRequestValues>({
    resolver: zodResolver(brochureRequestSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      company: "",
      position: "",
      email: "",
      number: "",
      agree: false,
    },
  });

  const closeModal = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit = async (values: BrochureRequestValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/brochure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Request failed");

      // Trigger the actual file download.
      const link = document.createElement("a");
      link.href = BROCHURE_FILE_PATH;
      link.download = "";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Thanks! Your brochure download has started.");
      closeModal();
    } catch (err) {
      console.error("Brochure download error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 left-5 z-[150] inline-flex items-center gap-2 rounded-full bg-burgundy-800 text-white pl-4 pr-5 py-3 shadow-lg hover:bg-burgundy-900 hover:shadow-xl transition-all duration-200"
        aria-label="Download Brochure"
      >
        <FileText size={18} />
        <span className="font-sans text-sm font-semibold tracking-wide">
          Download Brochure
        </span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Download Brochure form"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            <div className="overflow-y-auto p-6">
              <h3 className="font-serif text-xl font-bold text-gray-900 mb-1">
                Download Our Brochure
              </h3>
              <p className="font-sans text-sm text-gray-500 mb-6">
                Please fill in your details below to download.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="label">Name *</label>
                  <input
                    {...register("name")}
                    className="input-field"
                    placeholder="Jane Smith"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Company *</label>
                  <input
                    {...register("company")}
                    className="input-field"
                    placeholder="Acme Ltd"
                  />
                  {errors.company && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Position *</label>
                  <input
                    {...register("position")}
                    className="input-field"
                    placeholder="Operations Manager"
                  />
                  {errors.position && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.position.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Email *</label>
                  <input
                    {...register("email")}
                    type="email"
                    className="input-field"
                    placeholder="jane@acme.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">Number *</label>
                  <input
                    {...register("number")}
                    type="tel"
                    className="input-field"
                    placeholder="07700 000000"
                  />
                  {errors.number && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.number.message}
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input
                    {...register("agree")}
                    type="checkbox"
                    id="brochure-agree"
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800"
                  />
                  <label
                    htmlFor="brochure-agree"
                    className="font-sans text-xs text-gray-600 leading-relaxed"
                  >
                    I agree to provide my data.
                  </label>
                </div>
                {errors.agree && (
                  <p className="text-red-500 text-xs -mt-2">
                    {errors.agree.message}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!isValid || submitting}
                  className="btn-primary w-full mt-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      Download Brochure
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}