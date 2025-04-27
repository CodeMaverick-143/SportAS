# SportAs - Sports E-Commerce Platform

![SportAs Logo](public/logo.svg)

## 🚀 Overview

SportAs is a full-stack e-commerce platform specifically designed for sports and fitness products. Built with modern web technologies, it offers a seamless shopping experience with a clean, responsive design and robust backend functionality.

## ✨ Features

### 🔐 Authentication System
- **JWT-based Authentication**: Secure token-based authentication system
- **Password Encryption**: bcrypt-based password hashing for user security
- **Google Login Integration**: Quick and easy sign-in with Google accounts
- **User Profiles**: Personalized user profiles with order history

### 🛍️ Shop System
- **Category Organization**: Products organized in 5 main categories:
  - Sportswear
  - Footwear
  - Equipment
  - Gym
  - Nutrition
- **Product Management**: Comprehensive product details including images, descriptions, pricing, and inventory status
- **Search & Filter**: Advanced search functionality with category and price filtering
- **Product Reviews**: User review and rating system

### 🛒 Cart & Checkout
- **Shopping Cart**: Add, update, and remove products from your cart
- **Indian Address Format**: Specialized address form for Indian addresses
- **Indian Currency**: Prices displayed in ₹ (INR)
- **Order Summary**: Detailed order summary before checkout
- **Multiple Payment Options**: Various payment method integrations

### 📧 Email System
- **Order Confirmations**: Automated emails for order confirmations
- **Contact Form**: Working contact form that sends inquiries to administrators
- **Nodemailer Integration**: Reliable email delivery service

### 👨‍💼 Admin Dashboard
- **Product Management**: Add, edit, or remove products from inventory
- **Order Processing**: View and update order statuses
- **User Management**: Manage user accounts and permissions
- **Analytics**: View sales and visitor statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Fully responsive design works on desktop, tablet, and mobile
- **Tailwind CSS**: Modern styling with Tailwind CSS framework
- **Interactive Elements**: Smooth animations and transitions for better user experience
- **Accessibility**: WCAG-compliant design elements

## 🔧 Technology Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Next.js API routes, Node.js
- **Database**: MongoDB
- **Authentication**: NextAuth.js, JWT
- **Email**: Nodemailer
- **State Management**: React Context API
- **Image Optimization**: Next.js Image component with Unsplash integration
- **Deployment**: Vercel/Netlify compatible

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or later)
- npm or yarn
- MongoDB account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sportas.git
   cd sportas
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   JWT_SECRET=your_jwt_secret
   NEXTAUTH_URL=http://localhost:3000
   MONGO_URI=your_mongodb_connection_string
   EMAIL_HOST=your_smtp_host
   EMAIL_PORT=your_smtp_port
   EMAIL_SECURE=true_or_false
   EMAIL_USER=your_email_username
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=your_sender_email
   ```

4. Run development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
sportas/
├── app/                # Next.js app directory (App Router)
│   ├── api/            # API routes
│   ├── product/        # Product pages
│   ├── cart/           # Cart pages
│   ├── checkout/       # Checkout pages
│   ├── account/        # User account pages
│   └── admin/          # Admin dashboard
├── components/         # Reusable UI components
├── data/               # Data files and models
├── lib/                # Utility functions
├── models/             # MongoDB schemas
├── public/             # Static assets
│   └── data/           # JSON data files
└── styles/             # Global styles
```

## 📝 Product Data Management

SportAs offers flexible product data management:

- **Simplified Products**: A reduced set of products for development/testing
- **All Products**: Complete product catalog
- **Image Integration**: Easy integration with Unsplash for product images
- **Data Structure**: Consistent product data schema across the application

## 🔒 Security Features

- **JWT Token Authentication**: Secure user sessions
- **CSRF Protection**: Cross-site request forgery protection
- **Input Validation**: Comprehensive form validation
- **Secure Cookies**: HttpOnly cookies for authentication
- **Rate Limiting**: API rate limiting to prevent abuse

## 🌐 Deployment

SportAs is designed to be easily deployed to platforms like Vercel or Netlify with minimal configuration.

## 📱 Responsive Design

The application is fully responsive and provides an optimal experience across:
- Desktop computers
- Tablets
- Mobile phones

## 📞 Contact & Support

For questions, issues, or feature requests, please use the contact form on the website or create a GitHub issue.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

© 2025 SportAs. All Rights Reserved.
