'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

type TimePeriod = 'morning' | 'afternoon' | 'evening'

interface JobDetailsFormProps {
  serviceType: 'load' | 'unload' | 'loadAndUnload' | 'fullService'
  selectedDate: string
  selectedTime: TimePeriod
  numberOfHelpers?: number
  companyName: string
  initialDetails?: {
    pickupAddress?: {
      street1: string
      street2: string
      city: string
      province: string
      postalCode: string
    }
    deliveryAddress?: {
      street1: string
      street2: string
      city: string
      province: string
      postalCode: string
    }
    singleAddress?: {
      street1: string
      street2: string
      city: string
      province: string
      postalCode: string
    }
  }
}

export default function JobDetailsForm({
  serviceType,
  selectedDate,
  selectedTime,
  numberOfHelpers = 2,
  companyName,
  initialDetails
}: JobDetailsFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    pickupAddress: initialDetails?.pickupAddress || {
      street1: '',
      street2: '',
      city: '',
      province: '',
      postalCode: ''
    },
    deliveryAddress: initialDetails?.deliveryAddress || {
      street1: '',
      street2: '',
      city: '',
      province: '',
      postalCode: ''
    },
    singleAddress: initialDetails?.singleAddress || {
      street1: '',
      street2: '',
      city: '',
      province: '',
      postalCode: ''
    },
    hasDollies: false,
    truckSize: '', // Only for full service
    confirmedHelpers: numberOfHelpers,
    confirmedDate: selectedDate,
    confirmedTime: selectedTime
  })

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

  const needsTwoAddresses = serviceType === 'loadAndUnload' || serviceType === 'fullService'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Submit form data to backend
    console.log('Form submitted:', formData)
    // Navigate to next step (payment or confirmation)
    router.push('/booking/payment')
  }

  const handleAddressChange = (type: 'pickup' | 'delivery' | 'single', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`${type}Address`]: {
        ...prev[`${type}Address`],
        [field]: value
      }
    }))
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Move Details</h1>
      
      {/* Company Information */}
      <div className="bg-blue-50 rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold text-blue-900">Selected Company</h2>
        <p className="text-blue-800 mt-2 text-lg">{companyName}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Address Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Location Details</h2>
            
            {needsTwoAddresses ? (
              <>
                {/* Pickup Address */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Pickup Address</h3>
                  <div>
                    <label htmlFor="pickupStreet1" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="pickupStreet1"
                      value={formData.pickupAddress.street1}
                      onChange={(e) => handleAddressChange('pickup', 'street1', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="pickupStreet2" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address Line 2
                    </label>
                    <input
                      type="text"
                      id="pickupStreet2"
                      value={formData.pickupAddress.street2}
                      onChange={(e) => handleAddressChange('pickup', 'street2', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="pickupCity"
                        value={formData.pickupAddress.city}
                        onChange={(e) => handleAddressChange('pickup', 'city', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="pickupProvince" className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        id="pickupProvince"
                        value={formData.pickupAddress.province}
                        onChange={(e) => handleAddressChange('pickup', 'province', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pickupPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="pickupPostalCode"
                      value={formData.pickupAddress.postalCode}
                      onChange={(e) => handleAddressChange('pickup', 'postalCode', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium">Delivery Address</h3>
                  <div>
                    <label htmlFor="deliveryStreet1" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="deliveryStreet1"
                      value={formData.deliveryAddress.street1}
                      onChange={(e) => handleAddressChange('delivery', 'street1', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                      placeholder="Street address, P.O. box, company name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="deliveryStreet2" className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address Line 2
                    </label>
                    <input
                      type="text"
                      id="deliveryStreet2"
                      value={formData.deliveryAddress.street2}
                      onChange={(e) => handleAddressChange('delivery', 'street2', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        id="deliveryCity"
                        value={formData.deliveryAddress.city}
                        onChange={(e) => handleAddressChange('delivery', 'city', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="deliveryProvince" className="block text-sm font-medium text-gray-700 mb-1">
                        Province
                      </label>
                      <input
                        type="text"
                        id="deliveryProvince"
                        value={formData.deliveryAddress.province}
                        onChange={(e) => handleAddressChange('delivery', 'province', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deliveryPostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      id="deliveryPostalCode"
                      value={formData.deliveryAddress.postalCode}
                      onChange={(e) => handleAddressChange('delivery', 'postalCode', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </>
            ) : (
              // Single Address Form
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">Job Address</h3>
                <div>
                  <label htmlFor="singleStreet1" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    id="singleStreet1"
                    value={formData.singleAddress.street1}
                    onChange={(e) => handleAddressChange('single', 'street1', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Street address, P.O. box, company name"
                  />
                </div>
                
                <div>
                  <label htmlFor="singleStreet2" className="block text-sm font-medium text-gray-700 mb-1">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    id="singleStreet2"
                    value={formData.singleAddress.street2}
                    onChange={(e) => handleAddressChange('single', 'street2', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Apartment, suite, unit, building, floor, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="singleCity" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="singleCity"
                      value={formData.singleAddress.city}
                      onChange={(e) => handleAddressChange('single', 'city', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="singleProvince" className="block text-sm font-medium text-gray-700 mb-1">
                      Province
                    </label>
                    <input
                      type="text"
                      id="singleProvince"
                      value={formData.singleAddress.province}
                      onChange={(e) => handleAddressChange('single', 'province', e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="singlePostalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    id="singlePostalCode"
                    value={formData.singleAddress.postalCode}
                    onChange={(e) => handleAddressChange('single', 'postalCode', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            )}
          </div>

          {/* Move Details Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Move Details</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.confirmedDate}
                  onChange={(e) => setFormData({ ...formData, confirmedDate: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Time Period
                </label>
                <div className="relative">
                  <select
                    value={formData.confirmedTime}
                    onChange={(e) => setFormData({ ...formData, confirmedTime: e.target.value as TimePeriod })}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                    required
                  >
                    <option value="morning">Morning (8 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 8 PM)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  The company will contact you to confirm the exact time within your preferred period.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Helpers
              </label>
              <select
                value={formData.confirmedHelpers}
                onChange={(e) => setFormData({ ...formData, confirmedHelpers: parseInt(e.target.value) })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {[2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num} Helpers</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you have your own dollies?
              </label>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasDollies: true })}
                  className={`px-6 py-2 rounded-lg ${
                    formData.hasDollies
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, hasDollies: false })}
                  className={`px-6 py-2 rounded-lg ${
                    !formData.hasDollies
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {serviceType === 'fullService' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Truck Size
                </label>
                <select
                  value={formData.truckSize}
                  onChange={(e) => setFormData({ ...formData, truckSize: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select truck size</option>
                  <option value="16ft">16ft Box Truck</option>
                  <option value="20ft">20ft Box Truck</option>
                  <option value="26ft">26ft Box Truck</option>
                </select>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Confirm and Continue
          </button>
        </div>
      </form>
    </div>
  )
} 