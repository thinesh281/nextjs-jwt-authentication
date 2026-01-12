"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); // Email usually stays read-only
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // 1. Fetch current user data on load
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me"); // You'll need this helper route
      if (res.ok) {
        const data = await res.json();
        setName(data.user.name);
        setEmail(data.user.email);
      } else {
        router.push("/");
      }
    };
    fetchUser();
  }, [router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, password: newPassword }),
      });

      if (res.ok) {
        setMessage({ type: "success", text: "Profile updated successfully!" });
        setNewPassword(""); // Clear password field
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.message || "Update failed" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          Account Settings
        </h1>

        <form
          onSubmit={handleUpdate}
          className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden"
        >
          <div className="p-6 space-y-6">
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Email Field (Read Only) */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <input
                type="text"
                disabled
                className="block w-full rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                value={email}
              />
            </div>

            <hr className="border-slate-100" />

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-indigo-500 outline-none"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {message.text && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                    : "bg-red-50 text-red-700 border border-red-100"
                }`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="bg-slate-50 px-6 py-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
