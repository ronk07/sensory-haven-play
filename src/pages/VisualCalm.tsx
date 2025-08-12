import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Play, Pause, Maximize, Sun, Palette, Sparkles } from "lucide-react";

interface VisualScene {
  id: string;
  title: string;
  description: string;
  category: 'nature' | 'patterns' | 'cultural';
  emoji: string;
  colors: string[];
  animation: string;
}

const visualScenes: VisualScene[] = [
  // Nature scenes
  {
    id: 'ocean-waves',
    title: 'Ocean Waves',
    description: 'Gentle waves flowing back and forth',
    category: 'nature',
    emoji: '🌊',
    colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
    animation: 'wave'
  },
  {
    id: 'forest-breeze',
    title: 'Forest Breeze',
    description: 'Leaves swaying in a gentle wind',
    category: 'nature',
    emoji: '🌲',
    colors: ['#22c55e', '#34d399', '#6ee7b7'],
    animation: 'sway'
  },
  {
    id: 'sunset-sky',
    title: 'Sunset Sky',
    description: 'Warm colors of a peaceful sunset',
    category: 'nature',
    emoji: '🌅',
    colors: ['#f97316', '#fb923c', '#fdba74'],
    animation: 'glow'
  },
  // Patterns
  {
    id: 'mandala-flow',
    title: 'Mandala Flow',
    description: 'Rotating mandala patterns',
    category: 'patterns',
    emoji: '🪷',
    colors: ['#a855f7', '#c084fc', '#d8b4fe'],
    animation: 'rotate'
  },
  {
    id: 'geometric-pulse',
    title: 'Geometric Pulse',
    description: 'Soft geometric shapes pulsing',
    category: 'patterns',
    emoji: '🔸',
    colors: ['#06b6d4', '#67e8f9', '#a5f3fc'],
    animation: 'pulse'
  },
  // Cultural
  {
    id: 'cherry-blossoms',
    title: 'Cherry Blossoms',
    description: 'Japanese sakura petals falling',
    category: 'cultural',
    emoji: '🌸',
    colors: ['#ec4899', '#f472b6', '#f9a8d4'],
    animation: 'fall'
  },
  {
    id: 'northern-lights',
    title: 'Northern Lights',
    description: 'Aurora borealis dancing',
    category: 'cultural',
    emoji: '🌌',
    colors: ['#10b981', '#34d399', '#6ee7b7'],
    animation: 'aurora'
  }
];

