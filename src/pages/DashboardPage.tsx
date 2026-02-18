import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  FileText,
  Medal,
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
} from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';
import { clearAuth, isAdmin as checkIsAdmin, type User } from '../lib/jwt';
import api from '../lib/api';
import * as XLSX from 'xlsx';

// Static event timeline
const timelineEvents = [
  { date: 'Feb 22', title: 'Registration Deadline', status: 'completed' },
  { date: 'Feb 24', title: 'Kickoff Event', status: 'upcoming' },
  { date: 'Feb 25', title: 'Build Day', status: 'upcoming' },
  { date: 'Feb 26', title: 'Demo Day', status: 'upcoming' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Admin state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);

  // ═══════════════════════════════════════
  //  Load user data on mount
  // ═══════════════════════════════════════
  useEffect(() => {
    // Check if admin session (JWT role claim or legacy flag)
    if (checkIsAdmin()) {
      setIsAdmin(true);
      try {
        const usersData = sessionStorage.getItem('admin_users');
        if (usersData) setAdminUsers(JSON.parse(usersData));
      } catch (e) {
        console.error('Failed to parse admin users', e);
      }
      setIsLoading(false);
      return;
    }

    // Regular user — fetch from /dashboard API
    const token = localStorage.getItem('auth_token');
    if (!token) {
      navigate('/login');
      return;
    }

    api.get('/dashboard')
      .then(res => {
        if (res.data?.user) {
          setUser(res.data.user);
        } else {
          navigate('/login');
        }
      })
      .catch(() => {
        clearAuth();
        navigate('/login');
      })
      .finally(() => setIsLoading(false));
  }, [navigate]);

  // ═══════════════════════════════════════
  //  Handlers
  // ═══════════════════════════════════════
  const handleLogout = () => {
    clearAuth(); // Clears both localStorage and sessionStorage
    navigate('/login');
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';
  };

  // ═══════════════════════════════════════
  //  Excel Export
  // ═══════════════════════════════════════
  const handleExportExcel = () => {
    const exportData = filteredUsers.map((u: any, index: number) => ({
      'S.No': index + 1,
      'Name': u.username || u.name || '',
      'Email': u.email || '',
      'Mobile': u.mobile || '',
      'Institute': u.institute || '',
      'Team Name': u.teamName || 'Individual',
      'Team Count': u.team_count || 1,
      'Team Members': u.team_members
        ? (Array.isArray(u.team_members)
          ? u.team_members.map((m: any) => `${m.name} (${m.email})`).join(', ')
          : u.team_members)
        : '',
      'Topic / Idea': u.topic || u.idea_desc || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Participants');

    // Auto-fit column widths
    if (exportData.length > 0) {
      const colWidths = Object.keys(exportData[0]).map(key => ({
        wch: Math.max(
          key.length,
          ...exportData.map(row => String((row as any)[key] || '').length)
        ) + 2
      }));
      worksheet['!cols'] = colWidths;
    }

    XLSX.writeFile(workbook, `InnovatUp_Participants_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // ═══════════════════════════════════════
  //  Filtered users for admin search
  // ═══════════════════════════════════════
  const filteredUsers = adminUsers.filter((u: any) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (u.username || u.name || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.teamName || '').toLowerCase().includes(q) ||
      (u.institute || '').toLowerCase().includes(q) ||
      (u.mobile || '').includes(q) ||
      (u.topic || '').toLowerCase().includes(q)
    );
  });

  // ═══════════════════════════════════════
  //  Loading state
  // ═══════════════════════════════════════
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <CircleNotch className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  const displayName = isAdmin ? 'Admin' : (user?.name || 'User');

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ═══════════════════════════════════════ */}
      {/* Header                                  */}
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
                    {isAdmin ? 'Administrator' : 'Participant'}
                  </span>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                  <span className="text-xs font-bold text-primary">{getInitials(displayName)}</span>
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
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview'
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                >
                  <Table className="w-5 h-5" />
                  <span>All Participants</span>
                </button>
              ) : (
                <>
                  {[
                    { id: 'overview', label: 'Overview', icon: FileText },
                    { id: 'team', label: 'Team', icon: Users },
                    { id: 'certificates', label: 'Certificates', icon: Medal },
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
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
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                    Admin <span className="text-primary">Dashboard</span>
                  </h1>
                  <p className="body-text">
                    {adminUsers.length} registered participant{adminUsers.length !== 1 ? 's' : ''}.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="relative">
                    <MagnifyingGlass className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="py-2.5 pl-9 pr-4 text-sm border bg-card border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary w-56"
                    />
                  </div>

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

              {/* Data Table */}
              <div className="overflow-hidden border bg-card border-border rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-6 py-4 font-medium">#</th>
                        <th className="px-6 py-4 font-medium">Name</th>
                        <th className="px-6 py-4 font-medium">Email</th>
                        <th className="px-6 py-4 font-medium">Mobile</th>
                        <th className="px-6 py-4 font-medium">Institute</th>
                        <th className="px-6 py-4 font-medium">Team</th>
                        <th className="px-6 py-4 font-medium">Topic</th>
                        <th className="px-6 py-4 font-medium">Members</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                            {searchQuery ? 'No matching participants found.' : 'No participants registered yet.'}
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((u: any, index: number) => (
                          <tr key={u._id || index} className="transition-colors hover:bg-muted/20">
                            <td className="px-6 py-4 text-muted-foreground">{index + 1}</td>
                            <td className="px-6 py-4 font-medium text-foreground">{u.username || u.name || '-'}</td>
                            <td className="px-6 py-4 text-muted-foreground">{u.email || '-'}</td>
                            <td className="px-6 py-4 text-muted-foreground">{u.mobile || '-'}</td>
                            <td className="px-6 py-4 text-muted-foreground">{u.institute || '-'}</td>
                            <td className="px-6 py-4 text-primary">{u.teamName || 'Individual'}</td>
                            <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">{u.topic || u.idea_desc || '-'}</td>
                            <td className="px-6 py-4 text-muted-foreground">{u.team_count || 1}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary footer */}
              {filteredUsers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  Showing {filteredUsers.length} of {adminUsers.length} participant{adminUsers.length !== 1 ? 's' : ''}
                  {searchQuery && ` matching "${searchQuery}"`}
                </p>
              )}
            </motion.div>
          )}

          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ PARTICIPANT: Overview              ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {!isAdmin && activeTab === 'overview' && user && (
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
                  Welcome to your dashboard. Track your progress and manage your team.
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
                    {user.institute || 'N/A'}
                  </h3>
                  <p className="text-sm text-muted-foreground">Institute</p>
                </div>
                <div className="p-6 border bg-card border-border rounded-2xl">
                  <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-primary/10">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold font-display text-foreground">Active</h3>
                  <p className="text-sm text-muted-foreground">Registration Status</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="p-6 border bg-card border-border rounded-2xl">
                <h3 className="flex items-center gap-2 mb-6 text-lg font-bold font-display text-foreground">
                  <CalendarBlank className="w-5 h-5 text-primary" weight="duotone" />
                  Event Timeline
                </h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${event.status === 'completed'
                        ? 'bg-primary/20'
                        : 'bg-card border border-border'
                        }`}>
                        {event.status === 'completed' ? (
                          <CheckCircle className="w-4 h-4 text-primary" weight="duotone" />
                        ) : (
                          <Clock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
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
                    <p className="italic text-muted-foreground">No idea description submitted yet.</p>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ PARTICIPANT: Team                  ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {!isAdmin && activeTab === 'team' && user && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                  Team <span className="text-primary">{user.teamName || 'Overview'}</span>
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
                    <h3 className="font-medium text-foreground">{user.name} (You)</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <span className="px-3 py-1 text-sm border rounded-lg bg-card border-border text-primary">
                    Leader
                  </span>
                </div>

                {/* Team members */}
                {user.team_members && user.team_members.length > 0 ? (
                  user.team_members.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-6 border bg-card border-border rounded-2xl"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                        <UserIcon className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-foreground">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">{member.email}</p>
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

          {/* ╔═══════════════════════════════════╗ */}
          {/* ║ PARTICIPANT: Certificates           ║ */}
          {/* ╚═══════════════════════════════════╝ */}
          {!isAdmin && activeTab === 'certificates' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="mb-2 text-3xl font-bold font-display text-foreground">
                  <span className="text-primary">Certificates</span>
                </h1>
                <p className="body-text">
                  Download your certificates after the event concludes.
                </p>
              </div>

              <div className="p-10 text-center border bg-card border-border rounded-2xl">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 border rounded-full bg-card border-border">
                  <Medal className="w-10 h-10 text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="mb-2 text-xl font-bold font-display text-foreground">
                  Certificates Not Available Yet
                </h3>
                <p className="max-w-md mx-auto body-text">
                  Certificates will be available for download after the event concludes
                  and results are announced. Stay tuned!
                </p>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
