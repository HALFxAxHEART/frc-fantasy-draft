import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
      <div className="container flex flex-col md:flex-row justify-center items-center gap-4 text-xs md:text-sm text-muted-foreground">
        <a
          href="https://www.thebluealliance.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          Powered by The Blue Alliance
          <ExternalLink className="h-3 w-3" />
        </a>
        <div className="flex items-center gap-4">
          <Link
            to="/privacy-policy"
            className="hover:text-foreground transition-colors"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};