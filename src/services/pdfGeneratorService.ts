import jsPDF from 'jspdf';

interface HealthData {
  name: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
  emergencyContact?: string;
  medicalConditions?: string;
  weight?: string;
  height?: string;
  lastUpdate: string;
  emergencyApp: string;
}

export class PDFGeneratorService {
  private static addHeader(doc: jsPDF, name: string): number {
    // En-tête avec logo et titre
    doc.setFillColor(220, 38, 127); // Rose médical
    doc.rect(0, 0, 210, 35, 'F');
    
    // Titre principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FICHE SANTÉ D\'URGENCE', 105, 15, { align: 'center' });
    
    // Sous-titre
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('Ma Santé à Babi', 105, 25, { align: 'center' });
    
    // Nom du patient
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(`Patient: ${name}`, 20, 50);
    
    return 60; // Position Y après l'en-tête
  }

  private static addSection(doc: jsPDF, title: string, y: number, isCritical: boolean = false): number {
    // Fond de section
    const bgColor = isCritical ? [255, 245, 245] : [248, 250, 252];
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.rect(15, y - 5, 180, 20, 'F');
    
    // Bordure de section
    const borderColor = isCritical ? [239, 68, 68] : [148, 163, 184];
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.setLineWidth(0.5);
    doc.rect(15, y - 5, 180, 20);
    
    // Titre de section
    if (isCritical) {
      doc.setTextColor(185, 28, 28);
    } else {
      doc.setTextColor(51, 65, 85);
    }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, y + 5);
    
    return y + 25;
  }

  private static addField(doc: jsPDF, label: string, value: string, y: number, isCritical: boolean = false): number {
    // Label
    if (isCritical) {
      doc.setTextColor(185, 28, 28);
    } else {
      doc.setTextColor(75, 85, 99);
    }
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`${label}:`, 25, y);
    
    // Valeur
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    // Gestion du texte long
    const maxWidth = 140;
    const lines = doc.splitTextToSize(value, maxWidth);
    doc.text(lines, 25, y + 8);
    
    return y + (lines.length * 6) + 10;
  }

  private static addFooter(doc: jsPDF): void {
    const pageHeight = doc.internal.pageSize.height;
    
    // Ligne de séparation
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.line(20, pageHeight - 30, 190, pageHeight - 30);
    
    // Informations de génération
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, 20, pageHeight - 20);
    doc.text('Document confidentiel - Usage médical uniquement', 20, pageHeight - 12);
    
    // Logo/App info
    doc.text('Ma Santé à Babi - Application de santé numérique', 190, pageHeight - 20, { align: 'right' });
  }

  private static addEmergencyBanner(doc: jsPDF, y: number): number {
    // Bannière d'urgence
    doc.setFillColor(254, 226, 226);
    doc.rect(15, y, 180, 25, 'F');
    
    doc.setDrawColor(239, 68, 68);
    doc.setLineWidth(1);
    doc.rect(15, y, 180, 25);
    
    // Icône d'urgence (simulée avec du texte)
    doc.setTextColor(185, 28, 28);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠️', 25, y + 10);
    
    // Texte d'urgence
    doc.setFontSize(12);
    doc.text('INFORMATIONS CRITIQUES D\'URGENCE', 40, y + 10);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Ces informations sont essentielles en cas d\'intervention médicale d\'urgence', 40, y + 18);
    
    return y + 35;
  }

  static generateHealthCardPDF(data: HealthData): void {
    const doc = new jsPDF();
    
    // En-tête
    let currentY = this.addHeader(doc, data.name);
    
    // Bannière d'urgence si informations critiques
    const hasCriticalInfo = data.bloodType || data.allergies || data.emergencyContact;
    if (hasCriticalInfo) {
      currentY = this.addEmergencyBanner(doc, currentY);
    }
    
    // Section informations critiques
    if (data.bloodType || data.allergies || data.emergencyContact) {
      currentY = this.addSection(doc, 'INFORMATIONS CRITIQUES', currentY, true);
      
      if (data.bloodType) {
        currentY = this.addField(doc, 'Groupe sanguin', data.bloodType, currentY, true);
      }
      
      if (data.allergies) {
        currentY = this.addField(doc, 'Allergies', data.allergies, currentY, true);
      }
      
      if (data.emergencyContact) {
        currentY = this.addField(doc, 'Contact d\'urgence', data.emergencyContact, currentY, true);
      }
      
      currentY += 10;
    }
    
    // Section informations médicales
    if (data.medications || data.medicalConditions) {
      currentY = this.addSection(doc, 'INFORMATIONS MÉDICALES', currentY);
      
      if (data.medications) {
        currentY = this.addField(doc, 'Médicaments actuels', data.medications, currentY);
      }
      
      if (data.medicalConditions) {
        currentY = this.addField(doc, 'Conditions médicales', data.medicalConditions, currentY);
      }
      
      currentY += 10;
    }
    
    // Section informations physiques
    if (data.weight || data.height) {
      currentY = this.addSection(doc, 'INFORMATIONS PHYSIQUES', currentY);
      
      if (data.weight) {
        currentY = this.addField(doc, 'Poids', data.weight, currentY);
      }
      
      if (data.height) {
        currentY = this.addField(doc, 'Taille', data.height, currentY);
      }
      
      currentY += 10;
    }
    
    // QR Code placeholder
    currentY = this.addSection(doc, 'QR CODE', currentY);
    
    // Zone QR Code
    doc.setFillColor(255, 255, 255);
    doc.rect(25, currentY, 40, 40, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(25, currentY, 40, 40);
    
    // Texte QR Code
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('QR CODE', 45, currentY + 22, { align: 'center' });
    
    // Instructions QR
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text('Scannez ce code pour accéder aux informations', 75, currentY + 10);
    doc.text('numériques complètes du patient', 75, currentY + 18);
    doc.text(`Dernière mise à jour: ${new Date(data.lastUpdate).toLocaleDateString('fr-FR')}`, 75, currentY + 30);
    
    // Pied de page
    this.addFooter(doc);
    
    // Téléchargement
    const fileName = `fiche-sante-${data.name.replace(/\s+/g, '-').toLowerCase()}.pdf`;
    doc.save(fileName);
  }
}