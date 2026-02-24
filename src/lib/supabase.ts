import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Checkin = {
  id: string;
  name: string;
  status: "training_now" | "planning";
  start_time: string | null;
  end_time: string | null;
  message: string | null;
  created_at: string;
  checkin_date: string;
};