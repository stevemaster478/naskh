import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-4xl mx-auto px-6 md:px-16 h-16 md:h-20 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Naskh
          </h1>
          <p className="text-xs text-muted-foreground hidden md:block">
            Trascrizione DIN 31635
          </p>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
