import { Star, ArrowRight } from 'lucide-react';

export default function PopularPackages() {
  const packages = [
    {
      title: 'Instagram Followers Starter',
      price: '$29.99',
      originalPrice: '$39.99',
      features: ['1,000 Real Followers', 'Instant Delivery', '24/7 Support', '30-Day Refill Guarantee'],
      color: 'from-pink-500 to-purple-600',
      popular: false
    },
    {
      title: 'Instagram Growth Pro',
      price: '$79.99',
      originalPrice: '$99.99',
      features: ['5,000 Real Followers', '1,000 Likes', 'Instant Delivery', 'Priority Support', '60-Day Refill Guarantee'],
      color: 'from-purple-600 to-blue-600',
      popular: true
    },
    {
      title: 'TikTok Viral Package',
      price: '$49.99',
      originalPrice: '$69.99',
      features: ['50K Video Views', '500 Followers', 'Real Engagement', '48h Delivery'],
      color: 'from-gray-800 to-gray-900',
      popular: false
    },
    {
      title: 'YouTube Creator Boost',
      price: '$59.99',
      originalPrice: '$79.99',
      features: ['1,000 Subscribers', '10K Video Views', 'Watch Time Boost', '7-Day Delivery'],
      color: 'from-red-500 to-red-700',
      popular: false
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Most Selling 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our bestselling growth packages designed to boost your social media presence effectively
          </p>
        </div>

        {/* Package Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {packages.map((pkg, index) => (
            <div key={index} className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden ${pkg.popular ? 'ring-2 ring-purple-600' : ''}`}>
              {pkg.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-b-lg text-sm font-medium">
                  <Star className="w-3 h-3 inline mr-1" fill="currentColor" />
                  Most Popular
                </div>
              )}
              
              <div className={`h-2 bg-gradient-to-r ${pkg.color}`}></div>
              
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{pkg.title}</h3>
                
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">{pkg.originalPrice}</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 bg-gradient-to-r ${pkg.color} rounded-full mr-3 flex-shrink-0`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full bg-gradient-to-r ${pkg.color} text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105`}>
                  Get Started
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
            Discover All Packages
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}