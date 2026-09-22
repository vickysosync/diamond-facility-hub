import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || process.env.EMAIL_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER || process.env.EMAIL_HOST_USER || "";
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || process.env.EMAIL_HOST_PASSWORD || "";
const SMTP_FROM = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.EMAIL_HOST_USER || "";
const ADMIN_NOTIFICATION_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || process.env.SMTP_USER || process.env.EMAIL_HOST_USER || "";

function createTransporter() {
  if (!SMTP_USER || !SMTP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}

export interface QuoteEmailData {
  quoteId: string;
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  facilityType?: string;
  facilitySize?: number;
  selectedServices?: string[];
  frequency?: string;
  estimatedCost?: number;
  preferredDate?: string;
  city?: string;
  notes?: string;
}

export async function sendQuoteNotification(data: QuoteEmailData): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP credentials not configured. Quote saved to database. Data:", data.quoteId);
    return true;
  }

  const servicesList = Array.isArray(data.selectedServices) ? data.selectedServices.join(", ") : "Not specified";
  const costFormatted = data.estimatedCost ? `₹${data.estimatedCost.toLocaleString("en-IN")}` : "Custom Quote";

  const adminHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f1824; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #d69f4c; font-size: 20px;">DIAMOND INTEGRATED FACILITY SERVICES LLP</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">New Detailed Quote Request Received</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <div style="background: #f8fafc; border-left: 4px solid #d69f4c; padding: 12px 16px; margin-bottom: 20px;">
          <strong style="color: #0f1824; font-size: 16px;">Quote ID: ${data.quoteId}</strong>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 40%;">Company Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.companyName}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Contact Person:</td><td style="padding: 8px 0; font-weight: 600;">${data.contactPerson}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; font-weight: 600;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Facility Type:</td><td style="padding: 8px 0;">${data.facilityType || "General"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Facility Size:</td><td style="padding: 8px 0;">${data.facilitySize ? `${data.facilitySize.toLocaleString("en-IN")} sq.ft` : "N/A"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Services Selected:</td><td style="padding: 8px 0; font-weight: 600; color: #0f1824;">${servicesList}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Frequency:</td><td style="padding: 8px 0;">${data.frequency || "One Time"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Estimated Price:</td><td style="padding: 8px 0; font-weight: 700; color: #a3722e; font-size: 16px;">${costFormatted}</td></tr>
          ${data.preferredDate ? `<tr><td style="padding: 8px 0; color: #64748b;">Preferred Date:</td><td style="padding: 8px 0;">${data.preferredDate}</td></tr>` : ""}
          ${data.city ? `<tr><td style="padding: 8px 0; color: #64748b;">City:</td><td style="padding: 8px 0;">${data.city}</td></tr>` : ""}
          ${data.notes ? `<tr><td style="padding: 8px 0; color: #64748b;">Notes / Details:</td><td style="padding: 8px 0;">${data.notes}</td></tr>` : ""}
        </table>
      </div>
      <div style="background: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b;">
        Diamond Integrated Facility Services LLP • Pune, Maharashtra • <a href="https://diamondifs.com" style="color: #0f1824;">diamondifs.com</a>
      </div>
    </div>
  `;

  const customerHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f1824; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #d69f4c; font-size: 20px;">DIAMOND INTEGRATED FACILITY SERVICES LLP</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">Quote Request Confirmation</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <p style="font-size: 15px; margin-top: 0;">Dear <strong>${data.contactPerson}</strong>,</p>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Thank you for reaching out to <strong>Diamond Integrated Facility Services LLP</strong>. We have successfully received your service requirements under Reference ID <strong>${data.quoteId}</strong>.
        </p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px; color: #0f1824; font-size: 14px;">Summary of Your Request:</h4>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Selected Services:</strong> ${servicesList}</p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Indicative Estimate:</strong> <span style="color: #a3722e; font-weight: 700;">${costFormatted}</span></p>
          <p style="margin: 4px 0; font-size: 13px;"><strong>Frequency:</strong> ${data.frequency || "One Time"}</p>
        </div>
        <p style="font-size: 14px; line-height: 1.6; color: #334155;">
          Our facility coordinator will review your site requirements and contact you at <strong>${data.phone}</strong> shortly.
        </p>
        <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
          For urgent enquiries, you can reach us directly at <strong>020 45355544</strong> or <strong>+91 9689515295</strong>.
        </p>
      </div>
      <div style="background: #0f1824; color: #ffffff; padding: 16px; text-align: center; font-size: 12px;">
        Office No-A2, Sai Pritam Nagari, Rahatani, Pune - 411017 • <a href="https://diamondifs.com" style="color: #d69f4c;">diamondifs.com</a>
      </div>
    </div>
  `;

  try {
    // 1. Send alert to Admin / Business team
    await transporter.sendMail({
      from: `"Diamond Facility Hub" <${SMTP_FROM}>`,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `[New Quote ${data.quoteId}] ${data.companyName} - ${servicesList}`,
      html: adminHtml,
    });

    // Note: Outgoing emails to client/customer are temporarily disabled as requested.
    // Quotes are securely logged to MongoDB and notified directly to the business admin.
    return true;
  } catch (error) {
    console.error("Error sending quote email notification:", error);
    return false;
  }
}

