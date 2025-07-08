export interface HealthCenter {
  id: string;
  name: string;
  type: 'hospital' | 'pharmacy' | 'clinic';
  category: string; // Catégorie originale du CSV
  address: string;
  city: string;
  district?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  geometry: string; // Géométrie originale du CSV
  distance?: string;
  services?: string[];
  icon: string;
  color: string;
}

class HealthCentersService {
  private healthCenters: HealthCenter[] = [];
  private isLoaded = false;

  // Fonction pour calculer la distance entre deux points géographiques
  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  // Fonction pour mapper les catégories du CSV vers nos types
  private mapCategoryToType(category: string): 'hospital' | 'pharmacy' | 'clinic' {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('pharmacie')) return 'pharmacy';
    if (lowerCategory.includes('clinique')) return 'clinic';
    return 'hospital'; // Par défaut
  }

  // Fonction pour obtenir l'icône selon le type
  private getIconForType(type: 'hospital' | 'pharmacy' | 'clinic'): string {
    switch (type) {
      case 'hospital': return '🏥';
      case 'pharmacy': return '💊';
      case 'clinic': return '🏥';
      default: return '📍';
    }
  }

  // Fonction pour obtenir la couleur selon le type
  private getColorForType(type: 'hospital' | 'pharmacy' | 'clinic'): string {
    switch (type) {
      case 'hospital': return 'bg-red-100';
      case 'pharmacy': return 'bg-green-100';
      case 'clinic': return 'bg-blue-100';
      default: return 'bg-gray-100';
    }
  }

  // Fonction pour parser une ligne CSV
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;

    while (i < line.length) {
      const char = line[i];

      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i += 2;
          continue;
        }
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      i++;
    }

    result.push(current.trim());
    return result;
  }

  // Fonction pour charger les centres de santé depuis le CSV
  async loadHealthCenters(): Promise<HealthCenter[]> {
    if (this.isLoaded) {
      return this.healthCenters;
    }

    try {
      const response = await fetch('/data/hospitaux-de-cote-d\'ivoire.csv');
      if (!response.ok) {
        throw new Error('Erreur lors du chargement du fichier CSV');
      }

      const csvText = await response.text();
      const lines = csvText.split('\n').filter(line => line.trim());

      // Ignorer la première ligne (en-têtes)
      const dataLines = lines.slice(1);

      this.healthCenters = dataLines.map((line, index) => {
        try {
          const columns = this.parseCSVLine(line);

          // Parser les coordonnées depuis la colonne geometry
          const geometryStr = columns[0];
          let coordinates = { lat: 0, lng: 0 };

          try {
            const geometry = JSON.parse(geometryStr);
            if (geometry.coordinates && Array.isArray(geometry.coordinates)) {
              coordinates = {
                lng: geometry.coordinates[0],
                lat: geometry.coordinates[1]
              };
            }
          } catch (e) {
            console.warn('Erreur parsing coordonnées:', e);
          }

          const city = columns[4] || 'Non spécifié';
          const district = columns[5] || '';
          const category = columns[6] || 'Hôpital';
          const name = columns[7] || 'Centre de santé';

          const type = this.mapCategoryToType(category);

          return {
            id: `center_${index}`,
            name: name,
            type: type,
            category: category,
            address: district ? `${district}, ${city}` : city,
            city: city,
            district: district,
            coordinates: coordinates,
            geometry: geometryStr,
            services: this.getServicesForType(type),
            icon: this.getIconForType(type),
            color: this.getColorForType(type)
          };
        } catch (error) {
          console.warn('Erreur parsing ligne CSV:', error, line);
          return null;
        }
      }).filter((center): center is HealthCenter => center !== null);

      this.isLoaded = true;
      console.log(`${this.healthCenters.length} centres de santé chargés`);
      return this.healthCenters;
    } catch (error) {
      console.error('Erreur chargement centres de santé:', error);
      throw error;
    }
  }

  // Fonction pour obtenir les services selon le type
  private getServicesForType(type: 'hospital' | 'pharmacy' | 'clinic'): string[] {
    switch (type) {
      case 'hospital':
        return ['Urgences', 'Consultation', 'Hospitalisation', 'Chirurgie'];
      case 'pharmacy':
        return ['Médicaments', 'Conseil pharmaceutique', 'Matériel médical'];
      case 'clinic':
        return ['Consultation', 'Soins ambulatoires', 'Examens'];
      default:
        return ['Services de santé'];
    }
  }

  // Fonction pour obtenir les centres proches d'une position
  getNearbyHealthCenters(lat: number, lng: number, radiusKm: number = 50): HealthCenter[] {
    return this.healthCenters
      .map(center => {
        const distance = this.calculateDistance(lat, lng, center.coordinates.lat, center.coordinates.lng);
        return {
          ...center,
          distance: `${distance.toFixed(1)} km`
        };
      })
      .filter(center => {
        const distanceNum = parseFloat(center.distance!.replace(' km', ''));
        return distanceNum <= radiusKm;
      })
      .sort((a, b) => {
        const distanceA = parseFloat(a.distance!.replace(' km', ''));
        const distanceB = parseFloat(b.distance!.replace(' km', ''));
        return distanceA - distanceB;
      });
  }

  // Fonction pour rechercher des centres par nom ou ville
  searchHealthCenters(query: string): HealthCenter[] {
    const lowerQuery = query.toLowerCase();
    return this.healthCenters.filter(center =>
      center.name.toLowerCase().includes(lowerQuery) ||
      center.city.toLowerCase().includes(lowerQuery) ||
      center.address.toLowerCase().includes(lowerQuery)
    );
  }

  // Fonction pour obtenir tous les centres
  getAllHealthCenters(): HealthCenter[] {
    return this.healthCenters;
  }

  // Fonction pour filtrer par type
  getHealthCentersByType(type: 'hospital' | 'pharmacy' | 'clinic'): HealthCenter[] {
    return this.healthCenters.filter(center => center.type === type);
  }
}

// Export d'une instance singleton
const healthCentersService = new HealthCentersService();
export default healthCentersService;
export { HealthCentersService };
