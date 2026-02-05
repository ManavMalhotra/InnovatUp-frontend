import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Users,
  Lightbulb,
  FileText,
  Medal,
  SignOut,
  Bell,
  CalendarBlank,
  CheckCircle,
  Clock,
  Trophy
} from '@phosphor-icons/react';
import AnimatedLogo from '../components/AnimatedLogo';

const teamMembers = [
  { name: 'Alex Johnson', email: 'alex@college.edu', role: 'Team Leader' },
  { name: 'Sarah Chen', email: 'sarah@college.edu', role: 'Member' },
  { name: 'Mike Ross', email: 'mike@college.edu', role: 'Member' },
];

const timelineEvents = [
  { date: 'Feb 22', title: 'Registration Deadline', status: 'completed' },
  { date: 'Feb 24', title: 'Kickoff Event', status: 'upcoming' },
  { date: 'Feb 25', title: 'Build Day', status: 'upcoming' },
  { date: 'Feb 26', title: 'Demo Day', status: 'upcoming' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/50 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="w-full px-6 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <AnimatedLogo size={32} animate={false} />
              <span className="font-display font-bold text-xl lg:text-2xl text-foreground tracking-tight">
                Innovat<span className="text-primary">Up</span>
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-medium text-primary">AJ</span>
              </div>
              <Link to="/" className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                <SignOut className="w-5 h-5" weight="duotone" />
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
              {[
                { id: 'overview', label: 'Overview', icon: FileText },
                { id: 'team', label: 'Team', icon: Users },
                { id: 'certificates', label: 'Certificates', icon: Medal },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 lg:p-10">
          {activeTab === 'overview' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Welcome */}
              <div>
                <h1 className="headline-md font-display text-foreground mb-2">
                  Team <span className="text-primary">CodeCrafters</span>
                </h1>
                <p className="body-text">
                  Welcome to your dashboard. Track your progress and manage your team.
                </p>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">3</h3>
                  <p className="text-sm text-muted-foreground">Team Members</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">AI for Healthcare</h3>
                  <p className="text-sm text-muted-foreground">Project Topic</p>
                </div>
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-foreground">Pending</h3>
                  <p className="text-sm text-muted-foreground">Result Status</p>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-6 flex items-center gap-2">
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
                        <p className="text-foreground font-medium">{event.title}</p>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Idea description */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Idea Overview
                </h3>
                <p className="body-text">
                  We're building an AI-powered diagnostic tool that helps healthcare providers
                  detect early signs of diseases through medical imaging. Our solution uses
                  deep learning to analyze X-rays and MRIs, providing accurate predictions
                  in real-time.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="headline-md font-display text-foreground mb-2">
                  Team <span className="text-primary">Members</span>
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
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <span className="text-lg font-medium text-primary">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-foreground font-medium">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-card border border-border text-sm text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'certificates' && (
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div>
                <h1 className="headline-md font-display text-foreground mb-2">
                  <span className="text-primary">Certificates</span>
                </h1>
                <p className="body-text">
                  Download your certificates after the event concludes.
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-6">
                  <Medal className="w-10 h-10 text-muted-foreground" weight="duotone" />
                </div>
                <h3 className="text-xl font-display font-bold text-foreground mb-2">
                  Certificates Not Available Yet
                </h3>
                <p className="body-text max-w-md mx-auto">
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
