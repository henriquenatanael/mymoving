'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface Property {
  type: 'studio' | 'apartment' | 'house' | 'townhouse' | 'basement'
  bedrooms: number
  hasStairs: boolean
  hasElevator?: boolean
  elevatorReserved?: boolean
  distance?: number
}

interface Company {
  id: string
  name: string
  pricePerHour: number
}

// Temporary mock data - This should come from your API/database
const mockCompany: Company = {
  id: "1",
  name: "Premier Moving Co.",
  pricePerHour: 45
}

export default function BookingPage({ params }: { params: { companyId: string } }) {
  const searchParams = useSearchParams()
  const initialMovers = Number(searchParams.get('movers')) || 2

  const [serviceType, setServiceType] = useState('')
  const [hours, setHours] = useState(2)
  const [showEstimator, setShowEstimator] = useState(false)
  const [numberOfMovers, setNumberOfMovers] = useState(initialMovers)
  const [property, setProperty] = useState<Property>({
    type: 'apartment',
    bedrooms: 1,
    hasStairs: false,
    hasElevator: false,
    elevatorReserved: false,
    distance: 0
  })
  const [estimatedHours, setEstimatedHours] = useState<number | null>(null)

  const calculateEstimatedHours = (property: Property) => {
    let baseHours = 0
    
    // Base time considering property type and bedrooms
    if (property.type === 'studio') {
      baseHours = 1.5 // Base time for studio
    } else {
      baseHours = 2 + (property.bedrooms * 0.5) // 30 min per bedroom
    }

    // Adjust for property type specifics
    switch (property.type) {
      case 'house':
        baseHours += 0.5
        break
      case 'townhouse':
        baseHours += 0.25
        break
    }

    // Elevator and stairs factors
    if (property.type === 'apartment' || property.type === 'studio') {
      if (!property.hasElevator) {
        baseHours += 0.5
      } else if (!property.elevatorReserved) {
        baseHours += 0.25
      }
    }

    // Stairs factor
    if (property.hasStairs) {
      baseHours += 0.5
    }

    // Service type adjustments
    switch (serviceType) {
      case 'loading':
        baseHours *= 1.1
        break
      case 'unloading':
        baseHours *= 0.9
        break
      case 'loading-unloading':
        baseHours *= 2 // Double for both operations
        if (property.distance) {
          // Add travel time based on distance:
          // 0-15km: +0.5 hour
          // 16-30km: +1 hour
          // 31-50km: +1.5 hours
          // 50km+: +2 hours
          if (property.distance <= 15) {
            baseHours += 0.5
          } else if (property.distance <= 30) {
            baseHours += 1
          } else if (property.distance <= 50) {
            baseHours += 1.5
          } else {
            baseHours += 2
          }
        }
        break
    }

    // Adjust for number of movers
    if (numberOfMovers !== 2) {
      const efficiency = {
        3: 0.4,
        4: 0.3,
        5: 0.2
      }
      
      let timeReduction = 0
      for (let i = 3; i <= numberOfMovers; i++) {
        timeReduction += efficiency[i as keyof typeof efficiency]
      }
      
      baseHours = baseHours / (1 + timeReduction)
    }

    return Math.max(2, Math.floor(baseHours))
  }

  // Effect to update hours when any factor changes
  useEffect(() => {
    const estimated = calculateEstimatedHours(property)
    setEstimatedHours(estimated)
    setHours(estimated)
  }, [property, serviceType, numberOfMovers])

  const handlePropertyChange = (updates: Partial<Property>) => {
    setProperty(prev => ({ ...prev, ...updates }))
  }

  const calculateTotalPrice = (hours: number, movers: number) => {
    return hours * movers * mockCompany.pricePerHour
  }

  const handleEstimatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const estimated = calculateEstimatedHours(property)
    setEstimatedHours(estimated)
    setHours(estimated)
  }

  const handleMoversChange = (newMovers: number) => {
    setNumberOfMovers(newMovers)
    if (estimatedHours) {
      const newEstimate = calculateEstimatedHours(property)
      setEstimatedHours(newEstimate)
      setHours(newEstimate)
    }
  }

  const incrementHours = () => {
    setHours(prev => prev + 1)
  }

  const decrementHours = () => {
    setHours(prev => prev > 2 ? prev - 1 : prev)
  }

  const incrementDistance = () => {
    setProperty(prev => ({ ...prev, distance: (prev.distance || 0) + 1 }))
  }

  const decrementDistance = () => {
    setProperty(prev => ({ ...prev, distance: Math.max(1, (prev.distance || 0) - 1) }))
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Book Your Move</h1>

        {/* Service Type Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Service Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setServiceType('loading')}
              className={`p-4 border rounded-lg text-center ${
                serviceType === 'loading'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              Loading Only
            </button>
            <button
              onClick={() => setServiceType('unloading')}
              className={`p-4 border rounded-lg text-center ${
                serviceType === 'unloading'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              Unloading Only
            </button>
            <button
              onClick={() => setServiceType('loading-unloading')}
              className={`p-4 border rounded-lg text-center ${
                serviceType === 'loading-unloading'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-blue-500'
              }`}
            >
              Loading & Unloading
            </button>
          </div>
        </div>

        {/* Hours Selection */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">How many hours do you need?</h2>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={decrementHours}
              className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl"
              disabled={hours <= 2}
            >
              -
            </button>
            <div className="text-3xl font-semibold w-20 text-center">{hours}</div>
            <button
              onClick={incrementHours}
              className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl"
            >
              +
            </button>
          </div>
          <div className="text-center mt-2 text-gray-500">Minimum 2 hours required</div>
        </div>

        {/* Need Help Estimating Hours */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <button
            onClick={() => setShowEstimator(!showEstimator)}
            className="w-full py-3 px-4 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Need help estimating hours? Let us help you calculate
          </button>

          {showEstimator && (
            <div className="mt-6 space-y-6">
              {/* Current Number of Movers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currently selected movers
                    </label>
                    <div className="text-gray-600">
                      {numberOfMovers} movers selected from previous step
                    </div>
                  </div>
                  <button
                    onClick={() => setNumberOfMovers(initialMovers)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                    type="button"
                  >
                    Reset to initial selection
                  </button>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <p className="text-sm text-blue-800">
                    You can adjust the number of movers to see how it affects the estimated time and total cost:
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  {[2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => handleMoversChange(num)}
                      className={`px-4 py-2 rounded-lg ${
                        numberOfMovers === num
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num} Movers
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  More movers can reduce the total time needed, affecting the final cost
                </p>
              </div>

              {/* Property Details Form */}
              <form onSubmit={handleEstimatorSubmit} className="space-y-6">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {['studio', 'apartment', 'house', 'townhouse', 'basement'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => handlePropertyChange({ type: type as Property['type'] })}
                        className={`p-3 border rounded-lg text-center capitalize ${
                          property.type === type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Bedrooms - Only show if not studio */}
                {property.type !== 'studio' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Bedrooms
                    </label>
                    <div className="flex items-center space-x-3">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handlePropertyChange({ bedrooms: num })}
                          className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            property.bedrooms === num
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stairs */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Does the property have stairs?
                  </label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handlePropertyChange({ hasStairs: true })}
                      className={`px-4 py-2 rounded-lg ${
                        property.hasStairs === true
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePropertyChange({ hasStairs: false })}
                      className={`px-4 py-2 rounded-lg ${
                        property.hasStairs === false
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>

                {/* Elevator Questions - Show for both apartment and studio */}
                {(property.type === 'apartment' || property.type === 'studio') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Is there an elevator?
                      </label>
                      <div className="flex space-x-4">
                        <button
                          type="button"
                          onClick={() => handlePropertyChange({ hasElevator: true })}
                          className={`px-4 py-2 rounded-lg ${
                            property.hasElevator === true
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => handlePropertyChange({ hasElevator: false })}
                          className={`px-4 py-2 rounded-lg ${
                            property.hasElevator === false
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {property.hasElevator && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Will the elevator be reserved?
                        </label>
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => handlePropertyChange({ elevatorReserved: true })}
                            className={`px-4 py-2 rounded-lg ${
                              property.elevatorReserved === true
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePropertyChange({ elevatorReserved: false })}
                            className={`px-4 py-2 rounded-lg ${
                              property.elevatorReserved === false
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                            }`}
                          >
                            No
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Distance Input - Show only for loading-unloading */}
                {serviceType === 'loading-unloading' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distance between locations
                    </label>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <button
                          type="button"
                          onClick={() => handlePropertyChange({ 
                            distance: Math.max(1, (property.distance || 0) - 1)
                          })}
                          className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50"
                          disabled={(property.distance || 0) <= 1}
                        >
                          -
                        </button>
                        <div className="text-3xl font-semibold w-20 text-center">
                          {property.distance || 0}
                        </div>
                        <button
                          type="button"
                          onClick={() => handlePropertyChange({ 
                            distance: (property.distance || 0) + 1
                          })}
                          className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-center text-gray-500">kilometers</div>
                      <div className="mt-4 bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
                        <p className="font-medium mb-2">Additional time based on distance:</p>
                        <ul className="space-y-1">
                          <li>• 0-15 km: +30 minutes</li>
                          <li>• 16-30 km: +1 hour</li>
                          <li>• 31-50 km: +1.5 hours</li>
                          <li>• 50+ km: +2 hours</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                >
                  Calculate Estimated Hours
                </button>
              </form>

              {/* Show Estimation Results */}
              {estimatedHours && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Estimated Time: {estimatedHours} hours with {numberOfMovers} movers
                  </h3>
                  <div className="text-sm text-blue-700 space-y-3">
                    <p>
                      This estimate is based on having {numberOfMovers} movers working together. 
                      {numberOfMovers < 5 && ' Adding more movers can help complete the job faster.'}
                    </p>
                    <p>
                      Note: This is just an estimate. Actual time may vary depending on factors such as:
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Distance from truck to property</li>
                      <li>Property access conditions</li>
                      <li>Volume and type of items</li>
                      <li>Packing status of items</li>
                      <li>Weather conditions</li>
                      {property.type === 'apartment' && <li>Elevator availability and restrictions</li>}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hours Selection and Price Calculation */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="space-y-6">
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Number of movers:</span>
                <span className="font-semibold">{numberOfMovers}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Number of hours:</span>
                <span className="font-semibold">{hours}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t">
                <span>Total Price:</span>
                <span>${calculateTotalPrice(hours, numberOfMovers)}</span>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-sm text-yellow-800">
                Note: You can add more hours on the day of the move through your account if needed.
              </p>
            </div>

            {/* Continue Button */}
            <div className="relative">
              <button
                className={`w-full py-4 px-6 rounded-xl transition text-lg font-semibold flex items-center justify-center gap-2 mt-6 ${
                  serviceType 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!serviceType}
                title={!serviceType ? "Please select a service type above to continue" : ""}
              >
                Continue to Schedule Your Move
                <svg 
                  className={`w-5 h-5 ${!serviceType ? 'opacity-50' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {!serviceType && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                  Please select a service type above to continue
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 