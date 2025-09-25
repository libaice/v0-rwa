import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, TrendingUp, Zap, ArrowRight, Globe, Activity, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/5 to-background"></div>
        <div className="absolute inset-0 bg-grid-white/5"></div>
        <div className="container relative mx-auto px-4 py-24 lg:py-32">
          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Real World Assets
              <span className="block text-primary mt-2">Oracle Network</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Bridging traditional assets to blockchain with reliable, secure, and 
              transparent price feeds for the next generation of DeFi.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="group">
                  Launch Dashboard 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/prices">
                <Button size="lg" variant="outline">
                  <Activity className="mr-2 h-4 w-4" />
                  Live Price Feeds
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary">$2.5B+</p>
              <p className="text-sm text-muted-foreground mt-2">Total Value Secured</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">150+</p>
              <p className="text-sm text-muted-foreground mt-2">Asset Feeds</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">50ms</p>
              <p className="text-sm text-muted-foreground mt-2">Update Latency</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary">99.9%</p>
              <p className="text-sm text-muted-foreground mt-2">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose RWA Oracle?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for institutional-grade reliability with decentralized security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <CardTitle>Multi-Source Data</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Aggregate price data from multiple trusted sources including 
              exchanges, data providers, and institutional feeds.
            </CardDescription>
          </CardContent>
        </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Byzantine fault-tolerant consensus with reputation-based 
                  validation ensures data integrity and availability.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Price feeds updated in real-time with sub-second latency 
                  for critical DeFi applications and trading strategies.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Cross-Chain</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Deploy on multiple blockchains including Ethereum, Polygon, 
                  BSC, and more for maximum accessibility.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Asset Classes Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Asset Classes</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage across traditional and emerging asset markets
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Real Estate</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Commercial properties, REITs, residential indices, and global real estate markets
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Commodities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Precious metals, energy, agricultural products, and raw materials
                </p>
              </CardContent>
            </Card>
            
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Traditional Finance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Stocks, bonds, forex pairs, ETFs, and global market indices
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to integrate?</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Join the future of decentralized finance with institutional-grade oracle infrastructure
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="group">
                <Users className="mr-2 h-4 w-4" />
                Join Network
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/nodes">
              <Button size="lg" variant="outline">
                Become a Node Operator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}