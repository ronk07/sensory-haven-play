import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const TouchGames = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Touch & Feel – Sensory Haven</title>
        <meta name="description" content="Virtual slime, bubbles, textures." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Touch & Feel</h1>
      <p className="text-muted-foreground">Interactive tactile games. (Coming soon)</p>
    </main>
  );
};

export default TouchGames;
