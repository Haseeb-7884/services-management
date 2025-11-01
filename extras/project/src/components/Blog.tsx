import { Calendar, ArrowRight, TrendingUp, DollarSign, Target, Lightbulb } from 'lucide-react';

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: '10 Proven Strategies to Boost Your Instagram Engagement in 2024',
      excerpt: 'Discover the latest tactics successful influencers use to increase their Instagram engagement rates and build authentic connections.',
      category: 'Instagram Business',
      date: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: TrendingUp,
      color: 'from-pink-500 to-purple-600'
    },
    {
      id: 2,
      title: 'Social Media Marketing: Complete Guide for Small Businesses',
      excerpt: 'Learn how to create a comprehensive social media strategy that drives real business results and customer growth.',
      category: 'Marketing',
      date: '2024-01-12',
      readTime: '12 min read',
      image: 'https://images.pexels.com/photos/5632381/pexels-photo-5632381.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Target,
      color: 'from-blue-500 to-indigo-600'
    },
    {
      id: 3,
      title: 'How to Monetize Your Social Media Following: 7 Revenue Streams',
      excerpt: 'Turn your social media presence into a profitable business with these proven monetization strategies and tips.',
      category: 'Make Money',
      date: '2024-01-10',
      readTime: '10 min read',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 4,
      title: 'Growth Hacking Tips: From 0 to 100K Followers in 6 Months',
      excerpt: 'Real case studies and actionable insights from accounts that achieved massive growth using strategic content planning.',
      category: 'Tips & Growth',
      date: '2024-01-08',
      readTime: '15 min read',
      image: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Lightbulb,
      color: 'from-orange-500 to-red-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Latest 
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> Insights</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay ahead of the curve with our expert tips, strategies, and industry insights for social media growth
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden group cursor-pointer">
              <div className="relative overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 bg-gradient-to-r ${article.color} text-white px-3 py-1 rounded-full text-sm font-medium flex items-center`}>
                  <article.icon className="w-3 h-3 mr-1" />
                  {article.category}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="mx-2">•</span>
                  <span>{article.readTime}</span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center text-purple-600 font-medium text-sm group-hover:text-pink-600 transition-colors duration-300">
                  Read More
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300 hover:scale-105">
            View All Articles
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </div>
      </div>
    </section>
  );
}