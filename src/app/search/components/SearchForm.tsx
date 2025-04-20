'use client'

import { useState } from 'react'

interface SearchFormProps {
  serviceType: string
}

export default function SearchForm({ serviceType }: SearchFormProps) {
  const [location, setLocation] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle location search
    console.log('Searching in:', location)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          City or Postal Code
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your city or postal code"
            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>
      </div>
    </form>
  )
} 