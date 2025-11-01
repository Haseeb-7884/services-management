import Header from './components/Header';
import Hero from './components/Hero';
import PackagesOverview from './components/PackagesOverview';
import PopularPackages from './components/PopularPackages';
import PromoBanner from './components/PromoBanner';
import Blog from './components/Blog';
import ReviewForm from './components/ReviewForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <PackagesOverview />
      <PopularPackages />
      <PromoBanner />
      <Blog />
      <ReviewForm />
      <Footer />
    </div>
  );
}

export default App;