
import { Heart, MapPin, Calendar, MessageCircle, Bot, User, Book } from "lucide-react";

interface NavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const Navigation = ({ currentScreen, onNavigate }: NavigationProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Accueil', icon: Heart },
    { id: 'health-map', label: 'Centres', icon: MapPin },
    { id: 'adjoua-chat', label: 'Adjoua IA', icon: Bot, isCenter: true },
    { id: 'children', label: 'Enfants', icon: User },
    { id: 'health-record', label: 'Carnet', icon: Book },
  ];

  return (
    <div className="bottom-nav">
      <div className="flex justify-around items-center relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          if (item.isCenter) {
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="absolute left-1/2 transform -translate-x-1/2 -translate-y-6 bg-gradient-to-r from-violet-500 to-blue-500 p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
              >
                <Icon className="w-6 h-6 text-white" />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-gray-500 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Navigation;
