
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Heart, MapPin, Clock, AlertTriangle, Phone, PhoneCall } from "lucide-react";
import { BloodCompatibilityService } from "@/services/bloodCompatibilityService";

interface BloodCompatibilityProps {
  onBack?: () => void;
}

const BloodCompatibility = ({ onBack }: BloodCompatibilityProps) => {
  const { toast } = useToast();
  const [selectedBloodType, setSelectedBloodType] = useState<string | null>(null);
  const [bloodTypes, setBloodTypes] = useState<Array<{ type: string; emoji: string; universal: string | null; percentage: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBloodData = async () => {
      try {
        await BloodCompatibilityService.loadBloodData();
        const allBloodTypes = BloodCompatibilityService.getAllBloodTypes();
        
        const formattedBloodTypes = allBloodTypes.map(bloodData => ({
          type: bloodData.groupeSanguin,
          emoji: BloodCompatibilityService.getBloodTypeEmoji(bloodData.groupeSanguin),
          universal: bloodData.statutSpecial ? 
            (bloodData.statutSpecial.toLowerCase().includes('donneur') ? 'donneur' : 
             bloodData.statutSpecial.toLowerCase().includes('receveur') ? 'receveur' : null) : null,
          percentage: bloodData.pourcentagePopulation
        }));
        
        setBloodTypes(formattedBloodTypes);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de charger les données de compatibilité sanguine",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadBloodData();
  }, [toast]);

  const donationCenters = [
    {
      name: "Centre National de Transfusion Sanguine",
      address: "Treichville, Abidjan",
      phone: "+225 21 24 76 40",
      hours: "Lun-Ven: 07h30-16h30",
      services: ["Don de sang", "Tests sanguins", "Conseil"]
    },
    {
      name: "Banque de Sang CHU Treichville",
      address: "CHU Treichville, Abidjan",
      phone: "+225 21 24 42 00",
      hours: "24h/24 (Urgences)",
      services: ["Don d'urgence", "Réserve familiale"]
    },
    {
      name: "Croix-Rouge Côte d'Ivoire",
      address: "Plateau, Abidjan",
      phone: "+225 20 32 13 24",
      hours: "Lun-Sam: 08h00-17h00",
      services: ["Campagnes de don", "Sensibilisation"]
    }
  ];

  const handleCallCenter = (centerName: string, phone: string) => {
    // Simuler un appel téléphonique
    window.open(`tel:${phone}`, '_self');
    toast({
      title: "Appel en cours",
      description: `Appel vers ${centerName} (${phone})`,
    });
  };

  const handleLocateCenter = (centerName: string, address: string) => {
    // Ouvrir Google Maps avec l'adresse du centre
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    toast({
      title: "Localisation ouverte",
      description: `Position de ${centerName} ouverte dans Google Maps`,
    });
  };

  const handleEmergencyCall = () => {
    // Appel d'urgence vers le 185 (numéro d'urgence en Côte d'Ivoire)
    window.open('tel:185', '_self');
    toast({
      title: "Appel d'urgence",
      description: "Appel vers le 185 - Services d'urgence",
      variant: "destructive",
    });
  };

  const getCompatibilityInfo = (bloodType: string) => {
    return BloodCompatibilityService.getCompatibilityInfo(bloodType);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Compatibilité Sanguine</h1>
        </div>
        <p className="text-gray-600">Découvrez les compatibilités de don et de réception</p>
      </div>

      <div className="px-6 -mt-2">
        {/* Blood Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span>Sélectionnez votre groupe sanguin</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                <p className="text-gray-600 mt-2">Chargement des données...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                 {bloodTypes.map((blood) => (
                   <Button
                     key={blood.type}
                     variant={selectedBloodType === blood.type ? "default" : "outline"}
                     onClick={() => setSelectedBloodType(blood.type)}
                     className={`h-auto min-h-[100px] flex-col justify-center space-y-1 p-3 ${
                       selectedBloodType === blood.type ? 'bg-red-500 hover:bg-red-600' : ''
                     }`}
                   >
                     <span className="text-2xl mb-1">{blood.emoji}</span>
                     <span className="text-sm font-bold">{blood.type}</span>
                     <span className="text-xs text-gray-500 font-medium">{blood.percentage}</span>
                     {blood.universal && (
                       <Badge 
                         variant="secondary" 
                         className={`text-xs px-2 py-1 mt-1 text-center ${
                           selectedBloodType === blood.type ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
                         }`}
                       >
                         {blood.universal === "donneur" ? "Donneur universel" : "Receveur universel"}
                       </Badge>
                     )}
                   </Button>
                 ))}
               </div>
            )}
          </CardContent>
        </Card>

        {/* Compatibility Results */}
        {selectedBloodType && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                Compatibilité pour le groupe {selectedBloodType}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  Peut donner à :
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getCompatibilityInfo(selectedBloodType).canGiveTo.map((type) => (
                    <Badge key={type} variant="outline" className="border-green-500 text-green-700">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-blue-700 mb-2 flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                  Peut recevoir de :
                </h4>
                <div className="flex flex-wrap gap-2">
                  {getCompatibilityInfo(selectedBloodType).canReceiveFrom.map((type) => (
                    <Badge key={type} variant="outline" className="border-blue-500 text-blue-700">
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Donation Tips */}
        <Card className="mb-6 border-l-4 border-l-accent">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 text-accent mr-2" />
              Conditions pour donner son sang
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Être âgé de 18 à 65 ans</li>
              <li>• Peser au moins 50 kg</li>
              <li>• Être en bonne santé</li>
              <li>• Ne pas avoir donné dans les 8 dernières semaines</li>
              <li>• Avoir jeûné 4h avant le don</li>
            </ul>
          </CardContent>
        </Card>

        {/* Donation Centers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Centres de don de sang</h2>

          {donationCenters.map((center, index) => (
            <Card key={index} className="shadow-sm border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{center.name}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.address}</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{center.hours}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((service) => (
                      <Badge key={service} variant="secondary" className="text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCallCenter(center.name, center.phone)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">Appeler</span>
                  </Button>
                  <Button
                    size="sm"
                    className="bg-red-500 hover:bg-red-600 flex-1"
                    onClick={() => handleLocateCenter(center.name, center.address)}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Localiser
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Emergency Alert */}
        <Card className="mt-6 bg-red-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-2">🚨</div>
            <h3 className="font-semibold text-red-800 mb-2">Besoin urgent de sang ?</h3>
            <p className="text-sm text-red-700 mb-3">
              Contactez immédiatement le Centre National de Transfusion Sanguine
            </p>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleEmergencyCall}
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Appel d'urgence 185
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BloodCompatibility;
