
import React, { useState, useEffect, useMemo } from 'react';
import { 
  IssueStatus, IssueCategory, CivicIssue, User, AIAnalysisResult 
} from './types';
import { IssueCard } from './components/IssueCard';
import { ReportModal } from './components/ReportModal';
import { StatsChart } from './components/StatsChart';

// Initial Mock Data
const INITIAL_ISSUES: CivicIssue[] = [
  {
    id: '1',
    category: IssueCategory.POTHOLE,
    description: 'Deep pothole causing tire damage on Main St.',
    location: { lat: 40.7128, lng: -74.006, address: '123 Main St, Springfield' },
    imageUrl: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&q=80&w=800',
    status: IssueStatus.IN_PROGRESS,
    priorityScore: 88,
    aiConfidence: 96,
    reporterId: 'user1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: '2',
    category: IssueCategory.WASTE_MGMT,
    description: 'Overflowing garbage bin near Central Park entrance.',
    location: { lat: 40.7829, lng: -73.9654, address: '5th Ave & 72nd St' },
    imageUrl: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=800',
    status: IssueStatus.REPORTED,
    priorityScore: 45,
    aiConfidence: 92,
    reporterId: 'user2',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
  },
  {
    id: '3',
    category: IssueCategory.WATER_LEAK,
    description: 'Fire hydrant leaking significant water for 2 hours.',
    location: { lat: 40.7580, lng: -73.9855, address: 'Times Square Plaza' },
    imageUrl: 'https://images.unsplash.com/photo-1594411133594-28c3760f11d1?auto=format&fit=crop&q=80&w=800',
    status: IssueStatus.ASSIGNED,
    priorityScore: 92,
    aiConfidence: 98,
    reporterId: 'user1',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  }
];

const CURRENT_USER: User = {
  id: 'user1',
  name: 'Alex Johnson',
  role: 'CITIZEN',
  points: 450,
  avatar: 'https://i.pravatar.cc/150?u=alex'
};

