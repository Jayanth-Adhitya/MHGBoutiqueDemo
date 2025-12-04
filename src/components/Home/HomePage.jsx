import React from 'react';

export default function HomePage({ onStartChat }) {
  // How it works steps
  const steps = [
    {
      number: '01',
      title: 'Tell Us About You',
      description: 'Share your preferences, mood, occasion, or even a memory you want to capture in a scent.'
    },
    {
      number: '02',
      title: 'AI Finds Your Match',
      description: 'Our intelligent concierge analyzes thousands of fragrances to find your perfect matches.'
    },
    {
      number: '03',
      title: 'Discover Your Scent',
      description: 'Explore personalized recommendations tailored specifically to your unique taste.'
    }
  ];

  // What we help with
  const helpCategories = [
    {
      title: 'Find Your Signature',
      description: 'Discover a scent that becomes uniquely yours'
    },
    {
      title: 'Perfect Gifts',
      description: 'Find the ideal fragrance gift for someone special'
    },
    {
      title: 'Special Occasions',
      description: 'Match the perfect scent to any event or moment'
    },
    {
      title: 'Try Something New',
      description: 'Explore new scent families and expand your collection'
    }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[320px] md:min-h-[480px] flex flex-col items-center justify-center py-12 md:py-20 px-4">
        {/* Background Image - Forest */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-xl mx-3 md:mx-4 my-3 md:my-4"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.6) 100%), url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920")`
          }}
        />

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-2xl mx-auto px-2">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-[#D4A373] leading-tight tracking-tight mb-3 md:mb-4">
            Find Your Perfect Scent
          </h1>
          <p className="text-sm md:text-lg text-white/90 mb-5 md:mb-8 max-w-xl mx-auto leading-relaxed">
            Not sure which fragrance suits you? Our AI-powered concierge helps you discover
            the perfect perfume based on your personality, mood, and preferences.
          </p>
          <button
            onClick={onStartChat}
            className="px-5 py-2.5 md:px-8 md:py-4 rounded-lg bg-[#D4A373] text-[#102216] font-bold text-sm md:text-base hover:bg-[#c4935f] transition-colors"
          >
            Start Your Scent Journey
          </button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 max-w-[960px] mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#D4A373] tracking-tight mb-4">
            How We Help You
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Finding your signature scent has never been easier. Our AI concierge guides you every step of the way.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="text-5xl font-extrabold text-[#D4A373]/30 mb-4">{step.number}</div>
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What We Help With */}
      <section className="py-16 px-4 bg-black/20">
        <div className="max-w-[960px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#D4A373] tracking-tight mb-4">
              Whatever You Need
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Whether you're searching for yourself or someone else, we've got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white/5 rounded-xl p-6 text-center border border-white/10 hover:border-[#D4A373]/30 transition-all duration-300"
              >
                <h3 className="text-lg font-bold text-white mb-2">{category.title}</h3>
                <p className="text-gray-400 text-sm">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 max-w-[960px] mx-auto w-full">
        <div className="relative rounded-2xl overflow-hidden">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(212, 163, 115, 0.9) 0%, rgba(16, 34, 22, 0.95) 100%), url("https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200")`
            }}
          />

          <div className="relative z-10 py-16 px-8 md:px-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              Ready to Find Your Scent?
            </h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Talk to our AI concierge and discover fragrances perfectly matched to you.
              It's free, instant, and personalized.
            </p>
            <button
              onClick={onStartChat}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-lg bg-white text-[#102216] font-bold hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Chat With Our AI Concierge
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-4 max-w-[960px] mx-auto w-full">
        <div className="bg-black/20 rounded-xl p-10 md:p-16 text-center border border-white/10">
          <p className="max-w-2xl mx-auto text-lg md:text-xl italic text-gray-300 mb-6">
            "I was completely lost trying to find a perfume online. The AI concierge asked me a few simple questions and found exactly what I was looking for. It's like having a personal fragrance expert!"
          </p>
          <p className="text-sm font-bold text-[#D4A373]">— Sarah M.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-10">
        <div className="max-w-[960px] mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[#D4A373]">Explore</h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">All Perfumes</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Best Sellers</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">New Arrivals</a>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-[#D4A373]">Support</h3>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact Us</a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Shipping Info</a>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-bold text-[#D4A373]">Stay Updated</h3>
              <p className="text-sm text-gray-400">Get tips on finding your perfect scent.</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow rounded-l-lg border border-white/20 bg-black/20 text-white text-sm px-3 py-2 placeholder-gray-500 focus:border-[#D4A373] focus:outline-none"
                />
                <button className="bg-[#D4A373] text-[#102216] px-4 rounded-r-lg font-bold text-sm hover:bg-[#c4935f] transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 py-4 border-t border-white/10">
            &copy; 2025 mhgboutique. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
