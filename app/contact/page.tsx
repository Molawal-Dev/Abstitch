"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SiteLayout from "@/components/layout/SiteLayout";
import { useToast } from "@/components/ui/Toaster";
import { contactFormSchema, orderEnquirySchema, type ContactFormValues, type OrderEnquiryValues } from "@/lib/validations";
import { Mail, Phone, MapPin, MessageSquare, ShoppingBag, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "order">("contact");
  const [contactSent, setContactSent] = useState(false);
  const [orderSent, setOrderSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { success, error } = useToast();

  const contactForm = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });
  const orderForm = useForm<OrderEnquiryValues>({
    resolver: zodResolver(orderEnquirySchema),
    defaultValues: { embroidery_required: false },
  });

  const handleContactSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", ...values }),
      });
      if (!res.ok) throw new Error();
      setContactSent(true);
      success("Message sent! We'll be in touch within 1–2 business days.");
      contactForm.reset();
    } catch {
      error("Failed to send message. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOrderSubmit = async (values: OrderEnquiryValues) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "order", ...values }),
      });
      if (!res.ok) throw new Error();
      setOrderSent(true);
      success("Enquiry received! We'll review and get back to you shortly.");
      orderForm.reset();
    } catch {
      error("Failed to send enquiry. Please try again or email us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-burgundy-900 to-burgundy-800 text-white py-14">
        <div className="container-custom text-center">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-3">Contact Us</h1>
          <p className="font-sans text-white/75 max-w-lg mx-auto">
            Get in touch — whether it&apos;s a general enquiry or a custom order, we&apos;re here to help.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-serif text-xl font-bold text-gray-900 mb-4">Get In Touch</h2>
                {[
                  { icon: <Mail size={18} />, label: "Email", value: "info@abstitch.co.uk", href: "mailto:info@abstitch.co.uk" },
                  { icon: <Phone size={18} />, label: "Phone", value: "01224 639 152", href: "tel:+4401224639152" },
                  { icon: <MapPin size={18} />, label: "Location", value: "35 Ann Street, Aberdeen, UK. AB25 3LH", href: null },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-3 py-3 border-b border-gray-100">
                    <div className="w-9 h-9 rounded-lg bg-burgundy-50 flex items-center justify-center text-burgundy-800 flex-shrink-0">
                      {c.icon}
                    </div>
                    <div>
                      <p className="font-sans text-xs text-gray-400 uppercase tracking-wider">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="font-sans text-sm font-medium text-gray-800 hover:text-burgundy-800 transition-colors">{c.value}</a>
                      ) : (
                        <p className="font-sans text-sm font-medium text-gray-800">{c.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-burgundy-50 rounded-xl p-5">
                <h3 className="font-serif font-bold text-gray-900 mb-3">Opening Hours</h3>
                {[
                  ["Monday – Friday", "9:00am – 5:30pm"],
                  ["Saturday", "10:00am – 4:00pm"],
                  ["Sunday", "Closed"],
                ].map(([day, hours]) => (
                  <div key={day} className="flex justify-between font-sans text-sm py-1.5 border-b border-burgundy-100 last:border-0">
                    <span className="text-gray-600">{day}</span>
                    <span className="font-medium text-gray-800">{hours}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Forms */}
            <div className="lg:col-span-2">
              {/* Tab selector */}
              <div className="flex gap-0 mb-6 bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setActiveTab("contact")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-sans text-sm font-medium transition-all
                    ${activeTab === "contact" ? "bg-white shadow text-burgundy-800" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <MessageSquare size={15} />
                  General Enquiry
                </button>
                <button
                  id="order"
                  onClick={() => setActiveTab("order")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg font-sans text-sm font-medium transition-all
                    ${activeTab === "order" ? "bg-white shadow text-burgundy-800" : "text-gray-600 hover:text-gray-800"}`}
                >
                  <ShoppingBag size={15} />
                  Place an Order
                </button>
              </div>

              {/* General contact form */}
              {activeTab === "contact" && (
                contactSent ? (
                  <SuccessMessage
                    title="Message Sent!"
                    body="We've received your message and will be in touch within 1–2 business days."
                    onReset={() => setContactSent(false)}
                  />
                ) : (
                  <form onSubmit={contactForm.handleSubmit(handleContactSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input {...contactForm.register("name")} className="input-field" placeholder="Your name" />
                        {contactForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{contactForm.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="label">Email Address *</label>
                        <input {...contactForm.register("email")} type="email" className="input-field" placeholder="your@email.com" />
                        {contactForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{contactForm.formState.errors.email.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label">Phone Number</label>
                      <input {...contactForm.register("phone")} type="tel" className="input-field" placeholder="07700 000000 (optional)" />
                    </div>
                    <div>
                      <label className="label">Subject *</label>
                      <input {...contactForm.register("subject")} className="input-field" placeholder="What is your enquiry about?" />
                      {contactForm.formState.errors.subject && <p className="text-red-500 text-xs mt-1">{contactForm.formState.errors.subject.message}</p>}
                    </div>
                    <div>
                      <label className="label">Message *</label>
                      <textarea {...contactForm.register("message")} rows={5} className="input-field resize-none" placeholder="Tell us how we can help..." />
                      {contactForm.formState.errors.message && <p className="text-red-500 text-xs mt-1">{contactForm.formState.errors.message.message}</p>}
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                )
              )}

              {/* Order enquiry form */}
              {activeTab === "order" && (
                orderSent ? (
                  <SuccessMessage
                    title="Enquiry Received!"
                    body="Thank you for your order enquiry. We'll review your request and get back to you within 1–2 business days."
                    onReset={() => setOrderSent(false)}
                  />
                ) : (
                  <form onSubmit={orderForm.handleSubmit(handleOrderSubmit)} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
                    <p className="font-sans text-sm text-gray-600 bg-burgundy-50 px-4 py-3 rounded-lg">
                      Use this form to place a custom order, request embroidery, or enquire about bulk pricing — without paying upfront.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Full Name *</label>
                        <input {...orderForm.register("name")} className="input-field" placeholder="Your name" />
                        {orderForm.formState.errors.name && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="label">Email Address *</label>
                        <input {...orderForm.register("email")} type="email" className="input-field" placeholder="your@email.com" />
                        {orderForm.formState.errors.email && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label">Phone Number *</label>
                        <input {...orderForm.register("phone")} type="tel" className="input-field" placeholder="07700 000000" />
                        {orderForm.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.phone.message}</p>}
                      </div>
                      <div>
                        <label className="label">School / Organisation</label>
                        <input {...orderForm.register("school_or_organisation")} className="input-field" placeholder="e.g. Aberdeen Primary School" />
                      </div>
                    </div>
                    <div>
                      <label className="label">Items Required *</label>
                      <textarea {...orderForm.register("items_required")} rows={4} className="input-field resize-none" placeholder="Please list the items you need, including colours and sizes if known..." />
                      {orderForm.formState.errors.items_required && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.items_required.message}</p>}
                    </div>
                    <div>
                      <label className="label">Estimated Quantity *</label>
                      <input {...orderForm.register("quantity")} className="input-field" placeholder="e.g. 50 shirts, mixed sizes" />
                      {orderForm.formState.errors.quantity && <p className="text-red-500 text-xs mt-1">{orderForm.formState.errors.quantity.message}</p>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" {...orderForm.register("embroidery_required")} className="w-4 h-4 rounded border-gray-300 text-burgundy-800 focus:ring-burgundy-800" />
                        <span className="font-sans text-sm text-gray-700 font-medium">Embroidery or printing required?</span>
                      </label>
                    </div>
                    <div>
                      <label className="label">Logo / Design Description</label>
                      <textarea {...orderForm.register("logo_description")} rows={3} className="input-field resize-none" placeholder="Describe your logo or design (if applicable)..." />
                    </div>
                    <div>
                      <label className="label">Additional Notes</label>
                      <textarea {...orderForm.register("additional_notes")} rows={3} className="input-field resize-none" placeholder="Any other information we should know..." />
                    </div>
                    <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
                      {submitting ? "Sending…" : "Submit Order Enquiry"}
                    </button>
                  </form>
                )
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function SuccessMessage({ title, body, onReset }: { title: string; body: string; onReset: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-emerald-200 p-10 text-center">
      <CheckCircle className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
      <h3 className="font-serif text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="font-sans text-gray-500 mb-6">{body}</p>
      <button onClick={onReset} className="btn-outline">Send Another</button>
    </div>
  );
}
