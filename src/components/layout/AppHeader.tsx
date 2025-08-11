import { Link, NavLink } from "react-router-dom";
import mascot from "@/assets/mascot.png";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/favorites", label: "Favorites" },
  { to: "/settings", label: "Settings" },
  { to: "/parental", label: "Parent" },
];

export const AppHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={mascot}
            alt="Sensory Haven mascot"
            loading="lazy"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-display text-lg">Sensory Haven</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm ${
                  isActive ? "bg-secondary text-foreground" : "hover:bg-secondary"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/onboarding">
            <Button variant="secondary" size="sm">Setup</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
