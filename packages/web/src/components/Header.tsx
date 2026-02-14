'use client'

import Link from 'next/link'
import { useState } from 'react'

// basePath from next.config.ts
const BASE_PATH = ''

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            <img src={`${BASE_PATH}/logo.svg`} alt="Charge Spec Logo" className="w-7 h-7" />
            <span className="text-base font-semibold text-text-primary">快充查查网</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-[15px] text-text-secondary hover:text-link transition-colors font-medium py-1"
            >
              首页
            </Link>
            <Link
              href="/chargers"
              className="text-[15px] text-text-secondary hover:text-link transition-colors font-medium py-1"
            >
              充电器列表
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 -mr-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-gray-100 transition-colors"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">{isMenuOpen ? '关闭主菜单' : '打开主菜单'}</span>
              <svg
                className="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100" id="mobile-menu">
            <div className="py-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="block px-3 py-2.5 rounded-lg text-[15px] font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
              >
                首页
              </Link>
              <Link
                href="/chargers"
                onClick={closeMenu}
                className="block px-3 py-2.5 rounded-lg text-[15px] font-medium text-text-secondary hover:text-text-primary hover:bg-gray-50 transition-colors"
              >
                充电器列表
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
