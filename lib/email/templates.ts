import { Resend } from "resend";
import type { Order } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "info@abstitch.co.uk";
const FROM_EMAIL = "Abstitch <orders@abstitch.com>";

function formatPrice(p: number) {
  return `£${p.toFixed(2)}`;
}

function orderItemsHtml(order: Order) {
  return order.items
    .map(
      (item) => `
    <tr>
      <td style="padding:8px;border-bottom:1px solid #eee;">${item.product_name}${item.color ? ` — ${item.color}` : ""}${item.size ? ` / ${item.size}` : ""}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price)}</td>
      <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.subtotal)}</td>
    </tr>`
    )
    .join("");
}

function baseTemplate(title: string, content: string) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;font-family:'Georgia',serif;background:#f8f4f0;color:#2c1a1a;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f4f0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:#722F37;padding:32px;text-align:center;">
            <h1 style="margin:0;color:#fff;font-size:28px;letter-spacing:2px;">ABSTITCH</h1>
            <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;letter-spacing:1px;">EMBROIDERY · PRINTING · SCHOOL WEAR</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:40px;">
            <h2 style="color:#722F37;margin-top:0;">${title}</h2>
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f4f0;padding:24px;text-align:center;border-top:1px solid #eee;">
            <p style="margin:0;font-size:12px;color:#888;">Abstitch | Aberdeen, Scotland</p>
            <p style="margin:4px 0 0;font-size:12px;color:#888;">info@abstitch.co.uk</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendOrderConfirmationToCustomer(order: Order) {
  const content = `
    <p>Dear ${order.customer_name},</p>
    <p>Thank you for your order! We've received your purchase and are getting it ready.</p>

    <h3 style="color:#722F37;">Order #${order.order_number}</h3>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:4px;margin:16px 0;">
      <thead>
        <tr style="background:#722F37;color:#fff;">
          <th style="padding:10px;text-align:left;">Product</th>
          <th style="padding:10px;text-align:center;">Qty</th>
          <th style="padding:10px;text-align:right;">Unit</th>
          <th style="padding:10px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${orderItemsHtml(order)}</tbody>
      <tfoot>
        <tr>
          <td colspan="3" style="padding:8px;text-align:right;font-weight:bold;">Subtotal:</td>
          <td style="padding:8px;text-align:right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td colspan="3" style="padding:8px;text-align:right;font-weight:bold;">Shipping:</td>
          <td style="padding:8px;text-align:right;">${order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</td>
        </tr>
        <tr style="background:#f8f4f0;">
          <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Total:</td>
          <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;color:#722F37;">${formatPrice(order.total)}</td>
        </tr>
      </tfoot>
    </table>

    <h3 style="color:#722F37;">Delivery Address</h3>
    <p style="line-height:1.8;">
      ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
      ${order.shipping_address.address_line_1}<br>
      ${order.shipping_address.address_line_2 ? order.shipping_address.address_line_2 + "<br>" : ""}
      ${order.shipping_address.city}<br>
      ${order.shipping_address.postcode}<br>
      ${order.shipping_address.country}
    </p>

    <p>We'll be in touch once your order has been dispatched.</p>
    <p>If you have any questions, please contact us at <a href="mailto:info@abstitch.co.uk" style="color:#722F37;">info@abstitch.co.uk</a></p>
    <p>Thank you for choosing Abstitch!</p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: order.customer_email,
    subject: `Order Confirmation — ${order.order_number} | Abstitch`,
    html: baseTemplate(`Order Confirmed — ${order.order_number}`, content),
  });
}

export async function sendNewOrderNotificationToAdmin(order: Order) {
  const content = `
    <p>A new order has been placed on the Abstitch website.</p>

    <h3 style="color:#722F37;">Order #${order.order_number}</h3>
    <p><strong>Customer:</strong> ${order.customer_name} (${order.customer_email})<br>
    <strong>Phone:</strong> ${order.shipping_address.phone || "Not provided"}<br>
    <strong>Date:</strong> ${new Date(order.created_at).toLocaleString("en-GB")}</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eee;border-radius:4px;margin:16px 0;">
      <thead>
        <tr style="background:#722F37;color:#fff;">
          <th style="padding:10px;text-align:left;">Product</th>
          <th style="padding:10px;text-align:center;">Qty</th>
          <th style="padding:10px;text-align:right;">Unit</th>
          <th style="padding:10px;text-align:right;">Total</th>
        </tr>
      </thead>
      <tbody>${orderItemsHtml(order)}</tbody>
      <tfoot>
        <tr style="background:#f8f4f0;">
          <td colspan="3" style="padding:10px;text-align:right;font-weight:bold;font-size:16px;">Order Total:</td>
          <td style="padding:10px;text-align:right;font-weight:bold;font-size:16px;color:#722F37;">${formatPrice(order.total)}</td>
        </tr>
      </tfoot>
    </table>

    <h3 style="color:#722F37;">Delivery Address</h3>
    <p style="line-height:1.8;">
      ${order.shipping_address.first_name} ${order.shipping_address.last_name}<br>
      ${order.shipping_address.address_line_1}<br>
      ${order.shipping_address.address_line_2 ? order.shipping_address.address_line_2 + "<br>" : ""}
      ${order.shipping_address.city}, ${order.shipping_address.postcode}<br>
      ${order.shipping_address.country}
    </p>

    <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/orders/${order.id}" style="background:#722F37;color:#fff;padding:12px 24px;border-radius:4px;text-decoration:none;display:inline-block;">View Order in Admin</a></p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    subject: `New Order #${order.order_number} — ${formatPrice(order.total)} | Abstitch`,
    html: baseTemplate(`New Order Received — ${order.order_number}`, content),
  });
}

