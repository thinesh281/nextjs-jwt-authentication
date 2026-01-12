import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "@/lib/action";
import Link from "next/link"; // Use Link for internal navigation
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Bell,
  User,
  UserCircle, // New icon for Profile
} from "lucide-react";

export default async function DashboardPage() {
  // --- STEP 1: CHECK IDENTITY ---
  const user = await getCurrentUser();

  // --- STEP 2: REDIRECT IF NOT LOGGED IN ---
  if (!user) {
    redirect("/"); // Ensure this matches your login page path
  }

  // --- STEP 3: ROLE CHECK ---
  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      {/* 1. SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-xl font-bold border-b border-slate-800">
          Nexus<span className="text-blue-400">Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg bg-blue-600"
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          {/* UPDATED: Profile Link added to Sidebar */}
          <Link
            href="/profile"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            <UserCircle size={20} />
            <span>My Profile</span>
          </Link>

          <Link
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            <Users size={20} />
            <span>Team Members</span>
          </Link>

          <Link
            href="#"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-slate-800 transition"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </nav>

        {/* LOGOUT FORM */}
        <div className="p-4 border-t border-slate-800">
          <form action={logoutAction}>
            <button className="flex items-center space-x-3 w-full p-3 text-red-400 hover:bg-red-500/10 rounded-lg transition">
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </form>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-gray-700">Overview</h1>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-blue-600">
              <Bell size={20} />
            </button>

            {/* UPDATED: Profile link also added to the top user badge */}
            <Link
              href="/profile"
              className="flex items-center space-x-2 border-l pl-4 hover:opacity-80 transition"
            >
              <span className="text-sm font-medium text-gray-600">
                {user.name}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                <User size={18} />
              </div>
            </Link>
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <section className="p-8 overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Welcome back, {user.name} 👋</h2>
            <p className="text-gray-500">
              Here’s what’s happening with your projects today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-bold">
                Total Users
              </p>
              <p className="text-3xl font-bold mt-1">1,284</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-bold">
                Active Sessions
              </p>
              <p className="text-3xl font-bold mt-1">42</p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <p className="text-sm text-gray-500 uppercase font-bold">
                Pending Alerts
              </p>
              <p className="text-3xl font-bold mt-1 text-orange-500">12</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
