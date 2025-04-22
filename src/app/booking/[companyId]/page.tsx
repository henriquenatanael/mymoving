'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

interface Property {
  type: 'studio' | 'apartment' | 'house' | 'townhouse' | 'basement'
  bedrooms: number
  hasStairs: boolean
  numberOfFlights?: number
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
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMovers = Number(searchParams.get('movers')) || 2
  const selectedTimePeriod = searchParams.get('timePeriod') as 'morning' | 'afternoon' | 'evening'

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
  const [estimationBreakdown, setEstimationBreakdown] = useState<string[]>([])

  const calculateEstimatedHours = (property: Property) => {
    let baseHours = 0;
    let breakdown: string[] = [];

    // Base hours based on number of bedrooms (converted to sq ft)
    const sqFtRanges = {
      1: { min: 0, max: 800 },      // 1 bedroom
      2: { min: 800, max: 1000 },   // 2 bedrooms
      3: { min: 1000, max: 1500 },  // 3 bedrooms
      4: { min: 1500, max: 2000 },  // 4 bedrooms
      5: { min: 2001, max: 3000 },  // 5 bedrooms
      6: { min: 3000, max: 4000 },  // 6 bedrooms
      7: { min: 4000, max: Infinity } // 7+ bedrooms
    };

    const timeEstimates = {
      'under800': { 2: 2, 3: 2, 4: null },
      '800-1000': { 2: 2, 3: 2, 4: null },
      '1000-1500': { 2: 3, 3: 2.5, 4: 2 },
      '1500-2000': { 2: 4, 3: 3.5, 4: 2.5 },
      '2001-3000': { 2: 6, 3: 4.5, 4: 3.5 },
      '3000-4000': { 2: 7, 3: 5.5, 4: 4.5 },
      '4000+': { 2: 10, 3: 9, 4: 7 }
    };

    // Get square footage range based on number of bedrooms
    const bedrooms = property.type === 'studio' ? 1 : property.bedrooms;
    const sqFtRange = sqFtRanges[bedrooms as keyof typeof sqFtRanges];
    
    // Determine which time estimate to use
    let timeRange = 'under800';
    if (sqFtRange.max > 4000) timeRange = '4000+';
    else if (sqFtRange.max > 3000) timeRange = '3000-4000';
    else if (sqFtRange.max > 2000) timeRange = '2001-3000';
    else if (sqFtRange.max > 1500) timeRange = '1500-2000';
    else if (sqFtRange.max > 1000) timeRange = '1000-1500';
    else if (sqFtRange.max > 800) timeRange = '800-1000';

    // Get base hours from the time estimates table
    const estimates = timeEstimates[timeRange as keyof typeof timeEstimates];
    baseHours = estimates[numberOfMovers as keyof typeof estimates] || 2;
    breakdown.push(`Base estimate for ${bedrooms} bedroom(s): ${baseHours} hours`);

    // Adjust time based on service type
    if (serviceType === 'loading') {
      // Loading takes 20% more time due to truck packing
      const additionalTime = baseHours * 0.2;
      baseHours += additionalTime;
      breakdown.push(`Additional time for loading/packing truck: +${additionalTime.toFixed(1)} hours`);
    } else if (serviceType === 'unloading') {
      // Unloading is 10% faster as items are already packed
      const reduction = baseHours * 0.1;
      baseHours -= reduction;
      breakdown.push(`Time reduction for unloading only: -${reduction.toFixed(1)} hours`);
    } else if (serviceType === 'loading-unloading') {
      // Double the base time for both operations plus 20% for loading
      const loadingTime = baseHours * 1.2; // Base + 20% for loading
      const unloadingTime = baseHours; // Base time for unloading
      baseHours = loadingTime + unloadingTime;
      breakdown.push(`Loading time (including packing): ${loadingTime.toFixed(1)} hours`);
      breakdown.push(`Unloading time: ${unloadingTime.toFixed(1)} hours`);
    }

    // Add time for carry distance
    if (property.distance) {
      if (property.distance >= 50) {
        baseHours += 1.5; // 1-2 hours for 50+ ft
        breakdown.push('Long carry distance (50+ ft): +1.5 hours');
      } else if (property.distance >= 20) {
        baseHours += 0.75; // 0.5-1 hour for 20-50 ft
        breakdown.push('Medium carry distance (20-50 ft): +0.75 hours');
      }
    }

    // Add time for stairs/elevator
    if (property.hasStairs && property.numberOfFlights) {
      const stairsTime = property.numberOfFlights * 0.5; // 0.5 hour per flight
      baseHours += stairsTime;
      breakdown.push(`Stairs (${property.numberOfFlights} flights): +${stairsTime} hours`);
    } else if (property.hasElevator && !property.elevatorReserved) {
      baseHours += 0.5; // 0.5 hour for unreserved elevator
      breakdown.push('Unreserved elevator: +0.5 hours');
    }

    // For loading & unloading, add drive time
    if (serviceType === 'loading-unloading' && property.distance) {
      if (property.distance <= 40) {
        baseHours += 0.5;
        breakdown.push('Drive time (10-40 miles): +0.5 hours');
      } else if (property.distance <= 75) {
        baseHours += 1.5;
        breakdown.push('Drive time (40-75 miles): +1.5 hours');
      } else if (property.distance <= 100) {
        baseHours += 2.5;
        breakdown.push('Drive time (75-100 miles): +2.5 hours');
      }
    }

    // Ensure minimum of 2 hours
    const finalHours = Math.max(2, Math.ceil(baseHours));
    
    return {
      hours: finalHours,
      breakdown
    };
  }

