import { Play, Users, Shield, Zap } from 'lucide-react';

export default function Hero() {
  const features = [
    { icon: Users, title: 'Real Followers', desc: 'Authentic engagement' },
    { icon: Zap, title: 'Active & Engaged', desc: 'High-quality audience' },
    { icon: Shield, title: 'Secure Platform', desc: '100% safe & secure' }
  ];

  return (  
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600">
        <div className="absolute inset-0 bg-black opacity-10"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-300 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Instagram Growth
            <span className="block bg-gradient-to-r from-pink-300 to-yellow-300 bg-clip-text text-transparent">
              Marketing Agency
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Boost your social media presence with our premium growth services. 
            Get real followers, authentic engagement, and measurable results - 
            no bots, 100% secure.
          </p>

          {/* Play Button */}
          <div className="mb-12">
            <button className="group relative inline-flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30 rounded-full p-6 hover:bg-white/30 transition-all duration-300 hover:scale-105">
              <Play className="w-8 h-8 text-white ml-1 group-hover:scale-110 transition-transform duration-300" fill="currentColor" />
              <span className="absolute -bottom-8 text-white/80 text-sm font-medium">Watch Demo</span>
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <feature.icon className="w-8 h-8 text-pink-300 mx-auto mb-3" />
                <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}