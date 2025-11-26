// Lightweight Supabase client helper (ES module)
// Usage:
// 1. Add these two lines before importing this module in your pages:
//    <script>window.SUPABASE_URL = 'https://xyz.supabase.co'; window.SUPABASE_ANON_KEY = 'public-anon-key';</script>
// 2. Then import and init:
//    import { initSupabase, signUp, signIn, signOut, getUser } from '/js/supabase-client.js';
//    const supabase = initSupabase(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
//    await signIn(supabase, email, pass);
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
import { config } from './config.js';

export function initSupabase(url, anonKey) {
  // Resolve url and key from arguments, global window vars, or central config
  const resolvedUrl = url || (typeof window !== 'undefined' && window.SUPABASE_URL) || (config && config.supabase && config.supabase.url);
  const resolvedKey = anonKey || (typeof window !== 'undefined' && window.SUPABASE_ANON_KEY) || (config && config.supabase && config.supabase.anonKey);

  if (!resolvedUrl || !resolvedKey) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY must be provided');

  const supabase = createClient(resolvedUrl, resolvedKey, { auth: { persistSession: true } });
  return supabase;
}

export async function signUp(supabase, email, password, timeoutMs = 15000) {
  if (!supabase) throw new Error('Supabase client not initialised');

  // Race the Supabase signUp call against a timeout so callers get a clear
  // network-timeout error instead of waiting indefinitely.
  const signupPromise = supabase.auth.signUp({ email, password });
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Network timeout: request took too long')), timeoutMs)
  );

  return await Promise.race([signupPromise, timeoutPromise]);
}

export async function signIn(supabase, email, password) {
  if (!supabase) throw new Error('Supabase client not initialised');
  return await supabase.auth.signInWithPassword({ email, password });
}

export async function signOut(supabase) {
  if (!supabase) throw new Error('Supabase client not initialised');
  return await supabase.auth.signOut();
}

export function getUser(supabase) {
  if (!supabase) throw new Error('Supabase client not initialised');
  return supabase.auth.getUser ? supabase.auth.getUser() : { error: new Error('getUser not available in this SDK version') };
}

export async function resetPassword(supabase, email) {
  if (!supabase) throw new Error('Supabase client not initialised');
  return supabase.auth.resetPasswordForEmail ? await supabase.auth.resetPasswordForEmail(email) : { error: new Error('resetPasswordForEmail not available in this SDK version') };
}
