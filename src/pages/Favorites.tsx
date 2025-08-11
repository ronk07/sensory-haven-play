import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const Favorites = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Favorites – Sensory Haven</title>
        <meta name="description" content="Quick access to your go-to calming tools." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Favorites</h1>
      <p className="text-muted-foreground">Pin your most helpful tools. (Coming soon)</p>
    </main>
  );
};

export default Favorites;
