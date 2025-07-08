
import { Heart, Users, MapPin, Droplets, Calendar, QrCode, Bot, Bell, Book, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useScreenSize } from "@/hooks/useScreenSize";
import { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
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

interface DashboardProps {
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
  onNavigate: (screen: string) => void;
  onLogout: () => void;
}

const Dashboard = ({ user, onNavigate, onLogout }: DashboardProps) => {
  const { isDesktop } = useScreenSize();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutDialogOpen(false);
    setIsProfileOpen(false);
    onLogout();
  };

  const quickActions = [
    { id: 'health-record', title: 'Mon carnet de santé', icon: Book, color: 'bg-blue-500', desc: 'Consultez votre dossier médical' },
    { id: 'children', title: 'Gestion des enfants', icon: Users, color: 'bg-green-500', desc: 'Suivez la santé de vos enfants' },
    { id: 'health-map', title: 'Centres de santé', icon: Plus, color: 'bg-purple-500', desc: 'Trouvez les centres près de vous' },
    { id: 'blood-compatibility', title: 'Compatibilité sanguine', icon: Droplets, color: 'bg-red-500', desc: 'Vérifiez la compatibilité' },
    { id: 'appointments', title: 'Rendez-vous santé', icon: Calendar, color: 'bg-orange-500', desc: 'Prendre et gérer vos rendez-vous médicaux' },
    { id: 'qr-health', title: 'QR Fiche Santé', icon: QrCode, color: 'bg-indigo-500', desc: 'Partagez votre fiche santé' },
    { id: 'adjoua-chat', title: 'Adjoua IA', icon: Bot, color: 'bg-gradient-to-r from-violet-500 to-blue-500', desc: 'Assistant santé intelligent' },
    { id: 'reminders', title: 'Rappels', icon: Bell, color: 'bg-yellow-500', desc: 'Rappels de médicaments et vaccinations' },
  ];

  return (
    <div className={`${isDesktop ? '' : 'pb-20'}`}>
      {/* Header mobile uniquement */}
      {!isDesktop && (
        <div className="bg-white border-b border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Salut {user.firstName} ! 👋
              </h1>
              <p className="text-gray-600">Comment allez-vous aujourd'hui ?</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
              >
                <span className="text-white font-semibold text-sm">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer profil mobile */}
      <Drawer open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-lg">
                  {user.firstName[0]}{user.lastName[0]}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-600">Groupe sanguin {user.bloodType}</p>
              </div>
            </DrawerTitle>
          </DrawerHeader>

          <div className="px-4 py-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Email</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Téléphone</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Poids</span>
                <span className="font-medium">{user.weight} kg</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Taille</span>
                <span className="font-medium">{user.height} cm</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Enfants</span>
                <span className="font-medium">{user.childrenCount}</span>
              </div>
            </div>
          </div>

          <DrawerFooter>
            <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
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
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Header desktop */}
      {isDesktop && (
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Salut {user.firstName} ! 👋
          </h1>
          <p className="text-gray-600">Comment allez-vous aujourd'hui ?</p>
        </div>
      )}

      {/* Résumé santé */}
      <div className={`${isDesktop ? 'mb-8' : 'p-6'}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Votre résumé santé</h2>
        <div className={`grid ${isDesktop ? 'grid-cols-4' : 'grid-cols-3'} gap-4`}>
          <Card>
            <CardContent className="p-4 text-center">
              <Droplets className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Groupe sanguin</p>
              <p className="text-xl font-bold text-gray-900">{user.bloodType}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">kg</span>
              </div>
              <p className="text-sm text-gray-600">Poids</p>
              <p className="text-xl font-bold text-gray-900">{user.weight} kg</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-sm font-bold">cm</span>
              </div>
              <p className="text-sm text-gray-600">Taille</p>
              <p className="text-xl font-bold text-gray-900">{user.height} cm</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Enfants</p>
              <p className="text-xl font-bold text-gray-900">{user.childrenCount}</p>
            </CardContent>
          </Card>
          {isDesktop && (
            <Card>
              <CardContent className="p-4 text-center">
                <Heart className="w-8 h-8 text-pink-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">État</p>
                <p className="text-xl font-bold text-green-600">Bon</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className={`${isDesktop ? '' : 'px-6'}`}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className={`grid ${isDesktop ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.id}
                className="cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg"
                onClick={() => onNavigate(action.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{action.title}</h3>
                  {isDesktop && (
                    <p className="text-xs text-gray-600">{action.desc}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Statistiques additionnelles pour desktop */}
      {isDesktop && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h2>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Dernières consultations</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Consultation générale</span>
                    <span className="text-sm text-gray-500">Il y a 2 semaines</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contrôle de routine</span>
                    <span className="text-sm text-gray-500">Il y a 1 mois</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Prochains rappels</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Vaccination COVID-19</span>
                    <span className="text-sm text-orange-600">Dans 3 jours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contrôle enfant</span>
                    <span className="text-sm text-blue-600">Dans 1 semaine</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
