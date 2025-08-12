import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Play, Pause, Volume2, VolumeX, RotateCcw, Plus, Minus } from "lucide-react";

interface SoundTrack {
  id: string;
  title: string;
  category: 'nature' | 'instruments' | 'ambient';
  emoji: string;
  description: string;
  url: string;
  isPlaying: boolean;
  volume: number;
  loop: boolean;
}

const soundTracks: Omit<SoundTrack, 'isPlaying' | 'volume' | 'loop'>[] = [
  // Nature sounds
  {
    id: 'rain-gentle',
    title: 'Gentle Rain',
    category: 'nature',
    emoji: '🌧️',
    description: 'Soft raindrops on leaves',
    url: '/audio/nature/rain.mp3'
  },
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    category: 'nature',
    emoji: '🌊',
    description: 'Peaceful waves on shore',
    url: '/audio/nature/ocean.mp3'
  },
  {
    id: 'forest-birds',
    title: 'Forest Birds',
    category: 'nature',
    emoji: '🐦',
    description: 'Morning bird songs in forest',
    url: '/audio/nature/birds.mp3'
  },
  {
    id: 'wind-trees',
    title: 'Wind in Trees',
    category: 'nature',
    emoji: '🌲',
    description: 'Gentle breeze through leaves',
    url: '/audio/nature/wind.mp3'
  },
  {
    id: 'thunder-distant',
    title: 'Distant Thunder',
    category: 'nature',
    emoji: '⛈️',
    description: 'Soft rumbling thunder',
    url: '/audio/nature/thunder.mp3'
  },
  // Cultural instruments
  {
    id: 'tabla-rhythm',
    title: 'Tabla Rhythms',
    category: 'instruments',
    emoji: '🥁',
    description: 'Indian classical percussion',
    url: '/audio/instruments/tabla.mp3'
  },
  {
    id: 'kora-melodies',
    title: 'Kora Melodies',
    category: 'instruments',
    emoji: '🎵',
    description: 'West African harp sounds',
    url: '/audio/instruments/kora.mp3'
  },
  {
    id: 'shakuhachi-flute',
    title: 'Shakuhachi Flute',
    category: 'instruments',
    emoji: '🎋',
    description: 'Japanese bamboo flute',
    url: '/audio/instruments/shakuhachi.mp3'
  },
  {
    id: 'singing-bowls',
    title: 'Singing Bowls',
    category: 'instruments',
    emoji: '🔔',
    description: 'Tibetan meditation bowls',
    url: '/audio/instruments/bowls.mp3'
  },
  // Ambient sounds
  {
    id: 'white-noise',
    title: 'White Noise',
    category: 'ambient',
    emoji: '⚪',
    description: 'Pure white noise',
    url: '/audio/ambient/white-noise.mp3'
  },
  {
    id: 'brown-noise',
    title: 'Brown Noise',
    category: 'ambient',
    emoji: '🟤',
    description: 'Deep brown noise',
    url: '/audio/ambient/brown-noise.mp3'
  },
  {
    id: 'pink-noise',
    title: 'Pink Noise',
    category: 'ambient',
    emoji: '🩷',
    description: 'Balanced pink noise',
    url: '/audio/ambient/pink-noise.mp3'
  }
];

