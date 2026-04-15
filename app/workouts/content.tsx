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

// A curated palette of ~17 commonly-used label colors.
const COLORS: { name: string; hex: string }[] = [
  { name: "Red", hex: "#ef4444" },
  { name: "Orange", hex: "#f97316" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Lime", hex: "#84cc16" },
  { name: "Green", hex: "#22c55e" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Teal", hex: "#14b8a6" },
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Sky", hex: "#0ea5e9" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Indigo", hex: "#6366f1" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Fuchsia", hex: "#d946ef" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Rose", hex: "#f43f5e" },
];

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
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
  const [newColor, setNewColor] = useState(COLORS[10].hex); // Blue
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  const [drag, setDrag] = useState<DragState | null>(null);
  const dragRef = useRef<DragState | null>(null);
  dragRef.current = drag;

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
    setWorkouts(w || []);
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
      alert("Could not create workout. Please try again.");
    } else if (data) {
      setWorkouts((prev) => [...prev, data]);
      setNewTitle("");
    }
    setCreating(false);
  };

  // ----- Delete workout (removes schedule entries via cascade) -----
  const handleDeleteWorkout = async (id: string) => {
    if (
      !confirm(
        "Delete this workout? It will also be removed from your weekly schedule."
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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-4xl mx-auto px-4 pt-12 pb-20">
        <a
          href="/"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          ← vladtamas.com
        </a>

        <div className="mt-8 mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Workouts <span className="inline-block ml-2">💪</span>
          </h1>
          <p className="text-zinc-400 mt-2">
            Build your directory, then drag workouts into your week.
          </p>
        </div>

        {/* 1. Create a workout */}
        <form
          onSubmit={handleCreate}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-6"
        >
          <label className="block text-sm text-zinc-400 mb-2">
            Add a workout
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {/* Color picker */}
            <div className="relative" data-color-picker>
              <button
                type="button"
                onClick={() => setColorPickerOpen((o) => !o)}
                className="h-10 w-10 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center hover:border-zinc-600 transition"
                aria-label="Pick color"
              >
                <span
                  className="h-6 w-6 rounded-full border border-black/30"
                  style={{ backgroundColor: newColor }}
                />
              </button>
              {colorPickerOpen && (
                <div className="absolute z-20 mt-2 left-0 w-56 p-3 bg-zinc-900 border border-zinc-700 rounded-xl shadow-xl grid grid-cols-6 gap-2">
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
                          ? "border-white ring-2 ring-white/40"
                          : "border-black/30"
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
              placeholder="e.g. Back squat"
              className="flex-1 min-w-0 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg
                         text-white placeholder:text-zinc-500 focus:outline-none
                         focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />

            <button
              type="submit"
              disabled={creating || !newTitle.trim()}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg
                         font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? "Adding…" : "Create"}
            </button>
          </div>
        </form>

        {/* 2. Directory of workout pills */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Your Workouts
          </h2>
          {loading ? (
            <div className="flex py-4">
              <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : workouts.length === 0 ? (
            <p className="text-zinc-600 text-sm">
              No workouts yet. Add your first one above.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {workouts.map((w) => (
                <WorkoutPill
                  key={w.id}
                  workout={w}
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
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
            Your Week
          </h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            {DAYS.map((dayName, i) => {
              const entries = scheduleByDay[i] || [];
              const isHover = drag?.hoverDay === i;
              return (
                <div
                  key={dayName}
                  data-day-cell={i}
                  className={`flex items-stretch border-b last:border-b-0 border-zinc-800 transition-colors ${
                    isHover
                      ? "bg-emerald-900/30"
                      : i % 2 === 0
                      ? "bg-zinc-900"
                      : "bg-zinc-900/60"
                  }`}
                >
                  <div className="w-28 sm:w-36 shrink-0 px-4 py-3 font-semibold text-zinc-300 border-r border-zinc-800 flex items-center">
                    {dayName}
                  </div>
                  <div className="flex-1 min-h-[56px] px-3 py-2 flex flex-wrap items-center gap-2">
                    {entries.length === 0 && !isHover && (
                      <span className="text-zinc-700 text-sm italic">
                        Drop a workout here
                      </span>
                    )}
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
          <p className="text-xs text-zinc-600 mt-3">
            Tip: press and hold a workout pill, then drag it into a day. Tap
            the × on a scheduled pill to remove it.
          </p>
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
            className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg"
            style={{
              backgroundColor: drag.workout.color,
              opacity: 0.95,
            }}
          >
            {drag.workout.title}
          </span>
        </div>
      )}
    </div>
  );
}

function WorkoutPill({
  workout,
  draggable,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onDelete,
  dimmed,
}: {
  workout: Workout;
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
      className={`group inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium text-white shadow-sm transition-opacity ${
        draggable ? "cursor-grab active:cursor-grabbing touch-none" : ""
      } ${dimmed ? "opacity-40" : ""}`}
      style={{ backgroundColor: workout.color }}
    >
      <span>{workout.title}</span>
      {onDelete && (
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="ml-0.5 h-5 w-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/90 transition"
          aria-label={`Delete ${workout.title}`}
          title="Delete workout"
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
      className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
      style={{ backgroundColor: workout.color }}
    >
      <span>{workout.title}</span>
      <button
        type="button"
        onClick={onRemove}
        className="ml-0.5 h-5 w-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white/90 transition"
        aria-label={`Remove ${workout.title} from schedule`}
        title="Remove from day"
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
