import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface MessagesModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

const MESSAGES = [
  "E eu não estou exagerando quando digo que é um valor simbólico, porque é uma taxa só de R$19,90...",
  "Só lembrando, essa taxa é por todo material que eu tenho que usar e ainda tem todo o meu esforço pra me conectar com vocês dois, você entende né?",
  "Mas olha só, se você me disser que eu posso confiar em você, eu vou te mandar o desenho antes mesmo de você me pagar essa taxinha....",
  "Porque eu ACABEI de terminar o retrato dele e eu já tô MAIS ANSIOSA do que você, eu aposto 😁",
  "Então, eu posso confiar em você né?"
];

export function MessagesModal({ isOpen, onComplete }: MessagesModalProps) {
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setVisibleMessages(0);
      setShowButton(false);
      return;
    }

    // Show messages one by one with delay
    const timers: NodeJS.Timeout[] = [];
    
    MESSAGES.forEach((_, index) => {
      const timer = setTimeout(() => {
        setVisibleMessages(index + 1);
      }, index * 3000); // 3 seconds between each message
      timers.push(timer);
    });

    // Show button after all messages
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, MESSAGES.length * 3000 + 1000);
    timers.push(buttonTimer);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[150] overflow-y-auto">
      <div className="min-h-screen flex items-start sm:items-center justify-center p-3 sm:p-4 py-6">
        <div className="bg-card rounded-3xl max-w-lg w-full glass-effect mystic-glow p-4 sm:p-6 md:p-8 my-auto">
          <div className="space-y-2.5 sm:space-y-3">
            {MESSAGES.map((message, index) => (
              <div
                key={index}
                data-testid={`message-${index + 1}`}
                className={`
                  transform transition-all duration-700 ease-out
                  ${index < visibleMessages 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
                  }
                `}
              >
                <div className="bg-muted/30 rounded-2xl p-3 sm:p-4 border border-primary/20">
                  <p className="text-sm sm:text-base leading-relaxed text-foreground">
                    {message}
                  </p>
                  {index < MESSAGES.length - 1 && (
                    <div className="text-right mt-1">
                      <span className="text-xs text-muted-foreground">01:41</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {showButton && (
              <div 
                className="pt-3 sm:pt-4 animate-fade-in text-center sticky bottom-0 bg-card/80 backdrop-blur-sm -mx-4 sm:-mx-6 md:-mx-8 px-4 sm:px-6 md:px-8 pb-2"
                data-testid="button-container"
              >
                <Button
                  onClick={onComplete}
                  data-testid="button-continue-payment"
                  size="lg"
                  className="love-gradient hover:scale-105 active:scale-95 text-white px-8 sm:px-10 py-4 sm:py-5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform mystic-glow font-serif w-full sm:w-auto touch-manipulation"
                >
                  <span className="flex items-center justify-center space-x-2">
                    <span>Sim, Pode Confiar!</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
