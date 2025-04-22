'use client'

import { useSearchParams } from 'next/navigation'
import JobDetailsForm from '../components/JobDetailsForm'

export default function ConfirmDetailsPage() {
  const searchParams = useSearchParams()
  
  // Get booking details from URL parameters
  const serviceType = searchParams.get('serviceType') as 'load' | 'unload' | 'loadAndUnload' | 'fullService'
  const selectedDate = searchParams.get('date') || ''
  const selectedTime = searchParams.get('timePeriod') as 'morning' | 'afternoon' | 'evening'
  const numberOfHelpers = parseInt(searchParams.get('helpers') || '2')
  const companyName = searchParams.get('companyName') || 'Unknown Company'

  if (!serviceType) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <p className="text-red-600">Error: Missing required booking information</p>
      </div>
    )
  }

  return (
    <JobDetailsForm
      serviceType={serviceType}
      selectedDate={selectedDate}
      selectedTime={selectedTime}
      numberOfHelpers={numberOfHelpers}
      companyName={companyName}
    />
  )
}