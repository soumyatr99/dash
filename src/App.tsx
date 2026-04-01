import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Table as TableIcon, 
  Target, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Share2, 
  Download,
  Pause,
  Play,
  Search,
  Filter,
  Sparkles,
  Zap,
  BrainCircuit,
  MessageSquare,
  Send,
  X,
  Bot,
  User,
  Loader2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import Markdown from 'react-markdown';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatNumber = (num: number) => num.toLocaleString('en-IN');
const formatPercent = (num: number) => `${num.toFixed(1)}%`;

// --- Data ---
const DIST_DATA = [
  { d: "Ganjam", alc: 12, mt: 1500, yt: 18000, conf: 726, upl: 1050 },
  { d: "Khurda", alc: 10, mt: 1400, yt: 16800, conf: 650, upl: 980 },
  { d: "Cuttack", alc: 8, mt: 1200, yt: 14400, conf: 580, upl: 850 },
  { d: "Keonjhar", alc: 7, mt: 1000, yt: 12000, conf: 484, upl: 720 },
  { d: "Balasore", alc: 6, mt: 950, yt: 11400, conf: 420, upl: 650 },
  { d: "Bhadrak", alc: 5, mt: 800, yt: 9600, conf: 380, upl: 580 },
  { d: "Jajpur", alc: 6, mt: 900, yt: 10800, conf: 410, upl: 620 },
  { d: "Puri", alc: 5, mt: 850, yt: 10200, conf: 390, upl: 600 },
  { d: "Mayurbhanj", alc: 8, mt: 1100, yt: 13200, conf: 450, upl: 700 },
  { d: "Sundargarh", alc: 7, mt: 1050, yt: 12600, conf: 430, upl: 680 },
  { d: "Angul", alc: 5, mt: 800, yt: 9600, conf: 320, upl: 500 },
  { d: "Dhenkanal", alc: 4, mt: 750, yt: 9000, conf: 290, upl: 450 },
  { d: "Sambalpur", alc: 5, mt: 850, yt: 10200, conf: 340, upl: 520 },
  { d: "Bargarh", alc: 5, mt: 800, yt: 9600, conf: 310, upl: 480 },
  { d: "Bolangir", alc: 4, mt: 700, yt: 8400, conf: 260, upl: 400 },
  { d: "Kalahandi", alc: 4, mt: 750, yt: 9000, conf: 280, upl: 430 },
  { d: "Koraput", alc: 3, mt: 600, yt: 7200, conf: 210, upl: 350 },
  { d: "Rayagada", alc: 3, mt: 550, yt: 6600, conf: 190, upl: 320 },
  { d: "Nabarangpur", alc: 2, mt: 450, yt: 5400, conf: 150, upl: 280 },
  { d: "Malkangiri", alc: 2, mt: 400, yt: 4800, conf: 120, upl: 250 },
  { d: "Kandhamal", alc: 2, mt: 400, yt: 4800, conf: 130, upl: 260 },
  { d: "Boudh", alc: 2, mt: 350, yt: 4200, conf: 110, upl: 220 },
  { d: "Nayagarh", alc: 4, mt: 650, yt: 7800, conf: 240, upl: 380 },
  { d: "Jagatsinghpur", alc: 4, mt: 700, yt: 8400, conf: 270, upl: 410 },
  { d: "Kendrapara", alc: 4, mt: 750, yt: 9000, conf: 290, upl: 440 },
  { d: "Gajapati", alc: 2, mt: 350, yt: 4200, conf: 100, upl: 200 },
  { d: "Nuapada", alc: 2, mt: 350, yt: 4200, conf: 110, upl: 210 },
  { d: "Subarnapur", alc: 2, mt: 350, yt: 4200, conf: 120, upl: 230 },
  { d: "Jharsuguda", alc: 3, mt: 500, yt: 6000, conf: 180, upl: 300 },
  { d: "Deogarh", alc: 1, mt: 250, yt: 3000, conf: 80, upl: 150 }
];

