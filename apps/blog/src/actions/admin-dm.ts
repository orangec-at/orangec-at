"use server";

import { Resend } from "resend";
import { auth } from "@/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendAdminDM(content: string) {
  const session = await auth();
  
  if (!content || content.trim().length < 5) {
    return { success: false, message: "Message is too short" };
  }

  const senderEmail = session?.user?.email || "Anonymous Guest";
  const senderName = session?.user?.name || "Visitor";

  try {
    const { data, error } = await resend.emails.send({
      from: "Archives DM <onboarding@resend.dev>",
      to: "jaylee222@gmail.com", // Admin email
      subject: `[Archives DM] New message from ${senderName}`,
      html: `
        <h2>New Message from the Library</h2>
        <p><strong>Sender:</strong> ${senderName} (${senderEmail})</p>
        <hr />
        <p style="white-space: pre-wrap;">${content}</p>
        <hr />
        <p><small>Sent via OrangeC-AT Archives System</small></p>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return { success: false, message: "Failed to send message via email provider" };
    }

    return { success: true, message: "Your message has been safely delivered to the Master's desk.", data };
  } catch (err) {
    console.error("DM Action Error:", err);
    return { success: false, message: "An unexpected error occurred while sending the message" };
  }
}
