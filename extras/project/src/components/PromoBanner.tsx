import { Rocket, ArrowRight } from 'lucide-react';

export default function PromoBanner() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      
      {/* Animated Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-48 h-48 bg-pink-300 opacity-10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Rocket className="w-12 h-12 text-pink-300 animate-bounce" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Boost Your 
            <span className="block bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
              Social Media Growth?
            </span>
          </h2>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who have transformed their social media presence 
            with our premium growth services. Start your journey today!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group inline-flex items-center bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg">
              View All Packages
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            
            <button className="inline-flex items-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all duration-300 hover:scale-105">
              Get Free Consultation
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50K+</div>
              <div className="text-white/80">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">2M+</div>
              <div className="text-white/80">Followers Delivered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.9%</div>
              <div className="text-white/80">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}