import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Logo from './components/Logo';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MyMoving - Your Moving Services Marketplace in Canada",
  description: "Find the perfect moving company in Canada. Full service or labor only - we've got you covered.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <nav className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              <Logo size="small" showSlogan />
              <div className="flex gap-6 items-center">
                <Link href="/search" className="text-gray-600 hover:text-blue-600">
                  Search
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-blue-600">
                  How It Works
                </Link>
                <Link href="/companies/register" className="text-gray-600 hover:text-blue-600">
                  For Companies
                </Link>
                <div className="flex items-center gap-3 ml-2">
                  <Link href="/login" className="text-gray-600 hover:text-blue-600">
                    Login
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link 
                    href="/signup" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-gray-50 border-t">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <Logo size="small" />
                <p className="text-sm text-gray-600 mt-4">
                  Connecting you to the best moving companies in Canada.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Customers</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/search" className="text-sm text-gray-600 hover:text-blue-600">
                      Find Companies
                    </Link>
                  </li>
                  <li>
                    <Link href="/how-it-works" className="text-sm text-gray-600 hover:text-blue-600">
                      How It Works
                    </Link>
                  </li>
                  <li>
                    <Link href="/reviews" className="text-sm text-gray-600 hover:text-blue-600">
                      Reviews
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">For Companies</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/companies/register" className="text-sm text-gray-600 hover:text-blue-600">
                      Register Your Company
                    </Link>
                  </li>
                  <li>
                    <Link href="/companies/how-it-works" className="text-sm text-gray-600 hover:text-blue-600">
                      How It Works
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li>
                    <Link href="/contact" className="text-sm text-gray-600 hover:text-blue-600">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/support" className="text-sm text-gray-600 hover:text-blue-600">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-600">
              © {new Date().getFullYear()} MyMoving. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
