import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useCanonical } from "@/lib/seo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Heart, Play, Trash2, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface FavoriteItem {
  id: string;
  activity_type: 'music' | 'touch' | 'visual' | 'sound' | 'breathing';
  activity_data: any;
  created_at: string;
}

const Favorites = () => {
  const canonical = useCanonical();
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast({
        title: "Error loading favorites",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', favoriteId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast({
        title: "Removed from favorites",
        description: "Item removed successfully.",
      });
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: "Error removing item",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'music': return '🎵';
      case 'touch': return '🖐️';
      case 'visual': return '✨';
      case 'sound': return '🌊';
      case 'breathing': return '🌬️';
      default: return '❤️';
    }
  };

  const getActivityRoute = (type: string) => {
    switch (type) {
      case 'music': return '/music';
      case 'touch': return '/touch';
      case 'visual': return '/visual';
      case 'sound': return '/sound';
      case 'breathing': return '/breathing';
      default: return '/dashboard';
    }
  };

  const getActivityTitle = (item: FavoriteItem) => {
    const data = item.activity_data;
    switch (item.activity_type) {
      case 'music':
        return data.title || 'Music Track';
      case 'touch':
        return `${data.type || 'Touch'} Game`;
      case 'visual':
        return data.title || 'Visual Scene';
      case 'sound':
        return data.title || 'Soundscape';
      case 'breathing':
        return data.name || 'Breathing Pattern';
      default:
        return 'Favorite Item';
    }
  };

  const getActivityDescription = (item: FavoriteItem) => {
    const data = item.activity_data;
    switch (item.activity_type) {
      case 'music':
        return `${data.artist || 'Unknown Artist'} • ${data.mood || 'Unknown'} mood`;
      case 'touch':
        return `Interactive ${data.type || 'touch'} playground`;
      case 'visual':
        return data.description || 'Calming visual experience';
      case 'sound':
        return data.description || 'Ambient soundscape';
      case 'breathing':
        return data.description || 'Breathing exercise';
      default:
        return 'Saved item';
    }
  };

  const FavoriteCard = ({ item }: { item: FavoriteItem }) => (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{getActivityIcon(item.activity_type)}</div>
            <div>
              <CardTitle className="text-lg">{getActivityTitle(item)}</CardTitle>
              <p className="text-sm text-muted-foreground">{getActivityDescription(item)}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {item.activity_type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeFavorite(item.id)}
              className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Link to={getActivityRoute(item.activity_type)}>
            <Button size="sm" className="gap-1">
              <Play className="h-3 w-3" />
              Open
            </Button>
          </Link>
          <Link to={getActivityRoute(item.activity_type)}>
            <Button size="sm" variant="outline" className="gap-1">
              <ExternalLink className="h-3 w-3" />
              Go to {item.activity_type}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );

  const groupedFavorites = favorites.reduce((acc, item) => {
    const type = item.activity_type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {} as Record<string, FavoriteItem[]>);

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Favorites – Sensory Haven</title>
        <meta name="description" content="Quick access to your go-to calming tools." />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-display mb-2">Your Favorites</h1>
          <p className="text-muted-foreground">
            Quick access to your saved calming activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span className="text-sm text-muted-foreground">
            {favorites.length} saved items
          </span>
        </div>
      </div>

      {favorites.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-6xl mb-4">💙</div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Explore our activities and tap the heart button to save your favorite 
              music, games, visuals, and breathing exercises here.
            </p>
            <div className="flex justify-center gap-3">
              <Link to="/music">
                <Button variant="outline">🎵 Music</Button>
              </Link>
              <Link to="/visual">
                <Button variant="outline">✨ Visuals</Button>
              </Link>
              <Link to="/breathing">
                <Button variant="outline">🌬️ Breathing</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedFavorites).map(([type, items]) => (
            <div key={type}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold capitalize flex items-center gap-2">
                  <span className="text-2xl">{getActivityIcon(type)}</span>
                  {type} Favorites
                </h2>
                <Badge variant="outline">
                  {items.length} item{items.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map(item => (
                  <FavoriteCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default Favorites;
