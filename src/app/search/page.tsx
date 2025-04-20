'use client'

import { useState } from 'react'
import CompanyList from '@/app/search/components/CompanyList'

export default function SearchPage() {
  const [location, setLocation] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!location.trim()) {
      setFormErrors({ location: true })
      return
    }

    setFormErrors({})
    setShowResults(true)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Find Moving Help in Your Area</h1>
        <p className="text-gray-600 mb-8">
          Connect with professional movers for loading, unloading, or both
        </p>

        {!showResults ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
            <div className="mb-8 text-center bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Let's Find Your Moving Team</h2>
              <p className="text-blue-700">
                See instant prices from available movers in your area. Tell us where you are and we'll show you the best options.
              </p>
            </div>

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                City or Postal Code
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your location"
              />
              {formErrors.location && (
                <p className="mt-1 text-sm text-red-600">Please enter your location</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
            >
              Find Available Companies
            </button>
          </form>
        ) : (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold">Available Companies</h2>
                <p className="text-gray-600">
                  Showing available moving companies in your area
                </p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit Location
              </button>
            </div>
            <CompanyList />
          </div>
        )}
      </div>
    </main>
  )
} 