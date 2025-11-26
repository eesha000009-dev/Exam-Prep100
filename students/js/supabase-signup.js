// Supabase signup handler
import { initSupabase } from './supabase-client.js';
import { initializeUserProfile } from './supabase-user.js';

const supabase = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

export async function handleSignup(formData) {
  try {
    // First create the auth user
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          username: formData.username,
          full_name: formData.fullName
        }
      }
    });

    if (signupError) throw signupError;

    // Initialize the user profile in our profiles table (always create if missing)
    if (authData.user) {
      try {
        await initializeUserProfile(supabase, authData.user);
      } catch (err) {
        // If profile creation fails, log and continue (don't block signup)
        console.error('Profile creation failed during signup:', err);
      }
    }

    // Create initial activity record
    await supabase
      .from('activities')
      .insert([{
        user_id: authData.user.id,
        type: 'signup',
        description: 'Created account',
        created_at: new Date().toISOString()
      }]);

    return {
      success: true,
      user: authData.user
    };

  } catch (err) {
    console.error('Signup failed:', err);
    return {
      success: false,
      error: err.message
    };
  }
}

// Function to sync user data with session
export async function syncUserData(user) {
  try {
    if (!user?.id) throw new Error('No user to sync');

    // Use maybeSingle() so we don't throw when the profile row doesn't exist yet
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // If PostgREST returns an error indicating zero rows for single coercion,
    // maybeSingle avoids that; still treat other errors as fatal.
    if (profileError) throw profileError;

    // Get user activities
    const { data: activities } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    // Get notifications
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return {
      profile,
      activities: activities || [],
      unreadNotifications: count || 0
    };

  } catch (err) {
    console.error('Failed to sync user data:', err);
    throw err;
  }
}