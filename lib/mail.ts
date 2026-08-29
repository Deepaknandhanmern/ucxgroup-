import "server-only";
import nodemailer from "nodemailer";
import type { EnquiryInput } from "@/lib/enquiries-db";
import { listActiveSubscribers } from "@/lib/subscribers-db";

const NOTIFY_TO = "collaborate@ucx-group.com";
const SITE_URL = "https://ucx-group.com";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Form",
  careers: "Careers Application",
  "case-study-download": "Case Study Download",
  "resource-download": "Resource Download",
  "training-workshop": "Training & Workshop",
  "insight-lead": "Insight Article",
  "homepage-query": "Homepage Query",
  "interiors-enquiry": "Design & Interiors",
  "collaboration-challenge": "Collaboration Lab",
  "calendly-booking": "Calendly Booking",
  "newsletter-signup": "Newsletter Signup",
};

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

// Lazy — mirrors lib/db.ts's pattern of not doing real work at module-import
// time, and lets the app run fine locally/in CI with no SMTP env vars set.
function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

// Fire-and-forget: a missing/broken SMTP config should never stop an
// enquiry from being saved, so failures here are logged, not thrown.
export async function notifyNewEnquiry(enquiry: EnquiryInput): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  const sourceLabel = SOURCE_LABELS[enquiry.source] ?? enquiry.source;
  const fields = Object.entries(enquiry.data)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join("\n");

  try {
    await t.sendMail({
      from: process.env.SMTP_USER,
      to: NOTIFY_TO,
      replyTo: enquiry.email || undefined,
      subject: `New ${sourceLabel} — ${enquiry.name ?? enquiry.email ?? "UCX website"}`,
      text: `A new enquiry came in from the UCX website.\n\nSource: ${sourceLabel}\nName: ${enquiry.name ?? "—"}\nEmail: ${enquiry.email ?? "—"}\nPhone: ${enquiry.phone ?? "—"}\nSubject: ${enquiry.subject ?? "—"}\nMessage: ${enquiry.message ?? "—"}\n\nAll fields:\n${fields}\n\nView it in the dashboard: https://ucx-group.com/dashboard/enquiries`,
    });
  } catch (err) {
    console.error("Failed to send enquiry notification email:", err);
  }
}

// Fire-and-forget, same as above: a broken mail server should never block
// the publish action itself. Sent individually (not one email BCC'd to
// everyone) so each subscriber gets their own working unsubscribe link.
export async function notifySubscribersOfNewPost(post: { title: string; slug: string; excerpt: string }): Promise<void> {
  const t = getTransporter();
  if (!t) return;

  const subscribers = listActiveSubscribers();
  if (subscribers.length === 0) return;

  const postUrl = `${SITE_URL}/insights/${post.slug}`;

  await Promise.allSettled(
    subscribers.map((sub) => {
      const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${sub.token}`;
      return t.sendMail({
        from: process.env.SMTP_USER,
        to: sub.email,
        subject: `New from UCX Group: ${post.title}`,
        text: `${post.title}\n\n${post.excerpt}\n\nRead it here: ${postUrl}\n\n---\nYou're receiving this because you subscribed to UCX Group insights.\nUnsubscribe: ${unsubscribeUrl}`,
      });
    })
  );
}
