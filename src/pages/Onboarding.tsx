import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { useCanonical } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const steps = ["About You", "Preferences", "Safety"] as const;

type AgeGroup = "6–8" | "9–12" | "13–15";

const Onboarding = () => {
  const canonical = useCanonical();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | "">("");
  const [pref, setPref] = useState<string[]>([]);
  const [triggers, setTriggers] = useState<string[]>([]);

  const toggle = (value: string, setter: (v: string[]) => void, list: string[]) => {
    setter(list.includes(value) ? list.filter(x => x !== value) : [...list, value]);
  };

  const next = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));
  const finish = () => navigate("/dashboard");

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Onboarding – Sensory Haven</title>
        <meta name="description" content="Set up a personalized calming space." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <h1 className="text-3xl font-display mb-6">Let’s set up your space</h1>

      <div className="flex items-center gap-2 mb-6">
        {steps.map((s, i) => (
          <div key={s} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-primary' : 'bg-muted'}`} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 0 && (
            <div className="grid gap-4 max-w-xl">
              <label className="grid gap-2">
                <span className="text-sm">Display name (optional)</span>
                <input
                  className="h-11 rounded-md border bg-background px-3"
                  placeholder="e.g. Maya"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm">Age group</span>
                <select
                  className="h-11 rounded-md border bg-background px-3"
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
                >
                  <option value="" disabled>Choose</option>
                  <option value="6–8">6–8</option>
                  <option value="9–12">9–12</option>
                  <option value="13–15">13–15</option>
                </select>
              </label>
            </div>
          )}

          {step === 1 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Music",
                "Touch games",
                "Visuals",
                "Soundscapes",
                "Breathing",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => toggle(p, setPref, pref)}
                  className={`rounded-md border px-4 py-3 text-left ${
                    pref.includes(p) ? 'bg-secondary' : 'hover:bg-muted'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Loud noises",
                "Bright flashes",
                "Scratchy textures",
                "High pitch sounds",
              ].map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(t, setTriggers, triggers)}
                  className={`rounded-md border px-4 py-3 text-left ${
                    triggers.includes(t) ? 'bg-secondary' : 'hover:bg-muted'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-2">
            <Button variant="secondary" onClick={back} disabled={step === 0}>Back</Button>
            {step < steps.length - 1 ? (
              <Button onClick={next}>Next</Button>
            ) : (
              <Button onClick={finish}>Finish</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Onboarding;
