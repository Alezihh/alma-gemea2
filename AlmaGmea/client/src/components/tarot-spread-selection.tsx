import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TarotCard {
  id: number;
  name: string;
  image: string;
  description: string;
}

interface TarotSpreadSelectionProps {
  onComplete: (selectedCards: number[]) => void;
}

const TAROT_CARDS_DATA = [
  { id: 1, name: "A Lua", image: "🌙", description: "Intuição" },
  { id: 2, name: "O Julgamento", image: "⚖️", description: "Renovação" },
  { id: 3, name: "A Estrela", image: "⭐", description: "Esperança" },
  { id: 4, name: "O Sol", image: "☀️", description: "Alegria" },
  { id: 5, name: "O Mundo", image: "🌍", description: "Realização" },
  { id: 6, name: "O Louco", image: "🌟", description: "Novos começos" },
  { id: 7, name: "A Maga", image: "✨", description: "Manifestação" },
  { id: 8, name: "A Imperatriz", image: "🌸", description: "Abundância" },
];

// Simple card initialization - organized layout
const initializeCardData = (): TarotCard[] => {
  return TAROT_CARDS_DATA.map((card, index) => ({
    ...card,
    id: index + 1,
  }));
};

export function TarotSpreadSelection({ onComplete }: TarotSpreadSelectionProps) {
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    setCards(initializeCardData());
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  }, []);
  
  const handleCardClick = (cardId: number) => {
    if (selectedCards.includes(cardId)) {
      // Deselect
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else if (selectedCards.length < 3) {
      // Select
      setSelectedCards([...selectedCards, cardId]);
    } else {
      // Max 3 cards
      toast({
        title: "Limite atingido",
        description: "Selecione no máximo 3 cartas",
        variant: "destructive",
      });
    }
  };
  
  const handleReveal = () => {
    if (selectedCards.length === 3) {
      onComplete(selectedCards);
    }
  };
  
  const handleShuffle = () => {
    setCards(initializeCardData());
    setSelectedCards([]);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);
  };
  
  return (
    <div className="fixed inset-0 z-50 bg-background overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-background to-transparent p-3 sm:p-6 pb-8 sm:pb-12">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif text-gradient mb-1 sm:mb-2 animate-shimmer" style={{ fontFamily: 'Cinzel, serif' }}>
            Escolha 3 cartas do Tarot
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-accent mb-2 sm:mb-3">
            Deixe sua intuição guiar suas escolhas
          </p>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 glass-effect border-2 border-primary rounded-full mystic-glow">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-primary animate-pulse" />
            <span className="font-medium text-sm sm:text-base text-primary">
              {selectedCards.length} de 3 selecionadas
            </span>
          </div>
        </div>
        
        {/* Shuffle button */}
        <button
          onClick={handleShuffle}
          className="absolute top-3 sm:top-6 right-3 sm:right-6 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 glass-effect hover:mystic-glow border border-accent rounded-lg transition-all text-xs sm:text-sm text-foreground"
          data-testid="button-shuffle"
        >
          <Shuffle className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
          <span className="font-medium hidden sm:inline">Embaralhar</span>
        </button>
      </div>
      
      {/* Cards Container - Organized Grid */}
      <div className="flex items-center justify-center h-full px-4 sm:px-8 md:px-12" data-testid="cards-spread-container">
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 max-w-6xl">
          {cards.map((card, index) => {
            const isSelected = selectedCards.includes(card.id);
            const animationDelay = isAnimating ? index * 100 : 0;
            
            return (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  w-[110px] sm:w-[130px] md:w-[150px] lg:w-[170px]
                  h-[160px] sm:h-[190px] md:h-[220px] lg:h-[250px]
                  transition-all duration-300 cursor-pointer
                  focus:outline-none focus:ring-4 focus:ring-primary/50
                  ${isSelected ? 'scale-105 z-10 animate-mystical-pulse' : 'hover:scale-105'}
                  ${isAnimating ? 'opacity-0 translate-y-8' : 'opacity-100 translate-y-0'}
                `}
                style={{
                  transitionDelay: `${animationDelay}ms`,
                }}
                aria-pressed={isSelected}
                data-testid={`tarot-spread-card-${card.id}`}
              >
                <div className={`
                  relative w-full h-full rounded-xl
                  transition-all duration-300
                  ${isSelected 
                    ? 'mystic-glow ring-4 ring-primary' 
                    : 'romantic-shadow'
                  }
                `}>
                  {/* Card Back */}
                  <div className="absolute inset-0 rounded-xl border-4 border-accent overflow-hidden">
                    <img 
                      src={new URL('@assets/carta-tarot.jpg', import.meta.url).href}
                      alt="Carta de Tarot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* CTA Button */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-background to-transparent p-3 sm:p-6 pt-8 sm:pt-12">
        <div className="max-w-md mx-auto px-2">
          <Button
            onClick={handleReveal}
            disabled={selectedCards.length !== 3}
            className={`
              w-full h-12 sm:h-14 text-base sm:text-lg font-medium rounded-xl font-serif
              transition-all duration-300
              ${selectedCards.length === 3
                ? 'love-gradient hover:scale-105 text-white mystic-glow shadow-2xl hover:shadow-3xl animate-mystical-pulse'
                : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
              }
            `}
            data-testid="button-reveal-cards"
          >
            {selectedCards.length === 3 ? (
              <>
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-pulse" />
                Revelar cartas
              </>
            ) : (
              `Selecione ${3 - selectedCards.length} carta${3 - selectedCards.length > 1 ? 's' : ''}`
            )}
          </Button>
          {selectedCards.length !== 3 && (
            <p className="text-center text-xs sm:text-sm text-accent mt-2">
              Escolha 3 cartas para continuar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
