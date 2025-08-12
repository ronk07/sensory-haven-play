import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  mood: 'calm' | 'happy' | 'energizing';
  culture?: string;
  duration: string;
  url: string; // In real app, these would be actual audio files
  artwork: string;
}

const musicTracks: MusicTrack[] = [
  // Calm tracks
  {
    id: 'calm-1',
    title: 'Ocean Waves',
    artist: 'Nature Sounds',
    mood: 'calm',
    duration: '3:45',
    url: '/audio/calm/ocean-waves.mp3',
    artwork: '🌊'
  },
  {
    id: 'calm-2',
    title: 'Gentle Piano',
    artist: 'Peaceful Melodies',
    mood: 'calm',
    duration: '4:12',
    url: '/audio/calm/gentle-piano.mp3',
    artwork: '🎹'
  },
  {
    id: 'calm-3',
    title: 'Meditation Bells',
    artist: 'Zen Studio',
    mood: 'calm',
    culture: 'Tibetan',
    duration: '5:30',
    url: '/audio/calm/meditation-bells.mp3',
    artwork: '🔔'
  },
  // Happy tracks
  {
    id: 'happy-1',
    title: 'Sunshine Melody',
    artist: 'Happy Tunes',
    mood: 'happy',
    duration: '2:58',
    url: '/audio/happy/sunshine.mp3',
    artwork: '☀️'
  },
  {
    id: 'happy-2',
    title: 'Ukulele Dreams',
    artist: 'Island Vibes',
    mood: 'happy',
    culture: 'Hawaiian',
    duration: '3:22',
    url: '/audio/happy/ukulele.mp3',
    artwork: '🎸'
  },
  // Cultural tracks
  {
    id: 'cultural-1',
    title: 'Tabla Rhythms',
    artist: 'Classical India',
    mood: 'calm',
    culture: 'Indian',
    duration: '4:45',
    url: '/audio/cultural/tabla.mp3',
    artwork: '🥁'
  },
  {
    id: 'cultural-2',
    title: 'Kora Melodies',
    artist: 'West African Ensemble',
    mood: 'happy',
    culture: 'African',
    duration: '3:15',
    url: '/audio/cultural/kora.mp3',
    artwork: '🎵'
  },
  {
    id: 'cultural-3',
    title: 'Sakura Winds',
    artist: 'Traditional Japan',
    mood: 'calm',
    culture: 'Japanese',
    duration: '5:10',
    url: '/audio/cultural/shakuhachi.mp3',
    artwork: '🌸'
  }
];

const MusicCorner = () => {
  const canonical = useCanonical();
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const cultures = ['Indian', 'African', 'Japanese', 'Hawaiian', 'Tibetan'];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, []);

  // Audio synthesis for demo purposes
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const createAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playTrack = (track: MusicTrack) => {
    if (currentTrack?.id === track.id) {
      // Toggle play/pause for current track
      if (isPlaying) {
        stopAudio();
        setIsPlaying(false);
      } else {
        startAudio(track);
        setIsPlaying(true);
      }
    } else {
      // Start new track
      if (isPlaying) {
        stopAudio();
      }
      setCurrentTrack(track);
      setIsPlaying(true);
      startAudio(track);
    }
  };

  const startAudio = (track: MusicTrack) => {
    try {
      const audioContext = createAudioContext();
      
      // Resume audio context if suspended (required by browser policies)
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      // Create oscillator and gain node
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Set frequency based on track mood/type
      let frequency = 220; // Default A3
      if (track.mood === 'calm') frequency = 174; // Low, calming tone
      if (track.mood === 'happy') frequency = 528; // Higher, cheerful tone
      if (track.mood === 'energizing') frequency = 396; // Medium, energizing tone

      // Cultural adjustments
      if (track.culture === 'Indian') frequency = 261.63; // C4
      if (track.culture === 'African') frequency = 293.66; // D4
      if (track.culture === 'Japanese') frequency = 329.63; // E4

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine'; // Soft sine wave
      
      // Set volume
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + 0.5);

      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Add some variation for more interesting sound
      const lfo = audioContext.createOscillator();
      const lfoGain = audioContext.createGain();
      lfo.frequency.setValueAtTime(0.5, audioContext.currentTime);
      lfoGain.gain.setValueAtTime(10, audioContext.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(oscillator.frequency);

      // Start oscillators
      oscillator.start();
      lfo.start();

      // Store references
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      // Auto-stop after 30 seconds (demo limitation)
      setTimeout(() => {
        if (oscillatorRef.current === oscillator) {
          stopAudio();
          setIsPlaying(false);
        }
      }, 30000);

    } catch (error) {
      console.error('Error starting audio:', error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current = null;
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const toggleMute = () => {
    if (gainNodeRef.current) {
      if (isMuted) {
        gainNodeRef.current.gain.setValueAtTime(0.05, audioContextRef.current!.currentTime);
      } else {
        gainNodeRef.current.gain.setValueAtTime(0, audioContextRef.current!.currentTime);
      }
    }
    setIsMuted(!isMuted);
  };

  const TrackCard = ({ track }: { track: MusicTrack }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{track.artwork}</span>
              {track.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{track.artist}</p>
          </div>
          <FavoriteButton
            activityType="music"
            activityData={track}
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {track.mood}
            </Badge>
            {track.culture && (
              <Badge variant="outline" className="text-xs">
                {track.culture}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{track.duration}</span>
            <Button
              size="sm"
              onClick={() => playTrack(track)}
              className="gap-1"
            >
              {currentTrack?.id === track.id && isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {currentTrack?.id === track.id && isPlaying ? 'Pause' : 'Play'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Music Corner – Sensory Haven</title>
        <meta name="description" content="Calming and cultural tunes for kids." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Music Corner</h1>
          <p className="text-muted-foreground">Browse by mood or culture</p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            🎵 Demo: Tracks play synthesized tones based on mood and culture
          </p>
        </div>
        {currentTrack && (
          <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
            <span className="text-sm">
              Now playing: {currentTrack.title} 
              <span className="text-xs opacity-75 ml-1">(demo audio)</span>
            </span>
            <Button size="sm" variant="ghost" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="mood" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="mood">By Mood</TabsTrigger>
          <TabsTrigger value="culture">By Culture</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mood" className="space-y-6">
          {['calm', 'happy', 'energizing'].map((mood) => (
            <div key={mood}>
              <h2 className="text-xl font-semibold mb-3 capitalize">{mood} Music</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {musicTracks
                  .filter((track) => track.mood === mood)
                  .map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="culture" className="space-y-6">
          {cultures.map((culture) => {
            const culturalTracks = musicTracks.filter((track) => track.culture === culture);
            if (culturalTracks.length === 0) return null;
            
            return (
              <div key={culture}>
                <h2 className="text-xl font-semibold mb-3">{culture} Music</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {culturalTracks.map((track) => (
                    <TrackCard key={track.id} track={track} />
                  ))}
                </div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} />
    </main>
  );
};

export default MusicCorner;
