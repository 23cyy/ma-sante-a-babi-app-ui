
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Calendar, Heart, AlertCircle, X, User, Phone, MapPin } from "lucide-react";

interface ChildrenProps {
  onBack?: () => void;
}

const Children = ({ onBack }: ChildrenProps) => {
  const { toast } = useToast();
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showAddChildModal, setShowAddChildModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentChildId, setAppointmentChildId] = useState<number | null>(null);

  // Add child form states
  const [childName, setChildName] = useState("");
  const [childBirthDate, setChildBirthDate] = useState("");
  const [childBloodType, setChildBloodType] = useState("");
  const [childWeight, setChildWeight] = useState("");
  const [childHeight, setChildHeight] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");

  // Appointment form states
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [appointmentType, setAppointmentType] = useState("");
  const [appointmentDoctor, setAppointmentDoctor] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");

  const children = [
    {
      id: 1,
      name: "Koffi Diabaté",
      age: 3,
      birthDate: "2021-05-15",
      bloodType: "A+",
      weight: 14.5,
      height: 95,
      nextAppointment: "2025-01-20",
      appointmentType: "Vaccination ROR",
      vaccines: ["BCG", "DTC-Polio", "Hépatite B"],
      pendingVaccines: ["ROR", "Méningite"],
      avatar: "KD",
      bgColor: "bg-blue-500"
    },
    {
      id: 2,
      name: "Aminata Diabaté",
      age: 2,
      birthDate: "2022-08-22",
      bloodType: "O+",
      weight: 12.2,
      height: 87,
      nextAppointment: "2025-02-05",
      appointmentType: "Contrôle de croissance",
      vaccines: ["BCG", "DTC-Polio"],
      pendingVaccines: ["Hépatite B", "ROR"],
      avatar: "AD",
      bgColor: "bg-pink-500"
    }
  ];

  if (selectedChild !== null) {
    const child = children.find(c => c.id === selectedChild);
    if (!child) return null;

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="gradient-bg px-6 pt-12 pb-6">
          <div className="flex items-center space-x-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-2"
              onClick={() => setSelectedChild(null)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Profil de {child.name}</h1>
          </div>
        </div>

        <div className="px-6 -mt-2">
          {/* Child Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className={`w-16 h-16 ${child.bgColor}`}>
                  <AvatarFallback className="text-white font-bold text-xl">
                    {child.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900">{child.name}</h2>
                  <p className="text-gray-600">{child.age} ans • Né le {new Date(child.birthDate).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-primary">{child.bloodType}</div>
                  <div className="text-xs text-gray-600">Groupe sanguin</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-accent">{child.weight}kg</div>
                  <div className="text-xs text-gray-600">Poids</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-bold text-health-purple">{child.height}cm</div>
                  <div className="text-xs text-gray-600">Taille</div>
                </div>
              </div>

              {/* Next Appointment */}
              <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-5 h-5 text-accent" />
                  <span className="font-semibold text-accent">Prochain rendez-vous</span>
                </div>
                <p className="text-gray-900 font-medium">{child.appointmentType}</p>
                <p className="text-gray-600 text-sm">{new Date(child.nextAppointment).toLocaleDateString('fr-FR')} à 14h30</p>
              </div>
            </CardContent>
          </Card>

          {/* Vaccines Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-primary" />
                <span>État des vaccinations</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Vaccins à jour</h4>
                  <div className="flex flex-wrap gap-2">
                    {child.vaccines.map((vaccine) => (
                      <Badge key={vaccine} variant="default" className="bg-green-100 text-green-800">
                        ✓ {vaccine}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Vaccins en attente</h4>
                  <div className="flex flex-wrap gap-2">
                    {child.pendingVaccines.map((vaccine) => (
                      <Badge key={vaccine} variant="secondary" className="bg-amber-100 text-amber-800">
                        ⏳ {vaccine}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="h-12 bg-gray-400 cursor-not-allowed"
              disabled
            >
              <Calendar className="w-4 h-4 mr-2" />
              Prendre RDV
            </Button>
            <Button
              variant="outline"
              className="h-12 bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
              disabled
            >
              <Heart className="w-4 h-4 mr-2" />
              Carnet de santé
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Mes Enfants</h1>
          </div>
          <Button
            size="sm"
            className="bg-primary"
            onClick={() => {
              setShowAddChildModal(true);
              setChildName("");
              setChildBirthDate("");
              setChildBloodType("");
              setChildWeight("");
              setChildHeight("");
              setParentPhone("");
              setEmergencyContact("");
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <p className="text-gray-600">Gérez la santé de vos enfants</p>
      </div>

      <div className="px-6 -mt-2">
        <div className="space-y-4">
          {children.map((child) => (
            <Card
              key={child.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 border-0 shadow-sm"
              onClick={() => setSelectedChild(child.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className={`w-14 h-14 ${child.bgColor}`}>
                    <AvatarFallback className="text-white font-bold">
                      {child.avatar}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{child.name}</h3>
                    <p className="text-sm text-gray-600">
                      {child.age} ans • {child.bloodType} • {child.weight}kg
                    </p>

                    {/* Next Appointment Alert */}
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex items-center space-x-1 bg-accent/10 px-2 py-1 rounded-full">
                        <AlertCircle className="w-3 h-3 text-accent" />
                        <span className="text-xs text-accent font-medium">
                          {child.appointmentType}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(child.nextAppointment).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex space-x-1 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    </div>
                    <span className="text-xs text-gray-500">Vaccins</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Add Child Card */}
          <Card
            className="border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary transition-colors"
            onClick={() => {
              setShowAddChildModal(true);
              setChildName("");
              setChildBirthDate("");
              setChildBloodType("");
              setChildWeight("");
              setChildHeight("");
              setParentPhone("");
              setEmergencyContact("");
            }}
          >
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Ajouter un enfant</h3>
              <p className="text-sm text-gray-500">Créer un nouveau profil de santé</p>
            </CardContent>
          </Card>
        </div>

        {/* Modal d'ajout d'enfant */}
        {showAddChildModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5 text-primary" />
                    <span>Ajouter un enfant</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddChildModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="child-name">Nom complet de l'enfant *</Label>
                  <Input
                    id="child-name"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Ex: Koffi Diabaté"
                  />
                </div>

                <div>
                  <Label htmlFor="child-birth-date">Date de naissance *</Label>
                  <Input
                    id="child-birth-date"
                    type="date"
                    value={childBirthDate}
                    onChange={(e) => setChildBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="child-blood-type">Groupe sanguin</Label>
                    <select
                      id="child-blood-type"
                      value={childBloodType}
                      onChange={(e) => setChildBloodType(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Sélectionner</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="child-weight">Poids (kg)</Label>
                    <Input
                      id="child-weight"
                      type="number"
                      step="0.1"
                      value={childWeight}
                      onChange={(e) => setChildWeight(e.target.value)}
                      placeholder="Ex: 14.5"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="child-height">Taille (cm)</Label>
                  <Input
                    id="child-height"
                    type="number"
                    value={childHeight}
                    onChange={(e) => setChildHeight(e.target.value)}
                    placeholder="Ex: 95"
                  />
                </div>

                <div>
                  <Label htmlFor="parent-phone">Téléphone du parent *</Label>
                  <Input
                    id="parent-phone"
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="Ex: +225 07 12 34 56 78"
                  />
                </div>

                <div>
                  <Label htmlFor="emergency-contact">Contact d'urgence</Label>
                  <Input
                    id="emergency-contact"
                    type="tel"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="Ex: +225 05 98 76 54 32"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                  <p className="text-sm text-blue-800">
                    ℹ️ Les informations marquées d'un * sont obligatoires. Vous pourrez compléter le profil plus tard.
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddChildModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      toast({
                        title: "Enfant ajouté",
                        description: `Le profil de ${childName} a été créé avec succès !`,
                      });
                      setShowAddChildModal(false);
                    }}
                    disabled={!childName || !childBirthDate || !parentPhone}
                  >
                    Créer le profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de prise de rendez-vous */}
        {showAppointmentModal && appointmentChildId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>Prendre rendez-vous</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAppointmentModal(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Pour {children.find(c => c.id === appointmentChildId)?.name}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="appointment-type">Type de consultation *</Label>
                  <select
                    id="appointment-type"
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Sélectionner le type</option>
                    <option value="vaccination">Vaccination</option>
                    <option value="controle">Contrôle de croissance</option>
                    <option value="consultation">Consultation générale</option>
                    <option value="urgence">Consultation d'urgence</option>
                    <option value="specialiste">Consultation spécialisée</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointment-date">Date *</Label>
                    <Input
                      id="appointment-date"
                      type="date"
                      value={appointmentDate}
                      onChange={(e) => setAppointmentDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="appointment-time">Heure *</Label>
                    <select
                      id="appointment-time"
                      value={appointmentTime}
                      onChange={(e) => setAppointmentTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Choisir l'heure</option>
                      <option value="08:00">08:00</option>
                      <option value="09:00">09:00</option>
                      <option value="10:00">10:00</option>
                      <option value="11:00">11:00</option>
                      <option value="14:00">14:00</option>
                      <option value="15:00">15:00</option>
                      <option value="16:00">16:00</option>
                      <option value="17:00">17:00</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="appointment-doctor">Médecin préféré</Label>
                  <select
                    id="appointment-doctor"
                    value={appointmentDoctor}
                    onChange={(e) => setAppointmentDoctor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Aucune préférence</option>
                    <option value="Dr. Kouassi">Dr. Kouassi (Pédiatre)</option>
                    <option value="Dr. Bamba">Dr. Bamba (Généraliste)</option>
                    <option value="Dr. Traoré">Dr. Traoré (Pédiatre)</option>
                    <option value="Dr. Ouattara">Dr. Ouattara (Spécialiste)</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="appointment-notes">Notes ou symptômes</Label>
                  <Input
                    id="appointment-notes"
                    value={appointmentNotes}
                    onChange={(e) => setAppointmentNotes(e.target.value)}
                    placeholder="Décrivez les symptômes ou raisons de la consultation..."
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-md p-3">
                  <p className="text-sm text-green-800">
                    ✅ Vous recevrez une confirmation par SMS une fois le rendez-vous validé par le centre de santé.
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAppointmentModal(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={() => {
                      const childName = children.find(c => c.id === appointmentChildId)?.name;
                      toast({
                        title: "Rendez-vous demandé",
                        description: `Demande de rendez-vous pour ${childName} le ${new Date(appointmentDate).toLocaleDateString('fr-FR')} à ${appointmentTime}`,
                      });
                      setShowAppointmentModal(false);
                    }}
                    disabled={!appointmentType || !appointmentDate || !appointmentTime}
                  >
                    Confirmer le RDV
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Children;
