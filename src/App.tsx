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
  Pause,
  Play,
  Search,
  Filter,
  Zap,
  User,
  Loader2,
  Monitor,
  Maximize,
  Minimize,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Map,
  Building2,
  Briefcase,
  Menu,
  WifiOff,
  Download,
  PieChart as PieChartIcon
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Papa from 'papaparse';

// --- Utilities ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const formatNumber = (num: number) => num.toLocaleString('en-IN');
const formatPercent = (num: number) => `${num.toFixed(1)}%`;

// --- Types ---
interface DistrictContact {
  district: string;
  dlcName: string;
  dlcEmail: string;
  dlcMobile: string;
  dlcAltMobile: string;
  rmName: string;
  rmEmail: string;
  rmMobile: string;
}

interface DistrictTarget {
  district: string;
  monthlyTargets: number[]; // 0-11 for Jan-Dec
  yearlyTarget: number;
}

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

const RM_DATA = [
  { name: 'Jayashree Deheri', short: 'Jayashree D.', pct: 49.8, conf: 2865, tgt: 5750, color: '#f97316' },
  { name: 'Himaja Gharai', short: 'Himaja G.', pct: 38.8, conf: 2466, tgt: 6350, color: '#eab308' },
  { name: 'Soumya Rout', short: 'Soumya R.', pct: 35.2, conf: 1885, tgt: 5350, color: '#eab308' },
  { name: 'Ipsita Mishra', short: 'Ipsita M.', pct: 34.9, conf: 1560, tgt: 4475, color: '#ea580c' },
  { name: 'Debasish Sahu', short: 'Debasish S.', pct: 34.6, conf: 1063, tgt: 3075, color: '#ef4444' },
];

// --- Constants ---
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'district', label: 'Districts', icon: Map },
  { id: 'rm', label: 'RM Performance', icon: Briefcase },
  { id: 'alc', label: 'ALC Status', icon: Building2 },
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

