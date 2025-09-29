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
    console.log('Navigate to sign-in page');
  };

  return (
  
    <section className="relative bg-blue-50 overflow-hidden py-[8%] lg:py-[12%] ml-[6%] mr-[6%]"
>
  {/* Container */}
  <div className="relative z-10 w-full px-[5%] lg:px-[18%]">
    <div className="grid lg:grid-cols-2 gap-[6%] items-center">
      
          {/* Content Side */}
          <div className={`space-y-[5%] transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-[10%] opacity-0'}`}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-[0.6rem] px-[3%] py-[1%] bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-[90%] font-medium">
              <Zap className="w-[1rem] h-[1rem] text-blue-500" />
              Premium Print Solutions
            </div>

            {/* Heading */}
            <div className="space-y-[4%]">
              <h1 className="text-[8vw] lg:text-[4vw] font-black text-gray-900 leading-tight">
                Flyers & 
                <span className="block text-blue-600">Leaflets</span>
              </h1>
              <div className="w-[15%] h-[0.4rem] bg-blue-600 rounded-full" />
            </div>

            {/* Description */}
            <p className="text-[1.2rem] lg:text-[1.4rem] text-gray-700 leading-relaxed">
              Elevate your marketing with stunning flyer designs. 
              <span className="text-blue-600 font-semibold"> Premium papers</span> meet 
              <span className="text-blue-600 font-semibold"> exquisite finishes</span> for 
              maximum impact.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-[3%]">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`p-[5%] rounded-2xl bg-white border-2 border-blue-200 cursor-pointer transition-all duration-300 hover:bg-blue-100 hover:scale-105 ${
                    activeFeature === index ? 'bg-blue-100 border-blue-400' : ''
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <feature.icon className="w-[15%] h-[15%] text-blue-500 mb-[5%]" />
                  <h3 className="text-gray-900 font-semibold text-[0.9rem] mb-[2%]">{feature.title}</h3>
                  <p className="text-gray-600 text-[0.75rem]">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-[4%] pt-[4%]">
              <button
                onClick={handleGetStarted}
                className="group px-[8%] py-[4%] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transform transition-all duration-300 hover:scale-105 flex items-center justify-center gap-[0.6rem]"
              >
                Get Started
                <ArrowRight className="w-[1.2rem] h-[1.2rem] group-hover:translate-x-[15%] transition-transform" />
              </button>
            </div>
          </div>

          {/* Visual Side */}
          <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-[10%] opacity-0'}`}>
            
            {/* Image Frame */}
            <div className="relative group w-[78%] mx-auto lg:mx-[10%]">
              <div className="relative bg-white p-[0%] rounded-3xl border-2 border-blue-200">
                <div
                  className="w-full h-[50vw] sm:h-[40vw] lg:h-[35vw] rounded-2xl bg-cover bg-center transform group-hover:scale-105 transition-transform duration-500"
                  style={{
                    backgroundImage: "url('/homeimages/flyer.jpeg')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 rounded-2xl flex items-end p-[5%] transition-all duration-300">
                    <div className="text-white">
                      <div className="flex items-center gap-[0.4rem] mb-[2%]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-[1rem] h-[1rem] fill-yellow-400 text-yellow-400" />
                        ))}
                        <span className="text-[0.9rem]">Professional Quality</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Stats */}
                <div className="absolute -top-[6%] -right-[6%] bg-white rounded-2xl p-[5%] border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-[1.6rem] font-black text-blue-600">24h</div>
                    <div className="text-[0.8rem] text-gray-600 font-medium">Fast Delivery</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-[6%] -left-[6%] bg-blue-600 text-white rounded-2xl p-[5%]">
                  <div className="text-center">
                    <div className="text-[1.6rem] font-black">99%</div>
                    <div className="text-[0.8rem] font-medium">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="mt-[10%] grid grid-cols-2 md:grid-cols-4 gap-[6%]">
          {[
            { number: "50K+", label: "Flyers Printed" },
            { number: "500+", label: "Happy Clients" },
            { number: "15+", label: "Paper Types" },
            { number: "24/7", label: "Support" }
          ].map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-[5vw] lg:text-[2.5vw] font-black text-blue-600 mb-[2%] group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-600 font-medium text-[0.9rem]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlyerSection;
