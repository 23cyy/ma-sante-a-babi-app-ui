
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import WelcomeScreen from "@/components/WelcomeScreen";
import Dashboard from "@/components/Dashboard";
import HealthRecord from "@/components/HealthRecord";
import Children from "@/components/Children";
import HealthMap from "@/components/HealthMap";
import AdjouaChat from "@/components/AdjouaChat";
import BloodCompatibility from "@/components/BloodCompatibility";
import Appointments from "@/components/Appointments";
import Reminders from "@/components/Reminders";
import QRHealth from "@/components/QRHealth";
import Navigation from "@/components/Navigation";
import WebLayout from "@/components/WebLayout";
import { useScreenSize } from "@/hooks/useScreenSize";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bloodType: string;
  weight: number;
  height: number;
  childrenCount: number;
}

const Index = () => {
  const { isDesktop } = useScreenSize();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  
  // Déterminer l'écran actuel basé sur l'URL
  const getCurrentScreen = () => {
    const path = location.pathname;
    if (path === '/') return 'dashboard';
    return path.substring(1); // Enlever le '/' du début
  };
  
  const currentScreen = getCurrentScreen();

  const handleLogin = (userData: User) => {
    setUser(userData);
    navigate('/'); // Rediriger vers le dashboard après connexion
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/'); // Rediriger vers l'accueil après déconnexion
  };

  if (!user) {
    return <WelcomeScreen onLogin={handleLogin} />;
  }

  const handleNavigate = (screen: string) => {
    if (screen === 'dashboard') {
      navigate('/');
    } else {
      navigate(`/${screen}`);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'health-record':
        return <HealthRecord user={user} onBack={handleBack} />;
      case 'children':
        return <Children onBack={handleBack} />;
      case 'health-map':
        return <HealthMap onBack={handleBack} />;
      case 'adjoua-chat':
        return <AdjouaChat onBack={handleBack} />;
      case 'blood-compatibility':
        return <BloodCompatibility onBack={handleBack} />;
      case 'appointments':
        return <Appointments user={user} onBack={handleBack} />;
      case 'reminders':
        return <Reminders user={user} onBack={handleBack} />;
      case 'qr-health':
        return <QRHealth user={user} onBack={handleBack} />;
      default:
        return <Dashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />;
    }
  };

  if (isDesktop) {
    return (
      <WebLayout 
        currentScreen={currentScreen} 
        onNavigate={handleNavigate} 
        user={user} 
        onLogout={handleLogout}
      >
        {renderScreen()}
      </WebLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderScreen()}
      <Navigation currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
};

export default Index;