const App: React.FC = () => {
  const [view, setView] = useState<'CITIZEN' | 'AUTHORITY'>('CITIZEN');
  const [issues, setIssues] = useState<CivicIssue[]>(INITIAL_ISSUES);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<CivicIssue | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<IssueCategory | 'ALL'>('ALL');
  const [chatMessage, setChatMessage] = useState('');

  const handleReportSubmit = (data: {
    image: string;
    description: string;
    location: any;
    aiResult: AIAnalysisResult;
  }) => {
    const newIssue: CivicIssue = {
      id: Math.random().toString(36).substr(2, 9),
      category: data.aiResult.category,
      description: data.description,
      location: data.location,
      imageUrl: data.image,
      status: data.aiResult.verificationStatus ? IssueStatus.REPORTED : IssueStatus.VERIFYING,
      priorityScore: Math.round(data.aiResult.severity * 10),
      aiConfidence: data.aiResult.confidence,
      reporterId: CURRENT_USER.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setIssues([newIssue, ...issues]);
    setIsReportModalOpen(false);
  };

  const updateIssueStatus = (id: string, newStatus: IssueStatus) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, status: newStatus, updatedAt: new Date().toISOString() } : issue
    ));
  };

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = issue.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'ALL' || issue.category === filterCategory;
      const isVisible = view === 'CITIZEN' ? issue.reporterId === CURRENT_USER.id : true;
      return matchesSearch && matchesCategory && isVisible;
    });
  }, [issues, searchQuery, filterCategory, view]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 rotate-3">
              <i className="fas fa-city text-white text-lg"></i>
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tighter">CivicConnect<span className="text-blue-600">.</span>ai</span>
          </div>

          <div className="hidden md:flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setView('CITIZEN')}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'CITIZEN' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Citizens
            </button>
            <button 
              onClick={() => setView('AUTHORITY')}
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${view === 'AUTHORITY' ? 'bg-white shadow-md text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Authorities
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
               <i className="fas fa-star text-blue-600 text-xs"></i>
               <span className="text-sm font-black text-blue-700">{CURRENT_USER.points}</span>
            </div>
            <img src={CURRENT_USER.avatar} alt="Avatar" className="w-10 h-10 rounded-2xl border-2 border-white shadow-md cursor-pointer hover:scale-105 transition-transform" />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-[0.2em] mb-2">
               <span className="w-6 h-[2px] bg-blue-600"></span>
               {view === 'CITIZEN' ? 'Community Action' : 'Smart City Intelligence'}
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">
              {view === 'CITIZEN' ? 'Impact Your City' : 'Response Dashboard'}
            </h1>
          </div>
          {view === 'CITIZEN' && (
            <button 
              onClick={() => setIsReportModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-2xl shadow-blue-200 flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95"
            >
              <i className="fas fa-plus"></i> New Report
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Active</div>
            <div className="text-3xl font-black text-slate-900">
              {issues.filter(i => i.status !== IssueStatus.RESOLVED).length}
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Resolved</div>
            <div className="text-3xl font-black text-emerald-500">
              {issues.filter(i => i.status === IssueStatus.RESOLVED).length + 142}
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Accuracy</div>
            <div className="text-3xl font-black text-blue-500">98.4%</div>
          </div>
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Triage</div>
            <div className="text-3xl font-black text-purple-500">1.2m</div>
          </div>
        </div>

        {view === 'AUTHORITY' && <StatsChart />}

        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button 
                onClick={() => setFilterCategory('ALL')}
                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filterCategory === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
              >
                All
              </button>
              {Object.values(IssueCategory).map(cat => (
                <button 
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${filterCategory === cat ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                >
                  {cat.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredIssues.map(issue => (
              <IssueCard 
                key={issue.id} 
                issue={issue} 
                isAdmin={view === 'AUTHORITY'}
                onUpdateStatus={updateIssueStatus}
                onViewDetails={(i) => setSelectedIssue(i)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Issue Detail / Chat Drawer */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedIssue(null)}></div>
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
             <div className="p-6 border-b flex justify-between items-center">
                <h2 className="font-black text-slate-800 uppercase tracking-widest">Issue Tracking</h2>
                <button onClick={() => setSelectedIssue(null)} className="p-2 hover:bg-slate-100 rounded-full">
                  <i className="fas fa-times text-slate-400"></i>
                </button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <img src={selectedIssue.imageUrl} className="w-full h-48 object-cover rounded-3xl shadow-lg" alt="Issue" />
                <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-1">Description</span>
                   <p className="font-bold text-slate-800 text-lg leading-tight">{selectedIssue.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">Priority Score</span>
                      <span className="text-xl font-black text-blue-600">{selectedIssue.priorityScore}</span>
                   </div>
                   <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <span className="text-[10px] font-black text-slate-400 uppercase mb-1 block">AI Confidence</span>
                      <span className="text-xl font-black text-slate-700">{selectedIssue.aiConfidence}%</span>
                   </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <h3 className="font-black text-slate-800 uppercase text-xs tracking-widest mb-4">Direct Communication</h3>
                   <div className="space-y-4 mb-6">
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">NY</div>
                         <div className="bg-blue-50 p-4 rounded-2xl rounded-tl-none text-sm text-blue-800 font-medium">
                            Hello! A team has been dispatched to this location. Expected arrival in 45 minutes.
                         </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                         <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px] font-black">ME</div>
                         <div className="bg-slate-100 p-4 rounded-2xl rounded-tr-none text-sm text-slate-700 font-medium">
                            Thank you for the quick update!
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="p-6 border-t bg-slate-50">
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    placeholder="Message authority..." 
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                   />
                   <button className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                      <i className="fas fa-paper-plane"></i>
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {isReportModalOpen && (
        <ReportModal 
          onClose={() => setIsReportModalOpen(false)} 
          onSubmit={handleReportSubmit} 
        />
      )}
    </div>
  );
};

export default App;
