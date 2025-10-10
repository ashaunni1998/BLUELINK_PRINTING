import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Heart, FileText, Gift, Star, Zap, Eye } from 'lucide-react';
import { Link } from "react-router-dom";
const EnhancedHomeSections = () => {
  const [visibleSections, setVisibleSections] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-white">
      
      {/* Blog/Examples Section */}
 <section 
  id="blog-section"
  data-animate
  className={`relative py-20 lg:py-32 overflow-hidden transition-all duration-1000 ${
    visibleSections['blog-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
  }`}
>
  {/* Container matches header's 65% maxWidth */}
  {/* <div className="relative z-10 w-full max-w-[65%] mx-auto px-4"> */}
   <div
    style={{
      maxWidth: "75%",
      margin: "0 auto",
      marginLeft:"18%",
      marginRight:"21%"
    }}
  >
    {/* Section Header */}
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium mb-6">
        <Eye className="w-4 h-4" />
        Design Inspiration
      </div>
      <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
        Creative <span className="text-blue-600">Showcase</span>
      </h2>
      <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto" />
    </div>

{/* Cards Grid */}
<div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-stretch">
  
  {/* Business Cards Card */}
  <div 
    className={`group relative bg-white rounded-3xl overflow-hidden border-2 border-blue-200 transform transition-all duration-500 hover:scale-105 flex flex-col justify-between ${
      hoveredCard === 'business' ? 'scale-105' : ''
    }`}
    onMouseEnter={() => setHoveredCard('business')}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <div className="flex flex-col flex-grow">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src="/homeimages/business-cards-sample.jpg"
          alt="Business Card Examples"
          className="w-full h-64 lg:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-blue-600 border-2 border-blue-200">
          <Sparkles className="w-3 h-3 inline mr-1" />
          Featured
        </div>
      </div>

      {/* Content */}
       <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col flex-grow justify-between min-h-[420px]">

        <div>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight pr-2">
              10 Business Card  Examples
            </h3>
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 flex-shrink-0 mt-1" />
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5 lg:mb-6">
            Blue Link's designers share 10 standout business cards from different industries that combine creative layouts with premium finishes. Discover how smart use of color, typography, and unique printing techniques can instantly elevate your brand’s first impression.
          </p>
        </div>

        {/* Stats + Button */}
        <div>
          <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-5 lg:mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs sm:text-sm text-gray-600 ml-1">4.9</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">1.2k views</span>
          </div>
          <Link
            to="/blog/5"
            state={{ from: "home" }}
            className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl transform transition-all duration-300 hover:scale-105"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </div>

  {/* Invites Card */}
  <div 
    className={`group relative bg-white rounded-3xl overflow-hidden border-2 border-blue-200 transform transition-all duration-500 hover:scale-105 flex flex-col justify-between ${
      hoveredCard === 'invites' ? 'scale-105' : ''
    }`}
    onMouseEnter={() => setHoveredCard('invites')}
    onMouseLeave={() => setHoveredCard(null)}
  >
    <div className="flex flex-col flex-grow">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src="/homeimages/invites-sample.jpg"
          alt="Event Invitations"
          className="w-full h-64 lg:h-72 object-cover transform group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-semibold text-blue-600 border-2 border-blue-200">
          <Heart className="w-3 h-3 inline mr-1" />
          Popular
        </div>
      </div>

      {/* Content */}
        <div className="p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col flex-grow justify-between min-h-[420px]">

        <div>
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight pr-2">
              Invites They Won't Ignore
            </h3>
            <Heart className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
          </div>

          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4 sm:mb-5 lg:mb-6">
            Master the art of creating paper invites that actually get a "yes" with these proven design strategies and tips. From choosing the perfect color palette to selecting premium paper finishes, every detail matters in making your invitation stand out.
          </p>
        </div>

        {/* Stats + Button */}
        <div>
          <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-5 lg:mb-6">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-xs sm:text-sm text-gray-600 ml-1">4.8</span>
            </div>
            <span className="text-xs sm:text-sm text-gray-500">850 views</span>
          </div>
          <Link
            to="/blog/6"
            state={{ from: "home" }}
            className="group/btn w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl transform transition-all duration-300 hover:scale-105"
          >
            Read More
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  </div>
</div>

  </div>
</section>
      {/* Flyers Section */}
      <section 
        id="flyers-section"
        data-animate
       className={`relative py-20 lg:py-32 overflow-hidden transition-all duration-1000 delay-200 bg-blue-50 ml-[6%] mr-[6%] ${
  visibleSections['flyers-section']
    ? 'opacity-100 translate-y-0'
    : 'opacity-0 translate-y-10'
}`}

      >
        {/* Match header's container structure */}
{/* <div className="relative z-10 w-full px-[5%] lg:px-[18%]"> */}
 <div
    style={{
      maxWidth: "75%",
      margin: "0 16% 0 13%",
      padding: "0 1rem",
    }}
  >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Image Side */}
            <div className="relative group order-2 lg:order-1">
              <div className="relative bg-white p-4 lg:p-6 rounded-3xl border-2 border-blue-200 max-w-lg mx-auto lg:mx-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQd19vInA8bUX20OregUR32xvV6CbNZ_kMhDQ&s"
                  alt="Flyers & Leaflets"
                  className="w-full rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 lg:p-4 border-2 border-blue-200">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-black text-blue-600">Fast</div>
                    <div className="text-xs text-gray-600">Delivery</div>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white rounded-2xl p-3 lg:p-4">
                  <div className="text-center">
                    <div className="text-lg lg:text-xl font-black">HD</div>
                    <div className="text-xs">Quality</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Side */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                <FileText className="w-4 h-4" />
                Marketing Materials
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight">
                  Flyers & Leaflets.
                  <span className="block text-blue-600">Spread the word.</span>
                </h2>
                <div className="w-24 h-1 bg-blue-600 rounded-full" />
              </div>

              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Make your message loud and clear with professional, high-impact flyers and leaflets – 
                perfect for <span className="text-blue-600 font-semibold">promotions</span>, 
                <span className="text-blue-600 font-semibold"> menus</span>, and so much more.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Zap, text: "Same-day printing" },
                  { icon: Star, text: "Premium papers" },
                  { icon: Sparkles, text: "Custom designs" },
                  { icon: Heart, text: "Expert support" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl border border-blue-200">
                    <feature.icon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center gap-2 px-6 lg:px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl transform transition-all duration-300 hover:scale-105">
                  Shop Flyers & Leaflets
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-6 lg:px-8 py-4 border-2 border-blue-400 text-blue-600 font-semibold rounded-2xl bg-white hover:bg-blue-50 transition-all duration-300">
                  View Samples
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gifts Section */}
      <section 
        id="gifts-section"
        data-animate
        className={`relative py-20 lg:py-32 overflow-hidden transition-all duration-1000 delay-400 ${
          visibleSections['gifts-section'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Match header's container structure */}
{/* <div className="relative z-10 w-full px-[5%] lg:px-[18%]"> */}
        <div
    style={{
      maxWidth: "75%",
      margin: "0 auto",
      marginLeft:"18%",
      marginRight:"21%"
    }}
  >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Content Side */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 border border-blue-200 rounded-full text-blue-700 text-sm font-medium">
                <Gift className="w-4 h-4" />
                Custom Products
              </div>

              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-gray-900 leading-tight">
                  Personalized Gifts.
                  <span className="block text-blue-600">Make it special.</span>
                </h2>
                <div className="w-24 h-1 bg-blue-600 rounded-full" />
              </div>

              <p className="text-lg lg:text-xl text-gray-700 leading-relaxed">
                Add a personal touch with custom gifts perfect for any occasion – from 
                <span className="text-blue-600 font-semibold"> birthdays</span> to 
                <span className="text-blue-600 font-semibold"> business branding</span> and everything in between.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Heart, text: "Unique designs" },
                  { icon: Sparkles, text: "Premium quality" },
                  { icon: Gift, text: "Gift wrapping" },
                  { icon: Star, text: "Fast turnaround" }
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-blue-100 rounded-xl border border-blue-200">
                    <feature.icon className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group flex items-center justify-center gap-2 px-6 lg:px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl transform transition-all duration-300 hover:scale-105">
                  Shop Personalized Gifts
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-6 lg:px-8 py-4 border-2 border-blue-400 text-blue-600 font-semibold rounded-2xl bg-white hover:bg-blue-50 transition-all duration-300">
                  Browse Gallery
                </button>
              </div>
            </div>

            {/* Image Side - Updated to match the reference design */}
            <div className="relative">
              <div className="relative max-w-lg-1 mx-auto lg:mx-0">
                <img
                  src="https://thesignaturebox.com/cdn/shop/articles/personalised-gifts-5-things-to-consider-before-choosing-personalized-gifts-294055.jpg?v=1706979689&width=1280"
                  alt="Personalized Gift"
                  className="w-full rounded-2xl shadow-lg"
                />
                
                {/* 100% Custom Badge - Top Left */}
                <div className="absolute -top-3 -left-3 bg-white rounded-xl px-3 py-2 shadow-lg border border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-600">100%</div>
                    <div className="text-xs text-gray-600 uppercase tracking-wide">Custom</div>
                  </div>
                </div>
                
                {/* Gift Icon Badge - Bottom Right */}
                <div className="absolute -bottom-3 -right-3 bg-blue-600 text-white rounded-xl p-3 shadow-lg">
                  <div className="text-center">
                    <div className="text-lg">🎁</div>
                    <div className="text-xs">Special</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnhancedHomeSections;