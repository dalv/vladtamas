"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  supabase,
  type Workout,
  type WorkoutScheduleEntry,
} from "@/lib/supabase";

// A curated palette of ~17 muted, pastel label colors.
const COLORS: { name: string; hex: string }[] = [
  { name: "Merah", hex: "#fca5a5" },
  { name: "Jingga", hex: "#fdba74" },
  { name: "Amber", hex: "#fcd34d" },
  { name: "Kuning", hex: "#fde047" },
  { name: "Hijau Limau", hex: "#bef264" },
  { name: "Hijau", hex: "#86efac" },
  { name: "Zamrud", hex: "#6ee7b7" },
  { name: "Tosca", hex: "#5eead4" },
  { name: "Sian", hex: "#67e8f9" },
  { name: "Biru Langit", hex: "#7dd3fc" },
  { name: "Biru", hex: "#93c5fd" },
  { name: "Nila", hex: "#a5b4fc" },
  { name: "Violet", hex: "#c4b5fd" },
  { name: "Ungu", hex: "#d8b4fe" },
  { name: "Fuchsia", hex: "#f0abfc" },
  { name: "Merah Muda", hex: "#f9a8d4" },
  { name: "Mawar", hex: "#fda4af" },
];

// Map from the old saturated palette → new muted palette, so any workouts
// already stored in the DB pick up the new look without a migration.
const LEGACY_COLOR_MAP: Record<string, string> = {
  "#ef4444": "#fca5a5",
  "#f97316": "#fdba74",
  "#f59e0b": "#fcd34d",
  "#eab308": "#fde047",
  "#84cc16": "#bef264",
  "#22c55e": "#86efac",
  "#10b981": "#6ee7b7",
  "#14b8a6": "#5eead4",
  "#06b6d4": "#67e8f9",
  "#0ea5e9": "#7dd3fc",
  "#3b82f6": "#93c5fd",
  "#6366f1": "#a5b4fc",
  "#8b5cf6": "#c4b5fd",
  "#a855f7": "#d8b4fe",
  "#d946ef": "#f0abfc",
  "#ec4899": "#f9a8d4",
  "#f43f5e": "#fda4af",
};

function normalizeColor(hex: string): string {
  return LEGACY_COLOR_MAP[hex.toLowerCase()] ?? hex;
}

function pickRandomColor(except?: string): string {
  const pool = except ? COLORS.filter((c) => c.hex !== except) : COLORS;
  return pool[Math.floor(Math.random() * pool.length)].hex;
}

const DAYS = [
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
  "Minggu",
];

type DragState = {
  workout: Workout;
  x: number;
  y: number;
  hoverDay: number | null;
};

