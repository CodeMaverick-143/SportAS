import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Configure nodemailer with email service
const createTransporter = async () => {
  // For production, replace with actual SMTP credentials
  const testAccount = await nodemailer.createTestAccount();
  
  // Create a transporter using environment variables if available, or test account
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  });
  
  return transporter;
};

// Handle POST requests to /api/contact
export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, phone, subject, message } = body;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_FROM || '"SportAs Contact Form" <noreply@sportas.com>',
      to: 'arpitsarang2020@gmail.com', // Target email address
      replyTo: email, // Set reply-to as the sender's email
      subject: subject ? `Contact Form: ${subject}` : 'New Contact Form Submission',
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Contact Form Submission</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #10b981; padding: 20px; color: white; text-align: center; border-radius: 4px 4px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="border: 1px solid #e2e8f0; border-top: none; padding: 20px; border-radius: 0 0 4px 4px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-line; background-color: #f9fafb; padding: 12px; border-radius: 4px; border: 1px solid #e2e8f0;">${message}</p>
            <p style="margin-top: 24px; font-size: 14px; color: #6b7280;">This email was sent from the SportAs website contact form.</p>
          </div>
        </body>
        </html>
      `,
    };
    
    // Send the email
    const transporter = await createTransporter();
    const info = await transporter.sendMail(mailOptions);
    
    // For development, log the preview URL (for Ethereal emails)
    if (info.messageId && !process.env.EMAIL_HOST) {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return NextResponse.json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
