import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Lightbulb, 
  FileText, 
  Award, 
  LogOut, 
  Bell, 
  Calendar,
  CheckCircle2,
  Clock,
  Trophy
} from 'lucide-react';

const teamMembers = [
  { name: 'Alex Johnson', email: 'alex@college.edu', role: 'Team Leader' },
  { name: 'Sarah Chen', email: 'sarah@college.edu', role: 'Member' },
  { name: 'Mike Ross', email: 'mike@college.edu', role: 'Member' },
];

const timelineEvents = [
  { date: 'Mar 15', title: 'Registration Deadline', status: 'completed' },
  { date: 'Mar 20', title: 'Kickoff Event', status: 'upcoming' },
  { date: 'Mar 21', title: 'Build Day 1', status: 'upcoming' },
  { date: 'Mar 22', title: 'Demo Day', status: 'upcoming' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-neon-dark">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="font-display font-bold text-xl lg:text-2xl text-neon-white tracking-tight">
                Innovat<span className="text-neon-green">Up</span>
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-neon-gray hover:text-neon-white transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-neon-green rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center">
                <span className="text-sm font-medium text-neon-green">AJ</span>
              </div>
              <Link to="/" className="p-2 text-neon-gray hover:text-neon-white transition-colors">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="lg:w-64 lg:min-h-[calc(100vh-80px)] lg:border-r border-border">
          <nav className="p-4 lg:p-6">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'overview'
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'text-neon-gray hover:text-neon-white hover:bg-secondary'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">Overview</span>
              </button>
              <button
                onClick={() => setActiveTab('team')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'team'
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'text-neon-gray hover:text-neon-white hover:bg-secondary'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="font-medium">Team</span>
              </button>
              <button
                onClick={() => setActiveTab('certificates')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === 'certificates'
                    ? 'bg-neon-green/10 text-neon-green'
                    : 'text-neon-gray hover:text-neon-white hover:bg-secondary'
                }`}
              >
                <Award className="w-5 h-5" />
                <span className="font-medium">Certificates</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10">
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Welcome */}
              <div>
                <h1 className="headline-md font-display text-neon-white mb-2">
                  Team <span className="text-neon-green">CodeCrafters</span>
                </h1>
                <p className="body-text">
                  Welcome to your dashboard. Track your progress and manage your team.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-neon-white">3</h3>
                  <p className="text-sm text-neon-gray">Team Members</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-neon-white">AI for Healthcare</h3>
                  <p className="text-sm text-neon-gray">Project Topic</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-neon-green/10 flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-neon-green" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-neon-white">Pending</h3>
                  <p className="text-sm text-neon-gray">Result Status</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-neon-white mb-6 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-neon-green" />
                  Event Timeline
                </h3>
                <div className="space-y-4">
                  {timelineEvents.map((event, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        event.status === 'completed'
                          ? 'bg-neon-green/20'
                          : 'bg-secondary'
                      }`}>
                        {event.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-neon-green" />
                        ) : (
                          <Clock className="w-4 h-4 text-neon-gray" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-neon-white font-medium">{event.title}</p>
                        <p className="text-sm text-neon-gray">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idea description */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-neon-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-neon-green" />
                  Idea Overview
                </h3>
                <p className="body-text">
                  We're building an AI-powered diagnostic tool that helps healthcare providers 
                  detect early signs of diseases through medical imaging. Our solution uses 
                  deep learning to analyze X-rays and MRIs, providing accurate predictions 
                  in real-time.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h1 className="headline-md font-display text-neon-white mb-2">
                  Team <span className="text-neon-green">Members</span>
                </h1>
                <p className="body-text">
                  Manage your team and collaborate effectively.
                </p>
              </div>

              <div className="grid gap-4">
                {teamMembers.map((member, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-2xl p-6 flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-neon-green/20 flex items-center justify-center">
                      <span className="text-lg font-medium text-neon-green">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-neon-white font-medium">{member.name}</h3>
                      <p className="text-sm text-neon-gray">{member.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-secondary text-sm text-neon-gray">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div>
                <h1 className="headline-md font-display text-neon-white mb-2">
                  <span className="text-neon-green">Certificates</span>
                </h1>
                <p className="body-text">
                  Download your certificates after the event concludes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <Award className="w-10 h-10 text-neon-gray" />
                </div>
                <h3 className="text-xl font-display font-bold text-neon-white mb-2">
                  Certificates Not Available Yet
                </h3>
                <p className="body-text max-w-md mx-auto">
                  Certificates will be available for download after the event concludes 
                  and results are announced. Stay tuned!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
