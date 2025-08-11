import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const VisualCalm = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Visual Calm – Sensory Haven</title>
        <meta name="description" content="Soothing patterns and nature scenes." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Visual Calm</h1>
      <p className="text-muted-foreground">Adjustable calming visuals. (Coming soon)</p>
    </main>
  );
};

export default VisualCalm;
