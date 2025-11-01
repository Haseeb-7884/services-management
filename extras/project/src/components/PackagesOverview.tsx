import { Instagram, Facebook, Music, Youtube } from 'lucide-react';

export default function PackagesOverview() {
  const services = [
    {
      icon: Instagram,
      name: 'Instagram',
      desc: 'Followers, Likes, Views & More',
      color: 'from-pink-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-pink-50 to-purple-50'
    },
    {
      icon: Facebook,
      name: 'Facebook',
      desc: 'Page Likes, Post Engagement',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      icon: Music,
      name: 'TikTok',
      desc: 'Followers, Likes, Views',
      color: 'from-gray-800 to-gray-900',
      bgColor: 'bg-gradient-to-br from-gray-50 to-slate-100'
    },
    {
      icon: Youtube,
      name: 'YouTube',
      desc: 'Subscribers, Views, Likes',
      color: 'from-red-500 to-red-700',
      bgColor: 'bg-gradient-to-br from-red-50 to-pink-50'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
              Grow Your Social Media 
              <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Presence Today
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Choose from our comprehensive range of social media growth services. 
              We provide authentic engagement across all major platforms with 
              guaranteed results and 24/7 support.
            </p>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-700">Real, active followers and engagement</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-700">Safe and secure delivery methods</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"></div>
                <span className="text-gray-700">Money-back guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div key={index} className={`${service.bgColor} rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}