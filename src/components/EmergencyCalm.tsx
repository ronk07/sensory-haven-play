import { useEffect, useState } from "react";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmergencyCalm = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        aria-label="Open Emergency Calming Mode"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50"
      >
        <Button size="lg" variant="emergency" className="shadow-elevate">
          <ShieldCheck /> Calm Now
        </Button>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Emergency Calming Mode"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 animate-fade-in"
        >
          <div className="w-full max-w-md mx-auto rounded-lg bg-card p-6 text-center shadow-glow animate-scale-in">
            <div className="mx-auto mb-4 grid place-items-center h-40 w-40 rounded-full bg-secondary">
              <div className="h-28 w-28 rounded-full bg-primary/20 animate-breath" />
            </div>
            <h2 className="text-2xl font-display mb-2">You're Safe</h2>
            <p className="text-muted-foreground mb-4">
              Breathe slowly. In through the nose for 4, hold for 4, out for 6.
            </p>
            <div className="flex justify-center gap-2">
              <Button onClick={() => setOpen(false)} className="min-w-28">Close</Button>
              <a href="/breathing">
                <Button variant="secondary" className="min-w-28">Go to Breathing</Button>
              </a>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
