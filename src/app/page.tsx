"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Shield, Zap, ArrowRight, Activity, Users, Layers, Lock, BarChart3, Building, Coins } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
    }> = [];
    
    const particleCount = 80;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    
    function animate() {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 51, 234, ${particle.opacity})`;
        ctx.fill();
        
        // Draw connections
        particles.slice(i + 1).forEach(particle2 => {
          const dx = particle.x - particle2.x;
          const dy = particle.y - particle2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle2.x, particle2.y);
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.1 * (1 - distance / 100)})`;
            ctx.stroke();
          }
        });
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
    
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted]);

  const stats = [
    { value: 2.5, suffix: "B+", prefix: "$", label: "Total Value Secured" },
    { value: 150, suffix: "+", label: "Asset Feeds" },
    { value: 50, suffix: "ms", label: "Update Latency" },
    { value: 99.9, suffix: "%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section with Animated Background */}
      <section className="relative min-h-[90vh] flex items-center justify-center">
        {/* Animated gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent-purple/10 to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--accent-purple)/0.3),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,hsl(var(--accent-cyan)/0.2),transparent_50%)]"></div>
          
          {/* Animated grid */}
          {mounted && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"></div>
          )}
        </div>

        {/* Particle Canvas */}
        {mounted && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            style={{ pointerEvents: 'none' }}
          />
        )}
        
        {/* Floating orbs animation */}
        {mounted && (
          <>
            <div className="absolute top-1/4 left-1/4 w-72 h-72 gradient-secondary rounded-full filter blur-[128px] opacity-30 animate-float"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 gradient-primary rounded-full filter blur-[128px] opacity-30 animate-float animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 gradient-primary rounded-full filter blur-[100px] opacity-20 animate-pulse-slow"></div>
          </>
        )}

        <div className="container relative mx-auto px-6 lg:px-8 py-24 lg:py-32 z-10">
          <div className="text-center space-y-8 max-w-5xl mx-auto">
            <div className={cn("opacity-0", mounted && "animate-fade-in-up")}>
              <div className="inline-flex items-center gap-2 glass glass-hover rounded-full px-4 py-2 mb-8 transition-all duration-300">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-accent-cyan">Live on Mainnet</span>
              </div>
            </div>
            
            <h1 className={cn("text-6xl md:text-8xl font-bold tracking-tight opacity-0", mounted && "animate-fade-in-up animation-delay-200")}>
              <span className="gradient-text animate-gradient text-transparent">
                Real World Assets
              </span>
              <span className="block text-white mt-2">Oracle Network</span>
            </h1>
            
            <p className={cn("text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed opacity-0", mounted && "animate-fade-in-up animation-delay-400")}>
              Bridging traditional assets to blockchain with reliable, secure, and 
              transparent price feeds for the next generation of DeFi.
            </p>
            
            <div className={cn("flex flex-col sm:flex-row gap-4 justify-center pt-8 opacity-0", mounted && "animate-fade-in-up animation-delay-600")}>
              <Link href="/dashboard">
                <Button size="lg" className="group gradient-primary hover:shadow-lg hover:shadow-primary/25 text-white border-0 px-8 py-6 text-lg transition-all duration-300 relative overflow-hidden shimmer">
                  Launch Dashboard 
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/prices">
                <Button size="lg" variant="outline" className="glass glass-hover border-border hover:border-accent-cyan px-8 py-6 text-lg transition-all duration-300">
                  <Activity className="mr-2 h-5 w-5" />
                  Live Price Feeds
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-60">
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
            <div className="w-1 h-3 bg-border rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Stats Section with Counter Animation */}
      <section className="py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className={cn("text-center opacity-0", mounted && "animate-fade-in-up")} style={{ animationDelay: `${800 + index * 100}ms` }}>
                <div className="relative group transform-3d">
                  <div className="absolute inset-0 gradient-primary rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity blur-xl"></div>
                  <div className="relative glass hover:border-accent-purple rounded-2xl p-8 transition-all duration-300 hover-tilt hover:shadow-lg hover:shadow-accent-purple/20">
                    <p className="text-5xl font-bold gradient-text animate-gradient">
                      {stat.prefix}{stat.value}{stat.suffix}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text animate-gradient">
                Why Choose RWA Oracle?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for institutional-grade reliability with decentralized security
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Database,
                title: "Multi-Source Data",
                description: "Aggregate price data from multiple trusted sources including exchanges, data providers, and institutional feeds.",
                color: "from-accent-cyan to-blue-500"
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Byzantine fault-tolerant consensus with reputation-based validation ensures data integrity and availability.",
                color: "from-accent-purple to-pink-500"
              },
              {
                icon: Zap,
                title: "Real-Time Updates",
                description: "Price feeds updated in real-time with sub-second latency for critical DeFi applications and trading strategies.",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Layers,
                title: "Cross-Chain",
                description: "Deploy on multiple blockchains including Ethereum, Polygon, BSC, and more for maximum accessibility.",
                color: "from-green-500 to-teal-500"
              }
            ].map((feature, index) => (
              <div key={index} className={cn("opacity-0", mounted && "animate-fade-in-up")} style={{ animationDelay: `${1200 + index * 100}ms` }}>
                <Card className="glass hover:border-accent-cyan transition-all duration-300 hover:-translate-y-2 group h-full transform-3d hover-tilt">
                  <CardHeader>
                    <div className={`w-14 h-14 bg-gradient-to-r ${feature.color} p-[1px] rounded-xl mb-4 group-hover:shadow-lg group-hover:shadow-accent-cyan/20 transition-all duration-300`}>
                      <div className="w-full h-full bg-background rounded-xl flex items-center justify-center group-hover:bg-card transition-colors">
                        <feature.icon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Asset Classes Section with Visual Cards */}
      <section className="py-16 lg:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent-purple/5 to-transparent"></div>
        <div className="container mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="gradient-text animate-gradient">
                Supported Asset Classes
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive coverage across traditional and emerging asset markets
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Building,
                title: "Real Estate",
                description: "Commercial properties, REITs, residential indices, and global real estate markets",
                stats: "500+ Properties",
                gradient: "from-primary to-accent-purple"
              },
              {
                icon: Coins,
                title: "Commodities",
                description: "Precious metals, energy, agricultural products, and raw materials",
                stats: "50+ Commodities",
                gradient: "from-accent-purple to-accent-cyan"
              },
              {
                icon: BarChart3,
                title: "Traditional Finance",
                description: "Stocks, bonds, forex pairs, ETFs, and global market indices",
                stats: "1000+ Assets",
                gradient: "from-accent-cyan to-primary"
              }
            ].map((asset, index) => (
              <div key={index} className={cn("opacity-0", mounted && "animate-fade-in-up")} style={{ animationDelay: `${1600 + index * 100}ms` }}>
                <Card className="glass hover:border-accent-purple transition-all duration-500 hover:-translate-y-4 group relative overflow-hidden transform-3d hover-tilt hover:shadow-2xl hover:shadow-accent-purple/20">
                  <div className={`absolute inset-0 bg-gradient-to-br ${asset.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <CardHeader className="text-center relative">
                    <div className={`w-20 h-20 bg-gradient-to-r ${asset.gradient} p-[1px] rounded-2xl mx-auto mb-4`}>
                      <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center group-hover:bg-card transition-colors">
                        <asset.icon className="h-10 w-10 text-white" />
                      </div>
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{asset.title}</CardTitle>
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm text-muted-foreground">{asset.stats}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-muted-foreground">
                      {asset.description}
                    </p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient Border */}
      <section className="py-16 lg:py-24 relative">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto px-6 lg:px-0">
            <div className="relative">
              <div className="absolute inset-0 gradient-primary rounded-3xl blur-3xl opacity-50 animate-pulse-slow"></div>
              <div className="relative glass hover:border-accent-purple rounded-3xl p-8 lg:p-12 text-center transition-all duration-500 hover:shadow-2xl hover:shadow-accent-purple/30">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Ready to integrate?
                </h2>
                <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                  Join the future of decentralized finance with institutional-grade oracle infrastructure
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" className="group gradient-primary hover:shadow-lg hover:shadow-primary/25 text-white border-0 px-8 py-6 text-lg transition-all duration-300 relative overflow-hidden shimmer">
                      <Users className="mr-2 h-5 w-5" />
                      Join Network
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/nodes">
                    <Button size="lg" variant="outline" className="glass glass-hover border-border hover:border-accent-cyan px-8 py-6 text-lg transition-all duration-300">
                      <Lock className="mr-2 h-5 w-5" />
                      Become a Node Operator
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes scroll {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(3px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-gradient {
          animation: gradient 8s ease infinite;
        }

        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }

        .animation-delay-200 {
          animation-delay: 200ms;
        }

        .animation-delay-400 {
          animation-delay: 400ms;
        }

        .animation-delay-600 {
          animation-delay: 600ms;
        }

        .animation-delay-2000 {
          animation-delay: 2000ms;
        }
      `}</style>
    </div>
  );
}