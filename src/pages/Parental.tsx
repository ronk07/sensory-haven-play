import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const Parental = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Parental Dashboard – Sensory Haven</title>
        <meta name="description" content="Usage insights and content controls for caregivers." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Parental Dashboard</h1>
      <p className="text-muted-foreground">Reports and controls. (Coming soon)</p>
    </main>
  );
};

export default Parental;
