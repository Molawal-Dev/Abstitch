"use client";

import type { UseFormReturn } from "react-hook-form";
import type { CheckoutValues } from "@/lib/validations";

interface CheckoutFormProps {
  form: UseFormReturn<CheckoutValues>;
  onSubmit: (values: CheckoutValues) => void;
  loading: boolean;
}

export default function CheckoutForm({ form, onSubmit, loading }: CheckoutFormProps) {
  const { register, handleSubmit, formState: { errors } } = form;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-lg font-bold text-gray-900 mb-5">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">First Name *</label>
            <input {...register("first_name")} className="input-field" placeholder="John" />
            {errors.first_name && <p className="text-red-500 text-xs mt-1">{errors.first_name.message}</p>}
          </div>
          <div>
            <label className="label">Last Name *</label>
            <input {...register("last_name")} className="input-field" placeholder="Smith" />
            {errors.last_name && <p className="text-red-500 text-xs mt-1">{errors.last_name.message}</p>}
          </div>
          <div>
            <label className="label">Email Address *</label>
            <input {...register("email")} type="email" className="input-field" placeholder="john@email.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="label">Phone Number *</label>
            <input {...register("phone")} type="tel" className="input-field" placeholder="07700 000000" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h2 className="font-serif text-lg font-bold text-gray-900 mb-5">Delivery Address</h2>
        <div className="space-y-4">
          <div>
            <label className="label">Address Line 1 *</label>
            <input {...register("address_line_1")} className="input-field" placeholder="123 High Street" />
            {errors.address_line_1 && <p className="text-red-500 text-xs mt-1">{errors.address_line_1.message}</p>}
          </div>
          <div>
            <label className="label">Address Line 2</label>
            <input {...register("address_line_2")} className="input-field" placeholder="Flat 4 (optional)" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">City / Town *</label>
              <input {...register("city")} className="input-field" placeholder="Aberdeen" />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <label className="label">County</label>
              <input {...register("county")} className="input-field" placeholder="Aberdeenshire (optional)" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Postcode *</label>
              <input {...register("postcode")} className="input-field" placeholder="AB10 1AA" />
              {errors.postcode && <p className="text-red-500 text-xs mt-1">{errors.postcode.message}</p>}
            </div>
            <div>
              <label className="label">Country</label>
              <input {...register("country")} className="input-field" readOnly />
            </div>
          </div>
          <div>
            <label className="label">Order Notes</label>
            <textarea {...register("notes")} className="input-field resize-none" rows={3} placeholder="Any special instructions (optional)" />
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing…
          </>
        ) : (
          "Continue to Payment"
        )}
      </button>
    </form>
  );
}
