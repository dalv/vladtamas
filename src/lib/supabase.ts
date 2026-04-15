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

export type Workout = {
  id: string;
  title: string;
  color: string;
  created_at: string;
};

export type WorkoutScheduleEntry = {
  id: string;
  workout_id: string;
  day_of_week: number; // 0 = Monday ... 6 = Sunday
  position: number;
  created_at: string;
};