export function WorkoutsContent() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [schedule, setSchedule] = useState<WorkoutScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newColor, setNewColor] = useState<string>(() => pickRandomColor());
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  dragRef.current = drag;

  // Today, in Monday=0 … Sunday=6 form. Set after mount to avoid SSR mismatch.
  const [todayIndex, setTodayIndex] = useState<number | null>(null);
  useEffect(() => {
    setTodayIndex((new Date().getDay() + 6) % 7);
  }, []);

  // ----- Data fetching -----
  const fetchAll = useCallback(async () => {
    const [{ data: w, error: we }, { data: s, error: se }] = await Promise.all([
      supabase.from("workouts").select("*").order("created_at", { ascending: true }),
      supabase
        .from("workout_schedule")
        .select("*")
        .order("position", { ascending: true }),
    ]);
    if (we) console.error("Error fetching workouts:", we);
    if (se) console.error("Error fetching schedule:", se);
    setWorkouts(
      (w || []).map((row) => ({ ...row, color: normalizeColor(row.color) }))
    );
    setSchedule(s || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Close color picker when clicking outside
  useEffect(() => {
    if (!colorPickerOpen) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-color-picker]")) {
        setColorPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [colorPickerOpen]);

  // ----- Create workout -----
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("workouts")
      .insert({ title, color: newColor })
      .select()
      .single();
    if (error) {
      console.error("Error creating workout:", error);
      alert("Gagal membuat latihan. Silakan coba lagi.");
    } else if (data) {
      setWorkouts((prev) => [...prev, data]);
      setNewTitle("");
      setNewColor((prev) => pickRandomColor(prev));
    }
    setCreating(false);
  };

  // ----- Delete workout (removes schedule entries via cascade) -----
  const handleDeleteWorkout = async (id: string) => {
    if (
      !confirm(
        "Hapus latihan ini? Latihan juga akan dihapus dari jadwal mingguan Anda."
      )
    )
      return;
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) {
      console.error("Error deleting workout:", error);
      return;
    }
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
    setSchedule((prev) => prev.filter((s) => s.workout_id !== id));
  };

  // ----- Remove scheduled entry -----
  const handleRemoveScheduled = async (id: string) => {
    const prev = schedule;
    setSchedule((s) => s.filter((e) => e.id !== id));
    const { error } = await supabase
      .from("workout_schedule")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Error removing scheduled entry:", error);
      setSchedule(prev);
    }
  };

  // ----- Drag & drop via pointer events (works on desktop + touch) -----
  const handlePointerDown = (e: React.PointerEvent, workout: Workout) => {
    // Only left mouse button / primary touch / pen
    if (e.button !== undefined && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ workout, x: e.clientX, y: e.clientY, hoverDay: null });
    e.preventDefault();
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const dayEl = el?.closest("[data-day-cell]") as HTMLElement | null;
    const dayAttr = dayEl?.getAttribute("data-day-cell");
    const hoverDay = dayAttr ? parseInt(dayAttr, 10) : null;
    setDrag({
      workout: dragRef.current.workout,
      x: e.clientX,
      y: e.clientY,
      hoverDay,
    });
  };

  const handlePointerUp = async (e: React.PointerEvent) => {
    const current = dragRef.current;
    setDrag(null);
    if (!current) return;

    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const dayEl = el?.closest("[data-day-cell]") as HTMLElement | null;
    const dayAttr = dayEl?.getAttribute("data-day-cell");
    if (!dayAttr) return;
    const day = parseInt(dayAttr, 10);

    // Compute next position for this day
    const positionsForDay = schedule
      .filter((s) => s.day_of_week === day)
      .map((s) => s.position);
    const nextPos = positionsForDay.length
      ? Math.max(...positionsForDay) + 1
      : 0;

    // Optimistic insert
    const optimistic: WorkoutScheduleEntry = {
      id: `temp-${Date.now()}-${Math.random()}`,
      workout_id: current.workout.id,
      day_of_week: day,
      position: nextPos,
      created_at: new Date().toISOString(),
    };
    setSchedule((prev) => [...prev, optimistic]);

    const { data, error } = await supabase
      .from("workout_schedule")
      .insert({
        workout_id: current.workout.id,
        day_of_week: day,
        position: nextPos,
      })
      .select()
      .single();

    if (error) {
      console.error("Error scheduling workout:", error);
      setSchedule((prev) => prev.filter((s) => s.id !== optimistic.id));
      return;
    }
    if (data) {
      setSchedule((prev) =>
        prev.map((s) => (s.id === optimistic.id ? data : s))
      );
    }
  };

  // ----- Derived: schedule grouped by day -----
  const scheduleByDay = useMemo(() => {
    const map: Record<number, WorkoutScheduleEntry[]> = {};
    for (let d = 0; d < 7; d++) map[d] = [];
    for (const entry of schedule) {
      if (map[entry.day_of_week]) map[entry.day_of_week].push(entry);
    }
    for (const d of Object.keys(map)) {
      map[Number(d)].sort((a, b) => a.position - b.position);
    }
    return map;
  }, [schedule]);

  const workoutsById = useMemo(() => {
    const map: Record<string, Workout> = {};
    for (const w of workouts) map[w.id] = w;
    return map;
  }, [workouts]);

  // How many times each workout appears across the week — shown on directory pills.
  const usageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const entry of schedule) {
      counts[entry.workout_id] = (counts[entry.workout_id] ?? 0) + 1;
    }
    return counts;
  }, [schedule]);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <div className="max-w-3xl mx-auto px-4 pt-5 pb-8">
        <div className="flex items-center justify-between mb-4">
          <a
            href="/"
            className="text-zinc-500 hover:text-zinc-700 text-sm transition-colors"
          >
            ← vladtamas.com
          </a>
          <h1 className="text-lg font-semibold tracking-tight">
            Latihan <span className="ml-1">💪</span>
          </h1>
        </div>

        {/* 1. Create a workout */}
        <form
          onSubmit={handleCreate}
          className="flex items-center gap-2 mb-4"
        >
          {/* Color picker */}
          <div className="relative" data-color-picker>
            <button
              type="button"
              onClick={() => setColorPickerOpen((o) => !o)}
              className="h-9 w-9 rounded-lg border border-zinc-300 bg-white flex items-center justify-center hover:border-zinc-400 transition"
              aria-label="Pilih warna"
            >
              <span
                className="h-5 w-5 rounded-full border border-black/20"
                style={{ backgroundColor: newColor }}
              />
            </button>
            {colorPickerOpen && (
              <div className="absolute z-20 mt-2 left-0 w-56 p-3 bg-white border border-zinc-200 rounded-xl shadow-xl grid grid-cols-6 gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setNewColor(c.hex);
                      setColorPickerOpen(false);
                    }}
                    title={c.name}
                    className={`h-7 w-7 rounded-full border transition-transform hover:scale-110 ${
                      newColor === c.hex
                        ? "border-zinc-900 ring-2 ring-zinc-900/30"
                        : "border-black/20"
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Tambah latihan (mis. Back squat)"
            className="flex-1 min-w-0 h-9 px-3 bg-white border border-zinc-300 rounded-lg
                       text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none
                       focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />

          <button
            type="submit"
            disabled={creating || !newTitle.trim()}
            className="h-9 px-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg
                       font-semibold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "…" : "Buat"}
          </button>
        </form>

        {/* 2. Directory of workout pills */}
        <div className="mb-5">
          {loading ? (
            <div className="flex py-1">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-zinc-400 text-sm">
              Belum ada latihan. Tambahkan yang pertama di atas.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {workouts.map((w) => (
                <WorkoutPill
                  key={w.id}
                  workout={w}
                  count={usageCounts[w.id] ?? 0}
                  draggable
                  onPointerDown={(e) => handlePointerDown(e, w)}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onDelete={() => handleDeleteWorkout(w.id)}
                  dimmed={drag?.workout.id === w.id}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Weekly calendar */}
        <div className="border border-zinc-200 rounded-xl overflow-hidden">
          {DAYS.map((dayName, i) => {
            const entries = scheduleByDay[i] || [];
            const isHover = drag?.hoverDay === i;
            const isToday = todayIndex === i;
            return (
              <div
                key={dayName}
                data-day-cell={i}
                className={`flex items-stretch border-b last:border-b-0 border-zinc-200 transition-colors ${
                  isHover
                    ? "bg-emerald-100"
                    : i % 2 === 0
                    ? "bg-white"
                    : "bg-zinc-50"
                }`}
              >
                <div
                  className={`w-24 sm:w-28 shrink-0 px-3 py-2.5 text-sm border-r border-zinc-200 flex items-center gap-2 ${
                    isToday ? "font-semibold text-zinc-900" : "font-medium text-zinc-700"
                  }`}
                >
                  <span
                    className={`h-2 w-2 rounded-full shrink-0 ${
                      isToday ? "bg-emerald-500" : "bg-transparent"
                    }`}
                    aria-hidden
                  />
                  <span>{dayName}</span>
                </div>
                <div className="flex-1 min-h-[52px] px-3 py-2 flex flex-wrap items-center gap-2">
                  {entries.map((entry) => {
                    const w = workoutsById[entry.workout_id];
                    if (!w) return null;
                    return (
                      <ScheduledPill
                        key={entry.id}
                        workout={w}
                        onRemove={() => handleRemoveScheduled(entry.id)}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Drag ghost */}
      {drag && (
        <div
          className="pointer-events-none fixed z-50 select-none"
          style={{
            left: drag.x,
            top: drag.y,
            transform: "translate(-50%, -50%)",
          }}
        >
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-zinc-800 shadow-lg"
            style={{
              backgroundColor: drag.workout.color,
              opacity: 0.95,
            }}
          >
            {drag.workout.title}
            {usageCounts[drag.workout.id] > 0 && (
              <span className="ml-1 text-zinc-700/80">
                ({usageCounts[drag.workout.id]})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}

function WorkoutPill({
  workout,
  count = 0,
  draggable,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDelete,
  dimmed,
}: {
  workout: Workout;
  count?: number;
  draggable?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
  onPointerMove?: (e: React.PointerEvent) => void;
  onPointerUp?: (e: React.PointerEvent) => void;
  onDelete?: () => void;
  dimmed?: boolean;
}) {
  return (
    <span
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={`group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium text-zinc-800 shadow-sm transition-opacity ${
        draggable ? "cursor-grab active:cursor-grabbing touch-none" : ""
      } ${dimmed ? "opacity-40" : ""}`}
      style={{ backgroundColor: workout.color }}
    >
      <span>
        {workout.title}
        {count > 0 && (
          <span className="ml-1 text-zinc-700/80">({count})</span>
        )}
      </span>
      {onDelete && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-0.5 h-5 w-5 rounded-full bg-black/10 hover:bg-black/25 flex items-center justify-center text-zinc-700 transition"
          aria-label={`Hapus ${workout.title}`}
          title="Hapus latihan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </span>
  );
}

function ScheduledPill({
  workout,
  onRemove,
}: {
  workout: Workout;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium text-zinc-800 shadow-sm"
      style={{ backgroundColor: workout.color }}
    >
      <span>{workout.title}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 h-5 w-5 rounded-full bg-black/10 hover:bg-black/25 flex items-center justify-center text-zinc-700 transition"
        aria-label={`Hapus ${workout.title} dari jadwal`}
        title="Hapus dari hari"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </span>
  );
}
