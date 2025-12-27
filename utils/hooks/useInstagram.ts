import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

export interface InstagramPost {
    id: string;
    user_id: string;
    image_url: string | null;
    caption: string;
    hashtags: string[];
    scheduled_time: string | null;
    posted_at: string | null;
    status: 'draft' | 'scheduled' | 'posted' | 'failed';
    engagement_likes: number;
    engagement_comments: number;
    engagement_shares: number;
    engagement_views: number;
    ai_generated: boolean;
    created_at: string;
    updated_at: string;
}

export interface InstagramSettings {
    id: string;
    user_id: string;
    is_enabled: boolean;
    auto_post_enabled: boolean;
    ai_captions_enabled: boolean;
    posting_frequency: 'multiple' | 'daily' | 'alternate' | 'weekly';
    content_style: 'professional' | 'casual' | 'creative' | 'educational';
    default_hashtags: string[];
    best_posting_times: Array<{ day: string; time: string; engagement: string }>;
    created_at: string;
    updated_at: string;
}

export interface CreatePostInput {
    image_url?: string;
    caption: string;
    hashtags?: string[];
    scheduled_time?: string;
    status?: 'draft' | 'scheduled';
    ai_generated?: boolean;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
    id: string;
}

export function useInstagram() {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [settings, setSettings] = useState<InstagramSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // Fetch posts
    const fetchPosts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('instagram_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPosts(data || []);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching posts:', err);
            setError(err.message);
            toast.error('Failed to load Instagram posts');
        } finally {
            setLoading(false);
        }
    };

    // Fetch settings
    const fetchSettings = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('instagram_settings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            if (data) {
                setSettings(data);
            } else {
                // Create default settings if none exist
                const defaultSettings = {
                    user_id: user.id,
                    is_enabled: false,
                    auto_post_enabled: false,
                    ai_captions_enabled: true,
                    posting_frequency: 'daily' as const,
                    content_style: 'professional' as const,
                    default_hashtags: [],
                    best_posting_times: [],
                };

                const { data: newSettings, error: insertError } = await supabase
                    .from('instagram_settings')
                    .insert(defaultSettings)
                    .select()
                    .single();

                if (insertError) throw insertError;
                setSettings(newSettings);
            }
        } catch (err: any) {
            console.error('Error fetching settings:', err);
        }
    };

    // Create post
    const createPost = async (input: CreatePostInput) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('instagram_posts')
                .insert({
                    ...input,
                    user_id: user.id,
                    hashtags: input.hashtags || [],
                    status: input.status || 'draft',
                })
                .select()
                .single();

            if (error) throw error;

            setPosts(prev => [data, ...prev]);
            toast.success('Post created successfully');
            return data;
        } catch (err: any) {
            console.error('Error creating post:', err);
            toast.error(err.message || 'Failed to create post');
            throw err;
        }
    };

    // Update post
    const updatePost = async (input: UpdatePostInput) => {
        try {
            const { id, ...updates } = input;

            const { data, error } = await supabase
                .from('instagram_posts')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setPosts(prev => prev.map(post => post.id === id ? data : post));
            toast.success('Post updated successfully');
            return data;
        } catch (err: any) {
            console.error('Error updating post:', err);
            toast.error(err.message || 'Failed to update post');
            throw err;
        }
    };

    // Delete post
    const deletePost = async (id: string) => {
        try {
            const { error } = await supabase
                .from('instagram_posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setPosts(prev => prev.filter(post => post.id !== id));
            toast.success('Post deleted successfully');
        } catch (err: any) {
            console.error('Error deleting post:', err);
            toast.error(err.message || 'Failed to delete post');
            throw err;
        }
    };

    // Generate AI caption
    const generateCaption = async (context?: string, tone?: string) => {
        try {
            const response = await fetch('/api/instagram/generate-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    context: context || '',
                    tone: tone || settings?.content_style || 'professional',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to generate caption');
            }

            const data = await response.json();
            toast.success('Caption generated! ✨');
            return data.caption;
        } catch (err: any) {
            console.error('Error generating caption:', err);
            toast.error(err.message || 'Failed to generate caption');
            throw err;
        }
    };

    // Suggest hashtags
    const suggestHashtags = async (caption: string, category?: string) => {
        try {
            const response = await fetch('/api/instagram/suggest-hashtags', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    caption,
                    category: category || 'general',
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to suggest hashtags');
            }

            const data = await response.json();
            toast.success('Hashtags suggested! #️⃣');
            return data.hashtags;
        } catch (err: any) {
            console.error('Error suggesting hashtags:', err);
            toast.error(err.message || 'Failed to suggest hashtags');
            throw err;
        }
    };

    // Update settings
    const updateSettings = async (updates: Partial<Omit<InstagramSettings, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Not authenticated');

            const { data, error } = await supabase
                .from('instagram_settings')
                .update(updates)
                .eq('user_id', user.id)
                .select()
                .single();

            if (error) throw error;

            setSettings(data);
            toast.success('Settings updated successfully');
            return data;
        } catch (err: any) {
            console.error('Error updating settings:', err);
            toast.error(err.message || 'Failed to update settings');
            throw err;
        }
    };

    // Update post engagement (simulated or from actual Instagram API)
    const updateEngagement = async (id: string, engagement: Partial<Pick<InstagramPost, 'engagement_likes' | 'engagement_comments' | 'engagement_shares' | 'engagement_views'>>) => {
        try {
            const { data, error } = await supabase
                .from('instagram_posts')
                .update(engagement)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            setPosts(prev => prev.map(post => post.id === id ? data : post));
            return data;
        } catch (err: any) {
            console.error('Error updating engagement:', err);
            throw err;
        }
    };

    // Get analytics
    const getAnalytics = () => {
        const totalPosts = posts.length;
        const postedPosts = posts.filter(p => p.status === 'posted');
        const scheduledPosts = posts.filter(p => p.status === 'scheduled');

        const totalLikes = postedPosts.reduce((sum, post) => sum + post.engagement_likes, 0);
        const totalComments = postedPosts.reduce((sum, post) => sum + post.engagement_comments, 0);
        const totalShares = postedPosts.reduce((sum, post) => sum + post.engagement_shares, 0);
        const totalReach = postedPosts.reduce((sum, post) => sum + post.engagement_views, 0);

        const avgLikes = postedPosts.length > 0 ? (totalLikes / postedPosts.length).toFixed(0) : '0';
        const avgComments = postedPosts.length > 0 ? (totalComments / postedPosts.length).toFixed(0) : '0';
        const avgEngagement = postedPosts.length > 0 && totalReach > 0
            ? ((totalLikes + totalComments) / totalReach * 100).toFixed(1)
            : '0.0';

        // Calculate follower growth (simulated - would come from Instagram API)
        const followersGrowth = '+234'; // Mock data

        return {
            totalPosts,
            postedPosts: postedPosts.length,
            scheduledPosts: scheduledPosts.length,
            avgLikes,
            avgComments,
            avgEngagement,
            totalReach: totalReach.toLocaleString(),
            followersGrowth,
        };
    };

    // Get posts by status
    const getPostsByStatus = (status: InstagramPost['status']) => {
        return posts.filter(post => post.status === status);
    };

    // Subscribe to real-time changes
    useEffect(() => {
        fetchPosts();
        fetchSettings();

        // Set up real-time subscription
        const subscription = supabase
            .channel('instagram_posts_changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'instagram_posts' },
                (payload) => {
                    if (payload.eventType === 'INSERT') {
                        setPosts(prev => [payload.new as InstagramPost, ...prev]);
                    } else if (payload.eventType === 'UPDATE') {
                        setPosts(prev => prev.map(post =>
                            post.id === payload.new.id ? payload.new as InstagramPost : post
                        ));
                    } else if (payload.eventType === 'DELETE') {
                        setPosts(prev => prev.filter(post => post.id !== payload.old.id));
                    }
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        posts,
        settings,
        loading,
        error,
        createPost,
        updatePost,
        deletePost,
        generateCaption,
        suggestHashtags,
        updateSettings,
        updateEngagement,
        getAnalytics,
        getPostsByStatus,
        refresh: fetchPosts,
    };
}
