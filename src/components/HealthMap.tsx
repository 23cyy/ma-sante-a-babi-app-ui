
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, MapPin, Search, Navigation, AlertTriangle, AlertCircle, Loader2, Bell, Hospital, Building2, Pill } from "lucide-react";
import healthCentersService, { HealthCenter } from "@/services/healthCentersService";

interface HealthMapProps {
  onBack?: () => void;
}

const HealthMap = ({ onBack }: HealthMapProps) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [filteredCenters, setFilteredCenters] = useState<HealthCenter[]>([]);

  // Fonction simplifiée pour obtenir la position actuelle
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Géolocalisation non supportée');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLocation);
        setLocationError(null);
        setIsLoadingLocation(false);
        console.log('Position obtenue:', newLocation);
      },
      (error) => {
        console.error('Erreur géolocalisation:', error);
        setLocationError('Impossible d\'obtenir votre position. Vous pouvez saisir votre ville manuellement.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 600000 // 10 minutes
      }
    );
  };



  // Fonction pour rechercher les coordonnées d'une ville
  const searchCityCoordinates = async (cityName: string): Promise<{lat: number, lng: number} | null> => {
    // Base de données simplifiée des principales villes de Côte d'Ivoire
    const ivorianCities: Record<string, {lat: number, lng: number}> = {
      'abidjan': { lat: 5.3600, lng: -4.0083 },
      'bouake': { lat: 7.6906, lng: -5.0300 },
      'daloa': { lat: 6.8775, lng: -6.4503 },
      'yamoussoukro': { lat: 6.8276, lng: -5.2893 },
      'san-pedro': { lat: 4.7467, lng: -6.6364 },
      'korhogo': { lat: 9.4580, lng: -5.6300 },
      'man': { lat: 7.4125, lng: -7.5544 },
      'divo': { lat: 5.8372, lng: -5.3572 },
      'gagnoa': { lat: 6.1319, lng: -5.9506 },
      'abengourou': { lat: 6.7297, lng: -3.4969 }
    };

    const normalizedCity = cityName.toLowerCase().trim();

    // Recherche directe
    if (ivorianCities[normalizedCity]) {
      return ivorianCities[normalizedCity];
    }

    // Recherche partielle
    for (const [city, coords] of Object.entries(ivorianCities)) {
      if (city.includes(normalizedCity) || normalizedCity.includes(city)) {
        return coords;
      }
    }

    return null;
  };

  // Fonction pour ouvrir Google Maps avec itinéraire
  const openGoogleMapsDirections = (healthCenter: HealthCenter) => {
    if (!userLocation) {
      toast({
        title: "Géolocalisation requise",
        description: "Veuillez d'abord activer votre géolocalisation pour obtenir un itinéraire.",
        variant: "destructive"
      });
      return;
    }

    // Extraire les coordonnées du centre de santé depuis la géométrie
    let destinationLat: number;
    let destinationLng: number;

    try {
      // Parser la géométrie JSON
      const geometry = JSON.parse(healthCenter.geometry);
      if (geometry.type === 'Point' && geometry.coordinates && geometry.coordinates.length === 2) {
        destinationLng = geometry.coordinates[0];
        destinationLat = geometry.coordinates[1];
      } else {
        throw new Error('Format de géométrie non supporté');
      }
    } catch (error) {
      console.error('Erreur parsing géométrie:', error, 'Géométrie:', healthCenter.geometry);
      toast({
        title: "Erreur",
        description: "Impossible d'extraire les coordonnées de ce centre de santé.",
        variant: "destructive"
      });
      return;
    }

    // Construire l'URL Google Maps avec itinéraire
    const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${destinationLat},${destinationLng}`;

    // Ouvrir dans un nouvel onglet
    window.open(googleMapsUrl, '_blank');

    toast({
      title: "Itinéraire ouvert",
      description: "L'itinéraire s'ouvre dans Google Maps."
    });
  };



  // Fonction pour gérer la soumission de ville manuelle
  const handleCitySubmit = async () => {
    if (!manualCity.trim()) return;

    setIsSearchingCity(true);
    setLocationError(null);

    try {
      const coordinates = await searchCityCoordinates(manualCity);
      if (coordinates) {
        setUserLocation(coordinates);
        setManualCity('');
        setLocationError(null);
      } else {
        setLocationError(`Ville "${manualCity}" non trouvée. Essayez: Abidjan, Bouaké, Daloa, etc.`);
      }
    } catch (error) {
      setLocationError('Erreur lors de la recherche de la ville');
    } finally {
      setIsSearchingCity(false);
    }
  };

  // Charger les centres de santé
  useEffect(() => {
    const loadCenters = async () => {
      try {
        setIsLoadingCenters(true);
        setLoadingError(null);
        const centers = await healthCentersService.loadHealthCenters();
        setHealthCenters(centers);
        console.log('Centres de santé chargés:', centers.length);
      } catch (error) {
        console.error('Erreur chargement centres:', error);
        setLoadingError('Erreur lors du chargement des centres de santé');
      } finally {
        setIsLoadingCenters(false);
      }
    };

    loadCenters();
  }, []);

  // Essayer d'obtenir la géolocalisation au chargement
  useEffect(() => {
    if ('geolocation' in navigator) {
      setIsLoadingLocation(true);
      getCurrentLocation();
    } else {
      setLocationError('Géolocalisation non supportée par ce navigateur');
    }
  }, []);

  // Obtenir les centres filtrés selon la position de l'utilisateur et le type sélectionné
  const getFilteredCenters = (): HealthCenter[] => {
    let centers = healthCenters;

    // Si l'utilisateur a une position, montrer les centres proches dans un rayon de 20km
    if (userLocation) {
      centers = healthCentersService.getNearbyHealthCenters(
        userLocation.lat,
        userLocation.lng,
        20 // Rayon de 20km
      );
    } else {
      centers = healthCentersService.getAllHealthCenters();
    }

    // Filtrer par type
    if (selectedFilter !== 'all') {
      centers = centers.filter(center => center.type === selectedFilter);
    }

    // Filtrer par recherche
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      centers = centers.filter(center =>
        center.name.toLowerCase().includes(lowerQuery) ||
        center.city.toLowerCase().includes(lowerQuery) ||
        center.address.toLowerCase().includes(lowerQuery)
      );
    }

    return centers;
  };

  // Mettre à jour les centres filtrés quand les critères changent
  useEffect(() => {
    setFilteredCenters(getFilteredCenters());
  }, [healthCenters, selectedFilter, searchQuery, userLocation]);

  // Fonction pour compter les centres par type
  const getCenterCountByType = (type: string): number => {
    let centers = healthCenters;

    // Si l'utilisateur a une position, compter les centres proches dans un rayon de 20km
    if (userLocation) {
      centers = healthCentersService.getNearbyHealthCenters(
        userLocation.lat,
        userLocation.lng,
        20 // Rayon de 20km
      );
    } else {
      centers = healthCentersService.getAllHealthCenters();
    }

    // Filtrer par recherche si applicable
    if (searchQuery.trim()) {
      const lowerQuery = searchQuery.toLowerCase();
      centers = centers.filter(center =>
        center.name.toLowerCase().includes(lowerQuery) ||
        center.city.toLowerCase().includes(lowerQuery) ||
        center.address.toLowerCase().includes(lowerQuery)
      );
    }

    if (type === 'all') {
      return centers.length;
    }

    return centers.filter(center => center.type === type).length;
  };

  const filters = [
    { id: "all", label: "Tous", icon: "📍" },
    { id: "hospital", label: "Hôpitaux", icon: "🏥" },
    { id: "pharmacy", label: "Pharmacies", icon: "💊" },
    { id: "clinic", label: "Cliniques", icon: "🏥" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-6">
        <div className="flex items-center space-x-4 mb-4">
          <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Centres de Santé</h1>
        </div>
        <p className="text-gray-600">Trouvez un centre de santé près de chez vous</p>
      </div>

      <div className="px-6 -mt-2">
        {/* Statut de chargement des centres */}
        {isLoadingCenters && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <Loader2 className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
              <span className="text-blue-800">Chargement des centres de santé...</span>
            </div>
          </Card>
        )}

        {/* Erreur de chargement */}
        {loadingError && (
          <Card className="p-4 mb-4 bg-red-50 border-red-200">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800">{loadingError}</span>
            </div>
          </Card>
        )}

        {/* Statut de géolocalisation simplifié */}
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {userLocation ? (
                  <>
                    <div className="h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full"></div>
                    </div>
                    <div>
                      <span className="text-green-800 font-medium">Position détectée</span>
                      <div className="text-sm text-green-600">
                        {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                      </div>
                    </div>
                  </>
                ) : isLoadingLocation ? (
                  <>
                    <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    <span className="text-blue-800 font-medium">Localisation en cours...</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    <div>
                      <span className="text-orange-800 font-medium">Position non disponible</span>
                      {locationError && (
                        <div className="text-sm text-orange-600">{locationError}</div>
                      )}
                    </div>
                  </>
                )}
              </div>
              {!userLocation && !isLoadingLocation && (
                <Button
                  onClick={() => {
                    setIsLoadingLocation(true);
                    getCurrentLocation();
                  }}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Réessayer
                </Button>
              )}
            </div>

            {/* Option de saisie manuelle de ville */}
            {!userLocation && !isLoadingLocation && (
              <div className="mt-4 pt-4 border-t">
                <div className="text-sm text-gray-600 mb-2">Ou saisissez votre ville :</div>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ex: Abidjan, Bouaké, Daloa..."
                    value={manualCity}
                    onChange={(e) => setManualCity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleCitySubmit()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleCitySubmit}
                    disabled={isSearchingCity || !manualCity.trim()}
                    size="sm"
                  >
                    {isSearchingCity ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'OK'
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Information sur les urgences */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center mb-2">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <span className="font-semibold text-primary">Information</span>
          </div>
          <p className="text-sm text-gray-700">
            Pour les urgences médicales en Côte d'Ivoire, composez le <strong>185</strong> ou rendez-vous au centre de santé le plus proche.
          </p>
        </Card>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Rechercher un centre de santé..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl"
          />
        </div>

        {/* Filters */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {filters.map((filter) => {
            const count = getCenterCountByType(filter.id);
            return (
              <Button
                key={filter.id}
                variant={selectedFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.id)}
                className="whitespace-nowrap rounded-full"
              >
                <span className="mr-1">{filter.icon}</span>
                {filter.label}
                <span className="ml-1 text-xs opacity-75">({count})</span>
              </Button>
            );
          })}
        </div>

        {/* Centers List */}
        <div className="space-y-4">
          {filteredCenters.map((center) => (
            <Card key={center.id} className="shadow-sm border-0 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{center.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {center.category}
                    </Badge>
                  </div>
                  <div className="text-right">
                    {center.distance && (
                      <span className="text-sm text-gray-500">{center.distance}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{center.address}</span>
                  </div>

                  {center.services && center.services.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {center.services.slice(0, 3).map((service) => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                      {center.services.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{center.services.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                  <Button
                    size="sm"
                    className="bg-primary w-full"
                    onClick={() => openGoogleMapsDirections(center)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Itinéraire
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCenters.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="font-medium text-gray-900 mb-2">Aucun centre trouvé</h3>
            <p className="text-gray-500">Essayez de modifier vos critères de recherche</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthMap;
