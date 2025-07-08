import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Calendar, Pill, AlertTriangle, Phone, Heart, Edit, Save, X } from "lucide-react";

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

interface HealthRecordProps {
  user: User;
  onBack?: () => void;
}

const HealthRecord = ({ user, onBack }: HealthRecordProps) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isEditingCritical, setIsEditingCritical] = useState(false);
  const [editedCriticalInfo, setEditedCriticalInfo] = useState({
    allergies: "Pénicilline, Arachides",
    emergencyContact: "Marie Diabaté",
    emergencyPhone: "+225 07 12 34 56 78"
  });
  const { toast } = useToast();

  const vaccinations = [
    { name: "BCG", date: "2020-03-15", status: "Complété", nextDue: null },
    { name: "DTC-Polio", date: "2023-06-10", status: "Complété", nextDue: "2025-06-10" },
    { name: "Fièvre Jaune", date: "2022-01-20", status: "Complété", nextDue: "2032-01-20" },
    { name: "Méningite", date: null, status: "À venir", nextDue: "2025-02-15" }
  ];

  const medications = [
    { name: "Paracétamol 500mg", dosage: "1 comprimé matin et soir", status: "Actif", endDate: "2025-01-20" },
    { name: "Vitamine D", dosage: "1 goutte par jour", status: "Actif", endDate: "2025-03-15" },
    { name: "Fer", dosage: "1 comprimé le matin", status: "Terminé", endDate: "2024-12-20" }
  ];

  const consultations = [
    { date: "2024-12-15", doctor: "Dr. Kouamé Assi", type: "Consultation générale", notes: "Tout va bien, prochain RDV dans 3 mois" },
    { date: "2024-09-10", doctor: "Dr. Adjoua N'Guessan", type: "Gynécologie", notes: "Suivi de grossesse normal" },
    { date: "2024-06-05", doctor: "Dr. Koffi Yao", type: "Cardiologie", notes: "Tension artérielle normale" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Mon Carnet de Santé</h1>
        </div>
      </div>

      <div className="px-6 -mt-2">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="vaccinations">Vaccins</TabsTrigger>
            <TabsTrigger value="medications">Médocs</TabsTrigger>
            <TabsTrigger value="consultations">Visites</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Informations personnelles</span>
                  <Button
                    variant={isEditing ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isEditing) {
                        setEditedUser(user); // Reset changes
                        setIsEditing(false);
                      } else {
                        setIsEditing(true);
                      }
                    }}
                  >
                    {isEditing ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prénom</Label>
                    <Input 
                      value={isEditing ? editedUser.firstName : user.firstName} 
                      readOnly={!isEditing} 
                      className={isEditing ? "" : "bg-gray-50"}
                      onChange={(e) => setEditedUser({...editedUser, firstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Nom</Label>
                    <Input 
                      value={isEditing ? editedUser.lastName : user.lastName} 
                      readOnly={!isEditing} 
                      className={isEditing ? "" : "bg-gray-50"}
                      onChange={(e) => setEditedUser({...editedUser, lastName: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Email</Label>
                  <Input 
                    value={isEditing ? editedUser.email : user.email} 
                    readOnly={!isEditing} 
                    className={isEditing ? "" : "bg-gray-50"}
                    onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Téléphone</Label>
                  <Input 
                    value={isEditing ? editedUser.phone : user.phone} 
                    readOnly={!isEditing} 
                    className={isEditing ? "" : "bg-gray-50"}
                    onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Groupe sanguin</Label>
                    <Input 
                      value={isEditing ? editedUser.bloodType : user.bloodType} 
                      readOnly={!isEditing} 
                      className={isEditing ? "" : "bg-gray-50"}
                      onChange={(e) => setEditedUser({...editedUser, bloodType: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Poids (kg)</Label>
                    <Input 
                      value={isEditing ? editedUser.weight.toString() : user.weight.toString()} 
                      readOnly={!isEditing} 
                      className={isEditing ? "" : "bg-gray-50"}
                      type="number"
                      onChange={(e) => setEditedUser({...editedUser, weight: parseFloat(e.target.value) || 0})}
                    />
                  </div>
                </div>
                <div>
                  <Label>Taille (cm)</Label>
                  <Input 
                    value={isEditing ? editedUser.height.toString() : user.height.toString()} 
                    readOnly={!isEditing} 
                    className={isEditing ? "" : "bg-gray-50"}
                    type="number"
                    onChange={(e) => setEditedUser({...editedUser, height: parseFloat(e.target.value) || 0})}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => {
                        // Ici vous pourriez ajouter la logique pour sauvegarder en base de données
                        setIsEditing(false);
                        toast({
                          title: "Profil mis à jour",
                          description: "Vos informations personnelles ont été sauvegardées avec succès.",
                        });
                      }}
                      className="bg-primary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Informations médicales critiques */}
            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-red-700">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Informations critiques</span>
                  </div>
                  <Button
                    variant={isEditingCritical ? "destructive" : "outline"}
                    size="sm"
                    onClick={() => {
                      if (isEditingCritical) {
                        setEditedCriticalInfo({
                          allergies: "Pénicilline, Arachides",
                          emergencyContact: "Marie Diabaté",
                          emergencyPhone: "+225 07 12 34 56 78"
                        });
                        setIsEditingCritical(false);
                      } else {
                        setIsEditingCritical(true);
                      }
                    }}
                  >
                    {isEditingCritical ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </>
                    ) : (
                      <>
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-red-600 font-semibold">Allergies</Label>
                  {isEditingCritical ? (
                    <div className="mt-2">
                      <Input
                        value={editedCriticalInfo.allergies}
                        onChange={(e) => setEditedCriticalInfo({...editedCriticalInfo, allergies: e.target.value})}
                        placeholder="Ex: Pénicilline, Arachides, Latex..."
                        className="border-red-300 focus:border-red-500"
                      />
                      <p className="text-xs text-red-600 mt-1">⚠️ Séparez les allergies par des virgules</p>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">CRITIQUE</span>
                        <span className="text-red-800 font-medium">{editedCriticalInfo.allergies}</span>
                      </div>
                      <p className="text-xs text-red-600">⚠️ Informer immédiatement tout professionnel de santé</p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-red-600 font-semibold">Contact d'urgence</Label>
                  {isEditingCritical ? (
                    <div className="mt-2 space-y-2">
                      <Input
                        value={editedCriticalInfo.emergencyContact}
                        onChange={(e) => setEditedCriticalInfo({...editedCriticalInfo, emergencyContact: e.target.value})}
                        placeholder="Nom du contact d'urgence"
                        className="border-red-300 focus:border-red-500"
                      />
                      <Input
                        value={editedCriticalInfo.emergencyPhone}
                        onChange={(e) => setEditedCriticalInfo({...editedCriticalInfo, emergencyPhone: e.target.value})}
                        placeholder="Numéro de téléphone"
                        type="tel"
                        className="border-red-300 focus:border-red-500"
                      />
                    </div>
                  ) : (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <Phone className="w-4 h-4 text-red-600" />
                        <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold">CRITIQUE</span>
                      </div>
                      <p className="text-red-800 font-medium">{editedCriticalInfo.emergencyContact}</p>
                      <p className="text-red-700 text-sm">{editedCriticalInfo.emergencyPhone}</p>
                    </div>
                  )}
                </div>
                
                {isEditingCritical && (
                  <div className="flex justify-end pt-4">
                    <Button 
                      onClick={() => {
                        setIsEditingCritical(false);
                        toast({
                          title: "Informations critiques mises à jour",
                          description: "Les informations critiques ont été sauvegardées avec succès.",
                        });
                      }}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Conditions médicales */}
            <Card className="border-orange-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-orange-700">
                  <Heart className="w-5 h-5" />
                  <span>Conditions médicales</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">SUIVI</span>
                    <span className="text-orange-800 font-medium">Hypertension légère</span>
                  </div>
                  <p className="text-xs text-orange-600">Surveillance régulière recommandée</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccinations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mes Vaccinations</h3>
            </div>

            <div className="space-y-3">
              {vaccinations.map((vaccine, index) => (
                <Card key={index} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{vaccine.name}</h4>
                      <Badge variant={vaccine.status === "Complété" ? "default" : "secondary"}>
                        {vaccine.status}
                      </Badge>
                    </div>
                    {vaccine.date && (
                      <p className="text-sm text-gray-600 mb-1">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Fait le {new Date(vaccine.date).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                    {vaccine.nextDue && (
                      <p className="text-sm text-accent font-medium">
                        Prochain rappel : {new Date(vaccine.nextDue).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="medications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mes Médicaments</h3>
            </div>

            <div className="space-y-3">
              {medications.map((med, index) => (
                <Card key={index} className={`border-l-4 ${med.status === 'Actif' ? 'border-l-green-500' : 'border-l-gray-400'}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{med.name}</h4>
                      <Badge variant={med.status === "Actif" ? "default" : "secondary"}>
                        {med.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <Pill className="w-4 h-4 inline mr-1" />
                      {med.dosage}
                    </p>
                    <p className="text-sm text-gray-500">
                      Jusqu'au {new Date(med.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="consultations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Mes Consultations</h3>
            </div>

            <div className="space-y-3">
              {consultations.map((consultation, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{consultation.type}</h4>
                        <p className="text-sm text-primary font-medium">{consultation.doctor}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(consultation.date).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                      {consultation.notes}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthRecord;
