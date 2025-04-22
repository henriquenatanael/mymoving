'use client'

import { useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import CompanyList from '@/app/search/components/CompanyList'

type TimePeriod = 'morning' | 'afternoon' | 'evening'

export default function SearchPage() {
  const [location, setLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [timePeriod, setTimePeriod] = useState<TimePeriod | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [formErrors, setFormErrors] = useState<{ [key: string]: boolean }>({})
  const [calendarOpen, setCalendarOpen] = useState(false)

  // Calculate minimum date (today) and maximum date (6 months from now)
  const today = new Date()
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 'morning':
        return '8:00 AM - 12:00 PM'
      case 'afternoon':
        return '12:00 PM - 4:00 PM'
      case 'evening':
        return '4:00 PM - 8:00 PM'
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { [key: string]: boolean } = {}
    
    if (!location.trim()) {
      errors.location = true
    }
    if (!selectedDate) {
      errors.date = true
    }
    if (!timePeriod) {
      errors.timePeriod = true
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    setShowResults(true)
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.history.back()}
            className="mr-4 text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold">Find Moving Help in Your Area</h1>
        </div>
        <p className="text-gray-600 mb-8">
          Connect with professional movers for loading, unloading, or both
        </p>

        {!showResults ? (
          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-sm p-6">
            <div className="mb-8 text-center bg-blue-50 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">Let's Find Your Moving Team</h2>
              <p className="text-blue-700">
                Enter your details to see instant prices from available movers in your area
              </p>
            </div>

            {/* Location Input */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  formErrors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your postal code"
              />
              {formErrors.location && (
                <p className="mt-1 text-sm text-red-600">Please enter your postal code</p>
              )}
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                When do you need help?
              </label>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  minDate={today}
                  maxDate={maxDate}
                  inline
                  monthsShown={2}
                  calendarClassName="!flex !gap-8 !w-full"
                  dayClassName={date => 
                    date.toDateString() === (selectedDate?.toDateString() || '') 
                      ? "!bg-blue-600 !text-white hover:!bg-blue-700"
                      : "hover:!bg-gray-100"
                  }
                  fixedHeight
                />
              </div>
              {formErrors.date && (
                <p className="mt-1 text-sm text-red-600">Please select a date</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                You can schedule up to 6 months in advance
              </p>
            </div>

            {/* Time Period Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Time Period
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['morning', 'afternoon', 'evening'] as TimePeriod[]).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => setTimePeriod(period)}
                    className={`p-4 border rounded-lg text-center transition-colors ${
                      timePeriod === period
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : formErrors.timePeriod
                        ? 'border-red-200 hover:border-red-300'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-medium capitalize">{period}</div>
                    <div className="text-sm text-gray-500">{getTimePeriodLabel(period)}</div>
                  </button>
                ))}
              </div>
              {formErrors.timePeriod && (
                <p className="mt-2 text-sm text-red-600">Please select a time period</p>
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
                  Showing companies available on {formatDate(selectedDate)} ({timePeriod}) in your area
                </p>
              </div>
              <button
                onClick={() => setShowResults(false)}
                className="text-blue-600 hover:text-blue-700"
              >
                Edit Search
              </button>
            </div>
            <CompanyList />
          </div>
        )}
      </div>
    </main>
  )
} 