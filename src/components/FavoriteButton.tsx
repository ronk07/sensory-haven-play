import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
  activityType: 'music' | 'touch' | 'visual' | 'sound' | 'breathing'
  activityData: any
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export const FavoriteButton = ({ 
  activityType, 
  activityData, 
  size = 'default',
  className = ''
}: FavoriteButtonProps) => {
  const { user } = useAuth()
  const { toast } = useToast()
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    checkIfFavorited()
  }, [user, activityType, activityData])

  const checkIfFavorited = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('activity_type', activityType)
        .eq('activity_data', JSON.stringify(activityData))
        .single()

      if (data && !error) {
        setIsFavorited(true)
      }
    } catch (error) {
      // Not favorited or error - keep as false
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save favorites.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      if (isFavorited) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('activity_type', activityType)
          .eq('activity_data', JSON.stringify(activityData))

        if (error) throw error

        setIsFavorited(false)
        toast({
          title: "Removed from favorites",
          description: "Item removed from your favorites.",
        })
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            activity_type: activityType,
            activity_data: activityData,
          })

        if (error) throw error

        setIsFavorited(true)
        toast({
          title: "Added to favorites!",
          description: "Item saved to your favorites.",
        })
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isFavorited ? "default" : "outline"}
      size={size}
      onClick={toggleFavorite}
      disabled={loading}
      className={`gap-1 ${className}`}
    >
      <Heart 
        className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} 
      />
      {size !== 'sm' && (isFavorited ? 'Favorited' : 'Add to Favorites')}
    </Button>
  )
}