export async function sendContactFormEmail(data: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  const content = `
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#722F37;">${data.email}</a></p>
    ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ""}
    <p><strong>Subject:</strong> ${data.subject}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
    <p style="white-space:pre-wrap;">${data.message}</p>
    <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
    <p><a href="mailto:${data.email}" style="background:#722F37;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;display:inline-block;">Reply to ${data.name}</a></p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject} — from ${data.name}`,
    html: baseTemplate("New Contact Form Submission", content),
  });
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
  const content = `
    <h3 style="color:#722F37;">Customer Details</h3>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Email:</strong> <a href="mailto:${data.email}" style="color:#722F37;">${data.email}</a></p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    ${data.school_or_organisation ? `<p><strong>School / Organisation:</strong> ${data.school_or_organisation}</p>` : ""}

    <h3 style="color:#722F37;">Order Details</h3>
    <p><strong>Items Required:</strong></p>
    <p style="white-space:pre-wrap;background:#f8f4f0;padding:12px;border-radius:4px;">${data.items_required}</p>
    <p><strong>Estimated Quantity:</strong> ${data.quantity}</p>
    <p><strong>Embroidery / Printing Required:</strong> ${data.embroidery_required ? "Yes" : "No"}</p>
    ${data.logo_description ? `<p><strong>Logo / Design Description:</strong></p><p style="white-space:pre-wrap;background:#f8f4f0;padding:12px;border-radius:4px;">${data.logo_description}</p>` : ""}
    ${data.additional_notes ? `<p><strong>Additional Notes:</strong></p><p style="white-space:pre-wrap;background:#f8f4f0;padding:12px;border-radius:4px;">${data.additional_notes}</p>` : ""}

    <hr style="border:none;border-top:1px solid #eee;margin:16px 0;">
    <p><a href="mailto:${data.email}" style="background:#722F37;color:#fff;padding:10px 20px;border-radius:4px;text-decoration:none;display:inline-block;">Reply to ${data.name}</a></p>
  `;

  return resend.emails.send({
    from: FROM_EMAIL,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject: `Order Enquiry from ${data.name}${data.school_or_organisation ? ` — ${data.school_or_organisation}` : ""}`,
    html: baseTemplate("New Order Enquiry", content),
  });
}
