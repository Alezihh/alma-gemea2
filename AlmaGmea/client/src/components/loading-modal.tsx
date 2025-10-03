import { useEffect, useState } from "react";
import { Heart } from "lucide-react";

interface LoadingModalProps {
  isOpen: boolean;
}

export function LoadingModal({ isOpen }: LoadingModalProps) {
  const [currentLoadingStep, setCurrentLoadingStep] = useState(1);

  useEffect(() => {
    if (!isOpen) {
      setCurrentLoadingStep(1);
      return;
    }

    const interval = setInterval(() => {
      setCurrentLoadingStep(prev => {
        if (prev >= 3) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen]);

  const steps = [
    "✨ Processando seus dados pessoais",
    "🔮 Analisando compatibilidade cósmica",
    "💕 Encontrando sua conexão perfeita",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-card rounded-3xl max-w-md w-full glass-effect romantic-shadow text-center p-12">
          <div className="mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
              <Heart className="w-12 h-12 text-primary absolute inset-0 m-auto animate-pulse-slow" />
            </div>
            <h3 className="font-serif text-2xl font-bold mb-4" data-testid="loading-title">
              Analisando sua essência...
            </h3>
            <p className="text-muted-foreground mb-6">
              Estamos conectando você com sua alma gêmea perfeita
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              {steps.map((step, index) => (
                <p
                  key={index}
                  data-testid={`loading-step-${index + 1}`}
                  className={`transition-opacity duration-500 ${
                    currentLoadingStep > index ? 'opacity-100' : 
                    currentLoadingStep === index + 1 ? 'opacity-100' : 'opacity-30'
                  }`}
                >
                  {step}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
