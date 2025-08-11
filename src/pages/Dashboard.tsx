import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Touchpad, Sparkles, Waves, Heart, Gamepad2, Shield, Wind } from "lucide-react";
import { Link } from "react-router-dom";

const tiles = [
  { to: "/music", label: "Music Corner", Icon: Music, desc: "Calm, happy, cultural" },
  { to: "/touch", label: "Touch & Feel", Icon: Gamepad2, desc: "Slime, bubbles, sand" },
  { to: "/visual", label: "Visual Calm", Icon: Sparkles, desc: "Soft patterns & scenes" },
  { to: "/sound", label: "Soundscapes", Icon: Waves, desc: "Nature & instruments" },
  { to: "/breathing", label: "Breathing", Icon: Wind, desc: "Inhale, hold, exhale" },
  { to: "/favorites", label: "Favorites", Icon: Heart, desc: "Your go‑tos" },
];

const Dashboard = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Dashboard – Sensory Haven</title>
        <meta name="description" content="Personalized calming tools and activities." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <h1 className="text-3xl font-display mb-6">Your Haven</h1>
      <p className="text-muted-foreground mb-8">Choose an activity to begin.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiles.map(({ to, label, Icon, desc }) => (
          <Link key={to} to={to} className="group">
            <Card className="h-full transition hover:shadow-elevate">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className="h-5 w-5" /> {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">{desc}</CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-10 text-sm text-muted-foreground">
        Emergency Calming is always available via the red button.
      </div>
    </main>
  );
};

export default Dashboard;
