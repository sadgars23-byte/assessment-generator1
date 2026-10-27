import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="font-heading text-base font-bold tracking-tight sm:text-lg">
            AI Assessment Generator
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-muted-foreground">
          <Link to="/" activeProps={{ className: "text-foreground" }} className="hover:text-foreground">
            Home
          </Link>
          <Link
            to="/create"
            activeProps={{ className: "text-foreground" }}
            className="hover:text-foreground"
          >
            Create
          </Link>
        </nav>
      </div>
    </header>
  );
}
