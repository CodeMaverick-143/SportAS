import React from "react"
import Image from "next/image"
import { Shield, TrendingUp, Award, Users, Clock, Heart } from "lucide-react"

export const metadata = {
  title: "About Us | SportAs",
  description: "Learn about SportAs - Your premier destination for sports equipment and apparel in India",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">About SportAs</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Your premier destination for high-quality sports equipment, apparel, and nutrition in India.
        </p>
      </div>

      {/* About Us Content */}
      <div className="grid md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Story</h2>
          <p className="text-gray-600 mb-4">
            Founded in 2025, SportAs was born from a passion for sports and a vision to provide athletes of all levels with access to premium sports gear at competitive prices.
          </p>
          <p className="text-gray-600 mb-4">
            What began as a small online store has quickly grown into one of India&apos;s most trusted sports e-commerce platforms, serving thousands of customers across the country.
          </p>
          <p className="text-gray-600">
            Our mission is simple: to help everyone achieve their athletic potential by providing the best products, exceptional customer service, and expert guidance.
          </p>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image 
            src="/placeholder.svg?height=600&width=800" 
            alt="SportAs Team" 
            fill 
            className="object-cover"
          />
        </div>
      </div>

      {/* Values Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Shield className="text-emerald-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Quality Guarantee</h3>
            <p className="text-gray-600">
              We stand behind every product we sell with a 100% quality guarantee.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-blue-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Innovation</h3>
            <p className="text-gray-600">
              We constantly seek out the latest sports technology and innovative products.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center">
            <div className="mx-auto bg-amber-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
              <Award className="text-amber-600 h-7 w-7" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in everything we do, from product selection to customer service.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Why Choose SportAs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Expert Team</h3>
              <p className="text-gray-600">
                Our team consists of sports enthusiasts and professionals who understand your needs.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Authentic Products</h3>
              <p className="text-gray-600">
                We source products directly from manufacturers to ensure authenticity and quality.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Clock className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                We partner with reliable logistics providers to ensure quick delivery across India.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Heart className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-gray-600">
                Our customers' satisfaction is our top priority, with 24/7 support and easy returns.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                From sportswear to equipment and nutrition, we offer everything you need in one place.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-emerald-100 p-3 rounded-full h-12 w-12 flex items-center justify-center flex-shrink-0">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Competitive Pricing</h3>
              <p className="text-gray-600">
                We offer the best products at competitive prices, with regular deals and discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-emerald-700 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Gear Up?</h2>
        <p className="text-xl mb-6 max-w-2xl mx-auto">
          Explore our wide range of sports products and take your athletic performance to the next level.
        </p>
        <a
          href="/products"
          className="inline-block bg-white text-emerald-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Shop Now
        </a>
      </div>
    </div>
  )
}
