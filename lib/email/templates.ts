import { Resend } from "resend";
import type { Order } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = "Abstitch <sales@abstitch.com>";
const ADMIN_EMAILS = ["info@abstitch.co.uk"];

function formatGBP(amount: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
}

function renderOrderItemsRows(order: Order): string {
  return order.items
    .map((item) => {
      const schoolLine = item.school
        ? `<br/><span style="color:#722F37;font-size:12px;font-weight:600;">School: ${item.school}</span>`
        : "";
      const variantLine = [item.color, item.size]
        .filter(Boolean)
        .join(" / ");
      return `
        <tr>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;">
            <strong>${item.product_name}</strong>
            ${variantLine ? `<br/><span style="color:#666;font-size:12px;">${variantLine}</span>` : ""}
            ${schoolLine}
          </td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;">${formatGBP(item.price)}</td>
          <td style="padding:12px 8px;border-bottom:1px solid #eee;text-align:right;">${formatGBP(item.subtotal)}</td>
        </tr>
      `;
    })
    .join("");
}

function orderEmailHtml(order: Order, heading: string, intro: string): string {
  return `
    <div style="font-family: 'DM Sans', Arial, sans-serif; max-width:600px; margin:0 auto; color:#333;">
      <div style="background:#722F37; padding:24px; text-align:center;">
        <h1 style="color:#fff; margin:0; font-size:22px;">Abstitch</h1>
      </div>
      <div style="padding:24px;">
        <h2 style="color:#722F37; margin-top:0;">${heading}</h2>
        <p>${intro}</p>
        <p style="font-size:14px;color:#666;">
          Order Number: <strong>${order.order_number}</strong><br/>
          Date: ${new Date(order.created_at).toLocaleDateString("en-GB")}
        </p>

        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <thead>
            <tr style="background:#f7f7f7;">
              <th style="padding:8px; text-align:left; font-size:12px; text-transform:uppercase; color:#888;">Item</th>
              <th style="padding:8px; text-align:center; font-size:12px; text-transform:uppercase; color:#888;">Qty</th>
              <th style="padding:8px; text-align:right; font-size:12px; text-transform:uppercase; color:#888;">Price</th>
              <th style="padding:8px; text-align:right; font-size:12px; text-transform:uppercase; color:#888;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${renderOrderItemsRows(order)}
          </tbody>
        </table>

        <table style="width:100%; margin-top:12px;">
          <tr>
            <td style="padding:4px 8px; text-align:right; color:#666;">Subtotal:</td>
            <td style="padding:4px 8px; text-align:right; width:100px;">${formatGBP(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:4px 8px; text-align:right; color:#666;">Delivery:</td>
            <td style="padding:4px 8px; text-align:right;">${order.shipping > 0 ? formatGBP(order.shipping) : "Free / Collection"}</td>
          </tr>
          <tr>
            <td style="padding:8px; text-align:right; font-weight:bold; border-top:2px solid #722F37;">Total:</td>
            <td style="padding:8px; text-align:right; font-weight:bold; border-top:2px solid #722F37;">${formatGBP(order.total)}</td>
          </tr>
        </table>

        <div style="margin-top:24px; padding:16px; background:#f7f7f7; border-radius:8px;">
          <h3 style="margin:0 0 8px; font-size:14px; color:#722F37;">Delivery Details</h3>
          <p style="font-size:13px; color:#555; margin:0; line-height:1.6;">
            ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br/>
            ${order.shipping_address.address_line_1}${order.shipping_address.address_line_2 ? `, ${order.shipping_address.address_line_2}` : ""}<br/>
            ${order.shipping_address.city}${order.shipping_address.county ? `, ${order.shipping_address.county}` : ""}<br/>
            ${order.shipping_address.postcode}<br/>
            ${order.shipping_address.country}<br/>
            ${order.shipping_address.phone}<br/>
            ${order.shipping_address.email}
          </p>
        </div>

        ${order.notes ? `<p style="font-size:13px; color:#666; margin-top:16px;"><strong>Notes:</strong> ${order.notes}</p>` : ""}
      </div>
      <div style="background:#f0f0f0; padding:16px; text-align:center; font-size:12px; color:#999;">
        Abstitch &middot; 35 Ann Street, Aberdeen, AB25 3LH &middot; info@abstitch.co.uk
      </div>
    </div>
  `;
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.customer_email,
      subject: `Order Confirmation — ${order.order_number}`,
      html: orderEmailHtml(
        order,
        "Thank you for your order!",
        `Hi ${order.shipping_address.first_name}, we've received your order and it's now being processed. Here's a summary:`
      ),
    });
  } catch (err) {
    console.error("Failed to send customer confirmation email:", err);
  }
}

export async function sendNewOrderNotificationToAdmin(order: Order) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      subject: `New Order Received — ${order.order_number}`,
      html: orderEmailHtml(
        order,
        "New Order Received",
        `A new order has been placed by ${order.customer_name} (${order.customer_email}).`
      ),
    });
  } catch (err) {
    console.error("Failed to send admin order notification email:", err);
  }
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      replyTo: data.email,
      subject: `Contact Form: ${data.subject}`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width:600px; margin:0 auto; color:#333;">
          <div style="background:#722F37; padding:24px; text-align:center;">
            <h1 style="color:#fff; margin:0; font-size:22px;">Abstitch — Contact Form</h1>
          </div>
          <div style="padding:24px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space:pre-wrap; background:#f7f7f7; padding:12px; border-radius:8px;">${data.message}</p>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send contact form email:", err);
  }
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
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAILS,
      replyTo: data.email,
      subject: `New Order Enquiry from ${data.name}`,
      html: `
        <div style="font-family: 'DM Sans', Arial, sans-serif; max-width:600px; margin:0 auto; color:#333;">
          <div style="background:#722F37; padding:24px; text-align:center;">
            <h1 style="color:#fff; margin:0; font-size:22px;">Abstitch — Order Enquiry</h1>
          </div>
          <div style="padding:24px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            ${data.school_or_organisation ? `<p><strong>School/Organisation:</strong> ${data.school_or_organisation}</p>` : ""}
            <p><strong>Items Required:</strong></p>
            <p style="white-space:pre-wrap; background:#f7f7f7; padding:12px; border-radius:8px;">${data.items_required}</p>
            <p><strong>Quantity:</strong> ${data.quantity}</p>
            <p><strong>Embroidery Required:</strong> ${data.embroidery_required ? "Yes" : "No"}</p>
            ${data.logo_description ? `<p><strong>Logo Description:</strong> ${data.logo_description}</p>` : ""}
            ${data.additional_notes ? `<p><strong>Additional Notes:</strong> ${data.additional_notes}</p>` : ""}
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send order enquiry email:", err);
  }
}