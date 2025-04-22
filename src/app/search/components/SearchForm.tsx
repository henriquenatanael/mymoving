'use client'

import { useState } from 'react'
import { calculateMoveEstimate } from '@/app/utils/estimateCalculator'

interface SearchFormProps {
  serviceType: string
}

type TimePeriod = 'morning' | 'afternoon' | 'evening'

export default function SearchForm({ serviceType }: SearchFormProps) {
  const [location, setLocation] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('morning')
  const [numberOfRooms, setNumberOfRooms] = useState(1)
  const [floor, setFloor] = useState(1)
  const [hasElevator, setHasElevator] = useState(false)
  const [isElevatorReserved, setIsElevatorReserved] = useState(false)
  const [carryDistance, setCarryDistance] = useState<'under20' | '20-50' | '50plus'>('under20')
  const [driveDistance, setDriveDistance] = useState<'10-40' | '40-75' | '75-100' | undefined>(undefined)

  // Calculate minimum date (today) and maximum date (6 months from now)
  const today = new Date()
  const minDate = today.toISOString().split('T')[0]
  const maxDate = new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Handle location search with time period
    console.log('Searching in:', { location, selectedDate, timePeriod })
  }

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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Postal Code Input */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Postal Code
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter your postal code"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        {/* Date Selection */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            When do you need help?
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            min={minDate}
            max={maxDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            required
          />
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
                className={`p-4 border rounded-lg text-center ${
                  timePeriod === period
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-500'
                }`}
              >
                <div className="font-medium capitalize">{period}</div>
                <div className="text-sm text-gray-500">{getTimePeriodLabel(period)}</div>
              </button>
            ))}
          </div>
          <p className="mt-2 text-sm text-gray-600">
            The company will contact you to confirm the exact time within your preferred period.
          </p>
        </div>

        {/* Number of Rooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Bedrooms
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5, 6, '7+'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setNumberOfRooms(typeof num === 'string' ? 7 : num)}
                className={`px-4 py-2 rounded-lg ${
                  (num === '7+' && numberOfRooms === 7) || num === numberOfRooms
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Floor Number */}
        <div>
          <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
            Floor Number
          </label>
          <input
            type="number"
            id="floor"
            min="1"
            value={floor}
            onChange={(e) => setFloor(parseInt(e.target.value))}
            className="w-full px-4 py-2 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Elevator Options */}
        {floor > 1 && (
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="hasElevator"
                checked={hasElevator}
                onChange={(e) => setHasElevator(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="hasElevator" className="ml-2 text-sm text-gray-700">
                Building has elevator
              </label>
            </div>
            
            {hasElevator && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isElevatorReserved"
                  checked={isElevatorReserved}
                  onChange={(e) => setIsElevatorReserved(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isElevatorReserved" className="ml-2 text-sm text-gray-700">
                  Elevator is reserved for moving
                </label>
              </div>
            )}
          </div>
        )}

        {/* Carry Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Distance to Truck
          </label>
          <div className="flex gap-2">
            {[
              { value: 'under20', label: 'Under 20ft' },
              { value: '20-50', label: '20-50ft' },
              { value: '50plus', label: '50+ ft' }
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setCarryDistance(option.value as any)}
                className={`px-4 py-2 rounded-lg ${
                  carryDistance === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drive Distance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Drive Distance (if multiple locations)
          </label>
          <div className="flex gap-2">
            {[
              { value: undefined, label: 'None' },
              { value: '10-40', label: '10-40 miles' },
              { value: '40-75', label: '40-75 miles' },
              { value: '75-100', label: '75-100 miles' }
            ].map((option) => (
              <button
                key={option.label}
                type="button"
                onClick={() => setDriveDistance(option.value as any)}
                className={`px-4 py-2 rounded-lg ${
                  driveDistance === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Find Available Companies
        </button>
      </div>
    </form>
  )
} 