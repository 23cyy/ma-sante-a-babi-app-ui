import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Calendar, Clock, MapPin, User, X, Edit, Trash2 } from "lucide-react";

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

interface AppointmentsProps {
  user: User;
  onBack: () => void;
}

const Appointments = ({ user, onBack }: AppointmentsProps) => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("");
  const [editingAppointment, setEditingAppointment] = useState<number | null>(null);
  const [cancelingAppointment, setCancelingAppointment] = useState<number | null>(null);
  const [editDate, setEditDate] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editDoctor, setEditDoctor] = useState<string>("");
  const [editType, setEditType] = useState<string>("");
  const [cancelReason, setCancelReason] = useState<string>("");

  const upcomingAppointments = [
    {
      id: 1,
      date: "2025-01-25",
      time: "09:30",
      doctor: "Dr. Kouamé Assi",
      type: "Consultation générale",
      location: "CHU de Treichville",
      status: "Confirmé"
    },
    {
      id: 2,
      date: "2025-02-10",
      time: "14:00",
      doctor: "Dr. Adjoua N'Guessan",
      type: "Suivi gynécologique",
      location: "Clinique Sainte Anne-Marie",
      status: "En attente"
    },
    {
      id: 3,
      date: "2025-03-15",
      time: "11:15",
      doctor: "Dr. Koffi Yao",
      type: "Contrôle cardiologique",
      location: "Polyclinique Internationale",
      status: "Confirmé"
    }
  ];

  const availableDoctors = [
    "Dr. Kouamé Assi - Médecine générale",
    "Dr. Adjoua N'Guessan - Gynécologie",
    "Dr. Koffi Yao - Cardiologie",
    "Dr. Aya Traoré - Pédiatrie",
    "Dr. Mamadou Diallo - Dermatologie"
  ];

  const appointmentTypes = [
    "Consultation générale",
    "Suivi spécialisé",
    "Contrôle de routine",
    "Urgence",
    "Vaccination",
    "Bilan de santé"
  ];

  const handleBookAppointment = () => {
    // Logique de réservation
    toast({
      title: "Rendez-vous demandé",
      description: "Votre demande a été envoyée avec succès ! Vous recevrez une confirmation par SMS.",
    });
    setSelectedDate("");
    setSelectedTime("");
    setSelectedDoctor("");
    setAppointmentType("");
  };

  const handleModifyAppointment = (appointmentId: number) => {
    const appointment = upcomingAppointments.find(apt => apt.id === appointmentId);
    if (appointment) {
      setEditDate(appointment.date);
      setEditTime(appointment.time);
      setEditDoctor(appointment.doctor);
      setEditType(appointment.type);
      setEditingAppointment(appointmentId);
    }
  };

  const handleSaveModification = () => {
    toast({
      title: "Rendez-vous modifié",
      description: `Le rendez-vous #${editingAppointment} a été modifié avec succès.`,
    });
    setEditingAppointment(null);
    setEditDate("");
    setEditTime("");
    setEditDoctor("");
    setEditType("");
  };

  const handleCancelAppointment = (appointmentId: number) => {
    setCancelingAppointment(appointmentId);
    setCancelReason("");
  };

  const handleConfirmCancellation = () => {
    toast({
      title: "Rendez-vous annulé",
      description: `Le rendez-vous #${cancelingAppointment} a été annulé avec succès.`,
      variant: "destructive",
    });
    setCancelingAppointment(null);
    setCancelReason("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmé":
        return "bg-green-100 text-green-800";
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Annulé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Rendez-vous santé</h1>
            <p className="text-gray-600">Gérez vos rendez-vous médicaux</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Prendre un nouveau rendez-vous */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-orange-500" />
              <span>Prendre un nouveau rendez-vous</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date souhaitée</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Heure souhaitée</Label>
                <Input
                  id="time"
                  type="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="doctor">Médecin</Label>
              <select
                id="doctor"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionner un médecin</option>
                {availableDoctors.map((doctor, index) => (
                  <option key={index} value={doctor}>{doctor}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="type">Type de consultation</Label>
              <select
                id="type"
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Sélectionner le type</option>
                {appointmentTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || !selectedDoctor || !appointmentType}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Demander le rendez-vous
            </Button>
          </CardContent>
        </Card>

        {/* Rendez-vous à venir */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>Vos rendez-vous à venir</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {new Date(appointment.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                        <Clock className="w-4 h-4 text-gray-500 ml-4" />
                        <span className="text-gray-700">{appointment.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{appointment.doctor}</span>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-600 text-sm">{appointment.location}</span>
                      </div>
                      <p className="text-gray-600 text-sm">{appointment.type}</p>
                    </div>
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-orange-600 border-orange-200 hover:bg-orange-50"
                      onClick={() => handleModifyAppointment(appointment.id)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Annuler
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Modal de modification */}
        {editingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-orange-500" />
                    <span>Modifier le rendez-vous</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingAppointment(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-date">Nouvelle date</Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-time">Nouvelle heure</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-doctor">Médecin</Label>
                  <select
                    id="edit-doctor"
                    value={editDoctor}
                    onChange={(e) => setEditDoctor(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {availableDoctors.map((doctor, index) => (
                      <option key={index} value={doctor}>{doctor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-type">Type de consultation</Label>
                  <select
                    id="edit-type"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {appointmentTypes.map((type, index) => (
                      <option key={index} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingAppointment(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    onClick={handleSaveModification}
                    disabled={!editDate || !editTime || !editDoctor || !editType}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal d'annulation */}
        {cancelingAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span>Annuler le rendez-vous</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCancelingAppointment(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Êtes-vous sûr de vouloir annuler ce rendez-vous ? Cette action est irréversible.
                </p>

                <div>
                  <Label htmlFor="cancel-reason">Raison de l'annulation (optionnel)</Label>
                  <select
                    id="cancel-reason"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="">Sélectionner une raison</option>
                    <option value="Empêchement personnel">Empêchement personnel</option>
                    <option value="Problème de santé">Problème de santé</option>
                    <option value="Changement de médecin">Changement de médecin</option>
                    <option value="Report nécessaire">Report nécessaire</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setCancelingAppointment(null)}
                  >
                    Garder le RDV
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleConfirmCancellation}
                  >
                    Confirmer l'annulation
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

export default Appointments;
