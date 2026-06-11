import type { Order } from "@/types";

//Resend / email is not yet configured 

export async function sendOrderConfirmationToCustomer(order: Order) {
  console.log("[email stub] sendOrderConfirmationToCustomer", order.order_number);
  return Promise.resolve();
}

export async function sendNewOrderNotificationToAdmin(order: Order) {
  console.log("[email stub] sendNewOrderNotificationToAdmin", order.order_number);
  return Promise.resolve();
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  console.log("[email stub] sendContactFormEmail", data);
  return Promise.resolve();
}

export async function sendOrderEnquiryEmail(data: {
  name: string;
  email: string;
  phone: string;
  school_or_organisation?: string;
  items_required: string;
  quantity: string;
  embroidery_required: boolean;
  logo_description?: string;
  additional_notes?: string;
}) {
  console.log("[email stub] sendOrderEnquiryEmail", data);
  return Promise.resolve();
}