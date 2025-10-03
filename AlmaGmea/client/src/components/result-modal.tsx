import { Button } from "@/components/ui/button";
import { Heart, Share2, RotateCcw, X } from "lucide-react";
import type { SoulMateProfile } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ResultModalProps {
  isOpen: boolean;
  profile: SoulMateProfile | null;
  token: string | null;
  userName: string;
  onClose: () => void;
  onStartOver: () => void;
}

export function ResultModal({ isOpen, profile, token, userName, onClose, onStartOver }: ResultModalProps) {
  const { toast } = useToast();

  const shareResult = () => {
    if (token) {
      const url = `${window.location.origin}?result=${token}`;
      if (navigator.share) {
        navigator.share({
          title: 'Descobri minha Alma Gêmea!',
          text: 'Veja quem é a minha alma gêmea perfeita!',
          url: url
        });
      } else {
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
          });
        });
      }
    }
  };

  if (!isOpen || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl max-w-2xl w-full glass-effect romantic-shadow animate-slide-up">
          <div className="p-8">
            <div className="text-center mb-8">
              <Heart className="w-16 h-16 text-primary mb-4 mx-auto animate-heart-beat" />
              <h3 className="font-serif text-3xl font-bold mb-2" data-testid="result-title">
                Sua Alma Gêmea Encontrada!
              </h3>
              <p className="text-muted-foreground">
                O universo conspirou para revelar sua conexão perfeita
              </p>
            </div>

            <div className="space-y-6" data-testid="result-content">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <img
                    src={profile.image_url}
                    alt={profile.name}
                    data-testid="result-profile-image"
                    className="w-48 h-48 rounded-full object-cover mx-auto romantic-shadow"
                  />
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div>
                  <h4 className="font-serif text-3xl font-bold text-foreground mb-2" data-testid="result-profile-name">
                    {profile.name}
                  </h4>
                  <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed" data-testid="result-profile-description">
                    {profile.description}
                  </p>
                </div>
                
                <div className="bg-muted/50 rounded-xl p-6">
                  <p className="text-center text-muted-foreground" data-testid="result-match-explanation">
                    <strong>{userName}</strong>, baseado na sua essência única, 
                    <strong> {profile.name}</strong> é a pessoa que complementa 
                    perfeitamente sua energia e personalidade. Vocês compartilham 
                    uma conexão especial que transcende o comum.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={shareResult}
                data-testid="button-share-result"
                className="flex-1 love-gradient hover:scale-105 mystic-glow transition-all font-serif"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Compartilhar Resultado
              </Button>
              <Button
                variant="outline"
                onClick={onStartOver}
                data-testid="button-start-over"
                className="flex-1 border-accent text-accent hover:bg-accent/10 transition-all"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button
                variant="outline"
                onClick={onClose}
                data-testid="button-close-result"
                className="sm:flex-none border-primary text-primary hover:bg-primary/10 transition-all"
              >
                <X className="w-4 h-4 mr-2" />
                Fechar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
