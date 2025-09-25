import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Some features may not work correctly.');
}

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {} as ReturnType<typeof createClient>;

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          id: string;
          name: string;
          symbol: string;
          asset_type: string;
          description: string | null;
          location: string | null;
          verification_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['assets']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['assets']['Insert']>;
      };
      price_feeds: {
        Row: {
          id: string;
          asset_id: string;
          price: number;
          source: string;
          confidence_score: number | null;
          timestamp: string;
          block_number: number | null;
          transaction_hash: string | null;
        };
        Insert: Omit<Database['public']['Tables']['price_feeds']['Row'], 'id' | 'timestamp'>;
        Update: Partial<Database['public']['Tables']['price_feeds']['Insert']>;
      };
      oracle_nodes: {
        Row: {
          id: string;
          address: string;
          name: string | null;
          reputation_score: number;
          stake_amount: number | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['oracle_nodes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['oracle_nodes']['Insert']>;
      };
      data_sources: {
        Row: {
          id: string;
          name: string;
          api_endpoint: string | null;
          reliability_score: number | null;
          is_active: boolean;
        };
        Insert: Omit<Database['public']['Tables']['data_sources']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['data_sources']['Insert']>;
      };
    };
  };
};