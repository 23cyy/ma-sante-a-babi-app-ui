interface BloodTypeData {
  groupeSanguin: string;
  peutDonnerA: string[];
  peutRecevoirDe: string[];
  pourcentagePopulation: string;
  rhesus: string;
  statutSpecial: string;
}

export class BloodCompatibilityService {
  private static bloodData: BloodTypeData[] = [];
  private static isLoaded = false;

  static async loadBloodData(): Promise<void> {
    if (this.isLoaded) return;

    try {
      const response = await fetch('/data/compatibilit__groupes_sanguins.csv');
      const csvText = await response.text();
      
      const lines = csvText.split('\n');
      const headers = lines[0].split(',');
      
      this.bloodData = lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = this.parseCSVLine(line);
          return {
            groupeSanguin: values[0]?.trim() || '',
            peutDonnerA: this.parseBloodTypes(values[1] || ''),
            peutRecevoirDe: this.parseBloodTypes(values[2] || ''),
            pourcentagePopulation: values[3]?.trim() || '',
            rhesus: values[4]?.trim() || '',
            statutSpecial: values[5]?.trim() || ''
          };
        });
      
      this.isLoaded = true;
    } catch (error) {
      console.error('Erreur lors du chargement des données de compatibilité sanguine:', error);
      // Fallback avec données par défaut
      this.loadFallbackData();
    }
  }

  private static loadFallbackData(): void {
    this.bloodData = [
      {
        groupeSanguin: 'O-',
        peutDonnerA: ['Tous'],
        peutRecevoirDe: ['O-'],
        pourcentagePopulation: '7%',
        rhesus: '-',
        statutSpecial: 'Donneur universel'
      },
      {
        groupeSanguin: 'O+',
        peutDonnerA: ['O+', 'A+', 'B+', 'AB+'],
        peutRecevoirDe: ['O+', 'O-'],
        pourcentagePopulation: '37%',
        rhesus: '+',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'A-',
        peutDonnerA: ['A-', 'A+', 'AB-', 'AB+'],
        peutRecevoirDe: ['A-', 'O-'],
        pourcentagePopulation: '6%',
        rhesus: '-',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'A+',
        peutDonnerA: ['A+', 'AB+'],
        peutRecevoirDe: ['A+', 'A-', 'O+', 'O-'],
        pourcentagePopulation: '34%',
        rhesus: '+',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'B-',
        peutDonnerA: ['B-', 'B+', 'AB-', 'AB+'],
        peutRecevoirDe: ['B-', 'O-'],
        pourcentagePopulation: '2%',
        rhesus: '-',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'B+',
        peutDonnerA: ['B+', 'AB+'],
        peutRecevoirDe: ['B+', 'B-', 'O+', 'O-'],
        pourcentagePopulation: '9%',
        rhesus: '+',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'AB-',
        peutDonnerA: ['AB-', 'AB+'],
        peutRecevoirDe: ['AB-', 'A-', 'B-', 'O-'],
        pourcentagePopulation: '1%',
        rhesus: '-',
        statutSpecial: ''
      },
      {
        groupeSanguin: 'AB+',
        peutDonnerA: ['AB+'],
        peutRecevoirDe: ['Tous'],
        pourcentagePopulation: '4%',
        rhesus: '+',
        statutSpecial: 'Receveur universel'
      }
    ];
    this.isLoaded = true;
  }

  static getAllBloodTypes(): BloodTypeData[] {
    return this.bloodData;
  }

  static getBloodTypeInfo(bloodType: string): BloodTypeData | undefined {
    return this.bloodData.find(data => data.groupeSanguin === bloodType);
  }

  static getCompatibilityInfo(bloodType: string): { canGiveTo: string[], canReceiveFrom: string[] } {
    const bloodInfo = this.getBloodTypeInfo(bloodType);
    if (!bloodInfo) {
      return { canGiveTo: [], canReceiveFrom: [] };
    }

    let canGiveTo = bloodInfo.peutDonnerA;
    let canReceiveFrom = bloodInfo.peutRecevoirDe;

    // Gérer le cas "Tous"
    if (canGiveTo.includes('Tous')) {
      canGiveTo = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    }
    if (canReceiveFrom.includes('Tous')) {
      canReceiveFrom = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    }

    return {
      canGiveTo,
      canReceiveFrom
    };
  }

  static getBloodTypeEmoji(bloodType: string): string {
    const emojiMap: { [key: string]: string } = {
      'O-': '🅾️',
      'O+': '🅾️',
      'A-': '🅰️',
      'A+': '🅰️',
      'B-': '🅱️',
      'B+': '🅱️',
      'AB-': '🆎',
      'AB+': '🆎'
    };
    return emojiMap[bloodType] || '🩸';
  }

  static isUniversalDonor(bloodType: string): boolean {
    const bloodInfo = this.getBloodTypeInfo(bloodType);
    return bloodInfo?.statutSpecial.toLowerCase().includes('donneur') || false;
  }

  static isUniversalReceiver(bloodType: string): boolean {
    const bloodInfo = this.getBloodTypeInfo(bloodType);
    return bloodInfo?.statutSpecial.toLowerCase().includes('receveur') || false;
  }

  private static parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }

  private static parseBloodTypes(value: string): string[] {
    if (!value || value.trim() === '') return [];
    
    // Nettoyer la valeur (enlever les guillemets)
    const cleanValue = value.replace(/"/g, '').trim();
    
    if (cleanValue.toLowerCase() === 'tous') {
      return ['Tous'];
    }
    
    // Séparer par virgule et nettoyer chaque élément
    return cleanValue
      .split(',')
      .map(type => type.trim())
      .filter(type => type.length > 0);
  }
}