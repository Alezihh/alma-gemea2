import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { User, Calendar, MapPin, Mail, Star, Ruler, ArrowRight, ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { soulMateSubmissionSchema, type SoulMateSubmission } from "@shared/schema";
import { submitSoulMateData } from "@/lib/api";
import { TarotTransitionModal } from "./tarot-transition-modal";
import { TarotSpreadSelection } from "./tarot-spread-selection";

interface MultiStepFormProps {
  onClose: () => void;
  onResult: (result: any) => void;
  onLoading: (loading: boolean) => void;
}

const TAROT_CARDS = [
  { id: 1, name: "O Louco", image: "🌟", description: "Início de jornadas e novos começos", pattern: "hexagon", rotation: -8 },
  { id: 2, name: "A Maga", image: "✨", description: "Manifestação e criação", pattern: "moon", rotation: 5 },
  { id: 3, name: "A Alta Sacerdotisa", image: "🌙", description: "Intuição e sabedoria interior", pattern: "rays", rotation: -3 },
  { id: 4, name: "A Imperatriz", image: "🌸", description: "Fertilidade e abundância", pattern: "circle", rotation: 7 },
  { id: 5, name: "O Imperador", image: "👑", description: "Autoridade e estrutura", pattern: "hexagon", rotation: -5 },
  { id: 6, name: "O Papa", image: "🔮", description: "Tradição e espiritualidade", pattern: "moon", rotation: 4 },
  { id: 7, name: "Os Amantes", image: "💕", description: "Amor e escolhas do coração", pattern: "rays", rotation: -6 },
  { id: 8, name: "O Carro", image: "⚡", description: "Força de vontade e determinação", pattern: "circle", rotation: 6 },
  { id: 9, name: "A Força", image: "🦁", description: "Coragem e força interior", pattern: "hexagon", rotation: -4 },
  { id: 10, name: "A Estrela", image: "⭐", description: "Esperança e orientação divina", pattern: "moon", rotation: 3 },
];

const TarotCardPattern = ({ pattern }: { pattern: string }) => {
  switch (pattern) {
    case "hexagon":
      return (
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
          <pattern id="hexagon" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
            <polygon points="10,2 18,7 18,13 10,18 2,13 2,7" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#hexagon)" />
          <circle cx="50" cy="30" r="3" fill="currentColor" opacity="0.6" />
          <circle cx="50" cy="70" r="3" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "moon":
      return (
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="1" />
          {[...Array(20)].map((_, i) => {
            const angle = (i * 360) / 20;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 25 * Math.cos(rad);
            const y1 = 50 + 25 * Math.sin(rad);
            const x2 = 50 + 35 * Math.cos(rad);
            const y2 = 50 + 35 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="0.8" />;
          })}
          <path d="M 35 15 Q 30 30 35 45" fill="currentColor" opacity="0.6" />
          <path d="M 65 55 Q 70 70 65 85" fill="currentColor" opacity="0.6" />
        </svg>
      );
    case "rays":
      return (
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
          <pattern id="zigzag" x="0" y="0" width="15" height="10" patternUnits="userSpaceOnUse">
            <path d="M 0,5 L 7.5,0 L 15,5 L 7.5,10 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
          <rect width="100" height="100" fill="url(#zigzag)" />
          <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.7" />
        </svg>
      );
    case "circle":
      return (
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 15 * Math.cos(rad);
            const y1 = 50 + 15 * Math.sin(rad);
            const x2 = 50 + 40 * Math.cos(rad);
            const y2 = 50 + 40 * Math.sin(rad);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="currentColor" strokeWidth="1" />;
          })}
          <circle cx="50" cy="50" r="12" fill="currentColor" opacity="0.7" />
        </svg>
      );
    default:
      return null;
  }
};

const STEPS = [
  { icon: User, title: "Qual é o seu nome?", subtitle: "Como você gostaria de ser chamado(a)?" },
  { icon: Calendar, title: "Quando você nasceu?", subtitle: "Sua data de nascimento é essencial para nossa análise" },
  { icon: MapPin, title: "Onde você mora?", subtitle: "Sua localização influencia sua personalidade única" },
  { icon: Star, title: "Qual o seu signo?", subtitle: "As estrelas podem revelar sua personalidade" },
  { icon: Ruler, title: "Qual a sua altura?", subtitle: "Suas características físicas únicas" },
  { icon: Mail, title: "Seu e-mail", subtitle: "Para que possamos enviar seu resultado (opcional)" },
  { icon: Sparkles, title: "Escolha 3 cartas do Tarot", subtitle: "Deixe sua intuição guiar suas escolhas para revelar seu destino" },
];

