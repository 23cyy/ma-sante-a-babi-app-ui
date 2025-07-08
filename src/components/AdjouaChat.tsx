
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, Mic, MicOff, X, RotateCcw, Volume2, VolumeX } from "lucide-react";

// Types pour SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isPlaying?: boolean;
}

interface AdjouaChatProps {
  onBack?: () => void;
}

const AdjouaChat = ({ onBack }: AdjouaChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Bonjour ! Je suis Adjoua, votre assistante santé IA. Comment puis-je vous aider aujourd'hui ? 😊",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const quickSuggestions = [
    { icon: "🏥", text: "Hôpitaux près de moi", query: "Quels sont les hôpitaux les plus proches ?" },
    { icon: "🦠", text: "Symptômes COVID-19", query: "Quels sont les symptômes du COVID-19 ?" },
    { icon: "🦟", text: "Prévention paludisme", query: "Comment prévenir le paludisme ?" },
    { icon: "💉", text: "Calendrier vaccinal", query: "Quel est le calendrier de vaccination pour enfants ?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();

    if (message.includes("hôpital") || message.includes("centre") || message.includes("proche")) {
      return "Voici les centres de santé les plus proches de vous :\n\n🏥 CHU de Treichville (2.3 km)\n📍 Boulevard Lagunaire, Treichville\n⏰ Ouvert 24h/24\n\n🏥 Clinique Sainte Anne-Marie (5.1 km)\n📍 Cocody Angré\n⏰ 06h00 - 22h00\n\nVoulez-vous que je vous donne les directions vers l'un d'eux ?";
    }

    if (message.includes("covid") || message.includes("coronavirus")) {
      return "Les symptômes principaux du COVID-19 sont :\n\n🤒 Fièvre (38°C ou plus)\n😷 Toux sèche persistante\n😮‍💨 Essoufflement\n🤧 Perte d'odorat/goût\n💪 Fatigue intense\n🤕 Maux de tête\n\n⚠️ Si vous présentez ces symptômes, consultez rapidement un médecin. Portez un masque et isolez-vous.";
    }

    if (message.includes("paludisme") || message.includes("moustique")) {
      return "Pour prévenir le paludisme en Côte d'Ivoire :\n\n🛏️ Dormez sous une moustiquaire imprégnée\n🧴 Utilisez des répulsifs anti-moustiques\n👔 Portez des vêtements longs le soir\n🏠 Éliminez les eaux stagnantes\n💊 Prenez un traitement préventif si prescrit\n\n⚠️ Consultez immédiatement en cas de fièvre, frissons ou maux de tête.";
    }

    if (message.includes("vaccin") || message.includes("vaccination")) {
      return "Calendrier vaccinal ivoirien pour enfants :\n\n👶 Naissance : BCG, Hépatite B\n📅 6 semaines : DTC-Polio 1, Pneumocoque 1\n📅 10 semaines : DTC-Polio 2, Pneumocoque 2\n📅 14 semaines : DTC-Polio 3, Pneumocoque 3\n📅 9 mois : Rougeole, Fièvre jaune\n📅 15 mois : ROR, Méningite\n\nTenez toujours le carnet de vaccination à jour !";
    }

    return "Je comprends votre question. Pour des conseils médicaux précis, je recommande de consulter un professionnel de santé. Puis-je vous aider à trouver un centre de santé près de vous ou avez-vous d'autres questions sur la prévention santé ?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion: typeof quickSuggestions[0]) => {
    setInputMessage(suggestion.query);
  };

  const clearConversation = () => {
    setMessages([
      {
        id: 1,
        text: "Bonjour ! Je suis Adjoua, votre assistante santé IA. Comment puis-je vous aider aujourd'hui ? 😊",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  };

  // Initialisation de la reconnaissance vocale
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsRecording(false);
        setIsListening(false);
        
        toast({
          title: "Message vocal reçu",
          description: `"${transcript}"`
        });
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Erreur de reconnaissance vocale:', event.error);
        setIsRecording(false);
        setIsListening(false);
        
        let errorMessage = "Erreur de reconnaissance vocale";
        switch (event.error) {
          case 'no-speech':
            errorMessage = "Aucune parole détectée. Réessayez.";
            break;
          case 'audio-capture':
            errorMessage = "Microphone non accessible. Vérifiez les permissions.";
            break;
          case 'not-allowed':
            errorMessage = "Permission microphone refusée.";
            break;
          default:
            errorMessage = "Erreur de reconnaissance vocale. Réessayez.";
        }
        
        toast({
          title: "Erreur",
          description: errorMessage,
          variant: "destructive"
        });
      };
      
      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [toast]);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      toast({
        title: "Non supporté",
        description: "La reconnaissance vocale n'est pas supportée par votre navigateur.",
        variant: "destructive"
      });
      return;
    }
    
    if (isRecording) {
      // Arrêter l'enregistrement
      recognitionRef.current.stop();
      setIsRecording(false);
      setIsListening(false);
    } else {
      // Démarrer l'enregistrement
      try {
        setIsRecording(true);
        recognitionRef.current.start();
        
        toast({
          title: "Écoute en cours...",
          description: "Parlez maintenant, je vous écoute !"
        });
      } catch (error) {
        console.error('Erreur lors du démarrage:', error);
        setIsRecording(false);
        toast({
          title: "Erreur",
          description: "Impossible de démarrer la reconnaissance vocale.",
          variant: "destructive"
        });
      }
    }
  };

  // Fonction pour la synthèse vocale
  const handleTextToSpeech = (messageId: number, text: string) => {
    // Arrêter la lecture en cours si elle existe
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
      setCurrentPlayingId(null);
    }

    // Si c'est le même message, on arrête la lecture
    if (currentPlayingId === messageId) {
      setCurrentPlayingId(null);
      return;
    }

    // Vérifier si la synthèse vocale est supportée
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Non supporté",
        description: "La synthèse vocale n'est pas supportée par votre navigateur.",
        variant: "destructive"
      });
      return;
    }

    // Créer une nouvelle instance de synthèse vocale
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesisRef.current = utterance;
    
    // Configuration de la voix
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Essayer de sélectionner une voix féminine française
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('fr') && 
      (voice.name.toLowerCase().includes('female') || 
       voice.name.toLowerCase().includes('femme') ||
       voice.name.toLowerCase().includes('marie') ||
       voice.name.toLowerCase().includes('claire') ||
       voice.name.toLowerCase().includes('amelie'))
    );
    
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    } else {
      // Fallback vers la première voix française disponible
      const frenchVoice = voices.find(voice => voice.lang.startsWith('fr'));
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }
    }

    // Gestionnaires d'événements
    utterance.onstart = () => {
      setCurrentPlayingId(messageId);
    };

    utterance.onend = () => {
      setCurrentPlayingId(null);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (event) => {
      console.error('Erreur de synthèse vocale:', event.error);
      setCurrentPlayingId(null);
      speechSynthesisRef.current = null;
      
      toast({
        title: "Erreur",
        description: "Erreur lors de la lecture vocale.",
        variant: "destructive"
      });
    };

    // Démarrer la synthèse vocale
    window.speechSynthesis.speak(utterance);
  };

  // Nettoyer la synthèse vocale au démontage du composant
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Charger les voix disponibles
  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    
    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 flex flex-col">
      {/* Header */}
      <div className="gradient-bg px-6 pt-12 pb-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="p-2" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <img 
                  src="/assets/images/Logo_Team.png" 
                  alt="Adjoua IA" 
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="text-white font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Adjoua IA</h1>
                <p className="text-sm text-gray-600">Assistante santé</p>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearConversation}
            className="p-2"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Quick Suggestions - Placées en haut de la conversation */}
      {messages.length <= 1 && (
        <div className="px-6 py-4 bg-white border-b">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Suggestions rapides :</h3>
          <div className="grid grid-cols-1 gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left justify-start h-auto p-3 rounded-xl hover:bg-primary/5 border-gray-200"
              >
                <span className="text-lg mr-3">{suggestion.icon}</span>
                <span className="text-sm font-medium">{suggestion.text}</span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages - Zone de conversation améliorée */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} items-start space-x-3`}
          >
            {/* Avatar pour l'IA */}
            {!message.isUser && (
              <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
                <img 
                  src="/assets/images/Logo_Team.png" 
                  alt="Adjoua IA" 
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="text-white text-xs font-bold">
                  AI
                </AvatarFallback>
              </Avatar>
            )}

            {/* Bulle de message */}
            <div className={`max-w-[75%] ${message.isUser ? 'order-first' : ''}`}>
              <div
                className={`px-4 py-3 rounded-2xl shadow-sm relative group ${
                  message.isUser
                    ? 'bg-primary text-white rounded-br-md ml-auto'
                    : 'bg-white border border-gray-100 rounded-bl-md'
                }`}
              >
                <p className={`text-sm leading-relaxed whitespace-pre-line ${!message.isUser ? 'pr-8' : ''}`}>{message.text}</p>
                {!message.isUser && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTextToSpeech(message.id, message.text)}
                    className={`absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
                      currentPlayingId === message.id 
                        ? 'opacity-100 bg-blue-100 hover:bg-blue-200' 
                        : 'hover:bg-gray-100'
                    }`}
                    title={currentPlayingId === message.id ? "Arrêter la lecture" : "Lire le message"}
                  >
                    {currentPlayingId === message.id ? (
                      <VolumeX className="w-3 h-3 text-blue-600" />
                    ) : (
                      <Volume2 className="w-3 h-3 text-gray-500" />
                    )}
                  </Button>
                )}
              </div>
              <p className={`text-xs mt-2 px-2 ${
                message.isUser
                  ? 'text-gray-500 text-right'
                  : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
                {!message.isUser && currentPlayingId === message.id && (
                  <span className="ml-2 text-blue-500 animate-pulse">🔊 En cours de lecture...</span>
                )}
              </p>
            </div>

            {/* Avatar pour l'utilisateur */}
            {message.isUser && (
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-xs font-bold">Moi</span>
              </div>
            )}
          </div>
        ))}

        {/* Indicateur de frappe */}
        {isTyping && (
          <div className="flex justify-start items-start space-x-3">
            <Avatar className="w-8 h-8 flex-shrink-0 mt-1">
              <img 
                src="/assets/images/Logo_Team.png" 
                alt="Adjoua IA" 
                className="w-full h-full object-cover rounded-full"
              />
              <AvatarFallback className="text-white text-xs font-bold">
                AI
              </AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[75%]">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Zone de saisie fixe en bas */}
      <div className="flex-shrink-0 bg-white border-t px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Tapez votre message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="pr-12 h-12 rounded-full border-gray-300 focus:border-primary focus:ring-primary"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={handleVoiceInput}
              className={`absolute right-1 top-1 w-10 h-10 rounded-full p-0 transition-all duration-200 ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                  : isListening 
                    ? 'bg-blue-500 hover:bg-blue-600' 
                    : 'hover:bg-gray-100'
              }`}
            >
              {isRecording ? (
                <MicOff className={`w-4 h-4 ${isRecording ? 'text-white' : 'text-gray-400'}`} />
              ) : (
                <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-gray-400'}`} />
              )}
            </Button>
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="w-12 h-12 rounded-full bg-primary hover:bg-primary/90 p-0 shadow-lg"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdjouaChat;
