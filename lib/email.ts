import nodemailer from 'nodemailer'
import type { Order } from '@/types'

// Configure nodemailer with your email service
// For development/testing, using Ethereal fake SMTP service
// For production, use a real SMTP provider like SendGrid, AWS SES, etc.
const createTransporter = async () => {
  // For production, replace this with your actual SMTP credentials
  const testAccount = await nodemailer.createTestAccount()
  
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || testAccount.user,
      pass: process.env.EMAIL_PASSWORD || testAccount.pass,
    },
  })
  
  return transporter
}

// Create order confirmation email template
const createOrderConfirmationEmail = (order: Order, userEmail: string) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  const formattedItems = order.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${item.price.toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">₹${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('')
  
  return {
    from: process.env.EMAIL_FROM || '"SportAs" <info@sportas.com>',
    to: userEmail,
    subject: `Order Confirmation - #${order._id.substring(0, 8)}`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Confirmation</title>
        <style>
          body {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
          }
          .header {
            background-color: #059669;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .footer {
            background-color: #f9fafb;
            padding: 15px;
            text-align: center;
            font-size: 14px;
            color: #6b7280;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 12px;
          }
          .total-row {
            font-weight: bold;
            background-color: #f3f4f6;
          }
          .order-info {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .shipping-info {
            background-color: #f9fafb;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            background-color: #059669;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Your Order!</h1>
          <p>Order #${order._id.substring(0, 8)}</p>
        </div>
        
        <div class="content">
          <p>Dear ${order.shippingAddress.fullName},</p>
          
          <p>Thank you for shopping with SportAs! We're excited to confirm that your order has been received and is being processed.</p>
          
          <div class="order-info">
            <h3>Order Details:</h3>
            <p><strong>Order Number:</strong> #${order._id.substring(0, 8)}</p>
            <p><strong>Order Date:</strong> ${formattedDate}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card Payment'}</p>
            <p><strong>Order Status:</strong> ${order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}</p>
          </div>
          
          <h3>Order Summary:</h3>
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${formattedItems}
              <tr class="total-row">
                <td colspan="3" style="padding: 12px; text-align: right;">Subtotal:</td>
                <td style="padding: 12px; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="padding: 12px; text-align: right;">Shipping:</td>
                <td style="padding: 12px; text-align: right;">${order.totalAmount >= 500 ? 'Free' : '₹50.00'}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3" style="padding: 12px; text-align: right;">Total:</td>
                <td style="padding: 12px; text-align: right;">₹${order.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          
          <div class="shipping-info">
            <h3>Shipping Address:</h3>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.address}<br>
              ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}<br>
              Phone: ${order.shippingAddress.phone}<br>
              Email: ${order.shippingAddress.email}
            </p>
          </div>
          
          <p>We will notify you when your order ships. You can also track your order status in your account.</p>
          
          <center>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/orders/${order._id}" class="button">View Order</a>
          </center>
          
          <p>If you have any questions or need further assistance, please don't hesitate to contact our customer service team at support@sportas.com or call us at +91 98765 43210.</p>
          
          <p>Thank you for choosing SportAs!</p>
          
          <p>Best regards,<br>The SportAs Team</p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} SportAs. All rights reserved.</p>
          <p>123 Athletic Avenue, Sector 18, Gurugram, Haryana 122001, India</p>
        </div>
      </body>
      </html>
    `,
  }
}

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order: Order, userEmail: string) => {
  try {
    const transporter = await createTransporter()
    const emailOptions = createOrderConfirmationEmail(order, userEmail)
    
    const info = await transporter.sendMail(emailOptions)
    
    console.log('Order confirmation email sent successfully')
    // For development using Ethereal, log preview URL
    if (info.messageId && process.env.NODE_ENV === 'development') {
      console.log('Email preview URL: %s', nodemailer.getTestMessageUrl(info))
    }
    
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending order confirmation email:', error)
    return { success: false, error }
  }
}