const Soundscapes = () => {
  const canonical = useCanonical();
  const [activeTracks, setActiveTracks] = useState<SoundTrack[]>([]);
  const [masterVolume, setMasterVolume] = useState([70]);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

  const initializeTrack = (baseTrack: typeof soundTracks[0]): SoundTrack => ({
    ...baseTrack,
    isPlaying: false,
    volume: 70,
    loop: true
  });

  const addTrack = (baseTrack: typeof soundTracks[0]) => {
    if (activeTracks.length >= 3) {
      return; // Max 3 tracks
    }
    
    if (activeTracks.find(track => track.id === baseTrack.id)) {
      return; // Track already active
    }

    const track = initializeTrack(baseTrack);
    setActiveTracks(prev => [...prev, track]);
  };

  const removeTrack = (trackId: string) => {
    // Stop audio
    const audio = audioRefs.current[trackId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setActiveTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const toggleTrack = (trackId: string) => {
    setActiveTracks(prev =>
      prev.map(track => {
        if (track.id === trackId) {
          const audio = audioRefs.current[trackId];
          if (audio) {
            if (track.isPlaying) {
              audio.pause();
            } else {
              audio.play();
            }
          }
          return { ...track, isPlaying: !track.isPlaying };
        }
        return track;
      })
    );
  };

  const updateTrackVolume = (trackId: string, volume: number) => {
    setActiveTracks(prev =>
      prev.map(track => {
        if (track.id === trackId) {
          const audio = audioRefs.current[trackId];
          if (audio) {
            audio.volume = (volume / 100) * (masterVolume[0] / 100);
          }
          return { ...track, volume };
        }
        return track;
      })
    );
  };

  const updateMasterVolume = (volume: number[]) => {
    setMasterVolume(volume);
    // Update all active tracks
    activeTracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.volume = (track.volume / 100) * (volume[0] / 100);
      }
    });
  };

  const stopAll = () => {
    setActiveTracks(prev =>
      prev.map(track => {
        const audio = audioRefs.current[track.id];
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
        return { ...track, isPlaying: false };
      })
    );
  };

  const clearAll = () => {
    // Stop and remove all tracks
    activeTracks.forEach(track => {
      const audio = audioRefs.current[track.id];
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setActiveTracks([]);
  };

  const SoundCard = ({ track }: { track: typeof soundTracks[0] }) => {
    const isActive = activeTracks.find(t => t.id === track.id);
    const canAdd = activeTracks.length < 3 && !isActive;

    return (
      <Card className={`group hover:shadow-lg transition-all duration-200 ${isActive ? 'ring-2 ring-primary' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <span className="text-2xl">{track.emoji}</span>
                {track.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{track.description}</p>
            </div>
            <div className="flex items-center gap-1">
              <FavoriteButton
                activityType="sound"
                activityData={track}
                size="sm"
              />
              {canAdd && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => addTrack(track)}
                  className="gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Add
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="text-xs capitalize">
            {track.category}
          </Badge>
        </CardContent>
      </Card>
    );
  };

  const ActiveTrackCard = ({ track }: { track: SoundTrack }) => (
    <Card className="bg-secondary/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{track.emoji}</span>
            <div>
              <h4 className="font-medium">{track.title}</h4>
              <p className="text-xs text-muted-foreground">{track.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={track.isPlaying ? "default" : "outline"}
              onClick={() => toggleTrack(track.id)}
            >
              {track.isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeTrack(track.id)}
            >
              <Minus className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Volume2 className="h-3 w-3" />
            Volume: {track.volume}%
          </div>
          <Slider
            value={[track.volume]}
            onValueChange={(value) => updateTrackVolume(track.id, value[0])}
            max={100}
            min={0}
            step={5}
            className="w-full"
          />
        </div>
      </CardContent>

      {/* Hidden audio element */}
      <audio
        ref={(el) => {
          if (el) audioRefs.current[track.id] = el;
        }}
        loop={track.loop}
        preload="none"
      >
        {/* In a real app, you'd have actual audio files */}
        <source src={track.url} type="audio/mpeg" />
      </audio>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Soundscapes – Sensory Haven</title>
        <meta name="description" content="Nature sounds and instruments to relax." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Soundscapes</h1>
          <p className="text-muted-foreground">Layer nature sounds and instruments</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={stopAll} disabled={activeTracks.length === 0}>
            <Pause className="h-4 w-4" />
            Stop All
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} disabled={activeTracks.length === 0}>
            <RotateCcw className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Active Mixer */}
      {activeTracks.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="h-5 w-5" />
              Sound Mixer ({activeTracks.length}/3)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Master Volume */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium flex items-center gap-1">
                    Master Volume: {masterVolume[0]}%
                  </label>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => updateMasterVolume([masterVolume[0] > 0 ? 0 : 70])}
                  >
                    {masterVolume[0] > 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                </div>
                <Slider
                  value={masterVolume}
                  onValueChange={updateMasterVolume}
                  max={100}
                  min={0}
                  step={5}
                />
              </div>

              {/* Active Tracks */}
              <div className="space-y-3">
                {activeTracks.map(track => (
                  <ActiveTrackCard key={track.id} track={track} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sound Library */}
      <Tabs defaultValue="nature" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nature">🌲 Nature</TabsTrigger>
          <TabsTrigger value="instruments">🎵 Instruments</TabsTrigger>
          <TabsTrigger value="ambient">⚪ Ambient</TabsTrigger>
        </TabsList>
        
        <TabsContent value="nature" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Add up to 3 nature sounds to create your perfect environment 🌿
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {soundTracks
              .filter(track => track.category === 'nature')
              .map(track => (
                <SoundCard key={track.id} track={track} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="instruments" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Layer cultural instruments for a meditative experience 🎶
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {soundTracks
              .filter(track => track.category === 'instruments')
              .map(track => (
                <SoundCard key={track.id} track={track} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="ambient" className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            White and colored noise for focus and relaxation 🎚️
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {soundTracks
              .filter(track => track.category === 'ambient')
              .map(track => (
                <SoundCard key={track.id} track={track} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Soundscapes;