const LoadingPage = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#05070a] z-[200] flex flex-col items-center justify-center overflow-hidden">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="relative"
      >
        <div className="w-32 h-32 xl:w-40 xl:h-40 2xl:w-48 3xl:w-56 4xl:w-64 bg-blue-600 rounded-3xl 3xl:rounded-[2.5rem] 4xl:rounded-[3rem] flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.3)]">
          <TrendingUp className="w-16 h-16 xl:w-20 xl:h-20 2xl:w-24 3xl:w-28 4xl:w-32 text-white" />
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-4 border-2 border-blue-500/20 border-t-blue-500 rounded-[2.5rem] 3xl:rounded-[3rem] 4xl:rounded-[3.5rem]"
        />
      </motion.div>
      
      <div className="mt-12 xl:mt-16 2xl:mt-20 3xl:mt-24 4xl:mt-32 text-center">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-7xl font-black text-white tracking-tighter uppercase font-display"
        >
          OKCL <span className="text-blue-500">Strategic</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white/30 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-3xl font-bold uppercase tracking-[0.3em] mt-4 xl:mt-6 2xl:mt-8 3xl:mt-10 4xl:mt-12"
        >
          Initializing Dashboard v4.0
        </motion.p>
      </div>

      <div className="absolute bottom-24 xl:bottom-32 2xl:bottom-40 3xl:bottom-48 4xl:bottom-64 w-64 xl:w-80 2xl:w-96 3xl:w-[30rem] 4xl:w-[40rem] h-1 xl:h-1.5 2xl:h-2 3xl:h-3 4xl:h-4 bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '0%' }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="h-full bg-blue-500"
        />
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }: { onLogin: (username: string) => void }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedData, setCachedData] = useState<string[][] | null>(null);

  const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvb8M29xhrXYr8M-4FeXRt35nd9y1Zhm2O1ng_u-qIVoZqp5kBB--FD4yvZByHcxPZvosqKJR6KSKT/pub?gid=34385779&single=true&output=csv";

  useEffect(() => {
    const prefetch = async () => {
      try {
        const response = await fetch(CSV_URL);
        if (response.ok) {
          const csvText = await response.text();
          const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));
          setCachedData(rows[0][0].toLowerCase().includes('user') ? rows.slice(1) : rows);
        }
      } catch (err) {
        console.warn("Prefetch failed", err);
      }
    };
    prefetch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let dataRows = cachedData;
      
      if (!dataRows) {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error("Failed to fetch credentials");
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(',').map(cell => cell.trim()));
        dataRows = rows[0][0].toLowerCase().includes('user') ? rows.slice(1) : rows;
      }
      
      const userMatch = dataRows.find(row => row[1] === password);

      if (userMatch) {
        onLogin(userMatch[0]);
      } else {
        setError("Invalid password. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please check your internet.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#05070a] z-[150] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[450px] xl:max-w-[500px] 2xl:max-w-[600px] 3xl:max-w-[700px] 4xl:max-w-[1000px] glass p-8 xl:p-10 2xl:p-12 3xl:p-16 4xl:p-32 rounded-[2rem] xl:rounded-[2.5rem] 2xl:rounded-[3rem] 3xl:rounded-[4rem] 4xl:rounded-[6rem] border border-white/10 relative z-10"
      >
        <div className="flex flex-col items-center mb-12 xl:mb-14 2xl:mb-16 3xl:mb-20 4xl:mb-40">
          <div className="w-16 h-16 xl:w-18 xl:h-18 2xl:w-20 3xl:w-24 4xl:w-48 bg-blue-600 rounded-2xl 3xl:rounded-3xl 4xl:rounded-[3rem] flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 xl:mb-8 2xl:mb-10 3xl:mb-12 4xl:mb-20">
            <ShieldCheck className="w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-24 text-white" />
          </div>
          <h2 className="text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-9xl font-black text-white font-display uppercase tracking-tight">Secure Access</h2>
          <p className="text-white/40 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl mt-2 xl:mt-3 2xl:mt-4 3xl:mt-6 4xl:mt-10">Enter your password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 xl:space-y-7 2xl:space-y-8 3xl:space-y-10 4xl:space-y-20">
          <div className="space-y-2 xl:space-y-3 2xl:space-y-4 3xl:space-y-6 4xl:space-y-12">
            <label className="text-white/40 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-bold uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-16 text-white/20" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl xl:rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[3rem] py-4 xl:py-4.5 2xl:py-5 3xl:py-6 4xl:py-12 pl-12 xl:pl-13 2xl:pl-14 3xl:pl-18 4xl:pl-32 pr-12 text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 3xl:w-10 4xl:w-20" /> : <Eye className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 3xl:w-10 4xl:w-20" />}
              </button>
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-rose-400 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl mt-2 ml-1"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 xl:py-4.5 2xl:py-5 3xl:py-6 4xl:py-12 rounded-xl xl:rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[3rem] text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-3"
          >
            {isLoading ? <Loader2 className="w-5 h-5 xl:w-6 xl:h-6 2xl:w-8 3xl:w-10 4xl:w-20 animate-spin" /> : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="mt-8 xl:mt-10 2xl:mt-12 3xl:mt-16 4xl:mt-32 text-center">
          <p className="text-white/20 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl">
            Forgot password? <a href="#" className="text-blue-400 hover:underline">Contact Support</a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ label, value, subValue, icon: Icon, trend, color, progress, isTvMode }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn(
      "glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] flex flex-col justify-between h-full group hover:bg-white/10 transition-all duration-500 relative overflow-hidden",
      isTvMode && "p-6 xl:p-7 2xl:p-8 3xl:p-10 4xl:p-16"
    )}
  >
    <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
      <div className={cn("h-full transition-all duration-1000", color.replace('text-', 'bg-'))} style={{ width: `${progress || 0}%` }} />
    </div>
    <div className="flex justify-between items-start">
      <div className={cn("p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-5 rounded-xl 2xl:rounded-2xl 3xl:rounded-[1.25rem] 4xl:rounded-3xl bg-white/5", isTvMode && "p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10")}>
        <Icon className={cn("w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14", color, isTvMode && "w-10 h-10 xl:w-11 xl:h-12 2xl:w-14 3xl:w-16 4xl:w-24")} />
      </div>
      {trend && (
        <div className={cn(
          "flex items-center gap-1 px-2 py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 3xl:px-4 4xl:px-5 rounded-full text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-xl font-bold",
          trend > 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400",
          isTvMode && "px-4 py-2 xl:px-4.5 xl:py-2.5 2xl:px-5 3xl:px-6 4xl:px-10 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-3xl"
        )}>
          {trend > 0 ? <ArrowUpRight className="w-3 h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 3xl:w-5 4xl:w-7" /> : <ArrowDownRight className="w-3 h-3 xl:w-3.5 xl:h-3.5 2xl:w-4 3xl:w-5 4xl:w-7" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4 xl:mt-4.5 2xl:mt-5 3xl:mt-6 4xl:mt-10">
      <p className={cn("text-white/50 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest font-display", isTvMode && "text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl")}>{label}</p>
      <h3 className={cn("text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-3 text-glow font-display leading-none truncate", isTvMode && "text-4xl xl:text-5xl 2xl:text-6xl 3xl:text-7xl 4xl:text-[10rem]")}>{value}</h3>
      {subValue && <p className={cn("text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-lg mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-3 truncate font-mono", isTvMode && "text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-3xl")}>{subValue}</p>}
    </div>
  </motion.div>
);

const DaysStrip = () => {
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - now.getDate();
  const yearEnd = new Date(now.getFullYear(), 11, 31);
  const daysInYear = Math.round((yearEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-4.5 2xl:gap-5 3xl:gap-6 4xl:gap-12 mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-20">
      <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12">
        <div className="text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-8xl">📅</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Days left in month</span>
            <span className={cn("px-2 py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 3xl:px-4 4xl:px-5 rounded-full text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-lg font-black whitespace-nowrap", daysLeft <= 5 ? "bg-rose-500/20 text-rose-400" : "bg-orange-500/20 text-orange-400")}>
              {daysLeft <= 5 ? '🚨 URGENT' : '⚠️ NEEDS PUSH'}
            </span>
          </div>
          <div className="flex items-baseline gap-2 xl:gap-2.5 2xl:gap-3 3xl:gap-4 4xl:gap-6 mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-3 overflow-hidden">
            <span className={cn("text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black font-display shrink-0", daysLeft <= 5 ? "text-rose-500" : "text-orange-500")}>{daysLeft}</span>
            <span className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-medium truncate">Month ends {now.toLocaleString('default', { month: 'long' })} {daysInMonth}</span>
          </div>
        </div>
      </div>
      <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12">
        <div className="text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-8xl">📆</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Days left in {now.getFullYear()}</span>
            <span className="px-2 py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 3xl:px-4 4xl:px-5 rounded-full bg-blue-500/20 text-blue-400 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-lg font-black whitespace-nowrap">
              Q{Math.floor(now.getMonth() / 3) + 1} {now.getFullYear()}
            </span>
          </div>
          <div className="flex items-baseline gap-2 xl:gap-2.5 2xl:gap-3 3xl:gap-4 4xl:gap-6 mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-3 overflow-hidden">
            <span className="text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black font-display text-blue-500 shrink-0">{daysInYear}</span>
            <span className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-medium truncate">Year ends December 31</span>
          </div>
        </div>
      </div>
      <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12">
        <div className="text-3xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-8xl">🎯</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Strategic Milestone</span>
            <span className="px-2 py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 3xl:px-4 4xl:px-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-lg font-black whitespace-nowrap">
              ON TRACK
            </span>
          </div>
          <div className="flex items-baseline gap-2 xl:gap-2.5 2xl:gap-3 3xl:gap-4 4xl:gap-6 mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-3 overflow-hidden">
            <span className="text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black font-display text-emerald-500 shrink-0">25K</span>
            <span className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-medium truncate">Monthly Admission Goal</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AlertRow = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-4.5 2xl:gap-5 3xl:gap-6 4xl:gap-12 mt-6 xl:mt-7 2xl:mt-8 3xl:mt-10 4xl:mt-20">
    <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] border-l-4 border-rose-500 flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12 group hover:translate-x-1 transition-transform cursor-pointer">
      <div className="w-10 h-10 xl:w-10.5 xl:h-10.5 2xl:w-11 3xl:w-14 4xl:w-24 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 animate-pulse">
        <AlertCircle className="w-6 h-6 xl:w-6 xl:h-6 2xl:w-6.5 3xl:w-8 4xl:w-14" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xl xl:text-2xl 2xl:text-2.5xl 3xl:text-3xl 4xl:text-6xl font-black text-rose-500 font-display truncate">208</h4>
        <p className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Zero Confirmation ALCs</p>
      </div>
      <ChevronRight className="ml-auto text-white/20 group-hover:text-white transition-colors" />
    </div>
    <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] border-l-4 border-amber-500 flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12 group hover:translate-x-1 transition-transform cursor-pointer">
      <div className="w-10 h-10 xl:w-10.5 xl:h-10.5 2xl:w-11 3xl:w-14 4xl:w-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
        <Clock className="w-6 h-6 xl:w-6 xl:h-6 2xl:w-6.5 3xl:w-8 4xl:w-14" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xl xl:text-2xl 2xl:text-2.5xl 3xl:text-3xl 4xl:text-6xl font-black text-amber-500 font-display truncate">4,203</h4>
        <p className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Pending Payments</p>
      </div>
      <ChevronRight className="ml-auto text-white/20 group-hover:text-white transition-colors" />
    </div>
    <div className="glass p-4 xl:p-4.5 2xl:p-5 3xl:p-6 4xl:p-10 rounded-2xl 2xl:rounded-[1.25rem] 3xl:rounded-[1.5rem] 4xl:rounded-[2.5rem] border-l-4 border-orange-500 flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-12 group hover:translate-x-1 transition-transform cursor-pointer">
      <div className="w-10 h-10 xl:w-10.5 xl:h-10.5 2xl:w-11 3xl:w-14 4xl:w-24 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
        <TrendingUp className="w-6 h-6 xl:w-6 xl:h-6 2xl:w-6.5 3xl:w-8 4xl:w-14" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xl xl:text-2xl 2xl:text-2.5xl 3xl:text-3xl 4xl:text-6xl font-black text-orange-500 font-display truncate">22</h4>
        <p className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-xl font-bold uppercase tracking-widest truncate">Districts Below 40%</p>
      </div>
      <ChevronRight className="ml-auto text-white/20 group-hover:text-white transition-colors" />
    </div>
  </div>
);

const RMZones = () => (
  <div className="glass p-5 xl:p-6 2xl:p-7 3xl:p-8 4xl:p-20 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[4rem] mt-6 xl:mt-7 2xl:mt-8 3xl:mt-10 4xl:mt-20">
    <div className="flex justify-between items-center mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-20">
      <div className="flex-1 min-w-0">
        <h3 className="text-xl xl:text-2xl 2xl:text-2.5xl 3xl:text-3xl 4xl:text-6xl font-black text-white font-display truncate">Regional Manager Zones</h3>
        <p className="text-white/30 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-4 uppercase tracking-widest font-bold truncate">March 2026 Strategic Performance</p>
      </div>
      <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl border border-orange-500/30">
        <Users className="w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-16" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-16">
      {RM_DATA.map((rm) => (
        <div key={rm.name} className="bg-white/5 p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-12 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[3rem] border border-white/5 flex flex-col items-center text-center group hover:bg-white/10 transition-all">
          <div className="relative w-20 h-20 xl:w-22 xl:h-22 2xl:w-24 3xl:w-32 4xl:w-64 mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 4xl:mb-16">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={[{ value: rm.pct }, { value: 100 - rm.pct }]} innerRadius="75%" outerRadius="100%" startAngle={90} endAngle={450} dataKey="value" stroke="none">
                  <Cell fill={rm.color} />
                  <Cell fill="rgba(255,255,255,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-2.5xl 4xl:text-5xl font-black font-display" style={{ color: rm.color }}>{rm.pct}%</span>
            </div>
          </div>
          <h4 className="text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-black text-white mb-1 2xl:mt-1.5 3xl:mt-2 4xl:mb-4">{rm.short}</h4>
          <p className="text-white/30 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-mono mb-3 2xl:mb-4 3xl:mb-6 4xl:mb-8">{rm.conf.toLocaleString()} / {rm.tgt.toLocaleString()}</p>
          <div className={cn(
            "px-3 py-1 xl:px-3.5 xl:py-1.5 2xl:px-4 3xl:px-5 4xl:px-8 2xl:py-2 3xl:py-3 4xl:py-4 rounded-lg text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-black uppercase tracking-widest",
            rm.pct >= 45 ? "bg-emerald-500/10 text-emerald-400" : rm.pct >= 35 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
          )}>
            {rm.pct >= 45 ? '✅ Good' : rm.pct >= 35 ? '⚠️ Watch' : '🔴 Low'}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 4xl:mb-16 min-w-0">
    <h2 className="text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black tracking-tight text-glow-blue truncate uppercase">{title}</h2>
    <p className="text-white/40 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-4 font-medium truncate">{subtitle}</p>
  </div>
);

// --- Main App ---

export default function App() {
  const [page, setPage] = useState<'loading' | 'login' | 'dashboard'>('loading');
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('okcl_logged_in') === 'true');
  const [user, setUser] = useState(() => localStorage.getItem('okcl_user'));
  const [activeSection, setActiveSection] = useState(0);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);
  const [curCourse, setCurCourse] = useState<'combined' | 'oscit' | 'ococ'>('combined');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTvMode, setIsTvMode] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [districtContacts, setDistrictContacts] = useState<DistrictContact[]>([]);
  const [selectedDistrictContact, setSelectedDistrictContact] = useState<DistrictContact | null>(null);
  const [districtTargets, setDistrictTargets] = useState<DistrictTarget[]>([]);

  const CONTACTS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvb8M29xhrXYr8M-4FeXRt35nd9y1Zhm2O1ng_u-qIVoZqp5kBB--FD4yvZByHcxPZvosqKJR6KSKT/pub?gid=2089136267&single=true&output=csv";
  const TARGETS_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQvb8M29xhrXYr8M-4FeXRt35nd9y1Zhm2O1ng_u-qIVoZqp5kBB--FD4yvZByHcxPZvosqKJR6KSKT/pub?gid=182947968&single=true&output=csv";

  useEffect(() => {
    const fetchContacts = () => {
      Papa.parse(CONTACTS_CSV_URL, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as string[][];
          const contacts: DistrictContact[] = data.slice(1).map(row => ({
            district: row[0] || '',
            dlcName: row[3] || '',
            dlcEmail: row[4] || '',
            dlcMobile: row[5] || '',
            dlcAltMobile: row[6] || '',
            rmName: row[7] || '',
            rmEmail: row[8] || '',
            rmMobile: row[9] || '',
          }));
          setDistrictContacts(contacts);
        },
        error: (error) => console.error('Error fetching district contacts:', error)
      });
    };

    const fetchTargets = () => {
      Papa.parse(TARGETS_CSV_URL, {
        download: true,
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const data = results.data as string[][];
          const targets: DistrictTarget[] = data.slice(1).map(row => ({
            district: row[0] || '',
            monthlyTargets: row.slice(1, 13).map(val => parseInt(val.replace(/,/g, '')) || 0),
            yearlyTarget: parseInt(row[13]?.replace(/,/g, '')) || 0,
          }));
          setDistrictTargets(targets);
        },
        error: (error) => console.error('Error fetching district targets:', error)
      });
    };

    fetchContacts();
    fetchTargets();
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
    setUser(username);
    localStorage.setItem('okcl_logged_in', 'true');
    localStorage.setItem('okcl_user', username);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('okcl_logged_in');
    localStorage.removeItem('okcl_user');
    setPage('login');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Data processing
  const processedDistData = useMemo(() => {
    const currentMonthIdx = new Date().getMonth();
    return DIST_DATA.map(d => {
      const dynamicTarget = districtTargets.find(t => t.district.toLowerCase().includes(d.d.toLowerCase()));
      return {
        ...d,
        mt: dynamicTarget ? dynamicTarget.monthlyTargets[currentMonthIdx] : d.mt,
        yt: dynamicTarget ? dynamicTarget.yearlyTarget : d.yt,
      };
    });
  }, [districtTargets]);

  const stats = useMemo(() => {
    // Mocking filtered data based on course
    const multiplier = curCourse === 'combined' ? 1 : curCourse === 'oscit' ? 0.85 : 0.15;
    
    const totalConf = Math.round(processedDistData.reduce((acc, curr) => acc + curr.conf, 0) * multiplier);
    const totalUpl = Math.round(processedDistData.reduce((acc, curr) => acc + curr.upl, 0) * multiplier);
    const totalTarget = Math.round(processedDistData.reduce((acc, curr) => acc + curr.mt, 0) * multiplier);
    const totalYearly = Math.round(processedDistData.reduce((acc, curr) => acc + curr.yt, 0) * multiplier);
    const avgAchievement = (totalConf / totalTarget) * 100;

    return { totalConf, totalUpl, totalTarget, totalYearly, avgAchievement };
  }, [curCourse, processedDistData]);

  const tierData = useMemo(() => {
    let excellent = 0, onTrack = 0, moderate = 0, critical = 0;
    processedDistData.forEach(d => {
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
  }, [processedDistData]);

  const topDistricts = useMemo(() => {
    return [...processedDistData]
      .sort((a, b) => (b.conf / b.mt) - (a.conf / a.mt))
      .slice(0, 15)
      .map(d => ({
        name: d.d,
        conf: d.conf,
        upl: d.upl,
        ach: (d.conf / d.mt) * 100
      }));
  }, [processedDistData]);

  // Auto-rotation logic - Exclusive to TV Mode
  useEffect(() => {
    let timer: any;
    if (isTvMode && isAutoRotating) {
      timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setActiveSection((curr) => (curr + 1) % SECTIONS.length);
            return 0;
          }
          return prev + 1;
        });
      }, 100); // 10 seconds total
    } else {
      setProgress(0);
    }
    return () => clearInterval(timer);
  }, [isTvMode, isAutoRotating]);

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (page === 'loading') return <LoadingPage onComplete={() => setPage(isLoggedIn ? 'dashboard' : 'login')} />;
  if (page === 'login' && !isLoggedIn) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className={cn(
      "flex flex-col md:flex-row h-screen w-screen bg-[#05070a] overflow-hidden font-sans selection:bg-blue-500/30 transition-all duration-700",
      isTvMode ? "p-0" : "p-0"
    )}>
      {/* Sidebar - Optimized for Dashboard and TV Mode */}
      <aside className={cn(
        "hidden md:flex flex-col items-center border-r border-white/5 z-50 transition-all duration-500",
        isTvMode 
          ? "w-24 xl:w-28 2xl:w-32 3xl:w-40 4xl:w-64 py-10 xl:py-12 2xl:py-14 3xl:py-16 4xl:py-32 gap-8 xl:gap-10 2xl:gap-12 3xl:gap-16 4xl:gap-32 glass-dark bg-black/60" 
          : "w-20 xl:w-22 2xl:w-24 3xl:w-28 4xl:w-48 py-6 xl:py-8 2xl:py-10 3xl:py-12 4xl:py-24 gap-6 xl:gap-6.5 2xl:gap-7 3xl:gap-8 4xl:gap-24 glass-dark"
      )}>
        <div className={cn(
          "bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 transition-all",
          isTvMode
            ? "w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 3xl:w-20 4xl:w-32 rounded-2xl 3xl:rounded-3xl 4xl:rounded-[3rem]"
            : "w-10 h-10 xl:w-11 xl:h-11 2xl:w-12 3xl:w-16 4xl:w-24 rounded-xl 2xl:rounded-2xl 3xl:rounded-3xl"
        )}>
          <TrendingUp className={cn(
            "text-white transition-all",
            isTvMode
              ? "w-7 h-7 xl:w-8 xl:h-8 2xl:w-10 3xl:w-12 4xl:w-20"
              : "w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 3xl:w-10 4xl:w-14"
          )} />
        </div>
        
        <nav className="flex-1 flex flex-col gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-16">
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(idx);
                setProgress(0);
                if (!isTvMode) setIsAutoRotating(false);
              }}
              className={cn(
                "rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] transition-all duration-500 group relative",
                isTvMode
                  ? "p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-14"
                  : "p-3 xl:p-3.5 2xl:p-4 3xl:p-6 4xl:p-10",
                activeSection === idx ? "bg-blue-600 text-white shadow-lg shadow-blue-600/40" : "text-white/30 hover:text-white hover:bg-white/5"
              )}
            >
              <section.icon className={cn(
                "transition-all",
                isTvMode
                  ? "w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-20"
                  : "w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14"
              )} />
              <div className={cn(
                "absolute glass px-3 py-1.5 xl:px-3.5 xl:py-2 2xl:px-4 3xl:px-6 4xl:px-8 rounded-lg xl:rounded-xl 2xl:rounded-2xl font-bold opacity-0 pointer-events-none transition-all group-hover:opacity-100 whitespace-nowrap z-50",
                isTvMode
                  ? "left-24 xl:left-28 2xl:left-32 3xl:left-40 4xl:left-64 text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-4xl"
                  : "left-16 xl:left-18 2xl:left-20 3xl:left-24 4xl:left-40 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-3xl",
                "translate-x-[-10px] group-hover:translate-x-0"
              )}>
                {section.label}
              </div>
            </button>
          ))}
          <button
            onClick={() => setIsTvMode(!isTvMode)}
            className={cn(
              "rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] transition-all duration-500 group relative",
              isTvMode
                ? "p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-14 bg-blue-600/20 text-blue-400"
                : "p-3 xl:p-3.5 2xl:p-4 3xl:p-6 4xl:p-10 text-white/30 hover:text-white hover:bg-white/5"
            )}
          >
            <Monitor className={cn(
              "transition-all",
              isTvMode
                ? "w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-20"
                : "w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14"
            )} />
            <div className={cn(
              "absolute glass px-3 py-1.5 xl:px-3.5 xl:py-2 2xl:px-4 3xl:px-6 4xl:px-8 rounded-lg xl:rounded-xl 2xl:rounded-2xl font-bold opacity-0 pointer-events-none transition-all group-hover:opacity-100 whitespace-nowrap z-50",
              isTvMode
                ? "left-24 xl:left-28 2xl:left-32 3xl:left-40 4xl:left-64 text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-4xl"
                : "left-16 xl:left-18 2xl:left-20 3xl:left-24 4xl:left-40 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-3xl",
              "translate-x-[-10px] group-hover:translate-x-0"
            )}>
              {isTvMode ? "Exit TV Mode" : "TV Mode"}
            </div>
          </button>
        </nav>

        <div className="flex flex-col gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-16">
          <button 
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={cn(
              "rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] transition-all",
              isTvMode
                ? "p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-14"
                : "p-3 xl:p-3.5 2xl:p-4 3xl:p-6 4xl:p-10",
              isAutoRotating ? "text-emerald-400 bg-emerald-400/10" : "text-white/20 bg-white/5"
            )}
          >
            {isAutoRotating 
              ? <Pause className={cn(isTvMode ? "w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-20" : "w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14")} /> 
              : <Play className={cn(isTvMode ? "w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-20" : "w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14")} />
            }
          </button>
          <button 
            onClick={handleLogout}
            className={cn(
              "rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] text-rose-400 hover:bg-rose-400/10 transition-all",
              isTvMode
                ? "p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-14"
                : "p-3 xl:p-3.5 2xl:p-4 3xl:p-6 4xl:p-10"
            )}
          >
            <LogOut className={cn(isTvMode ? "w-8 h-8 xl:w-9 xl:h-9 2xl:w-10 3xl:w-12 4xl:w-20" : "w-6 h-6 xl:w-6.5 xl:h-6.5 2xl:w-7 3xl:w-8 4xl:w-14")} />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      {!isTvMode && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-dark border-t border-white/5 z-50 flex justify-around items-center py-3 px-2">
          {SECTIONS.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => {
                setActiveSection(idx);
                setProgress(0);
                setIsAutoRotating(false);
              }}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                activeSection === idx ? "text-blue-400" : "text-white/30"
              )}
            >
              <section.icon className="w-5 h-5" />
              <span className="text-[8px] font-bold uppercase tracking-tighter">{section.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-h-0 pb-16 md:pb-0">
        {/* Header */}
        <header className={cn(
          "h-16 md:h-18 xl:h-20 2xl:h-24 3xl:h-28 4xl:h-48 px-4 md:px-5 xl:px-6 2xl:px-8 3xl:px-10 4xl:px-24 flex items-center justify-between z-40 border-b border-white/5 bg-[#05070a]/80 backdrop-blur-md transition-all",
          isTvMode && "h-16 xl:h-18 2xl:h-24 3xl:h-28 4xl:h-32 opacity-50 hover:opacity-100"
        )}>
          <div className="flex items-center gap-3 md:gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-16">
            {isTvMode && (
              <button 
                onClick={() => setIsTvMode(false)}
                className="p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-6 glass rounded-xl hover:bg-white/10 text-white/60"
              >
                <Minimize className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-12" />
              </button>
            )}
            <div className="flex flex-col">
              <h1 className="text-sm md:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-6xl font-black tracking-tighter text-white uppercase truncate max-w-[150px] md:max-w-none">
                {isTvMode ? "TV MODE ACTIVE" : "OKCL Strategic Dashboard"}
              </h1>
              <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-6 4xl:gap-8 mt-0.5 xl:mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-4">
                <span className="px-1.5 py-0.5 md:px-2 md:py-0.5 xl:px-2.5 xl:py-1 2xl:px-3 3xl:px-4 4xl:px-8 2xl:py-1 3xl:py-2 4xl:py-3 bg-white/10 rounded-lg text-[8px] md:text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold text-white/60 uppercase tracking-widest">
                  {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <span className="hidden md:block w-1.5 h-1.5 xl:w-2 xl:h-2 2xl:w-2.5 3xl:w-3 4xl:w-4 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden md:block text-emerald-400/80 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">Live System Status</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span className="flex items-center gap-1 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-4 text-[8px] md:text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl text-blue-400 font-bold uppercase tracking-widest">
                  <User className="w-2.5 h-2.5 md:w-3 md:h-3 xl:w-4 xl:h-4 2xl:w-5 3xl:w-6 4xl:w-8" /> {user || 'Guest'}
                </span>
                {!isOnline && (
                  <span className="flex items-center gap-1 text-rose-400 text-[8px] md:text-[10px] font-bold uppercase animate-pulse">
                    <WifiOff className="w-2.5 h-2.5 md:w-3 md:h-3" /> Offline Mode
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 4xl:gap-24">
            <div className="hidden md:flex gap-2 xl:gap-3 2xl:gap-4 3xl:gap-6 4xl:gap-8">
              <button 
                onClick={toggleFullscreen}
                className="p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-8 glass rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] hover:bg-white/10 transition-all text-white/60 border border-white/10"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-12" /> : <Maximize className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-12" />}
              </button>
              <button 
                onClick={() => setIsTvMode(!isTvMode)}
                className={cn(
                  "p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-8 glass rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] transition-all border",
                  isTvMode ? "bg-blue-600/20 text-blue-400 border-blue-500/30" : "hover:bg-white/10 text-white/60 border-white/10"
                )}
                title="Toggle TV Mode"
              >
                <Monitor className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-12" />
              </button>
              {deferredPrompt && (
                <button 
                  onClick={handleInstallClick}
                  className="p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-8 bg-blue-600 text-white rounded-xl 2xl:rounded-2xl 3xl:rounded-[2rem] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                >
                  <Download className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-12" />
                  <span className="hidden xl:inline text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">Install App</span>
                </button>
              )}
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm md:text-xl xl:text-2xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-mono font-bold text-white/90 text-glow-blue">
                {currentTime.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="hidden md:block text-white/30 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-medium uppercase tracking-widest mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-4">
                {currentTime.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </header>

        {/* Content Sections */}
        <div className="flex-1 px-4 md:px-6 xl:px-8 2xl:px-10 3xl:px-12 4xl:px-24 pb-4 md:pb-6 xl:pb-8 2xl:pb-10 3xl:pb-12 4xl:pb-24 pt-4 md:pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-24 relative overflow-hidden min-h-0">
          <AnimatePresence mode="wait">
            {activeSection === 0 && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex flex-col h-full min-h-0 overflow-y-auto scrollbar-hide"
              >
                <div className="flex justify-between items-end mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-20">
                  <div className="flex flex-col">
                    <h2 className="text-2xl xl:text-2.5xl 2xl:text-3xl 3xl:text-4xl 4xl:text-7xl font-black tracking-tight text-glow-blue font-display uppercase">State <span className="text-orange-500">Overview</span></h2>
                    <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-5 4xl:gap-8 mt-1 2xl:mt-1.5 3xl:mt-2 4xl:mt-4">
                      <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 3xl:w-4 4xl:w-6 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">
                        Live · {currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · 912 Active ALCs
                      </span>
                    </div>
                  </div>
                  <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                    {(['combined', 'oscit', 'ococ'] as const).map((course) => (
                      <button
                        key={course}
                        onClick={() => setCurCourse(course)}
                        className={cn(
                          "px-4 py-2 xl:px-4.5 xl:py-2 2xl:px-5 2xl:py-2.5 3xl:px-6 3xl:py-3 4xl:px-12 4xl:py-6 rounded-lg text-[10px] xl:text-[11px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-black uppercase tracking-widest transition-all",
                          curCourse === course ? "bg-orange-500 text-white shadow-lg shadow-orange-500/40" : "text-white/40 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                </div>

                <DaysStrip />

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 xl:gap-4.5 2xl:gap-5 3xl:gap-6 4xl:gap-12 mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-20">
                  <StatCard label="Total Uploaded" value={formatNumber(stats.totalUpl)} subValue="Students in system" icon={Users} trend={-2.1} color="text-blue-400" progress={100} isTvMode={isTvMode} />
                  <StatCard label="Total Confirmed" value={formatNumber(stats.totalConf)} subValue="Payment completed" icon={CheckCircle2} trend={12.5} color="text-emerald-400" progress={stats.avgAchievement} isTvMode={isTvMode} />
                  <StatCard label="Pending Payment" value={formatNumber(stats.totalUpl - stats.totalConf)} subValue="Follow up required" icon={Clock} color="text-rose-400" progress={(stats.totalUpl - stats.totalConf) / stats.totalUpl * 100} isTvMode={isTvMode} />
                  <StatCard label="Monthly Target" value={formatNumber(stats.totalTarget)} subValue={`${currentTime.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} goal`} icon={Target} color="text-orange-400" progress={stats.avgAchievement} isTvMode={isTvMode} />
                  <StatCard label="Yearly Target" value={formatNumber(stats.totalYearly)} subValue={`Full year ${currentTime.getFullYear()} goal`} icon={BarChart3} color="text-amber-400" progress={(stats.totalConf / stats.totalYearly) * 100} isTvMode={isTvMode} />
                  <StatCard label="Active ALCs" value="912" subValue="208 inactive" icon={Users} color="text-purple-400" progress={81.4} isTvMode={isTvMode} />
                  <StatCard label="Annual Total" value="21,401" subValue="Q1 complete" icon={TrendingUp} color="text-cyan-400" progress={12.6} isTvMode={isTvMode} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 4xl:gap-16 flex-1 min-h-0">
                  <div className="lg:col-span-8 glass p-6 xl:p-7 2xl:p-8 3xl:p-10 4xl:p-20 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[4rem] flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-20">
                      <div>
                        <h3 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-6xl font-black text-white font-display">Monthly Trend</h3>
                        <p className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">2026 Confirmed vs 2025 Actual</p>
                      </div>
                      <div className="flex gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-20">
                        <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-5 4xl:gap-8">
                          <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 3xl:w-4 4xl:w-8 rounded-full bg-orange-500" />
                          <span className="text-white/60 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-bold uppercase font-display">2026</span>
                        </div>
                        <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-5 4xl:gap-8">
                          <div className="w-2 h-2 xl:w-2.5 xl:h-2.5 2xl:w-3 3xl:w-4 4xl:w-8 rounded-full bg-blue-500" />
                          <span className="text-white/60 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-bold uppercase font-display">2025</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[250px] xl:min-h-[300px] 2xl:min-h-[350px] 3xl:min-h-[400px] 4xl:min-h-[600px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={TREND_DATA}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                          <XAxis dataKey="day" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                          <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '12px' }}
                            itemStyle={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}
                          />
                          <Line type="monotone" dataKey="confirmed" stroke="#f97316" strokeWidth={4} dot={{ r: 6, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 8 }} />
                          <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="lg:col-span-4 flex flex-col gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 4xl:gap-16">
                    <div className="glass p-6 xl:p-7 2xl:p-8 3xl:p-10 4xl:p-20 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[4rem] flex flex-col min-h-0">
                      <h3 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-6xl font-black text-white mb-2 xl:mb-2.5 2xl:mb-3 3xl:mb-4 4xl:mb-8 font-display">Course Split</h3>
                      <p className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 4xl:mb-20 uppercase tracking-widest font-bold">Admission distribution by stream</p>
                      <div className="flex-1 flex flex-col items-center justify-center min-h-[180px] xl:min-h-[200px] 2xl:min-h-[220px] 3xl:min-h-[250px] 4xl:min-h-[400px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie data={[{ name: 'OS-CIT', value: 86.7, color: '#f97316' }, { name: 'OCOC', value: 13.3, color: '#3b82f6' }]} cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" paddingAngle={8} dataKey="value">
                              <Cell fill="#f97316" stroke="none" />
                              <Cell fill="#3b82f6" stroke="none" />
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl xl:text-4xl 2xl:text-5xl 3xl:text-6xl 4xl:text-9xl font-black text-white font-display">{formatNumber(stats.totalConf)}</span>
                          <span className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-lg 4xl:text-3xl font-bold uppercase tracking-widest">Confirmed</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 xl:gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-16 w-full mt-6 xl:mt-8 2xl:mt-10 3xl:mt-12 4xl:mt-20">
                        <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-5 4xl:gap-8">
                          <div className="w-2 h-2 xl:w-3 xl:h-3 2xl:w-4 3xl:w-6 4xl:w-8 rounded-full bg-[#f97316]" />
                          <div className="flex flex-col">
                            <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">OS-CIT</span>
                            <span className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-black text-white font-display">86.7%</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 xl:gap-3 2xl:gap-4 3xl:gap-5 4xl:gap-8">
                          <div className="w-2 h-2 xl:w-3 xl:h-3 2xl:w-4 3xl:w-6 4xl:w-8 rounded-full bg-[#3b82f6]" />
                          <div className="flex flex-col">
                            <span className="text-white/40 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest">OCOC</span>
                            <span className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-4xl font-black text-white font-display">13.3%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <RMZones />
                <AlertRow />
              </motion.div>
            )}

            {activeSection === 1 && (
              <motion.div
                key="districts"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex flex-col h-full min-h-0 overflow-y-auto scrollbar-hide"
              >
                <SectionHeader title="District Performance" subtitle="Detailed breakdown of admissions and targets across all 30 districts" />
                
                <div className="flex-1 min-h-0">
                  <div className="glass rounded-2xl xl:rounded-[1.5rem] 2xl:rounded-[2rem] 3xl:rounded-[2.5rem] 4xl:rounded-[4rem] overflow-hidden flex flex-col h-full min-h-0">
                    {/* Table Header - Hidden on mobile */}
                    <div className="hidden md:grid bg-white/5 px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-24 py-4 xl:py-4.5 2xl:py-5 3xl:py-6 4xl:py-16 grid-cols-12 gap-4 xl:gap-4.5 2xl:gap-5 3xl:gap-6 4xl:gap-16 text-white/40 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-black uppercase tracking-widest border-b border-white/10">
                      <div className="col-span-3">District Name</div>
                      <div className="col-span-1 text-center">ALCs</div>
                      <div className="col-span-2 text-center">Target</div>
                      <div className="col-span-2 text-center">Confirmed</div>
                      <div className="col-span-2 text-right">Achievement</div>
                      <div className="col-span-2 text-right">Contact</div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
                      {processedDistData.map((d, i) => {
                        const ach = (d.conf / d.mt) * 100;
                        return (
                          <React.Fragment key={d.d}>
                            {/* Desktop Row */}
                            <div className="hidden md:grid px-6 xl:px-7 2xl:px-8 3xl:px-10 4xl:px-24 py-4 xl:py-4.5 2xl:py-5 3xl:py-6 4xl:py-16 grid-cols-12 gap-4 xl:gap-4.5 2xl:gap-5 3xl:gap-6 4xl:gap-16 items-center border-b border-white/5 hover:bg-white/5 transition-all group">
                              <div className="col-span-3 flex items-center gap-3 xl:gap-4 2xl:gap-6 3xl:gap-8 4xl:gap-16 min-w-0">
                                <span className="text-white/20 font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl w-8 xl:w-10 2xl:w-12 3xl:w-16 shrink-0">{i + 1}</span>
                                <span className="text-base xl:text-lg 2xl:text-xl 3xl:text-2xl 4xl:text-5xl font-bold text-white group-hover:text-blue-400 transition-colors truncate">{d.d}</span>
                              </div>
                              <div className="col-span-1 text-center text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-medium text-white/60">{d.alc}</div>
                              <div className="col-span-2 text-center text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-mono text-white/80">{formatNumber(d.mt)}</div>
                              <div className="col-span-2 text-center text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-mono font-black text-blue-400">{formatNumber(d.conf)}</div>
                              <div className="col-span-2 flex flex-col items-end gap-1 xl:gap-2 2xl:gap-3 3xl:gap-4 4xl:gap-4">
                                <span className={cn("text-sm xl:text-base 2xl:text-lg 3xl:text-2xl 4xl:text-5xl font-black", ach >= 40 ? "text-emerald-400" : ach >= 25 ? "text-amber-400" : "text-rose-400")}>
                                  {formatPercent(ach)}
                                </span>
                                <div className="w-16 xl:w-20 2xl:w-24 3xl:w-32 4xl:w-64 h-1 xl:h-1.5 2xl:h-2 3xl:h-3 4xl:h-6 bg-white/5 rounded-full overflow-hidden">
                                  <div className={cn("h-full transition-all duration-1000", ach >= 40 ? "bg-emerald-500" : ach >= 25 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${Math.min(100, ach)}%` }} />
                                </div>
                              </div>
                              <div className="col-span-2 flex justify-end">
                                <button 
                                  onClick={() => {
                                    const contact = districtContacts.find(c => c.district.toLowerCase().includes(d.d.toLowerCase()));
                                    if (contact) setSelectedDistrictContact(contact);
                                  }}
                                  className="p-2 xl:p-2.5 2xl:p-3 3xl:p-4 4xl:p-8 glass rounded-xl hover:bg-blue-600/20 hover:text-blue-400 transition-all text-white/40 border border-white/5"
                                >
                                  <User className="w-5 h-5 xl:w-5.5 xl:h-5.5 2xl:w-6 3xl:w-8 4xl:w-14" />
                                </button>
                              </div>
                            </div>

                            {/* Mobile Card */}
                            <div className="md:hidden p-4 border-b border-white/5 space-y-4">
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                  <span className="text-white/20 font-mono text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-2xl">{i + 1}</span>
                                  <span className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-5xl font-bold text-white">{d.d}</span>
                                </div>
                                <span className={cn("text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-black", ach >= 40 ? "text-emerald-400" : ach >= 25 ? "text-amber-400" : "text-rose-400")}>
                                  {formatPercent(ach)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col">
                                  <span className="text-white/30 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-bold uppercase tracking-widest">Confirmed / Target</span>
                                  <span className="text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-mono">{formatNumber(d.conf)} / {formatNumber(d.mt)}</span>
                                </div>
                                <div className="flex flex-col items-end">
                                  <span className="text-white/30 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-bold uppercase tracking-widest">ALCs</span>
                                  <span className="text-white text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl">{d.alc}</span>
                                </div>
                              </div>
                              <div className="w-full h-1.5 xl:h-2 2xl:h-3 3xl:h-4 4xl:h-8 bg-white/5 rounded-full overflow-hidden">
                                <div className={cn("h-full", ach >= 40 ? "bg-emerald-500" : ach >= 25 ? "bg-amber-500" : "bg-rose-500")} style={{ width: `${Math.min(100, ach)}%` }} />
                              </div>
                              <button 
                                onClick={() => {
                                  const contact = districtContacts.find(c => c.district.toLowerCase().includes(d.d.toLowerCase()));
                                  if (contact) setSelectedDistrictContact(contact);
                                }}
                                className="w-full py-3 glass rounded-xl text-white/60 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2"
                              >
                                <User className="w-4 h-4" /> View Contact Info
                              </button>
                            </div>
                          </React.Fragment>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 2 && (
              <motion.div
                key="rm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex flex-col h-full min-h-0 overflow-y-auto scrollbar-hide"
              >
                <SectionHeader title="RM Performance" subtitle="Regional Manager zone-wise strategic tracking and efficiency metrics" />
                
                <div className="grid grid-cols-1 gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 4xl:gap-20">
                  <RMZones />
                  
                  <div className="glass p-6 xl:p-7 2xl:p-8 3xl:p-10 4xl:p-24 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[4rem]">
                    <h3 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-6xl font-black text-white mb-6 xl:mb-7 2xl:mb-8 3xl:mb-10 4xl:mb-32 font-display">RM Conversion Funnel</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 4xl:gap-32">
                      {RM_DATA.map(rm => (
                        <div key={rm.name} className="space-y-4 xl:space-y-5 2xl:space-y-6 3xl:space-y-8 4xl:space-y-16">
                          <div className="flex justify-between items-end">
                            <span className="text-white font-bold text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-5xl">{rm.name}</span>
                            <span className="text-white/40 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl font-mono">{rm.pct}% Achievement</span>
                          </div>
                          <div className="relative h-4 xl:h-5 2xl:h-6 3xl:h-8 4xl:h-16 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${rm.pct}%` }}
                              className="h-full"
                              style={{ backgroundColor: rm.color }}
                            />
                          </div>
                          <div className="flex justify-between text-white/30 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl font-bold uppercase tracking-widest">
                            <span>Confirmed: {formatNumber(rm.conf)}</span>
                            <span>Target: {formatNumber(rm.tgt)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 3 && (
              <motion.div
                key="alc"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "circOut" }}
                className="flex flex-col h-full min-h-0 overflow-y-auto scrollbar-hide"
              >
                <SectionHeader title="ALC Infrastructure" subtitle="Real-time status and efficiency tracking of Authorized Learning Centers" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-7 2xl:gap-8 3xl:gap-10 4xl:gap-20">
                  {ALC_DATA.map((alc) => (
                    <div key={alc.id} className="glass p-6 xl:p-7 2xl:p-8 3xl:p-10 4xl:p-20 rounded-2xl 2xl:rounded-[1.5rem] 3xl:rounded-[2rem] 4xl:rounded-[3.5rem] border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex justify-between items-start mb-4 xl:mb-5 2xl:mb-6 3xl:mb-8 4xl:mb-16">
                        <div className="flex-1 min-w-0">
                          <p className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-widest truncate">{alc.id}</p>
                          <h4 className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-5xl font-black mt-1 2xl:mt-2 3xl:mt-3 4xl:mt-4 truncate">{alc.name}</h4>
                          <p className="text-white/40 text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl mt-1 truncate">{alc.type}</p>
                        </div>
                        <span className={cn(
                          "px-3 py-1 xl:px-4 xl:py-2 2xl:px-6 3xl:px-8 4xl:px-12 2xl:py-3 3xl:py-4 4xl:py-4 rounded-full text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase tracking-wider",
                          alc.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        )}>
                          {alc.status}
                        </span>
                      </div>
                      <div className="space-y-2 xl:space-y-3 2xl:space-y-4 3xl:space-y-6 4xl:space-y-8">
                        <div className="flex justify-between text-xs xl:text-sm 2xl:text-base 3xl:text-lg 4xl:text-3xl">
                          <span className="text-white/40">Operational Efficiency</span>
                          <span className="font-black text-white">{alc.efficiency}%</span>
                        </div>
                        <div className="w-full h-2 xl:h-2.5 2xl:h-3 3xl:h-4 4xl:h-8 bg-white/5 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${alc.efficiency}%` }} className={cn("h-full", alc.efficiency >= 90 ? "bg-emerald-500" : alc.efficiency >= 70 ? "bg-blue-500" : "bg-amber-500")} />
                        </div>
                      </div>
                      <div className="mt-6 xl:mt-8 2xl:mt-10 3xl:mt-12 4xl:mt-20 pt-6 xl:pt-8 2xl:pt-10 3xl:pt-12 4xl:pt-20 border-t border-white/5 grid grid-cols-2 gap-4">
                        <div className="flex flex-col">
                          <span className="text-white/20 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-bold uppercase">Uptime</span>
                          <span className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl">99.9%</span>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="text-white/20 text-[8px] xl:text-[10px] 2xl:text-xs 3xl:text-sm 4xl:text-2xl font-bold uppercase">Last Sync</span>
                          <span className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl">2m ago</span>
                        </div>
                      </div>
                    </div>
                  ))}
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
      </main>
      {/* Contact Modal */}
      <AnimatePresence>
        {selectedDistrictContact && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDistrictContact(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl xl:max-w-3xl 2xl:max-w-4xl 3xl:max-w-5xl 4xl:max-w-7xl glass rounded-3xl 2xl:rounded-[2rem] 3xl:rounded-[2.5rem] 4xl:rounded-[4rem] border border-white/10 overflow-hidden shadow-2xl"
            >
              <div className="p-6 xl:p-8 2xl:p-10 3xl:p-12 4xl:p-24 border-b border-white/5 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl xl:text-3xl 2xl:text-4xl 3xl:text-5xl 4xl:text-8xl font-black text-white font-display uppercase tracking-tight">
                    {selectedDistrictContact.district} <span className="text-blue-500">Contacts</span>
                  </h3>
                  <p className="text-white/30 text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl mt-1 2xl:mt-2 3xl:mt-3 4xl:mt-6 font-bold uppercase tracking-widest">Official DLC & RM Information</p>
                </div>
                <button 
                  onClick={() => setSelectedDistrictContact(null)}
                  className="p-3 xl:p-4 2xl:p-5 3xl:p-6 4xl:p-12 glass rounded-2xl hover:bg-white/10 transition-all text-white/40"
                >
                  <LogOut className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 3xl:w-10 4xl:w-20 rotate-90" />
                </button>
              </div>
              
              <div className="p-6 xl:p-8 2xl:p-10 3xl:p-12 4xl:p-24 grid grid-cols-1 md:grid-cols-2 gap-6 xl:gap-8 2xl:gap-10 3xl:gap-12 4xl:gap-32">
                {/* DLC Info */}
                <div className="space-y-6 xl:space-y-8 2xl:space-y-10 3xl:space-y-12 4xl:space-y-24">
                  <div className="flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-16">
                    <div className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 3xl:w-20 4xl:w-40 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                      <Building2 className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 3xl:w-10 4xl:w-20" />
                    </div>
                    <div>
                      <h4 className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-3xl font-black uppercase tracking-widest">District Learning Center</h4>
                      <p className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-6xl font-black text-white mt-1">{selectedDistrictContact.dlcName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 xl:space-y-6 2xl:space-y-8 3xl:space-y-10 4xl:space-y-20">
                    <div className="glass p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-16 rounded-2xl border border-white/5">
                      <p className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase mb-1">Email Address</p>
                      <p className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl break-all">{selectedDistrictContact.dlcEmail}</p>
                    </div>
                    <div className="glass p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-16 rounded-2xl border border-white/5">
                      <p className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase mb-1">Mobile Numbers</p>
                      <p className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl">
                        {selectedDistrictContact.dlcMobile}
                        {selectedDistrictContact.dlcAltMobile && ` / ${selectedDistrictContact.dlcAltMobile}`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RM Info */}
                <div className="space-y-6 xl:space-y-8 2xl:space-y-10 3xl:space-y-12 4xl:space-y-24">
                  <div className="flex items-center gap-4 xl:gap-5 2xl:gap-6 3xl:gap-8 4xl:gap-16">
                    <div className="w-12 h-12 xl:w-14 xl:h-14 2xl:w-16 3xl:w-20 4xl:w-40 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                      <Briefcase className="w-6 h-6 xl:w-7 xl:h-7 2xl:w-8 3xl:w-10 4xl:w-20" />
                    </div>
                    <div>
                      <h4 className="text-white/30 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-3xl font-black uppercase tracking-widest">Regional Manager</h4>
                      <p className="text-lg xl:text-xl 2xl:text-2xl 3xl:text-3xl 4xl:text-6xl font-black text-white mt-1">{selectedDistrictContact.rmName}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4 xl:space-y-6 2xl:space-y-8 3xl:space-y-10 4xl:space-y-20">
                    <div className="glass p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-16 rounded-2xl border border-white/5">
                      <p className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase mb-1">Email Address</p>
                      <p className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl break-all">{selectedDistrictContact.rmEmail}</p>
                    </div>
                    <div className="glass p-4 xl:p-5 2xl:p-6 3xl:p-8 4xl:p-16 rounded-2xl border border-white/5">
                      <p className="text-white/20 text-[10px] xl:text-xs 2xl:text-sm 3xl:text-base 4xl:text-2xl font-bold uppercase mb-1">Mobile Number</p>
                      <p className="text-white font-mono text-sm xl:text-base 2xl:text-lg 3xl:text-xl 4xl:text-4xl">{selectedDistrictContact.rmMobile}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 xl:p-8 2xl:p-10 3xl:p-12 4xl:p-24 bg-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedDistrictContact(null)}
                  className="px-8 py-3 xl:px-10 xl:py-4 2xl:px-12 2xl:py-5 3xl:px-16 3xl:py-6 4xl:px-32 4xl:py-12 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-sm xl:text-base 2xl:text-lg 3xl:text-2xl 4xl:text-5xl"
                >
                  Close Information
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
