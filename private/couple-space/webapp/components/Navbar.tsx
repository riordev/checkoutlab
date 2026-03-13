'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Calendar, ListTodo, Home, Sparkles, Gift, ChefHat } from 'lucide-react'
import ThemeSelector from './ThemeSelector'

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/calendar', label: 'Calendar', icon: Calendar },
    { href: '/lists', label: 'Lists', icon: ListTodo },
    { href: '/date-night', label: 'Date Night', icon: Sparkles },
    { href: '/wishlist', label: 'Wishlist', icon: Gift },
    { href: '/recipes', label: 'Recipes', icon: ChefHat },
  ]

  return (
    <nav className="theme-nav sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-rose-600 rounded-full flex items-center justify-center shadow-lg">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-cozy)' }}>
              us
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all ${
                      isActive
                        ? 'font-medium'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: isActive ? 'var(--accent-light)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-primary)'
                    }}
                  >
                    <Icon className="w-4 h-4" />
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
