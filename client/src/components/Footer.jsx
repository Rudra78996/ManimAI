import { Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t border-border bg-background py-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground font-poppins">
        <p className="text-center sm:text-left">
          By <span className="text-foreground font-medium">Rudra Pratap Singh</span>
        </p>
        <div className="flex gap-4 items-center">
          <a
            href="https://github.com/Rudra78996"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/rudrapratapsingh03/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
