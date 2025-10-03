import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface TarotTransitionModalProps {
  isOpen: boolean;
  onComplete: () => void;
}

export function TarotTransitionModal({ isOpen, onComplete }: TarotTransitionModalProps) {
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStep(1);
      return;
    }

    const timer1 = setTimeout(() => {
      setCurrentStep(2);
    }, 3000);

    const timer2 = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[150]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl max-w-lg w-full glass-effect mystic-glow text-center p-12 animate-mystical-pulse">
          <div className="mb-8">
            {/* Animated Crystal Ball or Mystical Icon */}
            <div className="relative w-32 h-32 mx-auto mb-8">
              <div className="absolute inset-4 love-gradient rounded-full opacity-50 animate-pulse"></div>
              <div className="absolute inset-0 border-4 border-primary/50 rounded-full animate-spin-slow"></div>
              <div className="absolute inset-6 border-2 border-accent/60 rounded-full animate-pulse"></div>
              <Sparkles className="w-16 h-16 text-accent absolute inset-0 m-auto animate-float drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            </div>

            {/* Main Revelation Text */}
            <div className="space-y-6">
              <h3 className="font-serif text-3xl font-bold text-gradient leading-tight animate-shimmer" data-testid="tarot-revelation-title">
                A primeira revelação está chegando! 🌌
              </h3>
              
              <p className="text-lg text-accent leading-relaxed" data-testid="tarot-revelation-subtitle">
                Algo muito especial está prestes a ser desvendado sobre quem está destinado a cruzar o seu caminho...
              </p>

              {/* Second Step - Analysis Message */}
              <div className={`transition-opacity duration-1000 ${currentStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                <div className="border-t border-primary/30 pt-6 mt-6">
                  <p className="text-xl font-medium text-foreground leading-relaxed" data-testid="tarot-analysis-message">
                    Irei analisar profundamente as suas cartas, e junto ao meu dom...
                  </p>
                  
                  {/* Mystical dots animation */}
                  <div className="flex justify-center mt-4 space-x-2">
                    <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-0 shadow-lg shadow-primary/50"></div>
                    <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-150 shadow-lg shadow-secondary/50"></div>
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-300 shadow-lg shadow-accent/50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}