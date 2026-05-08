import { createClient } from '@supabase/supabase-js';

const PROJECT_URL = 'https://epsewsosawzbhrnmjenn.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwc2V3c29zYXd6Ymhybm1qZW5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUyMzYwMDUsImV4cCI6MjA4MDgxMjAwNX0.OOsRl8hnGgoA0NluStoHoXxWed3uoc7GwIobsykIcec';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || PROJECT_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const updateSupabaseConfig = (_url: string, _key: string) => {};
