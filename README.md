# Ma Santé à Babi 🏥

> **Note importante** : Cette application est actuellement en cours de refonte complète pour améliorer l'expérience utilisateur et intégrer de nouvelles fonctionnalités avancées.

## 🌐 Démo Live

**🚀 [Essayer la démo](https://ma-sante-babi-ui.vercel.app/)**

## 📋 Description

**Ma Santé à Babi** est une application de santé numérique innovante conçue spécifiquement pour la Côte d'Ivoire. Elle vise à démocratiser l'accès aux informations de santé et aux services médicaux grâce à une interface intuitive et des données ouvertes.

## ✨ Fonctionnalités Actuelles

### 🤖 Adjoua - Assistant IA Santé
- **Chat intelligent** avec reconnaissance vocale et synthèse vocale
- **Conseils médicaux** adaptés au contexte ivoirien
- **Informations sur** :
  - Centres de santé et hôpitaux proches
  - Symptômes COVID-19
  - Prévention du paludisme
  - Calendrier vaccinal ivoirien
  - Autres points basés sur les données publiques

### 🏥 Services de Santé
- **Carte interactive** des centres de santé
- **Compatibilité des groupes sanguins**
- **Gestion des rendez-vous médicaux**
- **Rappels de médicaments**
- **Suivi de santé des enfants**
- **Dossier médical personnel**
- **Code QR santé** pour partage sécurisé

### 📱 Interface Adaptative
- **Version mobile** optimisée pour smartphones
- **Version web** avec interface desktop
- **Navigation intuitive** avec sidebar et menus contextuels
- **Notifications unifiées** via Sonner (Toutes les refs à Toast seront delete)

## 🗃️ Open Data & Datasets

L'application s'appuie sur une approche **open data** pour garantir la transparence et l'accessibilité des informations de santé :

### Datasets Actuels
- **`hospitaux-de-cote-d'ivoire.csv`** : Base de données complète des établissements de santé
- **`compatibilite_groupes_sanguins.csv`** : Matrice de compatibilité pour les transfusions

### Datasets Futurs (En Intégration)
- Calendriers de vaccination par région
- Statistiques épidémiologiques
- Tarifs des consultations médicales
- Spécialistes par zone géographique
- Et bien d'autres

## 🚀 Fonctionnalités à Venir

### 🔗 Intégration MCP Server
Nous développons actuellement une intégration avec **MCP (Model Context Protocol) Server** qui permettra à Adjoua de :
- Accéder à des bases de données médicales en temps réel
- Fournir des diagnostics plus précis
- Se connecter aux systèmes hospitaliers
- Offrir des recommandations personnalisées basées sur l'historique médical
- Relation patient-médecin

### 📊 Analytics & Insights
- Tableaux de bord de santé publique
- Analyses prédictives des épidémies
- Rapports de santé communautaire

## 🛠️ Technologies Utilisées

- **Frontend** : React + TypeScript + Vite
- **UI Framework** : Tailwind CSS + shadcn/ui
- **Notifications** : Sonner
- **Cartes** : Intégration géolocalisation
- **IA** : Web Speech API (reconnaissance/synthèse vocale et à venir connexion via MCP Server)
- **Données** : CSV parsing + services dédiés

## 📦 Installation

```bash
# Cloner le repository
git clone [URL_DU_REPO]
cd ma-sante-babi-ui

# Installer les dépendances
npm install
# ou
bun install

# Lancer en mode développement
npm run dev
# ou
bun dev
```

## 🏗️ Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI réutilisables
│   ├── AdjouaChat.tsx  # Assistant IA
│   ├── Dashboard.tsx   # Tableau de bord
│   ├── HealthMap.tsx   # Carte des centres de santé
│   └── ...
├── services/           # Services et logique métier
├── hooks/              # Hooks React personnalisés
└── pages/              # Pages de l'application

public/
├── assets/images/      # Ressources visuelles
└── data/              # Datasets CSV
```

---

**Ma Santé à Babi** - *Votre santé, notre priorité* 🇨🇮
