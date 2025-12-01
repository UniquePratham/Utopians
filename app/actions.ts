'use server';

import nodemailer from 'nodemailer';

export async function sendJoinRequest(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'All fields are required.' };
    }

    // In a real app, you would use process.env.SMTP_HOST, etc.
    // For now, we'll log to console if no env vars are set, or try to send if they are.

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.example.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER || 'user',
            pass: process.env.SMTP_PASS || 'pass',
        },
    });

    try {
        if (process.env.SMTP_HOST) {
            await transporter.sendMail({
                from: `"Utopians Website" <${process.env.SMTP_USER}>`,
                to: process.env.CONTACT_EMAIL || 'contact@utopians.com', // Replace with team email
                subject: `New Join Request from ${name}`,
                text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
                html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message}</p>`,
            });
            console.log('Email sent successfully');
        } else {
            console.log('Mock Email Sent:', { name, email, message });
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return { success: true };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error: 'Failed to send email.' };
    }
}