const ALC_DATA = [
  { id: "ALC-001", name: "Central Hub", type: "Main", status: "Active", efficiency: 94 },
  { id: "ALC-002", name: "North Wing", type: "Satellite", status: "Active", efficiency: 88 },
  { id: "ALC-003", name: "South Port", type: "Satellite", status: "Maintenance", efficiency: 45 },
  { id: "ALC-004", name: "East Gate", type: "Main", status: "Active", efficiency: 91 },
  { id: "ALC-005", name: "West Terminal", type: "Satellite", status: "Active", efficiency: 82 },
];

const TREND_DATA = [
  { day: 'Mon', confirmed: 450, target: 500 },
  { day: 'Tue', confirmed: 520, target: 500 },
  { day: 'Wed', confirmed: 480, target: 500 },
  { day: 'Thu', confirmed: 610, target: 500 },
  { day: 'Fri', confirmed: 580, target: 500 },
  { day: 'Sat', confirmed: 420, target: 500 },
  { day: 'Sun', confirmed: 390, target: 500 },
];

// --- Constants ---
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'datagrid', label: 'Data Grid', icon: TableIcon },
  { id: 'strategy', label: 'Strategic Path', icon: Target },
];

const COLORS = {
  excellent: '#10b981', // Green
  onTrack: '#f59e0b',   // Amber
  moderate: '#f97316',  // Orange
  critical: '#ef4444',  // Red
  primary: '#3b82f6',   // Blue
  secondary: '#8b5cf6', // Purple
  accent: '#ec4899',    // Pink
};

// --- Components ---

const StatCard = ({ label, value, subValue, icon: Icon, trend, color }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass p-4 xl:p-6 2xl:p-12 rounded-2xl 2xl:rounded-[3rem] flex flex-col justify-between h-full group hover:bg-white/10 transition-all duration-500"
  >
    <div className="flex justify-between items-start">
      <div className="p-2 xl:p-3 2xl:p-6 rounded-xl 2xl:rounded-3xl bg-white/5">
        <Icon className={cn("w-6 h-6 xl:w-8 xl:h-8 2xl:w-16 2xl:h-16", color)} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 xl:px-3 xl:py-1 2xl:px-6 2xl:py-2 rounded-full text-xs xl:text-sm 2xl:text-2xl font-bold",
          trend > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8" /> : <ArrowDownRight className="w-3 h-3 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4 xl:mt-6 2xl:mt-12">
      <p className="text-white/50 text-xs xl:text-base 2xl:text-3xl font-medium uppercase tracking-widest">{label}</p>
      <h3 className="text-2xl xl:text-4xl 2xl:text-8xl font-black mt-1 2xl:mt-4 text-glow leading-none">{value}</h3>
      {subValue && <p className="text-white/30 text-xs xl:text-sm 2xl:text-2xl mt-1 2xl:mt-4 truncate font-mono">{subValue}</p>}
    </div>
  </motion.div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-4 xl:mb-8 2xl:mb-16">
    <h2 className="text-2xl xl:text-3xl 2xl:text-7xl font-black tracking-tight text-glow-blue">{title}</h2>
    <p className="text-white/40 text-sm xl:text-lg 2xl:text-4xl mt-1 2xl:mt-4 font-medium">{subtitle}</p>
  </div>
);

// --- AI Chat Component ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  role: 'user' | 'model';
  text: string;
};

type ChatMode = 'fast' | 'general' | 'complex';

