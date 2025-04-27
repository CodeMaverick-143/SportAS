import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import FeaturedProducts from "@/components/featured-products"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative rounded-xl overflow-hidden mb-12">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 h-[500px] flex items-center">
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-2xl text-white">
              <h1 className="text-5xl font-bold mb-4">Gear Up for Greatness</h1>
              <p className="text-xl mb-8">
                Premium sports equipment, apparel, and nutrition for athletes of all levels
              </p>
              <div className="flex gap-4">
                <Button asChild size="lg" className="bg-white text-emerald-800 hover:bg-gray-100">
                  <Link href="/products">Shop Now</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 hidden lg:block">
            <Image
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438"
              alt="Sports Equipment"
              width={600}
              height={500}
              className="object-cover h-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Visual Navigation - Image Links */}
      <section className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: "Sportswear",
              image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a",
              href: "/products?category=Sportswear"
            },
            {
              name: "Footwear",
              image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",
              href: "/products?category=Footwear"
            },
            {
              name: "Equipment",
              image: "https://images.unsplash.com/photo-1578762560042-46ad127c95ea",
              href: "/products?category=Equipment"
            },
            {
              name: "Nutrition",
              image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2",
              href: "/products?category=Nutrition"
            }
          ].map((item) => (
            <Link 
              key={item.name} 
              href={item.href}
              className="group relative overflow-hidden rounded-lg h-40 transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover brightness-75 group-hover:brightness-90 transition-all"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/80 px-4 py-2 rounded-full flex items-center gap-1 font-semibold text-emerald-800 group-hover:bg-white transition-colors">
                  {item.name} <ChevronRight className="h-4 w-4 opacity-70" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>



      {/* Featured Products */}
      <section className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link href="/products" className="text-emerald-600 hover:text-emerald-700 flex items-center">
            View all products <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <FeaturedProducts />
      </section>

      {/* Testimonials */}
      <section className="mb-16 bg-gray-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              id: 1,
              name: "Roni Maity",
              role: "Fitness Trainer",
              text: "The quality of SportAs equipment is exceptional for my training sessions. The adjustable dumbbells are space-saving and versatile - a perfect addition to my home gym setup!"
            },
            {
              id: 2,
              name: "Kanishk Ranjan",
              role: "Marathon Runner",
              text: "I bought my running shoes from SportAs and couldn't be happier. The delivery was incredibly fast, and the customer service team helped me find the perfect fit for my running style."
            },
            {
              id: 3,
              name: "Vinayak Mohakud",
              role: "Gym Enthusiast",
              text: "SportAs has become my go-to for all fitness nutrition. Their protein supplements have noticeably improved my recovery time after intense workouts. Highly recommended!"
            }
          ].map((testimonial) => (
            <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-4">
                <h4 className="font-semibold text-emerald-800 text-lg">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
              <p className="text-gray-700 italic">
                "{testimonial.text}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Collection Banners with Image Links */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-6">
          <Link 
            href="/products?category=Gym"
            className="relative overflow-hidden rounded-lg group h-64"
          >
            <Image
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f"
              alt="Home Gym Equipment"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <h3 className="text-white text-2xl font-bold mb-2">Home Gym Essentials</h3>
              <p className="text-white/90 mb-4">Everything you need for your perfect home setup</p>
              <span className="text-white font-medium inline-flex items-center">
                Shop Collection <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </Link>

          <Link 
            href="/products?discount=true"
            className="relative overflow-hidden rounded-lg group h-64"
          >
            <Image
              src="https://images.unsplash.com/photo-1556817411-31ae72fa3ea0"
              alt="Sale Items"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold inline-block mb-2 w-fit">SALE</div>
              <h3 className="text-white text-2xl font-bold mb-2">Seasonal Discounts</h3>
              <p className="text-white/90 mb-4">Up to 20% off on selected items</p>
              <span className="text-white font-medium inline-flex items-center">
                Shop Sale <ChevronRight className="ml-1 h-4 w-4" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-emerald-700 text-white rounded-xl p-8 mb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Newsletter</h2>
          <p className="mb-6">Get the latest updates on new products, special offers, and fitness tips.</p>
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="px-4 py-2 rounded-md flex-1 text-gray-900"
            />
            <Button className="bg-white text-emerald-700 hover:bg-gray-100">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}
