import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const Breathing = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-10">
      <Helmet>
        <title>Guided Breathing – Sensory Haven</title>
        <meta name="description" content="Gentle breathing exercises with animation." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-6">Guided Breathing</h1>

      <div className="mx-auto grid place-items-center h-72 w-72 rounded-full bg-secondary">
        <div className="h-52 w-52 rounded-full bg-primary/20 animate-breath" />
      </div>
      <p className="mt-6 text-center text-muted-foreground">Inhale 4 • Hold 4 • Exhale 6</p>
    </main>
  );
};

export default Breathing;
