/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Scale, 
  Terminal, 
  Briefcase, 
  Info, 
  Search, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Cpu,
  Globe,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { EARNING_PATHS, EarningPath } from './constants';
import { GoogleGenAI } from '@google/genai';

// Initialize Gemini for the advisor
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function App() {
  const [selectedPathId, setSelectedPathId] = useState<string>(EARNING_PATHS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [advisorInput, setAdvisorInput] = useState('');
  const [advisorResponse, setAdvisorResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const filteredPaths = useMemo(() => {
    return EARNING_PATHS.filter(path => 
      path.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      path.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const selectedPath = useMemo(() => 
    EARNING_PATHS.find(p => p.id === selectedPathId) || EARNING_PATHS[0]
  , [selectedPathId]);

  const handleAdvisorAsk = async () => {
    if (!advisorInput.trim()) return;
    setIsAnalyzing(true);
    setAdvisorResponse(null);
    try {
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are an AI Income Ethics Advisor. Answer the following question about ethical or compliant AI earning methods. Be professional, concise, and highlight regulatory considerations. 
        Question: ${advisorInput}`,
        config: {
          systemInstruction: "You are a professional financial ethics advisor specializing in AI. Focus on compliance, transparency, and regulation."
        }
      });
      setAdvisorResponse(response.text);
    } catch (error) {
      setAdvisorResponse("Error connecting to ethics advisor. Please try again later.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-ink font-sans selection:bg-brand-accent selection:text-white">
      {/* Search Header */}
      <header className="sticky top-0 z-30 bg-white border-b-2 border-brand-ink">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-sm tracking-[0.2em] uppercase">Ethic.al Systems</span>
            <div className="bg-brand-ink text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest leading-none">
              v1.0.24
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-12 relative hidden md:block">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-brand-muted" size={16} />
            <input 
              type="text" 
              placeholder="FILTER_PATHWAYS"
              className="w-full bg-transparent border-none py-2 pl-6 pr-4 focus:ring-0 outline-none text-xs font-bold uppercase tracking-widest placeholder:text-brand-line"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="path-search"
            />
          </div>

          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsAdvisorOpen(true)}
              className="flex items-center gap-2 group"
              id="advisor-trigger"
            >
              <span className="text-[10px] font-bold uppercase tracking-widest border-b border-brand-ink pb-0.5 group-hover:text-brand-accent group-hover:border-brand-accent transition-colors">
                Open Advisor
              </span>
              <MessageSquare size={14} className="text-brand-accent" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Sidebar */}
        <section className="lg:col-span-3 space-y-12">
          <div>
            <h2 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-6 border-b border-brand-line pb-2">Index_Categories</h2>
            <div className="flex flex-col border-l border-brand-line">
              {filteredPaths.map((path) => (
                <button
                  key={path.id}
                  onClick={() => setSelectedPathId(path.id)}
                  className={`w-full text-left py-4 px-6 transition-all relative ${
                    selectedPathId === path.id 
                    ? 'text-brand-accent' 
                    : 'text-brand-muted hover:text-brand-ink'
                  }`}
                  id={`path-btn-${path.id}`}
                >
                  {selectedPathId === path.id && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-brand-accent"
                    />
                  )}
                  <span className="text-xs font-bold uppercase tracking-widest block mb-1">
                    {path.id === selectedPathId ? '*' : ''} {path.title.split(' ')[0]}
                  </span>
                  <span className="block text-[10px] opacity-60">0{filteredPaths.indexOf(path) + 1}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-2 border-brand-ink p-6 bg-brand-ink text-white">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="text-brand-accent" size={24} />
              <h3 className="font-extrabold text-xs uppercase tracking-widest">Compliance_Verified</h3>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
              AER-42 Regulatory sync active. Standards aligned with ISO/IEC JTC 1/SC 42.
            </p>
          </div>
        </section>

        {/* Content Area */}
        <section className="lg:col-span-9 space-y-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPath.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="border-t-[3px] border-brand-ink pt-8 mb-12">
                <div className="flex flex-wrap items-end justify-between gap-8 mb-4">
                  <div className="flex gap-4">
                    {selectedPath.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold uppercase tracking-widest text-brand-muted">
                        // {tag}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] font-mono font-bold tracking-widest uppercase">
                    Ref: {selectedPath.id.slice(0, 8)}
                  </div>
                </div>
                
                <h1 className="text-7xl md:text-8xl lg:text-[112px] font-extrabold uppercase leading-[0.85] tracking-tighter mb-12">
                  {selectedPath.title.split(' ')[0]}
                  <br />
                  <span className="text-brand-accent">{selectedPath.title.split(' ').slice(1).join(' ')}</span>
                </h1>
              </div>

              <div className="max-w-3xl mb-16">
                <p className="text-xl md:text-2xl font-bold text-brand-ink leading-tight tracking-tight uppercase">
                  {selectedPath.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-brand-line border-y-2 border-brand-ink">
                <div className="p-8 bg-white border-r border-brand-line">
                  <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <Scale size={14} className="text-brand-ink" /> Framework_Notes
                  </h3>
                  <p className="text-sm font-bold uppercase leading-relaxed text-brand-ink">
                    {selectedPath.regulationNote}
                  </p>
                </div>

                <div className="p-8 bg-white">
                  <h3 className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-brand-accent" /> Ethic_Focus_Core
                  </h3>
                  <p className="text-sm font-bold uppercase leading-relaxed text-brand-accent">
                    {selectedPath.ethicalFocus}
                  </p>
                </div>
              </div>

              <div className="mt-16 flex flex-wrap items-center justify-between gap-12">
                <div className="flex items-center gap-8">
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Impact_Rank</span>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`w-4 h-1 px-3 ${s <= (selectedPath.complianceRating) ? 'bg-brand-ink' : 'bg-brand-line'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold text-brand-muted uppercase tracking-widest mb-1">Risk_LVL</span>
                    <span className="text-sm font-extrabold font-mono text-brand-ink tracking-widest uppercase">
                      {selectedPath.difficulty}
                    </span>
                  </div>
                </div>

                <button className="bg-brand-ink text-white px-8 py-4 font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-accent transition-all flex items-center gap-3">
                  <BookOpen size={16} />
                  Documentation_Full
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      {/* Advisor Panel */}
      <AnimatePresence>
        {isAdvisorOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdvisorOpen(false)}
              className="fixed inset-0 bg-brand-ink/20 backdrop-blur-md z-40"
            />
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 h-[80vh] bg-white border-t-4 border-brand-ink z-50 flex flex-col"
            >
              <div className="p-8 border-b-2 border-brand-line flex items-center justify-between bg-brand-bg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-ink flex items-center justify-center text-white">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-2xl uppercase tracking-tighter leading-none">Context_Advisor</h3>
                    <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em]">Compliance_Engine_v1</span>
                  </div>
                </div>
                <button onClick={() => setIsAdvisorOpen(false)} className="bg-brand-ink text-white p-3 font-bold hover:bg-brand-accent transition-colors uppercase text-[10px] tracking-widest">
                  Close_Esc
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-12 max-w-5xl mx-auto w-full space-y-12">
                <div className="border-l-4 border-brand-accent pl-8">
                  <p className="text-xl font-bold uppercase leading-tight text-brand-ink">
                    SYSTEM_INIT: Awaiting regulatory queries regarding autonomous income architecture.
                  </p>
                </div>

                {advisorResponse && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t-2 border-brand-ink pt-8"
                  >
                    <div className="flex items-center gap-2 mb-6 text-[10px] font-bold text-brand-accent uppercase tracking-widest">
                      <Terminal size={14} /> Analysis_Output
                    </div>
                    <div className="text-brand-ink text-lg font-bold uppercase leading-relaxed whitespace-pre-wrap">
                      {advisorResponse}
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="p-8 bg-brand-ink">
                <div className="max-w-5xl mx-auto relative">
                  <textarea 
                    placeholder="ENTER_QUERY_FOR_COMPLIANCE_REVIEW..."
                    className="w-full bg-white border-none p-6 focus:ring-4 focus:ring-brand-accent outline-none transition-all text-sm font-bold uppercase tracking-widest placeholder:text-brand-line"
                    rows={2}
                    value={advisorInput}
                    onChange={(e) => setAdvisorInput(e.target.value)}
                  />
                  <button 
                    onClick={handleAdvisorAsk}
                    disabled={isAnalyzing || !advisorInput.trim()}
                    className="absolute bottom-4 right-4 bg-brand-ink text-white px-6 py-2 font-bold text-[10px] uppercase tracking-widest hover:bg-brand-accent disabled:opacity-50 transition-all border border-white/20"
                  >
                    {isAnalyzing ? "Processing..." : "Submit_Query"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="max-w-[1400px] mx-auto px-6 py-20 border-t-2 border-brand-ink mt-20 flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 font-extrabold text-lg uppercase tracking-tighter">
            <Cpu size={24} className="text-brand-accent" />
            <span>Ethic.al Systems</span>
          </div>
          <p className="text-[10px] font-bold text-brand-muted uppercase tracking-widest max-w-[200px] leading-relaxed">
            Independent regulatory auditor for decentralized autonomous workflows.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Protocol</span>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">Privacy</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">Audit</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">Auth</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Legal</span>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">GDPR</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">AER</a>
            <a href="#" className="text-xs font-bold uppercase tracking-widest hover:text-brand-accent transition-colors">NIST</a>
          </div>
          <div className="flex flex-col col-span-2">
            <span className="text-[10px] font-bold text-brand-muted uppercase tracking-[0.2em] mb-2">Network_Stats</span>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-lg font-extrabold font-mono leading-none">1.2M</span>
                <span className="text-[8px] uppercase font-bold text-brand-muted">Active_Users</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold font-mono leading-none">99.8%</span>
                <span className="text-[8px] uppercase font-bold text-brand-muted">Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
