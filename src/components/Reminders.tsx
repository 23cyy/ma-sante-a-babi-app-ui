import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Plus, Bell, Pill, Syringe, Clock, Calendar, Trash2, Edit, X, Check } from "lucide-react";

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

interface RemindersProps {
  user: User;
  onBack: () => void;
}

const Reminders = ({ user, onBack }: RemindersProps) => {
  const { toast } = useToast();
  const [reminderType, setReminderType] = useState<string>("");
  const [reminderName, setReminderName] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("");
  const [reminderFrequency, setReminderFrequency] = useState<string>("");
  const [editingReminder, setEditingReminder] = useState<number | null>(null);
  const [deletingReminder, setDeletingReminder] = useState<number | null>(null);
  const [markingTaken, setMarkingTaken] = useState<number | null>(null);
  const [editType, setEditType] = useState<string>("");
  const [editName, setEditName] = useState<string>("");
  const [editTime, setEditTime] = useState<string>("");
  const [editFrequency, setEditFrequency] = useState<string>("");
  const [editDosage, setEditDosage] = useState<string>("");
  const [editEndDate, setEditEndDate] = useState<string>("");
  const [takenNotes, setTakenNotes] = useState<string>("");

  const activeReminders = [
    {
      id: 1,
      type: "medication",
      name: "Paracétamol 500mg",
      dosage: "1 comprimé",
      frequency: "Matin et soir",
      nextReminder: "2025-01-20 08:00",
      status: "Actif",
      endDate: "2025-01-25"
    },
    {
      id: 2,
      type: "medication",
      name: "Vitamine D",
      dosage: "1 goutte",
      frequency: "Quotidien",
      nextReminder: "2025-01-20 09:00",
      status: "Actif",
      endDate: "2025-03-15"
    },
    {
      id: 3,
      type: "vaccination",
      name: "Rappel DTC-Polio",
      dosage: "1 injection",
      frequency: "Unique",
      nextReminder: "2025-06-10 10:00",
      status: "Programmé",
      endDate: "2025-06-10"
    },
    {
      id: 4,
      type: "vaccination",
      name: "Vaccination Méningite",
      dosage: "1 injection",
      frequency: "Unique",
      nextReminder: "2025-02-15 14:00",
      status: "À venir",
      endDate: "2025-02-15"
    }
  ];

  const reminderTypes = [
    { value: "medication", label: "Médicament" },
    { value: "vaccination", label: "Vaccination" },
    { value: "checkup", label: "Contrôle médical" },
    { value: "exercise", label: "Exercice physique" }
  ];

  const frequencies = [
    "Quotidien",
    "Matin et soir",
    "3 fois par jour",
    "Hebdomadaire",
    "Mensuel",
    "Unique"
  ];

  const handleAddReminder = () => {
    toast({
      title: "Rappel ajouté",
      description: `Rappel "${reminderName}" ajouté avec succès pour ${reminderTime} (${reminderFrequency}) !`,
    });
    setReminderType("");
    setReminderName("");
    setReminderTime("");
    setReminderFrequency("");
  };

  const handleModifyReminder = (reminderId: number, reminderName: string) => {
    const reminder = activeReminders.find(r => r.id === reminderId);
    if (reminder) {
      setEditType(reminder.type);
      setEditName(reminder.name);
      setEditTime(reminder.nextReminder.split(' ')[1].substring(0, 5));
      setEditFrequency(reminder.frequency);
      setEditDosage(reminder.dosage);
      setEditEndDate(reminder.endDate);
      setEditingReminder(reminderId);
    }
  };

  const handleSaveModification = () => {
    toast({
      title: "Rappel modifié",
      description: `Le rappel "${editName}" a été modifié avec succès.`,
    });
    setEditingReminder(null);
    setEditType("");
    setEditName("");
    setEditTime("");
    setEditFrequency("");
    setEditDosage("");
    setEditEndDate("");
  };

  const handleMarkTaken = (reminderId: number, reminderName: string) => {
    setMarkingTaken(reminderId);
    setTakenNotes("");
  };

  const handleConfirmTaken = () => {
    const reminder = activeReminders.find(r => r.id === markingTaken);
    toast({
      title: "Prise confirmée",
      description: `"${reminder?.name}" marqué comme pris avec succès !`,
    });
    setMarkingTaken(null);
    setTakenNotes("");
  };

  const handleDeleteReminder = (reminderId: number, reminderName: string) => {
    setDeletingReminder(reminderId);
  };

  const handleConfirmDeletion = () => {
    const reminder = activeReminders.find(r => r.id === deletingReminder);
    toast({
      title: "Rappel supprimé",
      description: `Le rappel "${reminder?.name}" a été supprimé avec succès.`,
      variant: "destructive",
    });
    setDeletingReminder(null);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "medication":
        return <Pill className="w-4 h-4" />;
      case "vaccination":
        return <Syringe className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Actif":
        return "bg-green-100 text-green-800";
      case "Programmé":
        return "bg-blue-100 text-blue-800";
      case "À venir":
        return "bg-yellow-100 text-yellow-800";
      case "Terminé":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "medication":
        return "text-blue-600";
      case "vaccination":
        return "text-purple-600";
      default:
        return "text-gray-600";
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
            <h1 className="text-2xl font-bold text-gray-900">Rappels</h1>
            <p className="text-gray-600">Rappels de médicaments et vaccinations</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Ajouter un nouveau rappel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="w-5 h-5 text-yellow-500" />
              <span>Ajouter un nouveau rappel</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="type">Type de rappel</Label>
              <select
                id="type"
                value={reminderType}
                onChange={(e) => setReminderType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">Sélectionner le type</option>
                {reminderTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="name">Nom du médicament/vaccination</Label>
              <Input
                id="name"
                value={reminderName}
                onChange={(e) => setReminderName(e.target.value)}
                placeholder="Ex: Paracétamol 500mg, Vaccin DTC-Polio..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="time">Heure du rappel</Label>
                <Input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="frequency">Fréquence</Label>
                <select
                  id="frequency"
                  value={reminderFrequency}
                  onChange={(e) => setReminderFrequency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="">Sélectionner la fréquence</option>
                  {frequencies.map((freq, index) => (
                    <option key={index} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              onClick={handleAddReminder}
              disabled={!reminderType || !reminderName || !reminderTime || !reminderFrequency}
              className="w-full bg-yellow-500 hover:bg-yellow-600"
            >
              Ajouter le rappel
            </Button>
          </CardContent>
        </Card>

        {/* Rappels actifs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <span>Vos rappels actifs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeReminders.map((reminder) => (
                <div key={reminder.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={getTypeColor(reminder.type)}>
                          {getTypeIcon(reminder.type)}
                        </div>
                        <span className="font-medium text-gray-900">{reminder.name}</span>
                        <Badge className={getStatusColor(reminder.status)}>
                          {reminder.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <span>Dosage: {reminder.dosage}</span>
                        <span>•</span>
                        <span>Fréquence: {reminder.frequency}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>Prochain rappel: {new Date(reminder.nextReminder).toLocaleString('fr-FR')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4" />
                        <span>Fin: {new Date(reminder.endDate).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                      onClick={() => handleModifyReminder(reminder.id, reminder.name)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-green-600 border-green-200 hover:bg-green-50"
                      onClick={() => handleMarkTaken(reminder.id, reminder.name)}
                    >
                      Marquer pris
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleDeleteReminder(reminder.id, reminder.name)}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques du mois</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">95%</div>
                <div className="text-sm text-gray-600">Observance</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">28</div>
                <div className="text-sm text-gray-600">Prises réalisées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">2</div>
                <div className="text-sm text-gray-600">Prises manquées</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">1</div>
                <div className="text-sm text-gray-600">Vaccin à venir</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modal de modification */}
        {editingReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Edit className="w-5 h-5 text-yellow-500" />
                    <span>Modifier le rappel</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditingReminder(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="edit-type">Type de rappel</Label>
                  <select
                    id="edit-type"
                    value={editType}
                    onChange={(e) => setEditType(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  >
                    {reminderTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-name">Nom</Label>
                  <Input
                    id="edit-name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Nom du médicament/vaccination"
                  />
                </div>

                <div>
                  <Label htmlFor="edit-dosage">Dosage</Label>
                  <Input
                    id="edit-dosage"
                    value={editDosage}
                    onChange={(e) => setEditDosage(e.target.value)}
                    placeholder="Ex: 1 comprimé, 1 goutte, 1 injection"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-time">Heure</Label>
                    <Input
                      id="edit-time"
                      type="time"
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-frequency">Fréquence</Label>
                    <select
                      id="edit-frequency"
                      value={editFrequency}
                      onChange={(e) => setEditFrequency(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                    >
                      {frequencies.map((freq, index) => (
                        <option key={index} value={freq}>{freq}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="edit-end-date">Date de fin</Label>
                  <Input
                    id="edit-end-date"
                    type="date"
                    value={editEndDate}
                    onChange={(e) => setEditEndDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setEditingReminder(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600"
                    onClick={handleSaveModification}
                    disabled={!editType || !editName || !editTime || !editFrequency}
                  >
                    Sauvegarder
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal marquer comme pris */}
        {markingTaken && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Marquer comme pris</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMarkingTaken(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Confirmez-vous avoir pris ce médicament/vaccin ?
                </p>

                <div>
                  <Label htmlFor="taken-notes">Notes (optionnel)</Label>
                  <Input
                    id="taken-notes"
                    value={takenNotes}
                    onChange={(e) => setTakenNotes(e.target.value)}
                    placeholder="Ex: Pris avec de la nourriture, effets ressentis..."
                  />
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setMarkingTaken(null)}
                  >
                    Annuler
                  </Button>
                  <Button
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={handleConfirmTaken}
                  >
                    Confirmer la prise
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de suppression */}
        {deletingReminder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Trash2 className="w-5 h-5 text-red-500" />
                    <span>Supprimer le rappel</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeletingReminder(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Êtes-vous sûr de vouloir supprimer ce rappel ? Cette action est irréversible.
                </p>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    ⚠️ La suppression d'un rappel de médicament peut affecter votre traitement. Consultez votre médecin si nécessaire.
                  </p>
                </div>

                <div className="flex space-x-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setDeletingReminder(null)}
                  >
                    Garder le rappel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleConfirmDeletion}
                  >
                    Confirmer la suppression
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

export default Reminders;
