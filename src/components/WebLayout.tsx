
import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface WebLayoutProps {
  children: ReactNode;
  currentScreen: string;
  onNavigate: (screen: string) => void;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bloodType: string;
    weight: number;
    childrenCount: number;
  };
  onLogout: () => void;
}

const WebLayout = ({ children, currentScreen, onNavigate, user, onLogout }: WebLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar 
        currentScreen={currentScreen} 
        onNavigate={onNavigate} 
        user={user}
        onLogout={onLogout}
      />
      
      {/* Contenu principal */}
      <div className="flex-1 ml-64">
        <div className="p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default WebLayout;
