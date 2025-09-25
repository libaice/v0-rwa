"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Menu, X, ChevronDown, TrendingUp, TrendingDown, Circle, Search, Globe, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Products", href: "/products" },
  { name: "Solutions", href: "/solutions" },
  { name: "Developers", href: "/developers" },
  { name: "About", href: "/about" },
  { name: "Docs", href: "/docs" },
]

// Mock price data - in real app, this would come from an API
const priceData = [
  { symbol: "ETH", price: 2345.67, change: 2.34, trending: "up" },
  { symbol: "BTC", price: 45678.90, change: -1.23, trending: "down" },
  { symbol: "GOLD", price: 1987.65, change: 0.56, trending: "up" },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentPriceIndex, setCurrentPriceIndex] = useState(0)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Add background on scroll
      setIsScrolled(currentScrollY > 20)
      
      // Hide/show header based on scroll direction
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  // Rotate price ticker
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPriceIndex((prev) => (prev + 1) % priceData.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const currentPrice = priceData[currentPriceIndex]

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50" : "bg-transparent",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-20 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              {/* Custom Logo Design */}
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 gradient-primary rounded-xl opacity-80 blur-sm group-hover:opacity-100 transition-opacity"></div>
                <div className="relative w-full h-full gradient-primary rounded-xl flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent group-hover:from-accent-cyan group-hover:to-accent-purple transition-all duration-300">
                RWA Oracle
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-all duration-200 group",
                  pathname?.startsWith(item.href)
                    ? "text-white"
                    : "text-muted-foreground hover:text-white"
                )}
              >
                {item.name}
                {/* Hover effect */}
                <span className={cn(
                  "absolute bottom-0 left-0 w-full h-0.5 gradient-secondary transform origin-left transition-transform duration-300",
                  pathname?.startsWith(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                )} />
              </Link>
            ))}
          </nav>

          {/* Right Side Features */}
          <div className="hidden lg:flex items-center space-x-6">
            {/* Price Ticker */}
            <div className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50">
              <span className="text-xs text-muted-foreground">{currentPrice.symbol}</span>
              <span className="text-sm font-semibold">${currentPrice.price.toLocaleString()}</span>
              <div className={cn(
                "flex items-center text-xs font-medium",
                currentPrice.trending === "up" ? "text-green-500" : "text-red-500"
              )}>
                {currentPrice.trending === "up" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {Math.abs(currentPrice.change)}%
              </div>
            </div>

            {/* Network Status */}
            <div className="flex items-center space-x-2 text-sm">
              <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
              <span className="text-muted-foreground">Mainnet</span>
            </div>

            {/* Launch App Button */}
            <Link href="/dashboard">
              <Button className="gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 group">
                Launch App
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-card/50 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={cn(
        "lg:hidden fixed inset-x-0 top-20 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 transform",
        isMobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}>
        <nav className="p-6 space-y-4">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "block px-4 py-2 text-base font-medium rounded-lg transition-colors",
                pathname?.startsWith(item.href)
                  ? "bg-card text-white"
                  : "text-muted-foreground hover:bg-card/50 hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
          
          {/* Mobile Price Display */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Live Prices</span>
              <div className="flex items-center space-x-1">
                <Circle className="w-2 h-2 fill-green-500 text-green-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Connected</span>
              </div>
            </div>
            
            {priceData.map((price) => (
              <div key={price.symbol} className="flex items-center justify-between py-2">
                <span className="text-sm font-medium">{price.symbol}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm">${price.price.toLocaleString()}</span>
                  <div className={cn(
                    "flex items-center text-xs",
                    price.trending === "up" ? "text-green-500" : "text-red-500"
                  )}>
                    {price.trending === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(price.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA */}
          <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
            <Button className="w-full gradient-primary text-white">
              Launch App
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}