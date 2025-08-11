import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const Soundscapes = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Soundscapes – Sensory Haven</title>
        <meta name="description" content="Nature sounds and instruments to relax." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Soundscapes</h1>
      <p className="text-muted-foreground">Loop calm audios. (Coming soon)</p>
    </main>
  );
};

export default Soundscapes;
