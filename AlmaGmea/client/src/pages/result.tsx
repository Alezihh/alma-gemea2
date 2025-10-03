import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Share2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getSoulMateResult } from "@/lib/api";
import { FloatingHearts } from "@/components/floating-hearts";
import { Link, useParams } from "wouter";

export default function Result() {
  const { token } = useParams<{ token: string }>();
  const { toast } = useToast();
  const [hasShared, setHasShared] = useState(false);

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['/api/result', token],
    queryFn: () => token ? getSoulMateResult(token) : Promise.reject('No token'),
    enabled: !!token,
  });

  const shareResult = () => {
    if (token) {
      const url = `${window.location.origin}/result/${token}`;
      if (navigator.share) {
        navigator.share({
          title: 'Descobri minha Alma Gêmea!',
          text: 'Veja quem é a minha alma gêmea perfeita!',
          url: url
        }).then(() => setHasShared(true));
      } else {
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link copiado!",
            description: "O link foi copiado para a área de transferência.",
          });
          setHasShared(true);
        });
      }
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Heart className="w-12 h-12 text-muted-foreground mb-4 mx-auto" />
            <h1 className="text-2xl font-bold mb-2">Token não encontrado</h1>
            <p className="text-muted-foreground mb-4">
              O link parece estar incompleto ou inválido.
            </p>
            <Link href="/">
              <Button data-testid="button-go-home">
                <ArrowRight className="w-4 h-4 mr-2" />
                Ir para Página Inicial
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Loader2 className="w-12 h-12 text-primary mb-4 mx-auto animate-spin" />
            <h1 className="text-2xl font-bold mb-2" data-testid="loading-title">
              Carregando resultado...
            </h1>
            <p className="text-muted-foreground">
              Aguarde enquanto recuperamos sua alma gêmea.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Heart className="w-12 h-12 text-destructive mb-4 mx-auto" />
            <h1 className="text-2xl font-bold mb-2">Resultado não encontrado</h1>
            <p className="text-muted-foreground mb-4">
              Não conseguimos encontrar este resultado. O link pode ter expirado ou ser inválido.
            </p>
            <Link href="/">
              <Button data-testid="button-try-again">
                <Heart className="w-4 h-4 mr-2" />
                Fazer Novo Teste
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <FloatingHearts />
      
      {/* Navigation */}
      <nav className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-serif text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Alma Gêmea
              </h1>
            </div>
          </Link>
        </div>
      </nav>

      {/* Result Content */}
      <div className="relative z-10 px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <Card className="glass-effect romantic-shadow animate-slide-up">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-primary mb-4 mx-auto animate-heart-beat" />
                <h2 className="font-serif text-3xl font-bold mb-2" data-testid="result-title">
                  Sua Alma Gêmea Encontrada!
                </h2>
                <p className="text-muted-foreground">
                  O universo conspirou para revelar sua conexão perfeita
                </p>
              </div>

              <div className="space-y-6" data-testid="result-content">
                <div className="text-center space-y-6">
                  <div className="relative inline-block">
                    <img
                      src={result.profile.image_url}
                      alt={result.profile.name}
                      data-testid="result-profile-image"
                      className="w-48 h-48 rounded-full object-cover mx-auto romantic-shadow"
                    />
                    <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-serif text-3xl font-bold text-foreground mb-2" data-testid="result-profile-name">
                      {result.profile.name}
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed" data-testid="result-profile-description">
                      {result.profile.description}
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 rounded-xl p-6">
                    <p className="text-center text-muted-foreground" data-testid="result-match-explanation">
                      Baseado na análise única dos dados fornecidos, 
                      <strong> {result.profile.name}</strong> é a pessoa que complementa 
                      perfeitamente sua energia e personalidade. Vocês compartilham 
                      uma conexão especial que transcende o comum.
                    </p>
                  </div>

                  <p className="text-sm text-muted-foreground" data-testid="result-created-date">
                    Resultado gerado em {new Date(result.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  onClick={shareResult}
                  data-testid="button-share-result"
                  className="flex-1 bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {hasShared ? 'Compartilhado!' : 'Compartilhar Resultado'}
                </Button>
                <Link href="/">
                  <Button
                    variant="outline"
                    data-testid="button-new-test"
                    className="flex-1 w-full"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Fazer Novo Teste
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
