import React, { useEffect } from 'react';
import { RealEstateProvider, useRealEstate } from './context/RealEstateContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { AiChatWidget } from './components/common/AiChatWidget';

// Modals
import { BookingModal } from './components/modals/BookingModal';
import { BrochureModal } from './components/modals/BrochureModal';
import { VirtualTourModal } from './components/modals/VirtualTourModal';

// Home Sub-Components
import { HeroSection } from './components/home/HeroSection';
import { FeaturedProperties } from './components/home/FeaturedProperties';
import { AboutSection } from './components/home/AboutSection';
import { WhyChooseUs } from './components/home/WhyChooseUs';
import { LocationsSection } from './components/home/LocationsSection';
import { TestimonialSection } from './components/home/TestimonialSection';
import { ContactSection } from './components/home/ContactSection';

// Full Views
import { AllPropertiesView } from './components/views/AllPropertiesView';
import { PropertyDetailsView } from './components/views/PropertyDetailsView';
import { AboutView } from './components/views/AboutView';
import { WhyChooseView } from './components/views/WhyChooseView';
import { ContactView } from './components/views/ContactView';
import { WishlistView } from './components/views/WishlistView';
import { CompareView } from './components/views/CompareView';

// Admin & SEO Engine Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SeoEngineGenerator } from './components/admin/SeoEngineGenerator';

const MainContent: React.FC = () => {
  const { currentPage, isAdminLoggedIn, theme } = useRealEstate();

  // Sync dark theme class on document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Check if current view is admin
  const isAdminView = currentPage === 'admin' || currentPage === 'admin-dashboard' || currentPage === 'admin-login';

  // Render current view
  const renderCurrentView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HeroSection />
            <FeaturedProperties />
            <AboutSection />
            <WhyChooseUs />
            <LocationsSection />
            <TestimonialSection />
            <ContactSection />
          </>
        );

      case 'properties':
        return <AllPropertiesView />;

      case 'property-details':
        return <PropertyDetailsView />;

      case 'about':
        return <AboutView />;

      case 'why-choose':
        return <WhyChooseView />;

      case 'contact':
        return <ContactView />;

      case 'wishlist':
        return <WishlistView />;

      case 'compare':
        return <CompareView />;

      case 'seo-engine':
        // Agency tools (demo generator, bulk CSV, WordPress publishing) need the admin password.
        return isAdminLoggedIn ? <SeoEngineGenerator /> : <AdminLogin purpose="agency" />;

      case 'admin':
      case 'admin-login':
        return isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />;

      case 'admin-dashboard':
        return isAdminLoggedIn ? <AdminDashboard /> : <AdminLogin />;

      default:
        return (
          <>
            <HeroSection />
            <FeaturedProperties />
            <AboutSection />
            <WhyChooseUs />
            <LocationsSection />
            <TestimonialSection />
            <ContactSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-[#F8FAFC] font-sans selection:bg-[#D4AF37] selection:text-slate-950">
      
      {/* Global Header (hidden when on full-screen admin console) */}
      {!isAdminView && <Header />}

      {/* Main Routed Content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Global Footer (hidden when on full-screen admin console) */}
      {!isAdminView && <Footer />}

      {/* Global AI Concierge & WhatsApp Widget */}
      {!isAdminView && <AiChatWidget />}

      {/* Global Toast Container */}
      <ToastContainer />

      {/* Global Interactive Modals */}
      <BookingModal />
      <BrochureModal />
      <VirtualTourModal />
    </div>
  );
};

export default function App() {
  return (
    <RealEstateProvider>
      <MainContent />
    </RealEstateProvider>
  );
}
