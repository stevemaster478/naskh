import { MessageCircle, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-8" data-testid="footer">
      <div className="max-w-4xl mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-lg mb-1">Naṣkh</h3>
            <p className="text-sm text-muted-foreground">
              Strumento di trascrizione arabo-latino secondo DIN 31635
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 - Per studenti di ʿilm, traduttori e ricercatori
            </p>
          </div>

          <div className="flex gap-4">
            <a
              href="https://t.me/niuffars"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-telegram"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover-elevate active-elevate-2 transition-all"
            >
              <MessageCircle className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">@niuffars</span>
            </a>
            <a
              href="https://github.com/stevemaster478"
              target="_blank"
              rel="noopener noreferrer"
              data-testid="link-github"
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover-elevate active-elevate-2 transition-all"
            >
              <Github className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium">@stevemaster478</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
