// Supabase User Management Module
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

export function initSupabase(url, key) {
  if (!url || !key) throw new Error('Supabase URL and anon key required');
  return createClient(url, key);
}

export async function initializeUserProfile(supabase, userData) {
  if (!userData?.id) throw new Error('User ID required');
  
  try {
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userData.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Only insert if profile doesn't exist
    if (!existingProfile) {
      const { data, error: insertError } = await supabase
        .from('profiles')
        .insert([{
          id: userData.id,
          username: userData.user_metadata?.username || userData.email?.split('@')[0] || 'Student',
          full_name: userData.user_metadata?.full_name,
          email: userData.email,
          avatar_url: userData.user_metadata?.avatar_url,
          level: 'SS 3', // Default level
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      return data;
    }

    return existingProfile;
  } catch (err) {
    console.error('Failed to initialize user profile:', err);
    throw err;
  }
}

export async function updateUserProfile(supabase, userId, updates) {
  if (!userId || !updates) throw new Error('User ID and updates required');

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRecentActivities(supabase, userId, limit = 10) {
  if (!userId) throw new Error('User ID required');

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function recordActivity(supabase, userId, activity) {
  if (!userId || !activity) throw new Error('User ID and activity details required');

  const { data, error } = await supabase
    .from('activities')
    .insert([{
      user_id: userId,
      type: activity.type,
      description: activity.description,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}