  // Effect to update hours when any factor changes
  useEffect(() => {
    const estimate = calculateEstimatedHours(property);
    setEstimatedHours(estimate.hours);
    setHours(estimate.hours);
    setEstimationBreakdown(estimate.breakdown);
  }, [property, serviceType, numberOfMovers]);

  const handlePropertyChange = (updates: Partial<Property>) => {
    setProperty(prev => ({ ...prev, ...updates }))
  }

  const calculateTotalPrice = (hours: number, movers: number) => {
    return hours * movers * mockCompany.pricePerHour
  }

  const handleEstimatorSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const estimate = calculateEstimatedHours(property)
    setEstimatedHours(estimate.hours)
    setHours(estimate.hours)
    setEstimationBreakdown(estimate.breakdown)
  }

  const handleMoversChange = (newMovers: number) => {
    setNumberOfMovers(newMovers)
    if (estimatedHours) {
      const newEstimate = calculateEstimatedHours(property)
      setEstimatedHours(newEstimate.hours)
      setHours(newEstimate.hours)
      setEstimationBreakdown(newEstimate.breakdown)
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

  const handleBookingConfirm = () => {
    if (!serviceType) {
      alert('Please select a service type')
      return
    }

    // Get the date and time period from search params
    const params = new URLSearchParams({
      serviceType,
      date: searchParams.get('date') || '',
      timePeriod: selectedTimePeriod || 'morning',
      helpers: numberOfMovers.toString(),
      companyName: mockCompany.name
    })

    router.push(`/booking/confirm-details?${params.toString()}`)
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

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
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Movers
                  </label>
                </div>
                
                <div className="flex items-center justify-center gap-4 mb-2">
                  <button
                    type="button"
                    onClick={() => handleMoversChange(Math.max(2, numberOfMovers - 1))}
                    className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={numberOfMovers <= 2}
                  >
                    -
                  </button>
                  <div className="text-3xl font-semibold w-20 text-center">
                    {numberOfMovers}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleMoversChange(Math.min(5, numberOfMovers + 1))}
                    className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={numberOfMovers >= 5}
                  >
                    +
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  Minimum 2, maximum 5 movers
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
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => handlePropertyChange({ bedrooms: Math.max(1, property.bedrooms - 1) })}
                        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={property.bedrooms <= 1}
                      >
                        -
                      </button>
                      <div className="text-3xl font-semibold w-20 text-center">
                        {property.bedrooms}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePropertyChange({ bedrooms: Math.min(7, property.bedrooms + 1) })}
                        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={property.bedrooms >= 7}
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Maximum 7 bedrooms
                    </p>
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
                      onClick={() => handlePropertyChange({ hasStairs: false, numberOfFlights: undefined })}
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

                {/* Number of Flights */}
                {property.hasStairs && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number of Flights of Stairs
                    </label>
                    <div className="flex items-center justify-center gap-4 mb-2">
                      <button
                        type="button"
                        onClick={() => handlePropertyChange({ numberOfFlights: Math.max(1, (property.numberOfFlights || 1) - 1) })}
                        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(property.numberOfFlights || 1) <= 1}
                      >
                        -
                      </button>
                      <div className="text-3xl font-semibold w-20 text-center">
                        {property.numberOfFlights || 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePropertyChange({ numberOfFlights: Math.min(5, (property.numberOfFlights || 1) + 1) })}
                        className="w-12 h-12 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 flex items-center justify-center text-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={(property.numberOfFlights || 1) >= 5}
                      >
                        +
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Each flight of stairs adds 30 minutes to the total time
                    </p>
                  </div>
                )}

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
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Estimated Time Breakdown
                  </h3>
                  <div className="space-y-2">
                    {estimationBreakdown.map((detail, index) => (
                      <p key={index} className="text-blue-800">
                        {detail}
                      </p>
                    ))}
                    <p className="text-lg font-semibold text-blue-900 mt-4">
                      Total estimated time: {estimatedHours} hours
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setHours(estimatedHours);
                      setShowEstimator(false);
                    }}
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                  >
                    Use this estimate
                  </button>
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
                onClick={handleBookingConfirm}
                className={`w-full py-4 px-6 rounded-xl transition text-lg font-semibold flex items-center justify-center gap-2 mt-6 ${
                  serviceType 
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!serviceType}
                title={!serviceType ? "Please select a service type above to continue" : ""}
              >
                Continue to Details
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