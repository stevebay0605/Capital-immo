import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';
import SiteLoader from './components/SiteLoader';
import Home from './pages/Home';
import Biens from './pages/Biens';
import BienDetail from './pages/BienDetail';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/admin/RequireAuth';
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminBiens from './pages/admin/Biens';
import AdminServices from './pages/admin/Services';
import AdminTemoignages from './pages/admin/Temoignages';
import AdminEquipe from './pages/admin/Equipe';
import AdminContacts from './pages/admin/Contacts';
import AdminConfigurations from './pages/admin/Configurations';
import AdminEntreprise from './pages/admin/Entreprise';

function AppShell({ isLoading }: { isLoading: boolean }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <SiteLoader isVisible={isLoading} />}
      {!isAdmin && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/biens" element={<Biens />} />
          <Route path="/biens/:id" element={<BienDetail />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <RequireAuth>
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="biens" element={<AdminBiens />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="temoignages" element={<AdminTemoignages />} />
            <Route path="equipe" element={<AdminEquipe />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="configurations" element={<AdminConfigurations />} />
            <Route path="entreprise" element={<AdminEntreprise />} />
          </Route>
        </Routes>
      </div>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppButton />}
      {!isAdmin && <ScrollToTop />}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const finishLoading = () => {
      window.setTimeout(() => setIsLoading(false), 900);
    };

    if (document.readyState === 'complete') {
      finishLoading();
      return;
    }

    window.addEventListener('load', finishLoading, { once: true });
    return () => window.removeEventListener('load', finishLoading);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isLoading ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isLoading]);

  return (
    <Router>
      <AuthProvider>
        <AppShell isLoading={isLoading} />
      </AuthProvider>
    </Router>
  );
}

export default App;
