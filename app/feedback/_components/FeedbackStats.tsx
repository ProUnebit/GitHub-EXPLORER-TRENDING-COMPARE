import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquareHeart } from 'lucide-react';
import * as feedbackQueries from '@/db/queries/feedback';
import { RatingStars } from './RatingStars';

export async function FeedbackStats() {
  const [averageRating, totalCount, distribution] = await Promise.all([
    feedbackQueries.getAverageRating(),
    feedbackQueries.getFeedbackCount(),
    feedbackQueries.getRatingDistribution(),
  ]);
  
  if (totalCount === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Star className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-center text-muted-foreground">
            No feedback yet. Be the first to share your thoughts!
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const distMap = new Map(
    distribution.map(d => [d.rating, d.count])
  );
  
  const fullDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: distMap.get(rating) ?? 0,
  }));
  
  const maxCount = Math.max(...fullDistribution.map(d => d.count));
  
  return (
    <Card className='bg-card dark:border-teal-900/60'>
      <CardHeader>
        <CardTitle></CardTitle>
        <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-amber-300/80">
            <MessageSquareHeart className="h-5 w-5 text-teal-500" />
            Overall Rating
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* AVERAGE RATING */}
        <div className="flex items-center justify-center gap-6">
          {/* Number */}
          <div className="text-center">
            <div className="text-5xl font-bold">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-muted-foreground">
              out of 5.0
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <RatingStars
              value={averageRating}
              readonly
              size="md"
            />
            <div className="text-sm text-muted-foreground">
              {totalCount} {totalCount === 1 ? 'review' : 'reviews'}
            </div>
          </div>
        </div>
        
        {/* DISTRIBUTION - Bar chart */}
        <div className="space-y-2">
          {fullDistribution.map(({ rating, count }) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-2">
                {/* Rating number */}
                <div className="flex w-12 items-center gap-1 text-sm">
                  <span className="font-medium">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                </div>
                
                {/* Bar */}
                <div className="flex-1 h-5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {/* Count */}
                <div className="w-12 text-sm text-right text-muted-foreground">
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}