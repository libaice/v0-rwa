"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { WalletButton } from "@/components/web3/wallet-button"

const navigation = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Assets", href: "/assets" },
  { name: "Prices", href: "/prices" },
  { name: "Nodes", href: "/nodes" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">RWA Oracle</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname?.startsWith(item.href)
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center space-x-4">
          <WalletButton />
        </div>
      </div>
    </header>
  )
}