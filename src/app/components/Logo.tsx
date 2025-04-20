import React from 'react'
import Link from 'next/link'

interface LogoProps {
  color?: 'white' | 'blue'
  size?: 'small' | 'medium' | 'large'
  showSlogan?: boolean
}

export default function Logo({ color = 'blue', size = 'medium', showSlogan = false }: LogoProps) {
  const mainColor = color === 'white' ? 'text-white' : 'text-blue-600'
  const accentColor = color === 'white' ? 'text-blue-200' : 'text-blue-800'
  const sloganColor = color === 'white' ? 'text-blue-100' : 'text-blue-500'
  const textSize = {
    small: 'text-2xl',
    medium: 'text-4xl',
    large: 'text-7xl'
  }[size]

  const sloganSize = {
    small: 'text-[10px] w-32',
    medium: 'text-sm w-52',
    large: 'text-lg w-80'
  }[size]

  return (
    <Link href="/" className="flex flex-col items-center">
      <span className={`font-bold ${textSize} tracking-tight transition-transform hover:scale-105 leading-none mb-2`}>
        <span className={mainColor}>M</span>
        <span className={accentColor}>y</span>
        <span className={mainColor}>Moving</span>
      </span>
      {showSlogan && (
        <span className={`${sloganSize} ${sloganColor} font-medium tracking-wide text-center whitespace-nowrap`}>
          Your moving marketplace
        </span>
      )}
    </Link>
  )
} 