export interface EnquiryEmailData {
  enquiryId: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  service?: string;
  message: string;
}

export async function sendEnquiryNotification(data: EnquiryEmailData): Promise<boolean> {
  const transporter = createTransporter();
  if (!transporter) {
    console.warn("SMTP credentials not configured. Enquiry saved to database. Data:", data.enquiryId);
    return true;
  }

  const adminHtml = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f1824; color: #ffffff; padding: 24px; text-align: center;">
        <h2 style="margin: 0; color: #d69f4c; font-size: 20px;">DIAMOND INTEGRATED FACILITY SERVICES LLP</h2>
        <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.85;">New Contact Enquiry Received</p>
      </div>
      <div style="padding: 24px; color: #1e293b;">
        <div style="background: #f8fafc; border-left: 4px solid #d69f4c; padding: 12px 16px; margin-bottom: 20px;">
          <strong style="color: #0f1824; font-size: 16px;">Enquiry ID: ${data.enquiryId}</strong>
        </div>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 8px 0; color: #64748b; width: 35%;">Name:</td><td style="padding: 8px 0; font-weight: 600;">${data.name}</td></tr>
          ${data.company ? `<tr><td style="padding: 8px 0; color: #64748b;">Company:</td><td style="padding: 8px 0;">${data.company}</td></tr>` : ""}
          <tr><td style="padding: 8px 0; color: #64748b;">Phone:</td><td style="padding: 8px 0; font-weight: 600;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Email:</td><td style="padding: 8px 0; font-weight: 600;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
          <tr><td style="padding: 8px 0; color: #64748b;">Service Required:</td><td style="padding: 8px 0; font-weight: 600; color: #0f1824;">${data.service || "General Enquiry"}</td></tr>
          <tr><td style="padding: 8px 0; color: #64748b; vertical-align: top;">Message:</td><td style="padding: 8px 0; line-height: 1.5;">${data.message}</td></tr>
        </table>
      </div>
      <div style="background: #f1f5f9; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b;">
        Diamond Integrated Facility Services LLP • Pune, Maharashtra • <a href="https://diamondifs.com" style="color: #0f1824;">diamondifs.com</a>
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Diamond Facility Hub" <${SMTP_FROM}>`,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `[Enquiry ${data.enquiryId}] ${data.name} - ${data.service || "Facility Support"}`,
      html: adminHtml,
    });
    return true;
  } catch (error) {
    console.error("Error sending enquiry email notification:", error);
    return false;
  }
}
