import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, FileText, ArrowRight, Star, Zap } from 'lucide-react';

const FlyerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    { icon: Sparkles, title: "Premium Finishes", desc: "Gloss, matte, spot UV" },
    { icon: Palette, title: "Custom Colors", desc: "Vibrant CMYK printing" },
    { icon: FileText, title: "Quality Papers", desc: "From 130gsm to 400gsm" }
  ];

  const floatingElements = [
    { id: 1, size: 40, delay: 0 },
    { id: 2, size: 60, delay: 2 },
    { id: 3, size: 30, delay: 4 },
    { id: 4, size: 50, delay: 1 }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-pulse opacity-20"
            style={{
              width: `${element.size}px`,
              height: `${element.size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${element.delay}s`,
              background: 'linear-gradient(45deg, #ff6b9d, #4ecdc4)',
              borderRadius: '50%',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Geometric Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #fff 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, #fff 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px, 40px 40px'
        }}
      />

      <div className="relative z-10 container mx-auto px-4 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Content Side */}
          <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-white/90 text-sm font-medium">
              <Zap className="w-4 h-4 text-yellow-400" />
              Premium Print Solutions
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-white leading-tight">
                Flyers &
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Leaflets
                </span>
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-white/80 leading-relaxed max-w-lg">
              Elevate your marketing with stunning flyer designs. 
              <span className="text-pink-300 font-semibold"> Premium papers</span> meet 
              <span className="text-purple-300 font-semibold"> exquisite finishes</span> for 
              maximum impact.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:scale-105 ${
                    activeFeature === index ? 'bg-white/15 border-pink-400/50' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <feature.icon className="w-8 h-8 text-pink-400 mb-2" />
                  <h3 className="text-white font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-white/60 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl backdrop-blur-md hover:bg-white/10 transition-all duration-300">
                View Samples
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            
            {/* Main Image Container */}
            <div className="relative group">
              
              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl opacity-30 blur-2xl group-hover:opacity-50 transition-opacity duration-500" />
              
              {/* Image Frame */}
              <div className="relative bg-gradient-to-br from-white/20 to-white/5 p-6 rounded-3xl backdrop-blur-lg border border-white/20">
                <div
                  className="w-full h-80 lg:h-96 rounded-2xl bg-cover bg-center shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                  style={{
                    backgroundImage: "url('/homeimages/flyer.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm opacity-90">Professional Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-black text-gray-800">24h</div>
                    <div className="text-xs text-gray-600 font-medium">Fast Delivery</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-4 shadow-xl">
                  <div className="text-center">
                    <div className="text-2xl font-black">99%</div>
                    <div className="text-xs font-medium opacity-90">Satisfaction</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { number: "50K+", label: "Flyers Printed" },
            { number: "500+", label: "Happy Clients" },
            { number: "15+", label: "Paper Types" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl lg:text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-white/60 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlyerSection;