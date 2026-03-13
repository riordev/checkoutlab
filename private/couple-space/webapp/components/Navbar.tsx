'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Calendar, ListTodo, Home, Sparkles, Gift, ChefHat, StickyNote } from 'lucide-react'
import ThemeSelector from './ThemeSelector'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/lists', label: 'Lists', icon: ListTodo },
    { href: '/notes', label: 'Notes', icon: StickyNote },
    { href: '/date-night', label: 'Date Night', icon: Sparkles },
    { href: '/wishlist', label: 'Wishlist', icon: Gift },
    { href: '/recipes', label: 'Recipes', icon: ChefHat },
  ]

  return (
    <nav className="theme-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Chibi Cat SVG */}
            <div className="w-10 h-10 relative">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg group-hover:scale-110 transition-transform">
                {/* Cat body */}
                <ellipse cx="50" cy="65" rx="35" ry="30" fill="#fb7185" />
                {/* Cat head */}
                <circle cx="50" cy="40" r="28" fill="#fb7185" />
                {/* Left ear */}
                <polygon points="25,22 35,40 15,40" fill="#fb7185" />
                <polygon points="28,28 32,38 20,38" fill="#fda4af" />
                {/* Right ear */}
                <polygon points="75,22 65,40 85,40" fill="#fb7185" />
                <polygon points="72,28 68,38 80,38" fill="#fda4af" />
                {/* Eyes */}
                <circle cx="40" cy="38" r="4" fill="#1f2937" />
                <circle cx="60" cy="38" r="4" fill="#1f2937" />
                <circle cx="42" cy="36" r="1.5" fill="white" />
                <circle cx="62" cy="36" r="1.5" fill="white" />
                {/* Nose */}
                <polygon points="50,44 47,48 53,48" fill="#fda4af" />
                {/* Mouth */}
                <path d="M45,52 Q50,55 55,52" stroke="#1f2937" strokeWidth="2" fill="none" strokeLinecap="round" />
                {/* Whiskers */}
                <line x1="25" y1="42" x2="10" y2="40" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" />
                <line x1="25" y1="46" x2="10" y2="48" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" />
                <line x1="75" y1="42" x2="90" y2="40" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" />
                <line x1="75" y1="46" x2="90" y2="48" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" />
                {/* Paws */}
                <ellipse cx="30" cy="85" rx="8" ry="6" fill="#fda4af" />
                <ellipse cx="70" cy="85" rx="8" ry="6" fill="#fda4af" />
              </svg>
            </div>
            <span className="text-xl font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cozy)' }}>
              placeholder
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:scale-105 ${
                      isActive
                        ? 'font-medium'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)'
                    }}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                )
              })}
            </div>
            <div className="ml-2 pl-2 border-l border-[var(--border)]">
              <ThemeSelector />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
