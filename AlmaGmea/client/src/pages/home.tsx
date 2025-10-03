import { useState } from "react";
import { Heart, ArrowRight, UserPen, Wand2, Share2, Shield, EyeOff, Clock, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingHearts } from "@/components/floating-hearts";
import { MultiStepForm } from "@/components/multi-step-form";
import { LoadingModal } from "@/components/loading-modal";
import { MessagesModal } from "@/components/messages-modal";
import { ResultModal } from "@/components/result-modal";
import type { SoulMateProfile } from "@shared/schema";

declare global {
  interface Window {
    fbq: (action: string, event: string, params?: any) => void;
  }
}

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<{ profile: SoulMateProfile; token: string; userName: string } | null>(null);
  const [currentToken, setCurrentToken] = useState<string | null>(null);

  const handleFormResult = (apiResult: any, userName: string = '') => {
    // Store token and show messages modal
    console.log('Showing messages before payment...', apiResult);
    setCurrentToken(apiResult.token);
    setShowMessages(true);
  };

  const handleMessagesComplete = async () => {
    // Track Facebook Pixel conversion before redirecting
    if (currentToken) {
      try {
        // Track server-side conversion
        await fetch(`/api/track-conversion/${currentToken}`, {
          method: 'POST',
        });
        console.log('Facebook Pixel conversion tracked (server-side)');
        
        // Track client-side Purchase event
        if (typeof window.fbq !== 'undefined') {
          window.fbq('track', 'Purchase', {
            value: 19.90,
            currency: 'BRL'
          });
          console.log('Facebook Pixel Purchase tracked (client-side)');
        }
      } catch (error) {
        console.error('Failed to track conversion:', error);
      }
    }
    
    // Redirect to payment page after tracking
    console.log('Redirecting to payment page...');
    window.location.href = 'https://pay.kirvano.com/e4c41901-7afa-47a8-a3ea-160341cc2d01';
  };

  const handleStartOver = () => {
    setShowResult(false);
    setResult(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FloatingHearts />
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Alma Gêmea
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#como-funciona" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-how-it-works"
            >
              Como Funciona
            </a>
            <a 
              href="#privacidade" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="link-privacy"
            >
              Privacidade
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="font-serif text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
              Descubra Sua
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {" "}Alma Gêmea
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Graças ao Método Serena, revelamos o perfil da pessoa que não apenas combina com você, mas desperta o amor e a conexão que sua alma sempre buscou.
            </p>
          </div>
          
          <div className="mb-12 relative">
            <div className="rounded-3xl shadow-2xl mx-auto max-w-2xl w-full overflow-hidden romantic-shadow aspect-video">
              <iframe
                className="w-full h-full"
                src="https://www.youtube.com/embed/UJmFGklL7N4?autoplay=1&mute=0&loop=1&playlist=UJmFGklL7N4&controls=0&showinfo=0&rel=0&modestbranding=1"
                title="Vídeo Alma Gêmea"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                data-testid="hero-video"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-3xl pointer-events-none"></div>
          </div>

          <Button
            onClick={() => setShowForm(true)}
            data-testid="button-start-journey"
            size="lg"
            className="group love-gradient hover:scale-110 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform mystic-glow font-serif animate-mystical-pulse"
          >
            <span className="flex items-center justify-center space-x-3">
              <span>Começar Minha Jornada</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </Button>

          <p className="text-sm text-muted-foreground mt-6">
            ✨ 100% gratuito • Resultado instantâneo • Compartilhável
          </p>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold text-gradient mb-4 animate-shimmer">Histórias Reais de Amor</h3>
            <p className="text-xl text-accent">Pessoas que encontraram suas almas gêmeas através da nossa análise mística</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 justify-items-center">
            {/* Depoimento 1 - Fernanda */}
            <div className="glass-effect rounded-2xl overflow-hidden romantic-shadow hover:mystic-glow transition-all duration-300 group" data-testid="testimonial-fernanda">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={new URL('@assets/depoimento-fernanda.jpg', import.meta.url).href}
                  alt="Fernanda e Daniel - Alma Gêmea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              </div>
              <div className="p-6 -mt-20 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary animate-heart-beat" />
                  <h4 className="font-serif text-xl font-bold text-primary">Fernanda & Daniel</h4>
                </div>
                <p className="text-foreground leading-relaxed">
                  A Fernanda não acreditava que o desenho dela fosse realmente a sua alma gêmea, até conhecer o Daniel dois meses depois em uma festa, ele era <strong className="text-primary">IDÊNTICO</strong> ao desenho e a conexão entre os dois foi <strong className="text-accent">IMEDIATA!</strong>
                </p>
              </div>
            </div>

            {/* Depoimento 2 - Daniela */}
            <div className="glass-effect rounded-2xl overflow-hidden romantic-shadow hover:mystic-glow transition-all duration-300 group" data-testid="testimonial-daniela">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={new URL('@assets/depoimento-daniela.jpg', import.meta.url).href}
                  alt="Daniela e Júnior - Alma Gêmea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              </div>
              <div className="p-6 -mt-20 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary animate-heart-beat" />
                  <h4 className="font-serif text-xl font-bold text-primary">Daniela & Júnior</h4>
                </div>
                <p className="text-foreground leading-relaxed">
                  Daniela nunca acreditou nessas coisas e achava que era golpe, mas por curiosidade fez o pedido do seu desenho e, para sua surpresa, conheceu o Júnior <strong className="text-accent">3 DIAS DEPOIS...</strong> Ela me mandou essa foto e hoje em dia já fazem seis meses que eles se <strong className="text-primary">CASARAM!</strong>
                </p>
              </div>
            </div>

            {/* Depoimento 3 - Franciele */}
            <div className="glass-effect rounded-2xl overflow-hidden romantic-shadow hover:mystic-glow transition-all duration-300 group" data-testid="testimonial-franciele">
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={new URL('@assets/depoimento-franciele.jpg', import.meta.url).href}
                  alt="Franciele e Leandro - Alma Gêmea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>
              </div>
              <div className="p-6 -mt-20 relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Heart className="w-5 h-5 text-primary animate-heart-beat" />
                  <h4 className="font-serif text-xl font-bold text-primary">Franciele & Leandro</h4>
                </div>
                <p className="text-foreground leading-relaxed">
                  E a Franciele que sempre conviveu ao lado da sua alma gêmea e não sabia, mas após o desenho ela pode ter certeza que seu colega de trabalho Leandro, era o <strong className="text-accent">amor da sua vida.</strong> Ela também como a Daniele achava que era mais um desses golpes da internet, mas após acreditar ela recebeu o seu desenho da sua alma gêmea e pode ter certeza que o seu sentimento pelo Leandro estava <strong className="text-primary">correto!</strong>
                </p>
              </div>
            </div>
          </div>

          {/* CTA após depoimentos */}
          <div className="text-center mt-16">
            <p className="text-xl text-accent mb-6">Você também pode encontrar sua alma gêmea!</p>
            <Button
              onClick={() => setShowForm(true)}
              data-testid="button-testimonials-cta"
              size="lg"
              className="love-gradient hover:scale-105 text-white px-10 py-3 rounded-full font-semibold transition-all duration-300 mystic-glow font-serif"
            >
              <Heart className="w-5 h-5 mr-2 inline" />
              Descobrir Minha Alma Gêmea
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="como-funciona" className="px-4 py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="font-serif text-4xl font-bold text-foreground mb-4">Como Funciona</h3>
            <p className="text-xl text-muted-foreground">Um processo simples para descobrir sua conexão perfeita</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group" data-testid="step-share-data">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <UserPen className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-serif text-2xl font-semibold mb-4">1. Compartilhe Seus Dados</h4>
              <p className="text-muted-foreground">Forneça informações básicas como nome, data de nascimento e cidade para nossa análise personalizada</p>
            </div>

            <div className="text-center group" data-testid="step-mystical-analysis">
              <div className="w-20 h-20 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Wand2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-serif text-2xl font-semibold mb-4">2. Análise Mística</h4>
              <p className="text-muted-foreground">Nosso algoritmo único analiza sua essência para encontrar o perfil que mais combina com você</p>
            </div>

            <div className="text-center group" data-testid="step-discover-share">
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-serif text-2xl font-semibold mb-4">3. Descubra & Compartilhe</h4>
              <p className="text-muted-foreground">Receba o perfil da sua alma gêmea e compartilhe o resultado com seus amigos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Section */}
      <section id="privacidade" className="px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="font-serif text-4xl font-bold text-foreground mb-4">Privacidade & Transparência</h3>
            <p className="text-xl text-muted-foreground">Sua privacidade é nossa prioridade</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-xl border border-border" data-testid="privacy-secure-data">
              <Shield className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-semibold text-xl mb-3">Dados Seguros</h4>
              <p className="text-muted-foreground">Todas as informações são processadas de forma segura e não são compartilhadas com terceiros.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border" data-testid="privacy-limited-use">
              <EyeOff className="w-12 h-12 text-secondary mb-4" />
              <h4 className="font-semibold text-xl mb-3">Uso Limitado</h4>
              <p className="text-muted-foreground">Seus dados são usados apenas para gerar seu perfil de alma gêmea e podem ser removidos a qualquer momento.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border" data-testid="privacy-transparent-retention">
              <Clock className="w-12 h-12 text-accent mb-4" />
              <h4 className="font-semibold text-xl mb-3">Retenção Transparente</h4>
              <p className="text-muted-foreground">Mantemos os dados apenas pelo tempo necessário para fornecer o serviço.</p>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border" data-testid="privacy-user-control">
              <UserCheck className="w-12 h-12 text-primary mb-4" />
              <h4 className="font-semibold text-xl mb-3">Seu Controle</h4>
              <p className="text-muted-foreground">Você tem total controle sobre seus dados e pode solicitar remoção através do nosso suporte.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alma Gêmea
              </h4>
            </div>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Conectando corações através de uma análise única e personalizada. 
              Descubra a magia de encontrar sua alma gêmea perfeita.
            </p>
            <div className="border-t border-border pt-8">
              <p className="text-sm text-muted-foreground">
                © 2024 Alma Gêmea. Feito com <Heart className="w-3 h-3 text-primary inline mx-1" /> para conectar almas.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {showForm && (
        <MultiStepForm
          onClose={() => setShowForm(false)}
          onResult={(apiResult) => handleFormResult(apiResult, 'Você')}
          onLoading={setIsLoading}
        />
      )}

      <LoadingModal isOpen={isLoading} />

      <MessagesModal 
        isOpen={showMessages}
        onComplete={handleMessagesComplete}
      />

      <ResultModal
        isOpen={showResult}
        profile={result?.profile || null}
        token={result?.token || null}
        userName={result?.userName || 'Você'}
        onClose={() => setShowResult(false)}
        onStartOver={handleStartOver}
      />
    </div>
  );
}
