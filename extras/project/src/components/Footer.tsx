import { Instagram, Facebook, Twitter, Youtube, Mail, Phone, MapPin, CreditCard, Shield, Clock } from 'lucide-react';

export default function Footer() {
  const serviceCategories = {
    'Instagram Services': [
      'Buy Instagram Followers',
      'Buy Instagram Likes',
      'Buy Instagram Views',
      'Buy Instagram Comments',
      'Instagram Story Views'
    ],
    'Other Platforms': [
      'Buy TikTok Followers',
      'Buy Facebook Likes',
      'Buy YouTube Subscribers',
      'Buy YouTube Views',
      'Buy Twitter Followers'
    ],
    'Blog Categories': [
      'Instagram Tips',
      'Business Growth',
      'Marketing Strategies',
      'Social Media Tips',
      'Make Money Online'
    ]
  };

  const paymentMethods = [
    { name: 'Visa', icon: CreditCard },
    { name: 'Mastercard', icon: CreditCard },
    { name: 'PayPal', icon: CreditCard },
    { name: 'Stripe', icon: CreditCard },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2 rounded-lg font-bold text-xl">
                SG
              </div>
              <span className="ml-2 text-xl font-bold">SocialGrow</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The leading social media growth agency helping businesses and individuals 
              boost their online presence with authentic, high-quality engagement.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">support@socialgrow.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-gray-300">New York, NY 10001</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-300 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-red-400 transition-colors p-2 bg-gray-800 rounded-lg hover:bg-gray-700">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Service Categories */}
          {Object.entries(serviceCategories).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex items-center justify-center space-x-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <div className="font-semibold text-white">Secure & Safe</div>
                <div className="text-sm text-gray-400">SSL Protected</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <Clock className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-semibold text-white">24/7 Support</div>
                <div className="text-sm text-gray-400">Always Here to Help</div>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-semibold text-white">Money Back</div>
                <div className="text-sm text-gray-400">30-Day Guarantee</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods & Copyright */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © 2024 SocialGrow. All rights reserved.
            </div>

            {/* Payment Methods */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">We Accept:</span>
              <div className="flex items-center space-x-2">
                {paymentMethods.map((method) => (
                  <div key={method.name} className="bg-gray-800 p-2 rounded text-gray-400">
                    <method.icon className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}