export function MultiStepForm({ onClose, onResult, onLoading }: MultiStepFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showTarotSpread, setShowTarotSpread] = useState(false);
  const [showTarotTransition, setShowTarotTransition] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SoulMateSubmission>({
    resolver: zodResolver(soulMateSubmissionSchema),
    defaultValues: {
      name: "",
      birthdate: "",
      city: "",
      zodiacSign: "",
      height: "",
      email: "",
      preferences: "",
      tarotCards: [],
    },
  });

  const submitMutation = useMutation({
    mutationFn: submitSoulMateData,
    onSuccess: (result) => {
      onLoading(false);
      onResult(result);
    },
    onError: (error) => {
      onLoading(false);
      toast({
        variant: "destructive",
        title: "Ops! Algo deu errado",
        description: "Não conseguimos conectar com o universo no momento. Tente novamente.",
      });
    },
  });

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);
    
    if (isValid) {
      if (currentStep === 6) {
        // After email, show tarot spread selection
        setShowTarotSpread(true);
      } else if (currentStep < 6) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number): (keyof SoulMateSubmission)[] => {
    switch (step) {
      case 1: return ["name"];
      case 2: return ["birthdate"];
      case 3: return ["city"];
      case 4: return ["zodiacSign"];
      case 5: return ["height"];
      case 6: return ["email"];
      case 7: return ["tarotCards"];
      default: return [];
    }
  };

  const onSubmit = (data: SoulMateSubmission) => {
    // Show tarot transition modal first
    setShowTarotTransition(true);
  };

  const handleTarotCardsSelected = (selectedCards: number[]) => {
    // Update form with selected cards
    form.setValue('tarotCards', selectedCards);
    // Hide spread and show transition
    setShowTarotSpread(false);
    setShowTarotTransition(true);
  };
  
  const handleTarotTransitionComplete = () => {
    setShowTarotTransition(false);
    onLoading(true);
    const formData = form.getValues();
    submitMutation.mutate(formData);
  };

  const progress = (currentStep / 7) * 100;
  const StepIcon = STEPS[currentStep - 1].icon;

  // Show tarot spread selection if user completed step 6
  if (showTarotSpread) {
    return <TarotSpreadSelection onComplete={handleTarotCardsSelected} />;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4">
      <div className={`bg-card rounded-3xl max-w-md w-full glass-effect romantic-shadow animate-slide-up ${showTarotTransition ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-300`}>
        <div className="p-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Passo <span data-testid="step-number">{currentStep}</span> de 7
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-testid="button-close-form"
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </Button>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
              data-testid="progress-bar"
            />
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Step Content */}
            <div className="text-center mb-6">
              <StepIcon className="w-12 h-12 text-primary mb-4 mx-auto" />
              <h3 className="font-serif text-2xl font-bold mb-2">{STEPS[currentStep - 1].title}</h3>
              <p className="text-muted-foreground">{STEPS[currentStep - 1].subtitle}</p>
            </div>

            <div className="space-y-4">
              {/* Step 1: Name */}
              {currentStep === 1 && (
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite seu nome completo"
                          data-testid="input-name"
                          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 2: Birthdate */}
              {currentStep === 2 && (
                <FormField
                  control={form.control}
                  name="birthdate"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          data-testid="input-birthdate"
                          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 3: City */}
              {currentStep === 3 && (
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Digite sua cidade"
                          data-testid="input-city"
                          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 4: Zodiac Sign */}
              {currentStep === 4 && (
                <FormField
                  control={form.control}
                  name="zodiacSign"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="grid grid-cols-2 gap-3"
                          data-testid="radio-zodiac-sign"
                        >
                          <Label htmlFor="aries" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="aries" id="aries" />
                            <span className="flex-1">♈ Áries</span>
                          </Label>
                          <Label htmlFor="touro" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="touro" id="touro" />
                            <span className="flex-1">♉ Touro</span>
                          </Label>
                          <Label htmlFor="gemeos" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="gemeos" id="gemeos" />
                            <span className="flex-1">♊ Gêmeos</span>
                          </Label>
                          <Label htmlFor="cancer" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="cancer" id="cancer" />
                            <span className="flex-1">♋ Câncer</span>
                          </Label>
                          <Label htmlFor="leao" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="leao" id="leao" />
                            <span className="flex-1">♌ Leão</span>
                          </Label>
                          <Label htmlFor="virgem" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="virgem" id="virgem" />
                            <span className="flex-1">♍ Virgem</span>
                          </Label>
                          <Label htmlFor="libra" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="libra" id="libra" />
                            <span className="flex-1">♎ Libra</span>
                          </Label>
                          <Label htmlFor="escorpiao" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="escorpiao" id="escorpiao" />
                            <span className="flex-1">♏ Escorpião</span>
                          </Label>
                          <Label htmlFor="sagitario" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="sagitario" id="sagitario" />
                            <span className="flex-1">♐ Sagitário</span>
                          </Label>
                          <Label htmlFor="capricornio" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="capricornio" id="capricornio" />
                            <span className="flex-1">♑ Capricórnio</span>
                          </Label>
                          <Label htmlFor="aquario" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="aquario" id="aquario" />
                            <span className="flex-1">♒ Aquário</span>
                          </Label>
                          <Label htmlFor="peixes" className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors cursor-pointer active:scale-95">
                            <RadioGroupItem value="peixes" id="peixes" />
                            <span className="flex-1">♓ Peixes</span>
                          </Label>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 5: Height */}
              {currentStep === 5 && (
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="space-y-3"
                          data-testid="radio-height"
                        >
                          <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="baixo" id="baixo" />
                            <Label htmlFor="baixo" className="flex-1 cursor-pointer">Baixo(a) - até 1,60m</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="medio" id="medio" />
                            <Label htmlFor="medio" className="flex-1 cursor-pointer">Médio(a) - 1,61m a 1,75m</Label>
                          </div>
                          <div className="flex items-center space-x-3 p-3 border border-input rounded-lg hover:bg-muted/50 transition-colors">
                            <RadioGroupItem value="alto" id="alto" />
                            <Label htmlFor="alto" className="flex-1 cursor-pointer">Alto(a) - acima de 1,75m</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 6: Email */}
              {currentStep === 6 && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Digite seu e-mail"
                          data-testid="input-email"
                          className="w-full px-4 py-3 rounded-lg focus:ring-2 focus:ring-ring"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Step 7: Tarot Cards */}
              {currentStep === 7 && (
                <FormField
                  control={form.control}
                  name="tarotCards"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <div className="text-center text-sm text-muted-foreground mb-4">
                        Selecione exatamente 3 cartas que mais chamam sua atenção
                      </div>
                      <FormControl>
                        <div className="grid grid-cols-2 gap-6 max-h-96 overflow-y-auto p-4" data-testid="tarot-cards-grid">
                          {TAROT_CARDS.map((card) => {
                            const isSelected = field.value?.includes(card.id) || false;
                            const isDisabled = (field.value?.length || 0) >= 3 && !isSelected;
                            
                            return (
                              <div
                                key={card.id}
                                onClick={() => {
                                  if (isDisabled) return;
                                  const currentCards = field.value || [];
                                  if (isSelected) {
                                    field.onChange(currentCards.filter(id => id !== card.id));
                                  } else if (currentCards.length < 3) {
                                    field.onChange([...currentCards, card.id]);
                                  }
                                }}
                                className={`
                                  tarot-card cursor-pointer transition-all duration-300
                                  ${isSelected ? 'flipped' : ''}
                                  ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105'}
                                `}
                                style={{
                                  transform: isSelected ? '' : `rotate(${card.rotation}deg)`,
                                  transition: 'all 0.3s ease'
                                }}
                                data-testid={`tarot-card-${card.id}`}
                              >
                                <div className="tarot-card-inner">
                                  {/* Verso da carta (face down) */}
                                  <div className="tarot-card-back text-accent">
                                    <div className="absolute inset-0 p-2">
                                      <TarotCardPattern pattern={card.pattern} />
                                    </div>
                                  </div>
                                  
                                  {/* Frente da carta (face up) */}
                                  <div className={`
                                    tarot-card-front border-2 p-4
                                    ${isSelected 
                                      ? 'border-primary bg-primary/10 shadow-lg' 
                                      : 'border-muted bg-card'
                                    }
                                  `}>
                                    <div className="text-center h-full flex flex-col items-center justify-center">
                                      <div className="text-4xl mb-2">{card.image}</div>
                                      <div className="font-medium text-sm mb-1">{card.name}</div>
                                      <div className="text-xs text-muted-foreground line-clamp-2">{card.description}</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </FormControl>
                      <div className="text-center text-sm">
                        <span className={`font-medium ${(field.value?.length || 0) === 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {field.value?.length || 0} de 3 cartas selecionadas
                        </span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={previousStep}
                data-testid="button-previous"
                className={`px-6 py-3 ${currentStep === 1 ? 'invisible' : ''}`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>
              
              {currentStep < 7 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  data-testid="button-next"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                >
                  Próximo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                  className="px-8 py-3 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90"
                >
                  {submitMutation.isPending ? (
                    "Analisando..."
                  ) : (
                    <>
                      Encontrar Alma Gêmea
                      <Heart className="w-4 h-4 ml-2 animate-heart-beat" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
        </div>
      </div>

      {/* Tarot Transition Modal - Rendered outside card container */}
      {showTarotTransition && (
        <TarotTransitionModal 
          isOpen={showTarotTransition}
          onComplete={handleTarotTransitionComplete}
        />
      )}
    </div>
  );
}
