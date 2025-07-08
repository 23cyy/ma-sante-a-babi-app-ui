
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { toast } from "sonner";

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

interface WelcomeScreenProps {
  onLogin: (user: User) => void;
}

const WelcomeScreen = ({ onLogin }: WelcomeScreenProps) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Demo account
    if (loginData.email === "demo@masanteababi.ci" && loginData.password === "demo2025") {
      onLogin({
        firstName: "Mariam",
        lastName: "Diabaté",
        email: "demo@masanteababi.ci",
        phone: "+225 07 12 34 56 78",
        bloodType: "O+",
        weight: 65,
        height: 165,
        childrenCount: 2
      });
      toast.success("Connexion réussie ! Bienvenue Mariam 👋🏾");
    } else {
      toast.error("Email ou mot de passe incorrect");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    onLogin({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      phone: registerData.phone,
      bloodType: "O+",
      weight: 65,
      height: 165,
      childrenCount: 0
    });
    toast.success(`Bienvenue ${registerData.firstName} ! 🎉`);
  };

  const handleDemoLogin = () => {
    onLogin({
      firstName: "Mariam",
      lastName: "Diabaté",
      email: "demo@masanteababi.ci",
      phone: "+225 07 12 34 56 78",
      bloodType: "O+",
      weight: 65,
      height: 165,
      childrenCount: 2
    });
    toast.success("Connexion démo réussie ! 🚀");
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        {/* Logo & Title */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden">
            <img
              src="/assets/images/Logo_App.png"
              alt="Ma Santé à Babi Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Ma Santé à Babi</h1>
            <p className="text-gray-600 mt-2">Votre compagnon santé de confiance</p>
          </div>
        </div>

        {/* Demo Button */}
        <Button
          onClick={handleDemoLogin}
          className="w-full text-white py-6 text-lg font-medium rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200"
          style={{ backgroundColor: '#ef7b22' }}
        >
          Essayer la démo
        </Button>

        {/* Auth Forms */}
        <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none h-14">
              <TabsTrigger value="login" className="text-base">Se connecter</TabsTrigger>
              <TabsTrigger value="register" className="text-base">S'inscrire</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="m-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Bon retour !</CardTitle>
                <CardDescription>Connectez-vous à votre compte</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="demo@masanteababi.ci"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="demo2025"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary-600">
                    Se connecter
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register" className="m-0">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">Créer un compte</CardTitle>
                <CardDescription>Rejoignez notre communauté santé</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        placeholder="Mariam"
                        value={registerData.firstName}
                        onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        placeholder="Diabaté"
                        value={registerData.lastName}
                        onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                        required
                        className="h-12 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerEmail">Email</Label>
                    <Input
                      id="registerEmail"
                      type="email"
                      placeholder="votre@email.ci"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      placeholder="+225 07 12 34 56 78"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="registerPassword">Mot de passe</Label>
                    <Input
                      id="registerPassword"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                      required
                      className="h-12 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 text-base rounded-xl bg-primary hover:bg-primary-600">
                    Créer mon compte
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        <p className="text-center text-sm text-gray-500">
          En vous connectant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
