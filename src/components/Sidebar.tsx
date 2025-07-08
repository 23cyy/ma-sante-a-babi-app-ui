
import { Heart, MapPin, Calendar, MessageCircle, User, LogOut, Bell, QrCode, Droplets, Bot, Book, ChartAreaIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bloodType: string;
    weight: number;
    height: number;
    childrenCount: number;
  };
  onLogout: () => void;
}

const Sidebar = ({ currentScreen, onNavigate, user, onLogout }: SidebarProps) => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    onLogout();
  };

  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: ChartAreaIcon },
    { id: 'health-record', label: 'Carnet de santé', icon: Book },
    { id: 'children', label: 'Mes enfants', icon: User },
    { id: 'health-map', label: 'Centres de santé', icon: MapPin },
    { id: 'appointments', label: 'Rendez-vous santé', icon: Calendar },
    { id: 'reminders', label: 'Rappels', icon: Bell },
    { id: 'qr-health', label: 'QR Fiche Santé', icon: QrCode },
    { id: 'blood-compatibility', label: 'Compatibilité', icon: Droplets },
    { id: 'adjoua-chat', label: 'Adjoua IA', icon: Bot },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-50">
      {/* Logo et titre */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/assets/images/Logo_App.png"
              alt="Ma Santé à Babi Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ma Santé</h1>
            <p className="text-sm text-gray-500">à Babi</p>
          </div>
        </div>
      </div>

      {/* Profil utilisateur */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-lg">
              {user.firstName[0]}{user.lastName[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 truncate">
              Groupe {user.bloodType}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 text-left rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bouton de déconnexion */}
      <div className="p-4 border-t border-gray-100">
        <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmer la déconnexion</AlertDialogTitle>
              <AlertDialogDescription>
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLogoutConfirm}
                className="bg-red-600 hover:bg-red-700"
              >
                Se déconnecter
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Sidebar;
