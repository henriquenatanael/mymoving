'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Company {
  id: number
  name: string
  rating: number
  reviewCount: number
  pricePerHour: number
  coverImage: string
}

// Temporary mock data
const mockCompanies: Company[] = [
  {
    id: 1,
    name: "Premier Moving Co.",
    rating: 4.8,
    reviewCount: 156,
    pricePerHour: 45,
    coverImage: "/images/company1.jpg"
  },
  {
    id: 2,
    name: "Swift Movers",
    rating: 4.2,
    reviewCount: 98,
    pricePerHour: 40,
    coverImage: "/images/company2.jpg"
  }
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-5 h-5 ${
            star <= Math.round(rating)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function CompanyList() {
  const [numberOfMovers, setNumberOfMovers] = useState(2)
  const router = useRouter()

  return (
    <div className="space-y-6">
      {/* Number of Movers Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Movers
        </label>
        <div className="flex items-center space-x-4">
          {[2, 3, 4].map((number) => (
            <button
              key={number}
              onClick={() => setNumberOfMovers(number)}
              className={`px-4 py-2 rounded-lg ${
                numberOfMovers === number
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {number} Movers
            </button>
          ))}
        </div>
      </div>

      {mockCompanies.map(company => {
        const hourlyPrice = company.pricePerHour * numberOfMovers;
        
        return (
          <div key={company.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
            <div className="flex">
              {/* Cover Image */}
              <div className="w-1/3 relative">
                <div className="aspect-w-4 aspect-h-3 bg-gray-200">
                  <div className="w-full h-full bg-gray-200" />
                </div>
              </div>

              {/* Company Info */}
              <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{company.name}</h3>
                    <div className="flex items-center gap-2 mb-1">
                      <StarRating rating={company.rating} />
                      <span className="text-sm text-gray-600">({company.rating})</span>
                    </div>
                    <div className="text-sm text-gray-600">{company.reviewCount} reviews</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">${hourlyPrice}</div>
                    <div className="text-sm text-gray-500">per hour for {numberOfMovers} movers</div>
                    <div className="text-xs text-gray-400">(${company.pricePerHour} per mover per hour)</div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  <Link 
                    href={`/booking/${company.id}?movers=${numberOfMovers}`}
                    className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition text-center"
                  >
                    Select and Continue
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
} 