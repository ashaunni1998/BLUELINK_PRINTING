import React, { useState, useEffect } from 'react';
import { Sparkles, Palette, FileText, ArrowRight, Star, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const FlyerSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1440);
 const navigate = useNavigate();
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Consolidated resize handler matching Header.jsx
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive padding matching Header.jsx
  const getPadding = () => {
    if (windowWidth <= 768) return '1rem';
    if (windowWidth < 1200) return '1.5rem';
    return '2.5rem';
  };

  const padding = getPadding();

  const features = [
    { icon: Sparkles, title: "Premium Finishes", desc: "Gloss, matte, spot UV" },
    { icon: Palette, title: "Custom Colors", desc: "Vibrant CMYK printing" },
    { icon: FileText, title: "Quality Papers", desc: "From 130gsm to 400gsm" }
  ];

  const handleGetStarted = () => {
    navigate("/sign-in");
    
  };

  return (
    <section className="relative bg-blue-50 overflow-hidden" style={{ width: "100%", margin: "0", padding: "0" }}>
      {/* Container matching Header layout */}
      <div style={{
        maxWidth: "1440px",
        margin: "0 auto",
        padding: `${windowWidth <= 768 ? '2rem 1rem' : windowWidth < 1200 ? '3rem 1.5rem' : '4rem 2.5rem'}`,
        boxSizing: "border-box",
        width: "100%",
      }}>
        <div className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Content Side */}
            <div className={`space-y-6 lg:space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-[10%] opacity-0'}`}>
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                <Zap className="w-4 h-4 text-blue-500" />
                Premium Print Solutions
              </div>

              {/* Heading */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-gray-900 leading-tight">
                  Flyers & 
                  <span className="block text-blue-600">Leaflets</span>
                </h1>
                <div className="w-24 h-1.5 bg-blue-600 rounded-full" />
              </div>

              {/* Description */}
              <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
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
                    <feature.icon className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className="text-gray-900 font-semibold text-base mb-2">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
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
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[10%] opacity-0'}`}>
              
              {/* Image Frame */}
              <div className="relative group w-full max-w-2xl mx-auto">
                <div className="relative bg-white p-0 rounded-3xl border-2 border-blue-200">
                  <div
                    className="w-full h-80 md:h-96 lg:h-[28rem] xl:h-[32rem] rounded-2xl bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: "url('/homeimages/flyer.jpeg')",
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {/* Overlay */}
                    <div className="absolute inset-0 rounded-2xl flex items-end p-6 transition-all duration-300">
                      <div className="text-white">
                        <div className="flex items-center gap-1.5 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                          <span className="text-sm ml-1">Professional Quality</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Stats */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 md:p-4 border-2 border-blue-200 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-black text-blue-600">24h</div>
                      <div className="text-xs text-gray-600 font-medium">Fast Delivery</div>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-2xl p-3 md:p-4 shadow-lg">
                    <div className="text-center">
                      <div className="text-2xl md:text-3xl font-black">99%</div>
                      <div className="text-xs font-medium">Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-12 md:mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { number: "50K+", label: "Flyers Printed" },
              { number: "500+", label: "Happy Clients" },
              { number: "15+", label: "Paper Types" },
              { number: "24/7", label: "Support" }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FlyerSection;