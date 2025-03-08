'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Sparkles, Zap, Code2, Cpu, Boxes } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-background/95 relative overflow-hidden">
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[128px] translate-x-1/2 -translate-y-1/2" />
      
      {/* Grid Background */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center space-y-8 py-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/10 bg-primary/5 text-primary mb-8">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>The Future of AI Development</span>
          </div>
          
          <h1 className="text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 animate-gradient">
            Build Intelligent Applications
            <br />
            With Cutting-Edge AI
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create, deploy, and scale AI applications with our powerful platform.
            Experience the next generation of development tools.
          </p>

          <div className="flex justify-center gap-4">
            <Button size="lg" className="group">
              Get Started
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              View Documentation
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 py-20">
          <FeatureCard
            icon={<Zap className="w-6 h-6" />}
            title="Lightning Fast"
            description="Build and deploy AI applications with unprecedented speed and efficiency."
          />
          <FeatureCard
            icon={<Code2 className="w-6 h-6" />}
            title="Intuitive Development"
            description="Write clean, maintainable code with our modern development tools."
          />
          <FeatureCard
            icon={<Cpu className="w-6 h-6" />}
            title="Advanced AI Models"
            description="Access state-of-the-art AI models and APIs with simple integration."
          />
          <FeatureCard
            icon={<Boxes className="w-6 h-6" />}
            title="Scalable Infrastructure"
            description="Scale your applications seamlessly with our robust infrastructure."
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/20 transition-colors group">
      <div className="rounded-lg p-3 bg-primary/5 w-fit group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mt-4 mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}