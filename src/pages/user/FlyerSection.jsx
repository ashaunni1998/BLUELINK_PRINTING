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

  const handleGetStarted = () => {
    // Navigate to sign-in page - replace with your navigation logic
    console.log('Navigate to sign-in page');
  };

  return (
    <section className="relative bg-blue-50 overflow-hidden py-20 lg:py-32">
      
      <div className="relative z-10 container mx-auto px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-6xl mx-auto">
          
          {/* Content Side */}
          <div className={`space-y-8 transform transition-all duration-1000 mx-4 lg:mx-8 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
              <Zap className="w-4 h-4 text-blue-500" />
              Premium Print Solutions
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight">
                Flyers &
                <span className="block text-blue-600">
                  Leaflets
                </span>
              </h1>
              <div className="w-24 h-1 bg-blue-600 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed max-w-lg">
              Elevate your marketing with stunning flyer designs. 
              <span className="text-blue-600 font-semibold"> Premium papers</span> meet 
              <span className="text-blue-600 font-semibold"> exquisite finishes</span> for 
              maximum impact.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-2xl bg-white border-2 border-blue-200 cursor-pointer transition-all duration-300 hover:bg-blue-100 hover:scale-105 ${
                    activeFeature === index ? 'bg-blue-100 border-blue-400' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <feature.icon className="w-8 h-8 text-blue-500 mb-2" />
                  <h3 className="text-gray-900 font-semibold text-sm mb-1">{feature.title}</h3>
                  <p className="text-gray-600 text-xs">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleGetStarted}
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative transform transition-all duration-1000 delay-300 mx-4 lg:mx-8 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            
            {/* Main Image Container */}
            <div className="relative group">
              
              {/* Image Frame */}
              <div className="relative bg-white p-6 rounded-3xl border-2 border-blue-200">
                <div
                  className="w-full h-80 lg:h-96 rounded-2xl bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: "url('/homeimages/flyer.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay Content */}
                  <div className="absolute inset-0 rounded-2xl flex items-end p-6 transition-all duration-300">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-sm">Professional Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-600">24h</div>
                    <div className="text-xs text-gray-600 font-medium">Fast Delivery</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-2xl p-4">
                  <div className="text-center">
                    <div className="text-2xl font-black">99%</div>
                    <div className="text-xs font-medium">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto px-4">
          {[
            { number: "50K+", label: "Flyers Printed" },
            { number: "500+", label: "Happy Clients" },
            { number: "15+", label: "Paper Types" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl lg:text-4xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlyerSection;