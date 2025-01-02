import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface ForumAnalytics {
  totalPosts: number;
  totalReplies: number;
  activeUsers: number;
  postsToday: number;
  trendingTags: Array<{
    id: string;
    name: string;
    count: number;
    trend: number;
  }>;
}

export function useForumAnalytics() {
  const [analytics, setAnalytics] = useState<ForumAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);

        // Get total posts and replies
        const { data: postsData } = await supabase
          .from('forum_posts')
          .select('id', { count: 'exact' });

        const { data: repliesData } = await supabase
          .from('forum_replies')
          .select('id', { count: 'exact' });

        // Get active users (users who posted in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: activeUsersData } = await supabase
          .from('forum_posts')
          .select('author_id', { count: 'exact', distinct: true })
          .gte('created_at', thirtyDaysAgo.toISOString());

        // Get posts created today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data: todayPostsData } = await supabase
          .from('forum_posts')
          .select('id', { count: 'exact' })
          .gte('created_at', today.toISOString());

        // Get trending tags
        const { data: tagsData } = await supabase
          .from('forum_post_tags')
          .select(`
            tag_id,
            tag:forum_tags(name),
            post:post_id(created_at)
          `)
          .order('created_at', { ascending: false })
          .limit(100);

        // Process trending tags
        const tagCounts = new Map<string, { name: string; total: number; recent: number }>();
        
        tagsData?.forEach(({ tag_id, tag, post }) => {
          const postDate = new Date(post.created_at);
          const isRecent = postDate > thirtyDaysAgo;
          
          if (!tagCounts.has(tag_id)) {
            tagCounts.set(tag_id, { name: tag.name, total: 0, recent: 0 });
          }
          
          const counts = tagCounts.get(tag_id)!;
          counts.total++;
          if (isRecent) counts.recent++;
        });

        const trendingTags = Array.from(tagCounts.entries())
          .map(([id, { name, total, recent }]) => ({
            id,
            name,
            count: total,
            trend: (recent / total) * 100
          }))
          .sort((a, b) => b.trend - a.trend)
          .slice(0, 5);

        setAnalytics({
          totalPosts: postsData?.length || 0,
          totalReplies: repliesData?.length || 0,
          activeUsers: activeUsersData?.length || 0,
          postsToday: todayPostsData?.length || 0,
          trendingTags
        });
      } catch (error) {
        console.error('Error fetching forum analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();

    // Refresh analytics every 5 minutes
    const interval = setInterval(fetchAnalytics, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { analytics, isLoading };
}