const VisualCalm = () => {
  const canonical = useCanonical();
  const [selectedScene, setSelectedScene] = useState<VisualScene | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [brightness, setBrightness] = useState([75]);
  const [speed, setSpeed] = useState([50]);
  const [autoplay, setAutoplay] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoplay && isPlaying) {
      interval = setInterval(() => {
        setCurrentSceneIndex((prev) => (prev + 1) % visualScenes.length);
        setSelectedScene(visualScenes[(currentSceneIndex + 1) % visualScenes.length]);
      }, 8000); // Change scene every 8 seconds
    }
    return () => clearInterval(interval);
  }, [autoplay, isPlaying, currentSceneIndex]);

  const startViewing = (scene: VisualScene) => {
    setSelectedScene(scene);
    setIsPlaying(true);
    setCurrentSceneIndex(visualScenes.findIndex(s => s.id === scene.id));
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const getAnimationStyle = (scene: VisualScene) => {
    const baseStyle = {
      background: `linear-gradient(45deg, ${scene.colors.join(', ')})`,
      opacity: brightness[0] / 100,
    };

    const animationDuration = `${(101 - speed[0]) / 10}s`;

    switch (scene.animation) {
      case 'wave':
        return {
          ...baseStyle,
          background: `linear-gradient(45deg, ${scene.colors[0]}, ${scene.colors[1]}, ${scene.colors[2]}, ${scene.colors[1]})`,
          backgroundSize: '200% 200%',
          animation: isPlaying ? `wave ${animationDuration} ease-in-out infinite` : 'none',
        };
      case 'pulse':
        return {
          ...baseStyle,
          animation: isPlaying ? `pulse ${animationDuration} ease-in-out infinite` : 'none',
        };
      case 'rotate':
        return {
          ...baseStyle,
          background: `conic-gradient(${scene.colors.join(', ')})`,
          animation: isPlaying ? `spin ${animationDuration} linear infinite` : 'none',
        };
      case 'glow':
        return {
          ...baseStyle,
          background: `radial-gradient(circle, ${scene.colors.join(', ')})`,
          animation: isPlaying ? `glow ${animationDuration} ease-in-out infinite` : 'none',
        };
      default:
        return baseStyle;
    }
  };

  const SceneCard = ({ scene }: { scene: VisualScene }) => (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => startViewing(scene)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{scene.emoji}</span>
              {scene.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{scene.description}</p>
          </div>
          <FavoriteButton
            activityType="visual"
            activityData={scene}
            size="sm"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-20 rounded-lg relative overflow-hidden mb-3">
          <div 
            className="w-full h-full"
            style={{
              background: `linear-gradient(45deg, ${scene.colors.join(', ')})`,
              backgroundSize: '200% 200%',
              animation: 'wave 3s ease-in-out infinite',
            }}
          />
        </div>
        <div className="flex gap-1">
          {scene.colors.map((color, index) => (
            <div
              key={index}
              className="w-4 h-4 rounded-full border border-gray-200"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <main className={`${fullscreen ? 'fixed inset-0 z-50 bg-black' : 'container mx-auto px-4 py-8'}`}>
      <Helmet>
        <title>Visual Calm – Sensory Haven</title>
        <meta name="description" content="Soothing patterns and nature scenes." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      {selectedScene && fullscreen ? (
        <div className="w-full h-full relative">
          <div
            className="w-full h-full transition-all duration-1000"
            style={getAnimationStyle(selectedScene)}
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              Exit Fullscreen
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display mb-2">Visual Calm</h1>
              <p className="text-muted-foreground">Soothing patterns and nature scenes</p>
            </div>
            {selectedScene && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={togglePlay}>
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                  <Maximize className="h-4 w-4" />
                  Fullscreen
                </Button>
              </div>
            )}
          </div>

          {selectedScene && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{selectedScene.emoji}</span>
                  {selectedScene.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div 
                    className="w-full h-40 rounded-lg relative overflow-hidden"
                    style={getAnimationStyle(selectedScene)}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Sun className="h-4 w-4" />
                        Brightness: {brightness[0]}%
                      </label>
                      <Slider
                        value={brightness}
                        onValueChange={setBrightness}
                        max={100}
                        min={10}
                        step={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-1">
                        <Sparkles className="h-4 w-4" />
                        Animation Speed: {speed[0]}%
                      </label>
                      <Slider
                        value={speed}
                        onValueChange={setSpeed}
                        max={100}
                        min={10}
                        step={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Button
                        variant={autoplay ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAutoplay(!autoplay)}
                        className="w-full"
                      >
                        <Palette className="h-4 w-4 mr-1" />
                        Auto Slideshow
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="nature" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="nature">🌲 Nature</TabsTrigger>
              <TabsTrigger value="patterns">🔸 Patterns</TabsTrigger>
              <TabsTrigger value="cultural">🌸 Cultural</TabsTrigger>
            </TabsList>
            
            <TabsContent value="nature" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visualScenes
                  .filter(scene => scene.category === 'nature')
                  .map(scene => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visualScenes
                  .filter(scene => scene.category === 'patterns')
                  .map(scene => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="cultural" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {visualScenes
                  .filter(scene => scene.category === 'cultural')
                  .map(scene => (
                    <SceneCard key={scene.id} scene={scene} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      <style jsx>{`
        @keyframes wave {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes glow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </main>
  );
};

export default VisualCalm;
