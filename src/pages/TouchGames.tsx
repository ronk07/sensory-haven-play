import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Maximize, RotateCcw, Palette } from "lucide-react";

interface TouchPoint {
  x: number;
  y: number;
  id: number;
  timestamp: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  popped: boolean;
}

const TouchGames = () => {
  const canonical = useCanonical();
  const [activeTab, setActiveTab] = useState("slime");
  const [fullscreen, setFullscreen] = useState(false);
  const [slimeColor, setSlimeColor] = useState("#4ade80");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [sandDrawing, setSandDrawing] = useState<TouchPoint[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const nextBubbleId = useRef(0);
  const nextPointId = useRef(0);

  const slimeColors = [
    { name: "Green", value: "#4ade80" },
    { name: "Blue", value: "#3b82f6" },
    { name: "Purple", value: "#a855f7" },
    { name: "Pink", value: "#ec4899" },
    { name: "Orange", value: "#f97316" },
    { name: "Yellow", value: "#eab308" },
  ];

  const generateBubbles = useCallback(() => {
    const newBubbles: Bubble[] = [];
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: nextBubbleId.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 20,
        popped: false,
      });
    }
    setBubbles(newBubbles);
  }, []);

  const popBubble = (id: number) => {
    setBubbles(prev => prev.map(bubble => 
      bubble.id === id ? { ...bubble, popped: true } : bubble
    ));
    // Remove popped bubble after animation
    setTimeout(() => {
      setBubbles(prev => prev.filter(bubble => bubble.id !== id));
    }, 300);
  };

  const handleSlimeInteraction = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDrawing(true);
    // Create a ripple effect or interaction feedback
    const rect = e.currentTarget.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Add temporary visual feedback
    setTimeout(() => setIsDrawing(false), 300);
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (activeTab !== "sand") return;
    setIsDrawing(true);
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const point: TouchPoint = {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
      id: nextPointId.current++,
      timestamp: Date.now(),
    };
    setSandDrawing(prev => [...prev, point]);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (activeTab !== "sand" || !isDrawing) return;
    e.preventDefault();
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const point: TouchPoint = {
      x: ((clientX - rect.left) / rect.width) * 100,
      y: ((clientY - rect.top) / rect.height) * 100,
      id: nextPointId.current++,
      timestamp: Date.now(),
    };
    setSandDrawing(prev => [...prev, point]);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
  };

  const clearSand = () => {
    setSandDrawing([]);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const SlimePlayground = () => (
    <div className="relative w-full h-96 rounded-xl overflow-hidden border-2 border-dashed border-gray-300">
      <div 
        className="w-full h-full relative cursor-pointer transition-all duration-300 ease-out select-none"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${slimeColor}90, ${slimeColor}60)`,
          transform: isDrawing ? 'scale(1.05) rotate(1deg)' : 'scale(1)',
          filter: isDrawing ? 'hue-rotate(10deg)' : 'none',
        }}
        onMouseDown={handleSlimeInteraction}
        onTouchStart={handleSlimeInteraction}
        onMouseMove={(e) => {
          if (e.buttons === 1) handleSlimeInteraction(e);
        }}
        onTouchMove={handleSlimeInteraction}
      >
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center text-white/80">
            <div className="text-6xl mb-2 animate-bounce">🫧</div>
            <p className="text-sm font-medium">Touch and stretch the slime!</p>
            <p className="text-xs opacity-75 mt-1">Click and drag to interact</p>
          </div>
        </div>
        
        {/* Interactive blob effects */}
        <div 
          className={`absolute w-32 h-32 rounded-full opacity-30 transition-all duration-500 ${
            isDrawing ? 'animate-ping' : 'animate-pulse'
          }`}
          style={{ 
            background: slimeColor,
            left: '20%',
            top: '30%',
            transform: isDrawing ? 'scale(1.5)' : 'scale(1)',
            animationDelay: '0s'
          }}
        />
        <div 
          className={`absolute w-24 h-24 rounded-full opacity-20 transition-all duration-700 ${
            isDrawing ? 'animate-spin' : 'animate-pulse'
          }`}
          style={{ 
            background: slimeColor,
            right: '25%',
            bottom: '25%',
            transform: isDrawing ? 'scale(2)' : 'scale(1)',
            animationDelay: '1s'
          }}
        />
        <div 
          className={`absolute w-16 h-16 rounded-full opacity-40 transition-all duration-300 ${
            isDrawing ? 'animate-bounce' : 'animate-pulse'
          }`}
          style={{ 
            background: slimeColor,
            left: '60%',
            top: '60%',
            transform: isDrawing ? 'scale(1.8)' : 'scale(1)',
            animationDelay: '0.5s'
          }}
        />
        
        {/* Ripple effect when touching */}
        {isDrawing && (
          <div 
            className="absolute inset-0 rounded-full animate-ping opacity-30"
            style={{ 
              background: `radial-gradient(circle, ${slimeColor}, transparent 70%)`,
            }}
          />
        )}
      </div>
    </div>
  );

  const BubblePlayground = () => (
    <div 
      ref={containerRef}
      className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200"
    >
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className={`absolute rounded-full cursor-pointer transition-all duration-300 ${
            bubble.popped ? 'animate-ping opacity-0' : 'animate-bounce'
          }`}
          style={{
            left: `${bubble.x}%`,
            top: `${bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(173,216,230,0.6))',
            border: '2px solid rgba(255,255,255,0.3)',
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
          onClick={() => popBubble(bubble.id)}
        >
          <div 
            className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full opacity-60"
            style={{ width: `${bubble.size * 0.15}px`, height: `${bubble.size * 0.15}px` }}
          />
        </div>
      ))}
      
      {bubbles.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-2">🫧</div>
            <p className="text-gray-600 mb-4">Tap to create bubbles!</p>
            <Button onClick={generateBubbles}>Create Bubbles</Button>
          </div>
        </div>
      )}
    </div>
  );

  const SandPlayground = () => (
    <div 
      ref={containerRef}
      className="relative w-full h-96 rounded-xl overflow-hidden bg-gradient-to-b from-yellow-100 to-yellow-200 touch-none"
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {sandDrawing.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = sandDrawing[index - 1];
          return (
            <line
              key={point.id}
              x1={`${prevPoint.x}%`}
              y1={`${prevPoint.y}%`}
              x2={`${point.x}%`}
              y2={`${point.y}%`}
              stroke="#d97706"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.8"
            />
          );
        })}
        {sandDrawing.map((point) => (
          <circle
            key={point.id}
            cx={`${point.x}%`}
            cy={`${point.y}%`}
            r="3"
            fill="#d97706"
            opacity="0.6"
          />
        ))}
      </svg>
      
      {sandDrawing.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-2">🏖️</div>
            <p className="text-gray-600">Draw in the sand with your finger!</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <main className={`container mx-auto px-4 py-8 ${fullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <Helmet>
        <title>Touch & Feel – Sensory Haven</title>
        <meta name="description" content="Virtual slime, bubbles, textures." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Touch & Feel</h1>
          <p className="text-muted-foreground">Interactive tactile playground</p>
        </div>
        <div className="flex items-center gap-2">
          <FavoriteButton
            activityType="touch"
            activityData={{ type: activeTab }}
            size="sm"
          />
          <Button variant="outline" size="sm" onClick={toggleFullscreen}>
            <Maximize className="h-4 w-4" />
            {fullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="slime">🫧 Slime</TabsTrigger>
          <TabsTrigger value="bubbles">💧 Bubbles</TabsTrigger>
          <TabsTrigger value="sand">🏖️ Sand</TabsTrigger>
        </TabsList>
        
        <TabsContent value="slime" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Slime Color
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {slimeColors.map((color) => (
                  <Button
                    key={color.value}
                    variant={slimeColor === color.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSlimeColor(color.value)}
                    className="gap-1"
                  >
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: color.value }}
                    />
                    {color.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <SlimePlayground />
        </TabsContent>

        <TabsContent value="bubbles" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Tap bubbles to pop them! 🎈
            </p>
            <Button onClick={generateBubbles} size="sm">
              New Bubbles
            </Button>
          </div>
          <BubblePlayground />
        </TabsContent>

        <TabsContent value="sand" className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Draw patterns in the sand with your finger or mouse 🖐️
            </p>
            <Button onClick={clearSand} size="sm" className="gap-1">
              <RotateCcw className="h-4 w-4" />
              Clear Sand
            </Button>
          </div>
          <SandPlayground />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default TouchGames;
