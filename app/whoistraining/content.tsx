"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase, type Checkin } from "@/lib/supabase";

function getTodayDate() {
  // Returns YYYY-MM-DD in local timezone
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function formatTime(time: string | null) {
  if (!time) return null;
  const [h, m] = time.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${m} ${ampm}`;
}

function timeAgo(dateString: string) {
  const now = new Date();
  const then = new Date(dateString);
  const diffMs = now.getTime() - then.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  return `${Math.floor(diffHr / 24)}d ago`;
}

function generateTimeOptions() {
  const options: string[] = [];
  for (let h = 6; h <= 22; h++) {
    for (const m of ["00", "30"]) {
      options.push(`${String(h).padStart(2, "0")}:${m}`);
    }
  }
  return options;
}

const TIME_OPTIONS = generateTimeOptions();

export function WhoIsTrainingContent() {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"training_now" | "planning">("training_now");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [message, setMessage] = useState("");

  const fetchCheckins = useCallback(async () => {
    const today = getTodayDate();
    const { data, error } = await supabase
      .from("checkins")
      .select("*")
      .eq("checkin_date", today)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching checkins:", error);
      return;
    }
    setCheckins(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCheckins();

    // Subscribe to real-time changes
    const channel = supabase
      .channel("checkins-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "checkins" },
        () => {
          fetchCheckins();
        }
      )
      .subscribe();

    // Refresh every 60 seconds as fallback
    const interval = setInterval(fetchCheckins, 60000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchCheckins]);

  // Persist name in localStorage
  useEffect(() => {
    const saved = localStorage.getItem("whoistraining_name");
    if (saved) setName(saved);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    localStorage.setItem("whoistraining_name", name.trim());

    const { error } = await supabase.from("checkins").insert({
      name: name.trim(),
      status,
      start_time: status === "planning" && startTime ? startTime : null,
      end_time: status === "planning" && endTime ? endTime : null,
      message: message.trim() || null,
      checkin_date: getTodayDate(),
    });

    if (error) {
      console.error("Error checking in:", error);
      alert("Something went wrong. Please try again.");
    } else {
      setShowForm(false);
      setMessage("");
      setStartTime("");
      setEndTime("");
      await fetchCheckins();
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("checkins").delete().eq("id", id);
    if (!error) fetchCheckins();
  };

  const trainingNow = checkins.filter((c) => c.status === "training_now");
  const planningLater = checkins.filter((c) => c.status === "planning");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-6">
        <a
          href="/"
          className="text-zinc-500 hover:text-zinc-300 text-sm transition-colors"
        >
          ← vladtamas.com
        </a>

        <div className="mt-8 mb-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Who Is Training
            <span className="inline-block ml-2 animate-pulse">🤸</span>
          </h1>
          <p className="text-zinc-400 mt-2">{today}</p>
        </div>

        {/* Check-in button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mt-6 w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 
                       rounded-xl font-semibold text-white transition-all duration-200 
                       hover:shadow-lg hover:shadow-emerald-600/20 active:scale-[0.98]"
          >
            + Check In
          </button>
        )}

        {/* Check-in form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mt-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4"
          >
            {/* Name */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vlad"
                required
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg 
                           text-white placeholder:text-zinc-500 focus:outline-none 
                           focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Status toggle */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Status
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStatus("training_now")}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    status === "training_now"
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  🏋️ Training Now
                </button>
                <button
                  type="button"
                  onClick={() => setStatus("planning")}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    status === "planning"
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  📅 Planning to Train
                </button>
              </div>
            </div>

            {/* Time range (only for planning) */}
            {status === "planning" && (
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    From
                  </label>
                  <select
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg 
                               text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">Select time</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-zinc-400 mb-1.5">
                    Until
                  </label>
                  <select
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg 
                               text-white focus:outline-none focus:border-blue-500 transition"
                  >
                    <option value="">Select time</option>
                    {TIME_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {formatTime(t)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Optional message */}
            <div>
              <label className="block text-sm text-zinc-400 mb-1.5">
                Message{" "}
                <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="e.g. Looking for a base for icarians!"
                maxLength={140}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg 
                           text-white placeholder:text-zinc-500 focus:outline-none 
                           focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
              />
            </div>

            {/* Submit / Cancel */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-lg 
                           font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Checking in..." : "Check In"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg 
                           text-zinc-400 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Checkins list */}
      <div className="max-w-2xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : checkins.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🧘</p>
            <p className="text-zinc-400 text-lg">No one has checked in yet today.</p>
            <p className="text-zinc-600 text-sm mt-1">Be the first!</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Training Now section */}
            {trainingNow.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                    Training Now ({trainingNow.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {trainingNow.map((checkin) => (
                    <CheckinCard
                      key={checkin.id}
                      checkin={checkin}
                      onDelete={handleDelete}
                      currentName={name}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Planning section */}
            {planningLater.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <h2 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">
                    Planning to Train ({planningLater.length})
                  </h2>
                </div>
                <div className="space-y-2">
                  {planningLater.map((checkin) => (
                    <CheckinCard
                      key={checkin.id}
                      checkin={checkin}
                      onDelete={handleDelete}
                      currentName={name}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CheckinCard({
  checkin,
  onDelete,
  currentName,
}: {
  checkin: Checkin;
  onDelete: (id: string) => void;
  currentName: string;
}) {
  const isOwn = checkin.name.toLowerCase() === currentName.toLowerCase() && currentName !== "";
  const isNow = checkin.status === "training_now";

  return (
    <div
      className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all ${
        isNow
          ? "bg-emerald-950/30 border-emerald-900/50"
          : "bg-blue-950/20 border-blue-900/40"
      }`}
    >
      {/* Avatar circle */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          isNow
            ? "bg-emerald-600/30 text-emerald-300"
            : "bg-blue-600/30 text-blue-300"
        }`}
      >
        {checkin.name.charAt(0).toUpperCase()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-semibold text-white">{checkin.name}</span>
          {checkin.status === "planning" &&
            (checkin.start_time || checkin.end_time) && (
              <span className="text-xs text-blue-400">
                {checkin.start_time && formatTime(checkin.start_time)}
                {checkin.start_time && checkin.end_time && " → "}
                {checkin.end_time && formatTime(checkin.end_time)}
              </span>
            )}
          <span className="text-xs text-zinc-600">
            {timeAgo(checkin.created_at)}
          </span>
        </div>
        {checkin.message && (
          <p className="text-sm text-zinc-400 mt-0.5">{checkin.message}</p>
        )}
      </div>

      {/* Delete button (only visible for own entries) */}
      {isOwn && (
        <button
          onClick={() => onDelete(checkin.id)}
          className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 
                     text-zinc-600 hover:text-red-400 transition-all p-1"
          title="Remove check-in"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
}