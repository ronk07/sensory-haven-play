import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import hero from "@/assets/hero-aurora.png";
import mascot from "@/assets/mascot.png";
import { Button } from "@/components/ui/button";
import { AuroraBG } from "@/components/AuroraBG";
import { useCanonical } from "@/lib/seo";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const canonical = useCanonical();
  const { user } = useAuth();

  return (
    <main className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      <Helmet>
        <title>Sensory Haven – Inclusive Sensory Regulation for Kids</title>
        <meta
          name="description"
          content="Personalized calming tools, music, visuals, and games for autistic kids. Inclusive, kid-friendly, and accessible."
        />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <AuroraBG />

      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div className="animate-enter">
          <h1 className="text-4xl md:text-5xl font-display leading-tight mb-4">
            A cozy space to feel calm, comfy, and in control
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-prose">
            Sensory Haven adapts to your child's preferences with gentle music,
            playful touch games, soothing visuals, and guided breathing.
          </p>
          <div className="flex flex-wrap gap-3">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="hero" size="xl">Go to Dashboard</Button>
                </Link>
                <Link to="/onboarding">
                  <Button variant="secondary" size="lg">Update Setup</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="hero" size="xl">Get Started</Button>
                </Link>
                <Link to="/auth">
                  <Button variant="secondary" size="lg">Sign In</Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <img
            src={hero}
            alt="Soft aurora gradient background"
            className="w-full rounded-xl shadow-elevate"
            loading="eager"
          />
          <img
            src={mascot}
            alt="Friendly Sensory Haven mascot"
            className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full shadow-glow animate-scale-in"
            loading="lazy"
          />
        </div>
      </section>
    </main>
  );
};

export default Index;
