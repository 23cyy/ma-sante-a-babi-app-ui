import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, QrCode, Download, Share2, Eye, EyeOff, Shield, Smartphone, Copy } from "lucide-react";
import { PDFGeneratorService } from "@/services/pdfGeneratorService";

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

interface QRHealthProps {
  user: User;
  onBack: () => void;
}

const QRHealth = ({ user, onBack }: QRHealthProps) => {
  const { toast } = useToast();
  const [isQRVisible, setIsQRVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<string[]>([
    "bloodType",
    "allergies",
    "emergencyContact"
  ]);

  // Données de santé d'urgence
  const emergencyData = {
    bloodType: user.bloodType,
    allergies: ["Pénicilline", "Arachides"],
    medications: ["Paracétamol 500mg", "Vitamine D"],
    emergencyContact: {
      name: "Marie Diabaté",
      relation: "Épouse",
      phone: "+225 07 12 34 56 78"
    },
    medicalConditions: ["Hypertension légère"],
    lastUpdate: "2025-01-15"
  };

  const availableInfo = [
    { id: "bloodType", label: "Groupe sanguin", value: user.bloodType, critical: true },
    { id: "allergies", label: "Allergies", value: emergencyData.allergies.join(", "), critical: true },
    { id: "medications", label: "Médicaments actuels", value: emergencyData.medications.join(", "), critical: false },
    { id: "emergencyContact", label: "Contact d'urgence", value: `${emergencyData.emergencyContact.name} (${emergencyData.emergencyContact.phone})`, critical: true },
    { id: "medicalConditions", label: "Conditions médicales", value: emergencyData.medicalConditions.join(", "), critical: false },
    { id: "weight", label: "Poids", value: `${user.weight} kg`, critical: false },
    { id: "height", label: "Taille", value: `${user.height} cm`, critical: false }
  ];

  const handleInfoToggle = (infoId: string) => {
    setSelectedInfo(prev =>
      prev.includes(infoId)
        ? prev.filter(id => id !== infoId)
        : [...prev, infoId]
    );
  };

  const generateQRData = () => {
    const selectedData = availableInfo
      .filter(info => selectedInfo.includes(info.id))
      .reduce((acc, info) => {
        acc[info.id] = info.value;
        return acc;
      }, {} as Record<string, string>);

    return {
      name: `${user.firstName} ${user.lastName}`,
      ...selectedData,
      lastUpdate: emergencyData.lastUpdate,
      emergencyApp: "Ma Santé à Babi"
    };
  };

  const handleShare = async () => {
    // Génération d'un lien expirable simulé
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 24); // Expire dans 24h
    const shareableLink = `https://ma-sante-babi.ci/share/${Math.random().toString(36).substring(2, 15)}`;

    try {
      await navigator.clipboard.writeText(shareableLink);
      toast({
        title: "Lien partageable copié",
        description: `Un lien expirable a été copié dans le presse-papiers. Expire le ${expirationDate.toLocaleDateString('fr-FR')} à ${expirationDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    try {
      const qrData = generateQRData();
      PDFGeneratorService.generateHealthCardPDF(qrData);
      toast({
        title: "Fiche téléchargée",
        description: "Votre fiche de santé PDF a été téléchargée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur de téléchargement",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  // Simulation d'un QR Code (en réalité, vous utiliseriez une bibliothèque comme qrcode)
  const QRCodePlaceholder = () => (
    <div className="w-64 h-64 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center mx-auto">
      <div className="text-center">
        <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">QR Code généré</p>
        <p className="text-xs text-gray-400 mt-1">
          {selectedInfo.length} informations incluses
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
              <h1 className="text-2xl font-bold text-gray-900">QR Fiche Santé</h1>
               <p className="text-gray-600">Partagez votre fiche santé d'urgence</p>
            </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Informations de sécurité */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900 mb-1">Sécurité et confidentialité</h3>
                <p className="text-sm text-blue-700">
                  Votre QR code contient uniquement les informations que vous sélectionnez.
                  Il est recommandé de n'inclure que les données essentielles en cas d'urgence.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sélection des informations */}
        <Card>
          <CardHeader>
            <CardTitle>Informations à inclure dans le QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {availableInfo.map((info) => (
                <div key={info.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{info.label}</span>
                      {info.critical && (
                        <Badge variant="destructive" className="text-xs">
                          Critique
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{info.value}</p>
                  </div>
                  <Button
                    variant={selectedInfo.includes(info.id) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInfoToggle(info.id)}
                    className={selectedInfo.includes(info.id) ? "bg-indigo-500 hover:bg-indigo-600" : ""}
                  >
                    {selectedInfo.includes(info.id) ? "Inclus" : "Ajouter"}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Génération du QR Code */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Votre QR Code Santé</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQRVisible(!isQRVisible)}
                className="flex items-center space-x-2"
              >
                {isQRVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{isQRVisible ? "Masquer" : "Afficher"}</span>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedInfo.length === 0 ? (
              <div className="text-center py-8">
                <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Sélectionnez au moins une information pour générer le QR Code</p>
              </div>
            ) : (
              <div className="space-y-6">
                {isQRVisible ? (
                  <QRCodePlaceholder />
                ) : (
                  <div className="w-64 h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mx-auto">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Cliquez sur "Afficher" pour voir le QR Code</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    onClick={handleShare}
                    className="flex items-center space-x-2 bg-indigo-500 hover:bg-indigo-600"
                    disabled={!isQRVisible}
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </Button>
                  <Button
                    onClick={handleDownload}
                    variant="outline"
                    className="flex items-center space-x-2"
                    disabled={selectedInfo.length === 0}
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger PDF</span>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions d'utilisation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-green-500" />
              <span>Comment utiliser votre QR Code</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <p>Enregistrez le QR Code sur votre téléphone ou imprimez-le</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <p>Gardez-le accessible (portefeuille, trousseau de clés, etc.)</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <p>En cas d'urgence, les secours peuvent scanner le code pour accéder à vos informations vitales</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QRHealth;
