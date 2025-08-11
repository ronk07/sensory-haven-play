import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const MusicCorner = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Music Corner – Sensory Haven</title>
        <meta name="description" content="Calming and cultural tunes for kids." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Music Corner</h1>
      <p className="text-muted-foreground mb-6">Browse by mood or culture. (Coming soon)</p>
    </main>
  );
};

export default MusicCorner;