const ChatPanel = ({ isOpen, onClose, contextData }: { isOpen: boolean, onClose: () => void, contextData: any }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Hello! I am your OKCL Strategic AI Assistant. How can I help you analyze the dashboard today?' }
  ]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ChatMode>('general');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let modelName = 'gemini-3-flash-preview';
      let config: any = {
        systemInstruction: "You are an expert data analyst and strategic advisor for the OKCL dashboard. You help users understand district performance, ALC infrastructure, and strategic roadmaps. Keep your answers concise, professional, and data-driven. Format your responses using markdown.",
      };

      if (mode === 'fast') {
        modelName = 'gemini-3.1-flash-lite-preview';
      } else if (mode === 'complex') {
        modelName = 'gemini-3.1-pro-preview';
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      let prompt = text;
      if (messages.length === 1 || text.toLowerCase().includes('analyze')) {
        prompt = `Context Data: ${JSON.stringify(contextData)}\n\nUser Query: ${text}`;
      }

      const chat = ai.chats.create({
        model: modelName,
        config,
        history
      });

      const response = await chat.sendMessage({ message: prompt });
      
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: response.text || 'No response generated.'
      }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Sorry, I encountered an error while processing your request.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] 2xl:w-[600px] glass-dark border-l border-white/10 z-[100] flex flex-col shadow-2xl bg-[#05070a]/95 backdrop-blur-xl"
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">AI Assistant</h3>
                <p className="text-white/40 text-xs">Powered by Gemini</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-3 border-b border-white/10 flex gap-2 bg-black/20">
            <button 
              onClick={() => setMode('fast')}
              className={cn("flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all", mode === 'fast' ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              <Zap className="w-3 h-3" /> Fast
            </button>
            <button 
              onClick={() => setMode('general')}
              className={cn("flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all", mode === 'general' ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              <MessageSquare className="w-3 h-3" /> General
            </button>
            <button 
              onClick={() => setMode('complex')}
              className={cn("flex-1 py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all", mode === 'complex' ? "bg-purple-500/20 text-purple-400 border border-purple-500/30" : "bg-white/5 text-white/40 hover:bg-white/10")}
            >
              <BrainCircuit className="w-3 h-3" /> High Thinking
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3 max-w-[90%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0", msg.role === 'user' ? "bg-blue-600 text-white" : "bg-white/10 text-blue-400")}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div className={cn("p-3 rounded-2xl text-sm", msg.role === 'user' ? "bg-blue-600 text-white rounded-tr-none" : "bg-white/5 text-white/80 rounded-tl-none border border-white/10")}>
                  {msg.role === 'model' ? (
                    <div className="markdown-body prose prose-invert prose-sm max-w-none">
                      <Markdown>{msg.text}</Markdown>
                    </div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 max-w-[90%]">
                <div className="w-8 h-8 rounded-full bg-white/10 text-blue-400 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 text-white/80 rounded-tl-none border border-white/10 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                  <span className="text-sm text-white/40">
                    {mode === 'complex' ? 'Thinking deeply...' : 'Generating response...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => handleSend("Analyze the current district performance.")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors border border-white/5">
              Analyze Performance
            </button>
            <button onClick={() => handleSend("What are the top 3 districts by achievement?")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors border border-white/5">
              Top Districts
            </button>
            <button onClick={() => handleSend("Identify areas needing strategic intervention.")} className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/60 text-xs transition-colors border border-white/5">
              Strategic Insights
            </button>
          </div>

          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about the dashboard data..."
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 disabled:text-white/30 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Data processing
  const stats = useMemo(() => {
    const totalConf = DIST_DATA.reduce((acc, curr) => acc + curr.conf, 0);
    const totalUpl = DIST_DATA.reduce((acc, curr) => acc + curr.upl, 0);
    const totalTarget = DIST_DATA.reduce((acc, curr) => acc + curr.mt, 0);
    const totalYearly = DIST_DATA.reduce((acc, curr) => acc + curr.yt, 0);
    const avgAchievement = (totalConf / totalTarget) * 100;

    return { totalConf, totalUpl, totalTarget, totalYearly, avgAchievement };
  }, []);

  const tierData = useMemo(() => {
    let excellent = 0, onTrack = 0, moderate = 0, critical = 0;
    DIST_DATA.forEach(d => {
      const ach = (d.conf / d.mt) * 100;
      if (ach >= 40) excellent++;
      else if (ach >= 25) onTrack++;
      else if (ach >= 15) moderate++;
      else critical++;
    });
    return [
      { name: 'Excellent', value: excellent, color: COLORS.excellent },
      { name: 'On Track', value: onTrack, color: COLORS.onTrack },
      { name: 'Moderate', value: moderate, color: COLORS.moderate },
      { name: 'Critical', value: critical, color: COLORS.critical },
    ];
  }, []);

  const topDistricts = useMemo(() => {
    return [...DIST_DATA]
      .sort((a, b) => (b.conf / b.mt) - (a.conf / a.mt))
      .slice(0, 15)
      .map(d => ({
        name: d.d,
        conf: d.conf,
        upl: d.upl,
        ach: (d.conf / d.mt) * 100
      }));
  }, []);

  // Auto-rotation logic
  useEffect(() => {
    let timer: any;
    if (isAutoRotating) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveSection((curr) => (curr + 1) % SECTIONS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 100); // 10 seconds total
    }
    return () => clearInterval(timer);
  }, [isAutoRotating]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-screen w-screen bg-[#05070a] overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="w-20 xl:w-24 2xl:w-48 glass-dark flex flex-col items-center py-6 xl:py-12 2xl:py-24 gap-6 xl:gap-12 2xl:gap-24 border-r border-white/5 z-50">
        <div className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-24 2xl:h-24 bg-blue-600 rounded-xl 2xl:rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
          <TrendingUp className="w-6 h-6 xl:w-8 xl:h-8 2xl:w-14 2xl:h-14 text-white" />
        </div>
        
        <nav className="flex-1 flex flex-col gap-4 xl:gap-8 2xl:gap-16">
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(idx);
                setProgress(0);
                setIsAutoRotating(false);
              }}
              className={cn(
                "p-3 xl:p-4 2xl:p-10 rounded-xl 2xl:rounded-[2rem] transition-all duration-500 group relative",
                activeSection === idx ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "text-white/30 hover:text-white hover:bg-white/5"
              )}
            >
              <section.icon className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-14 2xl:h-14" />
              <div className={cn(
                "absolute left-16 xl:left-20 2xl:left-40 glass px-3 py-1.5 xl:px-4 xl:py-2 2xl:px-8 2xl:py-4 rounded-lg xl:rounded-xl 2xl:rounded-2xl text-sm xl:text-base 2xl:text-3xl font-bold opacity-0 pointer-events-none transition-all group-hover:opacity-100 whitespace-nowrap",
                "translate-x-[-10px] group-hover:translate-x-0 z-50"
              )}>
                {section.label}
              </div>
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsAutoRotating(!isAutoRotating)}
          className={cn(
            "p-3 xl:p-4 2xl:p-10 rounded-xl 2xl:rounded-[2rem] transition-all",
            isAutoRotating ? "text-emerald-400 bg-emerald-400/10" : "text-white/20 bg-white/5"
          )}
        >
          {isAutoRotating ? <Pause className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-14 2xl:h-14" /> : <Play className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-14 2xl:h-14" />}
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-0">
        {/* Header */}
        <header className="h-20 xl:h-24 2xl:h-48 px-6 xl:px-12 2xl:px-24 flex items-center justify-between z-40 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 xl:gap-8 2xl:gap-16">
            <div className="flex flex-col">
              <h1 className="text-xl xl:text-2xl 2xl:text-6xl font-black tracking-tighter text-white uppercase">OKCL Strategic Dashboard</h1>
              <div className="flex items-center gap-2 xl:gap-4 2xl:gap-8 mt-0.5 xl:mt-1 2xl:mt-4">
                <span className="px-2 py-0.5 xl:px-3 xl:py-1 2xl:px-8 2xl:py-3 bg-white/10 rounded-lg text-[10px] xl:text-xs 2xl:text-2xl font-bold text-white/60 uppercase tracking-widest">March 2026</span>
                <span className="w-1.5 h-1.5 xl:w-2 xl:h-2 2xl:w-4 2xl:h-4 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-400/80 text-[10px] xl:text-xs 2xl:text-2xl font-bold uppercase tracking-widest">Live System Status</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 xl:gap-12 2xl:gap-24">
            <div className="flex flex-col items-end">
              <p className="text-2xl xl:text-3xl 2xl:text-7xl font-mono font-bold text-white/90 text-glow-blue">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-white/30 text-xs xl:text-sm 2xl:text-3xl font-medium uppercase tracking-widest mt-1 2xl:mt-4">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-2 xl:gap-4 2xl:gap-8">
              <button 
                onClick={() => setIsAiOpen(true)}
                className="p-2 xl:p-3 2xl:p-8 glass rounded-xl 2xl:rounded-[2rem] hover:bg-blue-500/20 transition-all text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                <Sparkles className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-12 2xl:h-12" />
              </button>
              <button className="p-2 xl:p-3 2xl:p-8 glass rounded-xl 2xl:rounded-[2rem] hover:bg-white/10 transition-all">
                <Share2 className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-12 2xl:h-12 text-white/60" />
              </button>
              <button className="p-2 xl:p-3 2xl:p-8 glass rounded-xl 2xl:rounded-[2rem] hover:bg-white/10 transition-all">
                <Download className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-12 2xl:h-12 text-white/60" />
              </button>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="flex-1 px-6 xl:px-12 2xl:px-24 pb-6 xl:pb-12 2xl:pb-24 pt-8 xl:pt-12 2xl:pt-24 relative overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {activeSection === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="grid grid-cols-12 grid-rows-6 gap-6 xl:gap-8 2xl:gap-16 h-full"
              >
                <div className="col-span-3 row-span-2">
                  <StatCard label="Total Confirmed" value={formatNumber(stats.totalConf)} subValue={`Target: ${formatNumber(stats.totalTarget)}`} icon={CheckCircle2} trend={12.5} color="text-emerald-400" />
                </div>
                <div className="col-span-3 row-span-2">
                  <StatCard label="Achievement" value={formatPercent(stats.avgAchievement)} subValue="Overall Performance Index" icon={TrendingUp} trend={4.2} color="text-blue-400" />
                </div>
                <div className="col-span-3 row-span-2">
                  <StatCard label="Total Uploads" value={formatNumber(stats.totalUpl)} subValue={`${formatNumber(stats.totalUpl - stats.totalConf)} Pending Validation`} icon={Users} trend={-2.1} color="text-purple-400" />
                </div>
                <div className="col-span-3 row-span-2">
                  <StatCard label="Shortfall" value={formatNumber(stats.totalTarget - stats.totalConf)} subValue="Remaining for Strategic Goal" icon={AlertCircle} color="text-rose-400" />
                </div>

                <div className="col-span-8 row-span-4 glass p-6 xl:p-10 2xl:p-20 rounded-2xl 2xl:rounded-[4rem] flex flex-col min-h-0">
                  <div className="flex justify-between items-center mb-6 xl:mb-10 2xl:mb-20">
                    <div>
                      <h3 className="text-xl xl:text-3xl 2xl:text-6xl font-black text-white">Monthly Target Tracking</h3>
                      <p className="text-white/30 text-sm xl:text-lg 2xl:text-4xl mt-1 2xl:mt-4">Cumulative progress vs Daily strategic milestones</p>
                    </div>
                    <div className="flex gap-4 xl:gap-10 2xl:gap-20">
                      <div className="flex items-center gap-2 xl:gap-4">
                        <div className="w-2 h-2 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8 rounded-full bg-blue-500" />
                        <span className="text-white/60 text-xs xl:text-sm 2xl:text-3xl font-bold">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-2 xl:gap-4">
                        <div className="w-2 h-2 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8 rounded-full bg-white/10" />
                        <span className="text-white/60 text-xs xl:text-sm 2xl:text-3xl font-bold">Target</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={DIST_DATA.slice(0, 10)}>
                        <defs>
                          <linearGradient id="colorConf" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis dataKey="d" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                        <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="conf" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorConf)" />
                        <Area type="monotone" dataKey="mt" stroke="rgba(255,255,255,0.1)" strokeWidth={2} fill="transparent" strokeDasharray="10 10" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-span-4 row-span-4 glass p-6 xl:p-10 2xl:p-20 rounded-2xl 2xl:rounded-[4rem] flex flex-col min-h-0">
                  <h3 className="text-xl xl:text-3xl 2xl:text-6xl font-black text-white mb-2 xl:mb-4 2xl:mb-8">Tier Distribution</h3>
                  <p className="text-white/30 text-sm xl:text-lg 2xl:text-4xl mb-4 xl:mb-10 2xl:mb-20">District performance categorization</p>
                  <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={tierData} cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" paddingAngle={8} dataKey="value">
                          {tierData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />)}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl xl:text-5xl 2xl:text-9xl font-black text-white">{DIST_DATA.length}</span>
                      <span className="text-white/30 text-[10px] xl:text-xs 2xl:text-3xl font-bold uppercase tracking-widest">Districts</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 xl:gap-8 2xl:gap-16 w-full mt-6 xl:mt-10 2xl:mt-20">
                    {tierData.map((tier) => (
                      <div key={tier.name} className="flex items-center gap-2 xl:gap-4 2xl:gap-8">
                        <div className="w-2 h-2 xl:w-4 xl:h-4 2xl:w-8 2xl:h-8 rounded-full" style={{ backgroundColor: tier.color }} />
                        <div className="flex flex-col">
                          <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-2xl font-bold uppercase tracking-widest">{tier.name}</span>
                          <span className="text-lg xl:text-xl 2xl:text-4xl font-black text-white">{tier.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 1 && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex flex-col h-full gap-6 xl:gap-10 2xl:gap-20 min-h-0"
              >
                <SectionHeader title="Performance Analytics" subtitle="Comparative analysis of district-wise admissions and conversion rates" />
                <div className="grid grid-cols-12 gap-6 xl:gap-10 2xl:gap-20 flex-1 min-h-0">
                  <div className="col-span-8 glass p-6 xl:p-12 2xl:p-24 rounded-2xl 2xl:rounded-[4rem] flex flex-col min-h-0">
                    <h3 className="text-xl xl:text-3xl 2xl:text-6xl font-black text-white mb-8 xl:mb-16 2xl:mb-32">Top 15 Districts by Achievement</h3>
                    <div className="flex-1 min-h-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topDistricts} layout="vertical" margin={{ left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={12} width={100} tickLine={false} axisLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                          <Bar dataKey="ach" radius={[0, 10, 10, 0]} barSize={24}>
                            {topDistricts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.ach >= 40 ? COLORS.excellent : entry.ach >= 25 ? COLORS.onTrack : COLORS.moderate} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="col-span-4 flex flex-col gap-6 xl:gap-10 2xl:gap-20 min-h-0">
                    <div className="flex-1 glass p-6 xl:p-12 2xl:p-24 rounded-2xl 2xl:rounded-[4rem] min-h-0">
                      <h3 className="text-lg xl:text-2xl 2xl:text-5xl font-black text-white mb-6 xl:mb-12 2xl:mb-24">Conversion Funnel</h3>
                      <div className="space-y-8 xl:space-y-16 2xl:space-y-32">
                        <div>
                          <div className="flex justify-between mb-2 xl:mb-6 2xl:mb-12">
                            <span className="text-white/40 text-xs xl:text-base 2xl:text-3xl font-bold uppercase">Total Uploads</span>
                            <span className="text-sm xl:text-2xl 2xl:text-5xl font-black">{formatNumber(stats.totalUpl)}</span>
                          </div>
                          <div className="h-2 xl:h-6 2xl:h-12 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-blue-500" />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between mb-2 xl:mb-6 2xl:mb-12">
                            <span className="text-white/40 text-xs xl:text-base 2xl:text-3xl font-bold uppercase">Confirmed</span>
                            <span className="text-sm xl:text-2xl 2xl:text-5xl font-black">{formatNumber(stats.totalConf)}</span>
                          </div>
                          <div className="h-2 xl:h-6 2xl:h-12 bg-white/5 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(stats.totalConf / stats.totalUpl) * 100}%` }} className="h-full bg-emerald-500" />
                          </div>
                          <p className="text-emerald-400 text-xs xl:text-lg 2xl:text-4xl mt-4 xl:mt-8 2xl:mt-16 font-bold">{(stats.totalConf / stats.totalUpl * 100).toFixed(1)}% Conversion Rate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 2 && (
              <motion.div
                key="datagrid"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="flex flex-col h-full gap-6 xl:gap-10 2xl:gap-20 min-h-0"
              >
                <SectionHeader title="District Data Grid" subtitle="Comprehensive breakdown of all 30 districts with real-time metrics" />
                <div className="flex-1 glass rounded-2xl xl:rounded-[4rem] overflow-hidden flex flex-col min-h-0">
                  <div className="bg-white/5 px-6 xl:px-12 2xl:px-24 py-4 xl:py-8 2xl:py-16 grid grid-cols-12 gap-4 xl:gap-8 2xl:gap-16 text-white/40 text-xs xl:text-sm 2xl:text-3xl font-black uppercase tracking-widest border-b border-white/10">
                    <div className="col-span-3">District</div>
                    <div className="col-span-1 text-center">ALCs</div>
                    <div className="col-span-2 text-center">Target</div>
                    <div className="col-span-2 text-center">Uploaded</div>
                    <div className="col-span-2 text-center">Confirmed</div>
                    <div className="col-span-2 text-right">Achievement</div>
                  </div>
                  <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                    {DIST_DATA.map((d, i) => {
                      const ach = (d.conf / d.mt) * 100;
                      return (
                        <div key={d.d} className="px-6 xl:px-12 2xl:px-24 py-4 xl:py-8 2xl:py-16 grid grid-cols-12 gap-4 xl:gap-8 2xl:gap-16 items-center border-b border-white/5 hover:bg-white/5 transition-all group">
                          <div className="col-span-3 flex items-center gap-3 xl:gap-8 2xl:gap-16">
                            <span className="text-white/20 font-mono text-sm xl:text-xl 2xl:text-4xl w-8 xl:w-16">{i + 1}</span>
                            <span className="text-base xl:text-2xl 2xl:text-5xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{d.d}</span>
                          </div>
                          <div className="col-span-1 text-center text-sm xl:text-xl 2xl:text-4xl font-medium text-white/60">{d.alc}</div>
                          <div className="col-span-2 text-center text-sm xl:text-xl 2xl:text-4xl font-mono text-white/80">{formatNumber(d.mt)}</div>
                          <div className="col-span-2 text-center text-sm xl:text-xl 2xl:text-4xl font-mono text-white/80">{formatNumber(d.upl)}</div>
                          <div className="col-span-2 text-center text-sm xl:text-xl 2xl:text-4xl font-mono font-black text-blue-400">{formatNumber(d.conf)}</div>
                          <div className="col-span-2 flex flex-col items-end gap-1 xl:gap-4">
                            <span className={cn("text-sm xl:text-2xl 2xl:text-5xl font-black", ach >= 40 ? "text-emerald-400" : ach >= 25 ? "text-amber-400" : "text-rose-400")}>
                              {formatPercent(ach)}
                            </span>
                            <div className="w-16 xl:w-32 2xl:w-64 h-1 xl:h-3 2xl:h-6 bg-white/5 rounded-full overflow-hidden">
                              <div className={cn("h-full transition-all duration-1000", ach >= 40 ? "bg-emerald-500" : ach >= 25 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${Math.min(100, ach)}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 3 && (
              <motion.div
                key="strategy"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="flex flex-col h-full gap-6 xl:gap-10 2xl:gap-20 min-h-0"
              >
                <SectionHeader title="Strategic Roadmap" subtitle="Path to 25,000 monthly admissions: Gap analysis and trend forecasting" />
                <div className="grid grid-cols-12 gap-6 xl:gap-10 2xl:gap-20 flex-1 min-h-0">
                  <div className="col-span-7 flex flex-col gap-6 xl:gap-10 2xl:gap-20 min-h-0">
                    <div className="flex-1 glass p-6 xl:p-12 2xl:p-24 rounded-2xl 2xl:rounded-[4rem] flex flex-col min-h-0">
                      <h3 className="text-xl xl:text-3xl 2xl:text-6xl font-black text-white mb-6 xl:mb-16 2xl:mb-32">Daily Confirmation Trend</h3>
                      <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={DIST_DATA.slice(0, 15)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="d" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px' }} />
                            <Line type="monotone" dataKey="conf" stroke="#3b82f6" strokeWidth={6} dot={{ r: 6, fill: '#3b82f6', strokeWidth: 3, stroke: '#05070a' }} activeDot={{ r: 10 }} />
                            <Line type="monotone" dataKey="upl" stroke="rgba(255,255,255,0.1)" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="h-40 xl:h-60 2xl:h-96 glass p-6 xl:p-12 2xl:p-24 rounded-2xl 2xl:rounded-[4rem] bg-blue-600/10 border-blue-500/20 overflow-hidden">
                      <div className="flex items-center gap-6 xl:gap-12 2xl:gap-24 h-full">
                        <div className="p-4 xl:p-8 2xl:p-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-600/40 shrink-0">
                          <TrendingUp className="w-8 h-8 xl:w-16 2xl:w-32 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg xl:text-3xl 2xl:text-6xl font-black text-white">Strategic Insight</h4>
                          <p className="text-white/60 text-xs xl:text-xl 2xl:text-4xl mt-2 xl:mt-6 2xl:mt-12 leading-relaxed">
                            Current pipeline conversion is at <span className="text-white font-bold">68.2%</span>. To reach the 25K target, we need an average of <span className="text-blue-400 font-bold">2,125 confirmations per day</span>.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-5 glass p-6 xl:p-12 2xl:p-24 rounded-2xl 2xl:rounded-[4rem] flex flex-col min-h-0">
                    <h3 className="text-xl xl:text-3xl 2xl:text-6xl font-black text-white mb-6 xl:mb-16 2xl:mb-32">ALC Infrastructure Status</h3>
                    <div className="space-y-6 xl:space-y-12 2xl:space-y-24 flex-1 min-h-0 overflow-y-auto scrollbar-hide">
                      {ALC_DATA.map((alc) => (
                        <div key={alc.id} className="bg-white/5 p-6 xl:p-10 2xl:p-20 rounded-2xl 2xl:rounded-[3rem] border border-white/5">
                          <div className="flex justify-between items-start mb-4 xl:mb-8 2xl:mb-16">
                            <div>
                              <p className="text-white/30 text-[10px] xl:text-sm 2xl:text-2xl font-bold uppercase tracking-widest">{alc.id}</p>
                              <h4 className="text-lg xl:text-2xl 2xl:text-5xl font-black mt-1 2xl:mt-4">{alc.name}</h4>
                            </div>
                            <span className={cn(
                              "px-3 py-1 xl:px-6 xl:py-2 2xl:px-12 2xl:py-4 rounded-full text-[10px] xl:text-sm 2xl:text-2xl font-bold uppercase tracking-wider",
                              alc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            )}>
                              {alc.status}
                            </span>
                          </div>
                          <div className="space-y-2 xl:space-y-4 2xl:space-y-8">
                            <div className="flex justify-between text-xs xl:text-lg 2xl:text-3xl">
                              <span className="text-white/40">Efficiency</span>
                              <span className="font-black text-white">{alc.efficiency}%</span>
                            </div>
                            <div className="w-full h-2 xl:h-4 2xl:h-8 bg-white/5 rounded-full overflow-hidden">
                              <motion.div initial={{ width: 0 }} animate={{ width: `${alc.efficiency}%` }} className={cn("h-full", alc.efficiency >= 90 ? "bg-emerald-500" : alc.efficiency >= 70 ? "bg-blue-500" : "bg-amber-500")} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/5 absolute bottom-0 left-0">
          {isAutoRotating && (
            <motion.div key={activeSection} initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 10, ease: "linear" }} className="h-full bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
          )}
        </div>

        {/* AI Chat Panel */}
        <ChatPanel 
          isOpen={isAiOpen} 
          onClose={() => setIsAiOpen(false)} 
          contextData={{ stats, tierData, topDistricts }} 
        />
      </main>
    </div>
  );
}
