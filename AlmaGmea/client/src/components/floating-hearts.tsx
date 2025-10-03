import { Heart } from "lucide-react";

export function FloatingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute top-10 left-10 text-primary/20 animate-float" style={{animationDelay: '0s'}}>
        <Heart className="w-8 h-8" />
      </div>
      <div className="absolute top-32 right-20 text-rose-300/30 animate-float" style={{animationDelay: '2s'}}>
        <Heart className="w-6 h-6" />
      </div>
      <div className="absolute bottom-40 left-1/4 text-secondary/20 animate-float" style={{animationDelay: '4s'}}>
        <Heart className="w-7 h-7" />
      </div>
      <div className="absolute bottom-20 right-1/3 text-accent/30 animate-float" style={{animationDelay: '1s'}}>
        <Heart className="w-5 h-5" />
      </div>
      <div className="absolute top-1/2 left-16 text-primary/15 animate-float" style={{animationDelay: '3s'}}>
        <Heart className="w-6 h-6" />
      </div>
      <div className="absolute top-3/4 right-16 text-secondary/25 animate-float" style={{animationDelay: '5s'}}>
        <Heart className="w-7 h-7" />
      </div>
    </div>
  );
}
