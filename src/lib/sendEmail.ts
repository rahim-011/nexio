
import { Resend } from "resend";

export async function sendEmail({
    to,
    subject,
    html,
}: {
    to: string;
    subject: string;
    html: string;
}) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { data, error } = await resend.emails.send({
        from: "Nexio <onboarding@resend.dev>",
        to,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
