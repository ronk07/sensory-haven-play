import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  emoji: string;
}

const breathingPatterns: BreathingPattern[] = [
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal timing for balance and focus',
    inhale: 4,
    hold: 4,
    exhale: 4,
    emoji: '⬜'
  },
  {
    id: 'calm',
    name: '4-7-8 Calming',
    description: 'Deep relaxation technique',
    inhale: 4,
    hold: 7,
    exhale: 8,
    emoji: '😌'
  },
  {
    id: 'simple',
    name: 'Simple Breathing',
    description: 'Easy pattern for beginners',
    inhale: 3,
    hold: 2,
    exhale: 4,
    emoji: '🌬️'
  },
  {
    id: 'energizing',
    name: 'Energizing Breath',
    description: 'Quick pattern for alertness',
    inhale: 6,
    hold: 2,
    exhale: 4,
    emoji: '⚡'
  }
];

const Breathing = () => {
  const canonical = useCanonical();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(selectedPattern.inhale);
  const [sessionLength, setSessionLength] = useState('2'); // minutes
  const [totalTime, setTotalTime] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [cycles, setCycles] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout>();
  const speechRef = useRef<SpeechSynthesisUtterance>();

  const sessionOptions = [
    { value: '1', label: '1 minute' },
    { value: '2', label: '2 minutes' },
    { value: '3', label: '3 minutes' },
    { value: '5', label: '5 minutes' },
    { value: '10', label: '10 minutes' }
  ];

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            // Move to next phase
            if (currentPhase === 'inhale') {
              setCurrentPhase('hold');
              speakPhase('hold');
              return selectedPattern.hold;
            } else if (currentPhase === 'hold') {
              setCurrentPhase('exhale');
              speakPhase('exhale');
              return selectedPattern.exhale;
            } else {
              // Complete cycle
              setCurrentPhase('inhale');
              setCycles(prev => prev + 1);
              speakPhase('inhale');
              return selectedPattern.inhale;
            }
          }
          return prev - 1;
        });
        
        setTotalTime(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isActive, currentPhase, selectedPattern]);

  useEffect(() => {
    // Check if session is complete
    const sessionSeconds = parseInt(sessionLength) * 60;
    if (totalTime >= sessionSeconds && isActive) {
      stopSession();
      speakPhase('complete');
    }
  }, [totalTime, sessionLength, isActive]);

  const speakPhase = (phase: 'inhale' | 'hold' | 'exhale' | 'complete') => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    const messages = {
      inhale: 'Breathe in',
      hold: 'Hold',
      exhale: 'Breathe out',
      complete: 'Session complete. Well done!'
    };

    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }

    speechRef.current = new SpeechSynthesisUtterance(messages[phase]);
    speechRef.current.rate = 0.8;
    speechRef.current.pitch = 1;
    speechRef.current.volume = 0.7;
    window.speechSynthesis.speak(speechRef.current);
  };

  const startSession = () => {
    setIsActive(true);
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setTotalTime(0);
    setCycles(0);
    speakPhase('inhale');
  };

  const stopSession = () => {
    setIsActive(false);
    clearInterval(intervalRef.current);
    if (speechRef.current) {
      window.speechSynthesis.cancel();
    }
  };

  const resetSession = () => {
    stopSession();
    setCurrentPhase('inhale');
    setTimeLeft(selectedPattern.inhale);
    setTotalTime(0);
    setCycles(0);
  };

  const changePattern = (patternId: string) => {
    const pattern = breathingPatterns.find(p => p.id === patternId);
    if (pattern) {
      setSelectedPattern(pattern);
      if (!isActive) {
        setCurrentPhase('inhale');
        setTimeLeft(pattern.inhale);
      }
    }
  };

  const getCircleScale = () => {
    const totalDuration = currentPhase === 'inhale' ? selectedPattern.inhale :
                         currentPhase === 'hold' ? selectedPattern.hold :
                         selectedPattern.exhale;
    
    const progress = (totalDuration - timeLeft) / totalDuration;
    
    if (currentPhase === 'inhale') {
      return 0.6 + (progress * 0.4); // Scale from 0.6 to 1.0
    } else if (currentPhase === 'exhale') {
      return 1.0 - (progress * 0.4); // Scale from 1.0 to 0.6
    } else {
      return 1.0; // Hold at full size
    }
  };

  const getPhaseColor = () => {
    switch (currentPhase) {
      case 'inhale': return '#3b82f6'; // Blue
      case 'hold': return '#10b981'; // Green
      case 'exhale': return '#8b5cf6'; // Purple
      default: return '#3b82f6';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PatternCard = ({ pattern }: { pattern: BreathingPattern }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
        selectedPattern.id === pattern.id ? 'ring-2 ring-primary' : ''
      }`}
      onClick={() => !isActive && changePattern(pattern.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{pattern.emoji}</span>
              {pattern.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{pattern.description}</p>
          </div>
          <FavoriteButton
            activityType="breathing"
            activityData={pattern}
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          Inhale {pattern.inhale}s • Hold {pattern.hold}s • Exhale {pattern.exhale}s
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Guided Breathing – Sensory Haven</title>
        <meta name="description" content="Gentle breathing exercises with animation." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Guided Breathing</h1>
          <p className="text-muted-foreground">Find your calm with guided breathing patterns</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
          >
            {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            Voice Guide
          </Button>
        </div>
      </div>

      {/* Breathing Animation */}
      <Card className="mb-6">
        <CardContent className="p-8">
          <div className="flex flex-col items-center space-y-6">
            {/* Animated Circle */}
            <div className="relative">
              <div 
                className="w-72 h-72 rounded-full border-4 border-gray-200 flex items-center justify-center transition-all duration-1000 ease-in-out"
                style={{
                  transform: `scale(${getCircleScale()})`,
                  backgroundColor: `${getPhaseColor()}20`,
                  borderColor: getPhaseColor(),
                }}
              >
                <div className="text-center">
                  <div className="text-6xl mb-2">
                    {currentPhase === 'inhale' ? '↗️' : currentPhase === 'hold' ? '⏸️' : '↘️'}
                  </div>
                  <p className="text-xl font-semibold capitalize">{currentPhase}</p>
                  <p className="text-3xl font-bold text-primary">{timeLeft}</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {!isActive ? (
                <Button onClick={startSession} size="lg" className="gap-2">
                  <Play className="h-5 w-5" />
                  Start Session
                </Button>
              ) : (
                <Button onClick={stopSession} size="lg" className="gap-2" variant="outline">
                  <Pause className="h-5 w-5" />
                  Stop
                </Button>
              )}
              <Button onClick={resetSession} size="lg" variant="outline" className="gap-2">
                <RotateCcw className="h-5 w-5" />
                Reset
              </Button>
            </div>

            {/* Session Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>Pattern: {selectedPattern.name}</p>
              <p>Time: {formatTime(totalTime)} / {sessionLength} min</p>
              <p>Cycles completed: {cycles}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Session Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Session Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Length</label>
              <Select value={sessionLength} onValueChange={setSessionLength} disabled={isActive}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sessionOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Pattern</label>
              <div className="p-2 bg-secondary rounded-md text-sm">
                {selectedPattern.name}: {selectedPattern.inhale}-{selectedPattern.hold}-{selectedPattern.exhale}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Breathing Patterns */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Choose a Breathing Pattern</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {breathingPatterns.map(pattern => (
            <PatternCard key={pattern.id} pattern={pattern} />
          ))}
        </div>
      </div>
    </main>
  );
};

export default Breathing;
