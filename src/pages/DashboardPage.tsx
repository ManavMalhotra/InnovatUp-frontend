import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Users,
  FileText,
  SignOut,
  Bell,
  CalendarBlank,
  CheckCircle,
  Clock,
  Trophy,
  Buildings,
  Table,
  User as UserIcon,
  DownloadSimple,
  MagnifyingGlass,
  CircleNotch,
  CaretDown,
  CaretUp,
  Envelope,
  Phone,
  UserCircle,
  ArrowClockwise,
} from "@phosphor-icons/react";
import AnimatedLogo from "../components/AnimatedLogo";
import { clearAuth, isAdmin as checkIsAdmin, type User } from "../lib/jwt";
import type { AdminUser, TeamMember } from "../types/auth";
import api from "../lib/api";
import * as XLSX from "xlsx";

// Static event timeline
const timelineEvents = [
  { date: "Mar 21", title: "Registration Deadline", status: "completed" },
  { date: "Mar 24", title: "Kickoff Event", status: "upcoming" },
  { date: "Mar 24", title: "Build Day", status: "upcoming" },
  { date: "Mar 24", title: "Demo Day", status: "upcoming" },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);

  // ═══════════════════════════════════════
  // Toggle expanded row
  // ═══════════════════════════════════════
  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    if (expandedRows.size === filteredUsers.length) {
      setExpandedRows(new Set());
    } else {
      setExpandedRows(new Set(filteredUsers.map((u, i) => u._id || String(i))));
    }
  };

  // ═══════════════════════════════════════
  // Fetch admin users from backend
  // ═══════════════════════════════════════
  const fetchAdminUsers = useCallback(
    async (showRefreshLoader = false) => {
      if (showRefreshLoader) {
        setIsRefreshing(true);
      }

      try {
        const token =
          sessionStorage.getItem("admin_token") ||
          localStorage.getItem("auth_token");
        const res = await api.get("/admin/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data?.result === "ok" && Array.isArray(res.data.users)) {
          setAdminUsers(res.data.users);
          // Update sessionStorage cache
          sessionStorage.setItem("admin_users", JSON.stringify(res.data.users));
          setLastFetched(new Date());
        }
      } catch (err: any) {
        console.error("Failed to fetch admin users:", err);

        // If API fails, fall back to cached data
        if (!showRefreshLoader) {
          try {
            const cached = sessionStorage.getItem("admin_users");
            if (cached) {
              setAdminUsers(JSON.parse(cached));
            }
          } catch (e) {
            console.error("Failed to parse cached admin users", e);
          }
        }

        // If 401/403 → session expired
        if (err?.response?.status === 401 || err?.response?.status === 403) {
          clearAuth();
          navigate("/login");
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [navigate],
  );

  // ═══════════════════════════════════════
  // Load user data on mount
  // ═══════════════════════════════════════
  useEffect(() => {
    if (checkIsAdmin()) {
      setIsAdmin(true);

      // Load cached data first for instant display
      try {
        const cached = sessionStorage.getItem("admin_users");
        if (cached) setAdminUsers(JSON.parse(cached));
      } catch (e) {
        console.error("Failed to parse cached admin users", e);
      }

      // Then fetch fresh data from backend
      fetchAdminUsers(false).finally(() => setIsLoading(false));
      return;
    }

    // Regular user
    const token = localStorage.getItem("auth_token");
    if (!token) {
      navigate("/login");
      return;
    }

    api
      .get("/dashboard")
      .then((res) => {
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          navigate("/login");
        }
      })
      .catch(() => {
        clearAuth();
        navigate("/login");
      })
      .finally(() => setIsLoading(false));
  }, [navigate, fetchAdminUsers]);

  // ═══════════════════════════════════════
  // Manual refresh handler
  // ═══════════════════════════════════════
  const handleRefresh = () => {
    fetchAdminUsers(true);
  };

  // ═══════════════════════════════════════
  // Handlers
  // ═══════════════════════════════════════
  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const getInitials = (name: string = "") => {
    return (
      name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() || "?"
    );
  };

  // ═══════════════════════════════════════
  // Format last fetched time
  // ═══════════════════════════════════════
  const formatLastFetched = () => {
    if (!lastFetched) return "";
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastFetched.getTime()) / 1000);
    if (diff < 5) return "Just now";
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return lastFetched.toLocaleTimeString();
  };

  // ═══════════════════════════════════════
  // Excel Export (includes team member rows)
  // ═══════════════════════════════════════
  const handleExportExcel = () => {
    const exportData: Record<string, string | number>[] = [];

    filteredUsers.forEach((u, index) => {
      exportData.push({
        "S.No": index + 1,
        Role: "Leader",
        Name: u.username || u.name || "",
        Email: u.email || "",
        Mobile: u.mobile || "",
        Institute: u.institute || "",
        "Team Name": u.teamName || "Individual",
        "Team Size": (u.team_count || 0) + 1,
        "Topic / Idea": u.topic || "",
        "Idea Description": u.idea_desc || "",
      });

      if (u.team_members && Array.isArray(u.team_members)) {
        u.team_members.forEach((m: TeamMember) => {
          exportData.push({
            "S.No": "",
            Role: "Member",
            Name: m.name || "",
            Email: m.email || "",
            Mobile: m.mobile || "",
            Institute: "",
            "Team Name": u.teamName || "Individual",
            "Team Size": "",
            "Topic / Idea": "",
            "Idea Description": "",
          });
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    if (exportData.length > 0) {
      const colWidths = Object.keys(exportData[0]).map((key) => ({
        wch:
          Math.max(
            key.length,
            ...exportData.map(
              (row) => String(row[key as keyof typeof row] || "").length,
            ),
          ) + 2,
      }));
      worksheet["!cols"] = colWidths;
    }

    XLSX.writeFile(
      workbook,
      `InnovatUp_Participants_${new Date().toISOString().split("T")[0]}.xlsx`,
    );
  };

  // ═══════════════════════════════════════
  // Filtered users for admin search
  // ═══════════════════════════════════════
  const filteredUsers = adminUsers.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const memberMatch =
      u.team_members &&
      Array.isArray(u.team_members) &&
      u.team_members.some(
        (m: TeamMember) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.email || "").toLowerCase().includes(q) ||
          (m.mobile || "").includes(q),
      );
    return (
      (u.username || u.name || "").toLowerCase().includes(q) ||
      (u.email || "").toLowerCase().includes(q) ||
      (u.teamName || "").toLowerCase().includes(q) ||
      (u.institute || "").toLowerCase().includes(q) ||
      (u.mobile || "").includes(q) ||
      (u.topic || "").toLowerCase().includes(q) ||
      (u.idea_desc || "").toLowerCase().includes(q) ||
      memberMatch
    );
  });

  // ═══════════════════════════════════════
  // Compute stats
  // ═══════════════════════════════════════
  const totalTeams = adminUsers.length;
  const totalParticipants = adminUsers.reduce(
    (acc, u) =>
      acc +
      1 +
      (u.team_members && Array.isArray(u.team_members)
        ? u.team_members.length
        : 0),
    0,
  );
  const uniqueInstitutes = new Set(
    adminUsers.map((u) => u.institute).filter(Boolean),
  ).size;

  // ═══════════════════════════════════════
  // Loading state
  // ═══════════════════════════════════════
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
        <CircleNotch className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const displayName = isAdmin ? "Admin" : user?.name || "User";

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════ */}
      {/* Header                                 */}
      {/* ═══════════════════════════════════════ */}
      <header className="sticky top-0 z-50 border-b bg-card/50 backdrop-blur-md border-border">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <AnimatedLogo size={32} animate={false} />
              <span className="text-xl font-bold tracking-tight font-display lg:text-2xl text-foreground">
                Innovat<span className="text-primary">Up</span>
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button className="relative p-2 transition-colors text-muted-foreground hover:text-foreground">
                <Bell className="w-5 h-5" />
                <span className="absolute w-2 h-2 rounded-full top-1 right-1 bg-primary" />
              </button>

              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <div className="flex-col items-end hidden sm:flex">
                  <span className="text-sm font-medium">{displayName}</span>
                  <span className="text-xs text-muted-foreground">
                    {isAdmin ? "Administrator" : "Participant"}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                  <span className="text-xs font-bold text-primary">
                    {getInitials(displayName)}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 transition-colors text-muted-foreground hover:text-red-400"
                  title="Logout"
                >
                  <SignOut className="w-5 h-5" weight="duotone" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* ═══════════════════════════════════════ */}
        {/* Sidebar                                 */}
        {/* ═══════════════════════════════════════ */}
        <aside className="lg:w-64 lg:min-h-[calc(100vh-80px)] lg:border-r border-border bg-background/50">
          <nav className="sticky p-4 lg:p-6 top-20">
            <div className="space-y-2">
              {isAdmin ? (
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === "overview"
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
                >
                  <Table className="w-5 h-5" />
                  <span>All Participants</span>
                </button>
              ) : (
                <>
                  {[
                    { id: "overview", label: "Overview", icon: FileText },
                    { id: "team", label: "Team", icon: Users },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === item.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-card"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          </nav>
        </aside>

        {/* ═══════════════════════════════════════ */}
        {/* Main Content                            */}
        {/* ═══════════════════════════════════════ */}
        <main className="flex-1 p-6 lg:p-10">
          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ ADMIN VIEW                        ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {isAdmin && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                    Admin <span className="text-primary">Dashboard</span>
                  </h1>
                  <div className="flex items-center gap-3">
                    <p className="body-text">
                      Manage all registered teams and participants.
                    </p>
                    {lastFetched && (
                      <span className="text-xs text-muted-foreground">
                        · Updated {formatLastFetched()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Refresh button */}
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-xl border border-border bg-card text-foreground hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh data from server"
                  >
                    <ArrowClockwise
                      className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                      weight="bold"
                    />
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                  </button>

                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlass className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search name, email, team..."
                      className="py-2.5 pl-9 pr-4 text-sm border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-64"
                    />
                  </div>

                  {/* Expand / Collapse All */}
                  <button
                    onClick={expandAll}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-xl border border-border bg-card text-foreground hover:bg-muted/50"
                  >
                    {expandedRows.size === filteredUsers.length &&
                    filteredUsers.length > 0 ? (
                      <>
                        <CaretUp className="w-4 h-4" weight="bold" />
                        Collapse All
                      </>
                    ) : (
                      <>
                        <CaretDown className="w-4 h-4" weight="bold" />
                        Expand All
                      </>
                    )}
                  </button>

                  {/* Export button */}
                  <button
                    onClick={handleExportExcel}
                    disabled={filteredUsers.length === 0}
                    className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <DownloadSimple className="w-4 h-4" weight="bold" />
                    Export Excel
                  </button>
                </div>
              </div>

              {/* ═══════════════════════════════════════ */}
              {/* Refreshing overlay indicator            */}
              {/* ═══════════════════════════════════════ */}
              {isRefreshing && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-3 px-4 py-3 text-sm border rounded-xl bg-primary/5 border-primary/20 text-primary"
                >
                  <CircleNotch className="w-4 h-4 animate-spin" />
                  Fetching latest data from server...
                </motion.div>
              )}

              {/* ═══════════════════════════════════════ */}
              {/* Stats Cards                            */}
              {/* ═══════════════════════════════════════ */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="p-5 border bg-card border-border rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-foreground">
                        {totalTeams}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered Teams
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 border bg-card border-border rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      <UserCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-foreground">
                        {totalParticipants}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total Participants
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 border bg-card border-border rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                      <Buildings className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold font-display text-foreground">
                        {uniqueInstitutes}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Institutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════ */}
              {/* Data Table with Expandable Rows         */}
              {/* ═══════════════════════════════════════ */}
              <div className="overflow-hidden border bg-card border-border rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="w-10 px-4 py-4 font-medium"></th>
                        <th className="px-4 py-4 font-medium">#</th>
                        <th className="px-4 py-4 font-medium">Leader Name</th>
                        <th className="px-4 py-4 font-medium">Email</th>
                        <th className="px-4 py-4 font-medium">Mobile</th>
                        <th className="px-4 py-4 font-medium">Institute</th>
                        <th className="px-4 py-4 font-medium">Team Name</th>
                        <th className="px-4 py-4 font-medium">Topic</th>
                        <th className="px-4 py-4 font-medium">Team Size</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={9}
                            className="px-6 py-12 text-center text-muted-foreground"
                          >
                            {searchQuery
                              ? "No matching participants found."
                              : "No participants registered yet."}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u, index) => {
                          const rowId = u._id || String(index);
                          const isExpanded = expandedRows.has(rowId);
                          const hasMembers =
                            u.team_members &&
                            Array.isArray(u.team_members) &&
                            u.team_members.length > 0;
                          const teamSize =
                            1 +
                            (u.team_members && Array.isArray(u.team_members)
                              ? u.team_members.length
                              : 0);

                          return (
                            <>
                              {/* Main Row */}
                              <tr
                                key={rowId}
                                onClick={() => hasMembers && toggleRow(rowId)}
                                className={`transition-colors ${
                                  hasMembers
                                    ? "cursor-pointer hover:bg-muted/20"
                                    : ""
                                } ${isExpanded ? "bg-primary/5" : ""}`}
                              >
                                <td className="px-4 py-4 text-center">
                                  {hasMembers ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleRow(rowId);
                                      }}
                                      className="p-1 transition-colors rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    >
                                      {isExpanded ? (
                                        <CaretUp
                                          className="w-4 h-4"
                                          weight="bold"
                                        />
                                      ) : (
                                        <CaretDown
                                          className="w-4 h-4"
                                          weight="bold"
                                        />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="block w-4 h-4" />
                                  )}
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-primary/20">
                                      <span className="text-xs font-bold text-primary">
                                        {getInitials(
                                          u.username || u.name || "",
                                        )}
                                      </span>
                                    </div>
                                    <span className="font-medium text-foreground">
                                      {u.username || u.name || "-"}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">
                                  {u.email || "-"}
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">
                                  {u.mobile || "-"}
                                </td>
                                <td className="px-4 py-4 text-muted-foreground">
                                  {u.institute || "-"}
                                </td>
                                <td className="px-4 py-4">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-primary/10 text-primary">
                                    <Users className="w-3 h-3" />
                                    {u.teamName || "Individual"}
                                  </span>
                                </td>
                                <td className="px-4 py-4 text-muted-foreground max-w-[180px] truncate">
                                  {u.topic || "-"}
                                </td>
                                <td className="px-4 py-4">
                                  <span
                                    className={`inline-flex items-center justify-center w-7 h-7 text-xs font-bold rounded-full ${
                                      teamSize > 1
                                        ? "bg-primary/10 text-primary"
                                        : "bg-muted text-muted-foreground"
                                    }`}
                                  >
                                    {teamSize}
                                  </span>
                                </td>
                              </tr>

                              {/* Expanded Team Members + Idea Description */}
                              <AnimatePresence>
                                {isExpanded && (
                                  <tr key={`${rowId}-expanded`}>
                                    <td colSpan={9} className="p-0 border-t-0">
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{
                                          height: "auto",
                                          opacity: 1,
                                        }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{
                                          duration: 0.25,
                                          ease: "easeInOut",
                                        }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-6 py-5 ml-10 mr-6 space-y-4 border-l-2 bg-muted/10 border-primary/30">
                                          {/* Team Members */}
                                          <div>
                                            <h4 className="flex items-center gap-2 mb-3 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                              <Users className="w-4 h-4" />
                                              Team Members (
                                              {u.team_members?.length || 0})
                                            </h4>
                                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                              {u.team_members &&
                                                Array.isArray(u.team_members) &&
                                                u.team_members.map(
                                                  (
                                                    member: TeamMember,
                                                    mIndex: number,
                                                  ) => (
                                                    <div
                                                      key={mIndex}
                                                      className="p-4 border bg-card border-border rounded-xl"
                                                    >
                                                      <div className="flex items-center gap-3 mb-2">
                                                        <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full bg-muted">
                                                          <UserIcon className="w-4 h-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="min-w-0">
                                                          <p className="text-sm font-medium truncate text-foreground">
                                                            {member.name || "-"}
                                                          </p>
                                                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">
                                                            Member {mIndex + 1}
                                                          </span>
                                                        </div>
                                                      </div>
                                                      <div className="space-y-1.5 ml-11">
                                                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                          <Envelope className="w-3.5 h-3.5 flex-shrink-0" />
                                                          <span className="truncate">
                                                            {member.email ||
                                                              "-"}
                                                          </span>
                                                        </p>
                                                        <p className="flex items-center gap-2 text-xs text-muted-foreground">
                                                          <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                                          <span>
                                                            {member.mobile ||
                                                              "-"}
                                                          </span>
                                                        </p>
                                                      </div>
                                                    </div>
                                                  ),
                                                )}
                                            </div>
                                          </div>

                                          {/* Idea Description */}
                                          {u.idea_desc && (
                                            <div>
                                              <h4 className="flex items-center gap-2 mb-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                                <FileText className="w-4 h-4" />
                                                Idea Description
                                              </h4>
                                              <div className="p-3 text-sm border rounded-lg bg-card border-border text-foreground">
                                                {u.idea_desc}
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    </td>
                                  </tr>
                                )}
                              </AnimatePresence>
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary footer */}
              {filteredUsers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {adminUsers.length} team
                  {adminUsers.length !== 1 ? "s" : ""} · {totalParticipants}{" "}
                  total participant
                  {totalParticipants !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              )}
            </motion.div>
          )}

          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ PARTICIPANT: Overview              ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {!isAdmin && activeTab === "overview" && user && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                  Hello, <span className="text-primary">{user.name}</span>
                </h1>
                <p className="body-text">
                  Welcome to your dashboard. Track your progress and manage your
                  team.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-6 border bg-card border-border rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    {(user.team_count || 0) + 1}
                  </h3>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
                <div className="p-6 border bg-card border-border rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10">
                    <Buildings className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold truncate font-display text-foreground">
                    {user.institute || "N/A"}
                  </h3>
                  <p className="text-sm text-muted-foreground">Institute</p>
                </div>
                <div className="p-6 border bg-card border-border rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-foreground">
                    Active
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Registration Status
                  </p>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 border bg-card border-border rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-lg font-bold font-display text-foreground">
                  <CalendarBlank
                    className="w-5 h-5 text-primary"
                    weight="duotone"
                  />
                  Event Timeline
                </h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          event.status === "completed"
                            ? "bg-primary/20"
                            : "bg-card border border-border"
                        }`}
                      >
                        {event.status === "completed" ? (
                          <CheckCircle
                            className="w-4 h-4 text-primary"
                            weight="duotone"
                          />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">
                          {event.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {event.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idea description */}
              <div className="p-6 border bg-card border-border rounded-2xl">
                <h3 className="flex items-center gap-2 mb-4 text-lg font-bold font-display text-foreground">
                  <FileText className="w-5 h-5 text-primary" />
                  Idea Overview
                </h3>
                <div className="p-4 rounded-xl bg-muted/20">
                  {user.idea_desc ? (
                    <p className="body-text">{user.idea_desc}</p>
                  ) : (
                    <p className="italic text-muted-foreground">
                      No idea description submitted yet.
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ PARTICIPANT: Team                  ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {!isAdmin && activeTab === "team" && user && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                  Team{" "}
                  <span className="text-primary">
                    {user.teamName || "Overview"}
                  </span>
                </h1>
                <p className="body-text">
                  Manage your team and collaborate effectively.
                </p>
              </div>

              <div className="grid gap-4">
                {/* Leader card */}
                <div className="flex items-center gap-4 p-6 border bg-card border-border rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20">
                    <span className="text-lg font-medium text-primary">
                      {getInitials(user.name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-foreground">
                      {user.name} (You)
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <span className="px-3 py-1 text-sm border rounded-lg bg-card border-border text-primary">
                    Leader
                  </span>
                </div>

                {/* Team members */}
                {user.team_members && user.team_members.length > 0 ? (
                  user.team_members.map((member: TeamMember, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-6 border bg-card border-border rounded-2xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        <UserIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {member.email}
                        </p>
                      </div>
                      <span className="px-3 py-1 text-sm border rounded-lg bg-card border-border text-muted-foreground">
                        Member
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center border border-dashed rounded-2xl border-border text-muted-foreground">
                    No other team members found.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
