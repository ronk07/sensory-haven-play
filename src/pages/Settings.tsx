import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";

const Settings = () => {
  const canonical = useCanonical();
  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Settings – Sensory Haven</title>
        <meta name="description" content="Edit profile, safety and accessibility preferences." />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <h1 className="text-3xl font-display mb-2">Settings</h1>
      <p className="text-muted-foreground">Manage preferences. (Coming soon)</p>
    </main>
  );
};

export default Settings;
