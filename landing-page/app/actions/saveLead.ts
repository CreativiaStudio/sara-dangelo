'use server'

import { supabase } from '@/lib/supabase';

export async function saveLead(email: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('leads')
      .insert([{ email }]);
      
    if (error) {
      console.error('Error saving lead:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    console.error('Unexpected error saving lead:', err);
    return { success: false, error: 'Internal server error' };
  }
}
