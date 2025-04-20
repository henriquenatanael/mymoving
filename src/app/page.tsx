import Link from 'next/link'
import Image from 'next/image'
import Logo from './components/Logo'

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="relative min-h-[400px] flex items-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/moving-bg.jpg"
            alt="Residential moving"
            fill
            className="object-cover brightness-50"
            priority
          />
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center">
              <Logo color="white" size="large" showSlogan />
            </div>
          </div>
        </div>
      </div>

      {/* How it Works Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Select Moving Type</h3>
              <p className="text-gray-600">Full Service - includes truck, movers and equipment.<br />Labor Only - if you have your U-Haul or rental truck.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Compare Companies</h3>
              <p className="text-gray-600">See listed companies in your area, their prices and reviews</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Book</h3>
              <p className="text-gray-600">Schedule your move</p>
            </div>
          </div>
        </div>
      </div>

      {/* Choose Service Section */}
      <div className="bg-gray-50 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-600">Let's get started</h2>
          </div>
          <h2 className="text-3xl font-bold text-center mb-12">Choose your service</h2>
          
          {/* Service Options */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Link 
                href="/search?service=full" 
                className="block group transform transition duration-300 hover:scale-105"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4 group-hover:text-blue-600 transition-colors">Full Service Moving</h3>
                  </div>
                  <p className="text-gray-600">
                    Get a complete moving service with professional movers, trucks, and all the equipment needed for your move.
                  </p>
                </div>
              </Link>

              <Link 
                href="/search?service=labor" 
                className="block group transform transition duration-300 hover:scale-105"
              >
                <div className="bg-white p-8 rounded-2xl shadow-sm group-hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-xl">
                      <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold ml-4 group-hover:text-blue-600 transition-colors">Labor Only</h3>
                  </div>
                  <p className="text-gray-600">
                    Renting a U-Haul or truck? Find skilled movers to help you load and unload your rental truck, saving you time and effort.
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
