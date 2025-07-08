
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Map, Bell, MapPin, AlertCircle, Loader2 } from 'lucide-react';
import healthCentersService, { HealthCenter } from '@/services/healthCentersService';

const HealthMap = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('all');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [manualCity, setManualCity] = useState('');
  const [isSearchingCity, setIsSearchingCity] = useState(false);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>([]);
  const [isLoadingCenters, setIsLoadingCenters] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fonction pour vérifier les permissions
  const checkPermissions = async () => {
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
        console.log('Permission géolocalisation:', permission.state);
        return permission.state;
      } catch (error) {
        console.log('Impossible de vérifier les permissions:', error);
        return 'prompt';
      }
    }
    return 'prompt';
  };

  // Fonction pour demander la géolocalisation
  const requestLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationPermission('denied');
      setLocationError('Géolocalisation non supportée par ce navigateur');
      setIsLoadingLocation(false);
      return;
    }

    // Vérifier les permissions d'abord
    const permissionState = await checkPermissions();
    console.log('État des permissions:', permissionState);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            console.log('Position obtenue:', pos.coords.latitude, pos.coords.longitude);
            resolve(pos);
          },
          (err) => {
            console.error('Erreur géolocalisation:', err);
            reject(err);
          },
          {
            enableHighAccuracy: false, // Désactivé pour plus de compatibilité
            timeout: 20000, // Augmenté à 20 secondes
            maximumAge: 300000 // 5 minutes
          }
        );
      });

      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
      setLocationPermission('granted');
      setLocationError(null);
      console.log('Localisation réussie:', { lat: latitude, lng: longitude });
    } catch (error: any) {
      console.error('Erreur de géolocalisation:', error);
      let errorMessage = 'Erreur inconnue';

      if (error.code) {
        switch (error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = 'Veuillez vérifier que la géolocalisation est activée dans les paramètres de votre navigateur et actualiser la page.';
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = 'Position indisponible. Vérifiez votre connexion GPS/WiFi.';
            break;
          case 3: // TIMEOUT
            errorMessage = 'Délai d\'attente dépassé. Vérifiez votre connexion.';
            break;
          default:
            errorMessage = `Erreur ${error.code}: ${error.message}`;
        }
      } else {
        errorMessage = error.message || 'Erreur de géolocalisation';
      }

      setLocationError(errorMessage);
      setLocationPermission('denied');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Fonction pour rechercher une ville et obtenir ses coordonnées
  const searchCityLocation = async (cityName: string) => {
    setIsSearchingCity(true);
    setLocationError(null);

    try {
      // Utiliser l'API de géocodage de Google (ou une alternative)
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(cityName + ', Côte d\'Ivoire')}&key=YOUR_API_KEY&limit=1`
      );

      if (!response.ok) {
        throw new Error('Erreur lors de la recherche de la ville');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setUserLocation({ lat, lng });
        setLocationPermission('granted');
        console.log(`Ville trouvée: ${cityName}`, { lat, lng });
      } else {
        throw new Error('Ville non trouvée');
      }
    } catch (error) {
      console.error('Erreur recherche ville:', error);
      // Fallback: utiliser des coordonnées approximatives pour les principales villes de Côte d'Ivoire
      const cityCoordinates: { [key: string]: { lat: number, lng: number } } = {
        'abidjan': { lat: 5.3364, lng: -4.0267 },
        'bouaké': { lat: 7.6906, lng: -5.0300 },
        'daloa': { lat: 6.8770, lng: -6.4503 },
        'yamoussoukro': { lat: 6.8276, lng: -5.2893 },
        'san-pédro': { lat: 4.7467, lng: -6.6364 },
        'korhogo': { lat: 9.4580, lng: -5.6300 },
        'man': { lat: 7.4125, lng: -7.5544 },
        'divo': { lat: 5.8372, lng: -5.3570 },
        'gagnoa': { lat: 6.1319, lng: -5.9506 },
        'anyama': { lat: 5.4950, lng: -4.0517 }
      };

      const normalizedCity = cityName.toLowerCase().trim();
      const coords = cityCoordinates[normalizedCity];

      if (coords) {
        setUserLocation(coords);
        setLocationPermission('granted');
        console.log(`Ville trouvée dans la base locale: ${cityName}`, coords);
      } else {
        setLocationError(`Ville "${cityName}" non trouvée. Essayez: Abidjan, Bouaké, Daloa, Yamoussoukro, etc.`);
      }
    } finally {
      setIsSearchingCity(false);
    }
  };

  // Fonction pour valider la saisie de ville
  const handleCitySubmit = () => {
    if (manualCity.trim()) {
      searchCityLocation(manualCity.trim());
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

  // Demander la localisation au chargement du composant
  useEffect(() => {
    if (locationPermission === 'pending') {
      requestLocation();
    }
  }, []);

  // Obtenir les centres filtrés selon la position de l'utilisateur et le type sélectionné
  const getFilteredCenters = (): HealthCenter[] => {
    let centers = healthCenters;

    // Si l'utilisateur a une position, montrer les centres proches
    if (userLocation) {
      centers = healthCentersService.getNearbyHealthCenters(
        userLocation.lat,
        userLocation.lng,
        50 // Rayon de 50km
      );
    }

    // Filtrer par type
    if (selectedType !== 'all') {
      centers = centers.filter(center => center.type === selectedType);
    }

    return centers;
  };

  const filterTypes = [
    { id: 'all', label: 'Tout', icon: '📍' },
    { id: 'hospital', label: 'Hôpitaux', icon: '🏥' },
    { id: 'pharmacy', label: 'Pharmacies', icon: '💊' },
    { id: 'clinic', label: 'Cliniques', icon: '🏥' }
  ];

  const filteredCenters = getFilteredCenters();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Centres de santé</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-gray-500"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6">
        {/* Filtres */}
        <div className="mb-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {filterTypes.map((type) => (
              <Button
                key={type.id}
                variant={selectedType === type.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(type.id)}
                className={`flex-shrink-0 ${
                  selectedType === type.id
                    ? 'bg-primary text-white'
                    : 'border-gray-300 text-gray-600'
                }`}
              >
                <span className="mr-1">{type.icon}</span>
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Information sur Abidjan */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <div className="flex items-center mb-2">
            <Bell className="w-5 h-5 text-primary mr-2" />
            <span className="font-semibold text-primary">Information</span>
          </div>
          <p className="text-sm text-gray-700">
            Pour les urgences médicales en Côte d'Ivoire, composez le <strong>185</strong> ou rendez-vous au centre de santé le plus proche.
          </p>
        </Card>

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

        {/* Statut de géolocalisation */}
        {locationPermission === 'pending' && (
          <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
            <div className="flex items-center">
              <MapPin className="w-5 h-5 text-blue-600 mr-2 animate-pulse" />
              <span className="text-blue-800">
                {isLoadingLocation ? 'Localisation en cours...' : 'Demande d\'accès à votre position'}
              </span>
            </div>
          </Card>
        )}

        {locationPermission === 'denied' && (
          <Card className="p-4 mb-4 bg-orange-50 border-orange-200">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-1">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    <span className="text-orange-800 font-medium">Position non disponible</span>
                  </div>
                  {locationError && (
                    <p className="text-sm text-orange-700 ml-7">{locationError}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={requestLocation}
                  disabled={isLoadingLocation}
                  className="text-orange-600 border-orange-300 ml-2"
                >
                  {isLoadingLocation ? 'Chargement...' : 'Réessayer'}
                </Button>
              </div>

              <div className="border-t border-orange-200 pt-3">
                 <p className="text-sm text-orange-700 mb-3">💡 <strong>Solutions alternatives :</strong></p>
                 <div className="space-y-2 text-sm text-orange-600 mb-3">
                   <div>• Vérifiez que la géolocalisation est activée dans votre navigateur</div>
                   <div>• Actualisez la page et réessayez</div>
                   <div>• Ou saisissez votre ville manuellement ci-dessous</div>
                 </div>

                 <div className="space-y-2">
                   <label className="text-sm font-medium text-orange-800">Saisir votre ville :</label>
                   <div className="flex space-x-2">
                     <input
                       type="text"
                       value={manualCity}
                       onChange={(e) => setManualCity(e.target.value)}
                       placeholder="Ex: Abidjan, Bouaké, Daloa..."
                       className="flex-1 px-3 py-2 text-sm border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                       onKeyPress={(e) => e.key === 'Enter' && handleCitySubmit()}
                       disabled={isSearchingCity}
                     />
                     <Button
                       size="sm"
                       onClick={handleCitySubmit}
                       disabled={!manualCity.trim() || isSearchingCity}
                       className="bg-orange-600 hover:bg-orange-700 text-white"
                     >
                       {isSearchingCity ? 'Recherche...' : 'Valider'}
                     </Button>
                   </div>
                 </div>
               </div>
            </div>
          </Card>
        )}

        {locationPermission === 'granted' && userLocation && (
          <Card className="p-4 mb-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-green-600 mr-2" />
                <div>
                  <span className="text-green-800 font-medium">Position détectée</span>
                  <p className="text-xs text-green-700 mt-1">
                    Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={requestLocation}
                className="text-green-600 border-green-300"
              >
                Actualiser
              </Button>
            </div>
          </Card>
        )}

        {/* Google Maps intégrée */}
        <Card className="p-4 mb-6 bg-gradient-to-br from-blue-50 to-green-50">
          <div className="h-64 bg-white rounded-lg overflow-hidden">
            <iframe
              src={userLocation
                ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.123456789!2d${userLocation.lng}!3d${userLocation.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${userLocation.lat.toFixed(6)}%2C${userLocation.lng.toFixed(6)}!5e0!3m2!1sfr!2sci!4v1640995200000!5m2!1sfr!2sci`
                : "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.123456789!2d-4.0184761!3d5.328579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTknNDMuMyJOIDTCsDAxJzA2LjUiVw!5e0!3m2!1sfr!2sci!4v1640995200000!5m2!1sfr!2sci"
              }
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={userLocation ? "Votre position" : "Carte des centres de santé - Abidjan"}
            ></iframe>
          </div>
        </Card>

        {/* Liste des centres */}
        {!isLoadingCenters && !loadingError && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">
                Centres de santé ({filteredCenters.length})
              </h3>
              {userLocation && (
                <span className="text-xs text-gray-500">
                  Dans un rayon de 50km
                </span>
              )}
            </div>

            {filteredCenters.length === 0 ? (
              <Card className="p-6 text-center">
                <div className="text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    Aucun centre trouvé pour cette catégorie.
                    {userLocation ? ' Essayez d\'élargir votre recherche.' : ' Activez la géolocalisation pour voir les centres proches.'}
                  </p>
                </div>
              </Card>
            ) : (
              filteredCenters.map((center) => (
                <Card key={center.id} className="p-4 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-3">
                    <div className={`w-12 h-12 rounded-lg ${center.color} flex items-center justify-center text-xl`}>
                      {center.icon}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{center.name}</h4>
                        <span className="text-sm text-gray-500">{center.distance}</span>
                      </div>

                      <div className="flex items-center mb-2">
                        <div className="flex text-yellow-400 mr-2">
                          {'★'.repeat(Math.floor(center.rating || 4))}
                        </div>
                        <span className="text-sm text-gray-600">{center.rating}</span>
                      </div>

                      {center.address && (
                        <p className="text-xs text-gray-500 mb-2">{center.address}</p>
                      )}

                      <div className="flex flex-wrap gap-1">
                        {center.services?.map((service, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex space-x-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-primary hover:bg-primary/90"
                      onClick={() => window.open(`tel:185`, '_self')}
                    >
                      Appeler
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.lat},${center.coordinates.lng}`;
                        window.open(url, '_blank');
                      }}
                    >
                      Itinéraire
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}


      </div>
    </div>
  );
};

export default HealthMap;
