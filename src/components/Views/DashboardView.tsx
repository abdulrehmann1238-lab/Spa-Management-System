"use client";

import React, { useState, useEffect } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  TrendingUp, Users, Calendar, DollarSign, 
  Percent, Sparkles, AlertCircle, ArrowUpRight, 
  MapPin, CheckCircle2, ChevronRight, Activity
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const revenueData = [
  { name: 'Mon', revenue: 2400, bookings: 12 },
  { name: 'Tue', revenue: 3600, bookings: 18 },
  { name: 'Wed', revenue: 3100, bookings: 15 },
  { name: 'Thu', revenue: 4200, bookings: 21 },
  { name: 'Fri', revenue: 5800, bookings: 29 },
  { name: 'Sat', revenue: 7100, bookings: 36 },
  { name: 'Sun', revenue: 6300, bookings: 32 },
];

const customerSatisfaction = [
  { rating: '5 Stars', count: 342, percentage: 92 },
  { rating: '4 Stars', count: 24, percentage: 6 },
  { rating: '3 Stars', count: 5, percentage: 1.5 },
  { rating: '2 Stars', count: 1, percentage: 0.5 },
];

export default function DashboardView() {
  const { clients, appointments, therapists, setView } = useSpaStore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d'>('7d');
  
  // Count-up states for wow entry
  const [revDaily, setRevDaily] = useState(0);
  const [occupancyRate, setOccupancyRate] = useState(0);
  
  useEffect(() => {
    // Elegant number counter
    const revTimer = setTimeout(() => setRevDaily(5480), 300);
    const occTimer = setTimeout(() => setOccupancyRate(84), 500);
    return () => {
      clearTimeout(revTimer);
      clearTimeout(occTimer);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Morning Business Briefing Screen */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sage-600 to-sage-700 text-white p-6 md:p-8 shadow-premium">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="flex items-center gap-2 text-gold text-sm font-medium tracking-wider uppercase">
            <Sparkles className="h-4 w-4" />
            <span>Executive Insights Dashboard</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-light text-white leading-tight">
            Good morning, Arthur. <br />
            <span className="font-normal text-beige-100">The Sanctuary is running at optimal health today.</span>
          </h1>
          <p className="text-sm md:text-base text-sage-100 font-light leading-relaxed max-w-2xl">
            You have <span className="font-semibold text-white">14 appointments</span> scheduled today, with 
            <span className="font-semibold text-white"> Elena Rostova</span> fully booked. Your daily revenue pacing 
            is <span className="font-semibold text-white text-gold">18% higher</span> than last week. 
            There are 2 low-stock inventory alerts requiring action.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button 
              onClick={() => setView('receptionist-workspace')}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/10 rounded-lg text-sm transition-all flex items-center gap-2"
            >
              <span>View Receptionist Board</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setView('ai-insights')}
              className="px-4 py-2 bg-gold hover:bg-gold/90 text-charcoal active:scale-95 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
            >
              <span>Ask Sanctuary AI</span>
              <Sparkles className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card hover:shadow-premium-hover transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal-muted font-light">Daily Gross Revenue</span>
            <div className="h-10 w-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-110 transition-transform">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-display font-semibold">${revDaily.toLocaleString()}</h2>
            <div className="flex items-center gap-1.5 text-xs text-natural font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+12.4% from yesterday</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card hover:shadow-premium-hover transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal-muted font-light">Beds Occupancy Rate</span>
            <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
              <Percent className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-display font-semibold">{occupancyRate}%</h2>
            <div className="flex items-center gap-1.5 text-xs text-natural font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+6% target surplus</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card hover:shadow-premium-hover transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal-muted font-light">Today's Appointments</span>
            <div className="h-10 w-10 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 group-hover:scale-110 transition-transform">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-display font-semibold">{appointments.length} / 20</h2>
            <div className="flex items-center gap-1.5 text-xs text-charcoal-muted font-light">
              <span>6 bookings completed</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card hover:shadow-premium-hover transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm text-charcoal-muted font-light">Total VIP Clients</span>
            <div className="h-10 w-10 rounded-xl bg-beige-100/5 flex items-center justify-center text-charcoal-light group-hover:scale-110 transition-transform border border-beige-100">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <h2 className="text-3xl font-display font-semibold">
              {clients.filter(c => c.status === 'VIP').length}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-natural font-medium">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>+3 new VIPs this week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Main charts & occupancy heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recharts trend */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-medium">Revenue & Booking Trends</h3>
              <p className="text-xs text-charcoal-muted">Performance tracking over the current week</p>
            </div>
            <div className="flex bg-beige-100/50 p-0.5 rounded-lg text-xs border border-beige-100">
              <button 
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-md transition-all ${timeRange === '7d' ? 'bg-white text-charcoal shadow-card font-medium' : 'text-charcoal-muted'}`}
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-md transition-all ${timeRange === '30d' ? 'bg-white text-charcoal shadow-card font-medium' : 'text-charcoal-muted'}`}
              >
                Month (Forecast)
              </button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3C5A4B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3C5A4B" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F1EA" />
                <XAxis dataKey="name" stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderColor: '#E6E1D8',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(60, 90, 75, 0.08)',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
                <Area type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#3C5A4B" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Occupancy Heatmap & Live Indicator */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Spa Occupancy Heatmap</h3>
            <p className="text-xs text-charcoal-muted">Hourly slot usage for active beds/suites</p>
          </div>
          
          {/* Mock Heatmap Grid */}
          <div className="space-y-4">
            <div className="grid grid-cols-6 gap-2 text-center text-[10px] text-charcoal-muted font-medium uppercase tracking-wider">
              <div>Room</div>
              <div>09:00</div>
              <div>11:00</div>
              <div>13:00</div>
              <div>15:00</div>
              <div>17:00</div>
            </div>
            
            {[
              { name: 'Santal Suite', cells: [4, 4, 2, 4, 3] },
              { name: 'Jasmine Room', cells: [0, 4, 3, 0, 4] },
              { name: 'Lotus Lounge', cells: [3, 2, 4, 3, 2] },
              { name: 'Bamboo Zen', cells: [2, 0, 0, 4, 1] },
              { name: 'Eucalyptus Rm', cells: [1, 3, 2, 1, 0] },
            ].map((row, rIdx) => (
              <div key={rIdx} className="grid grid-cols-6 gap-2 items-center">
                <div className="text-[11px] font-medium text-charcoal-light truncate text-left">{row.name}</div>
                {row.cells.map((level, cIdx) => {
                  let bgClass = "bg-beige-100"; // 0
                  if (level === 1) bgClass = "bg-sage-100 text-sage-800";
                  if (level === 2) bgClass = "bg-sage-200 text-white";
                  if (level === 3) bgClass = "bg-sage-400 text-white";
                  if (level === 4) bgClass = "bg-sage-600 text-white"; // 100% booked
                  
                  return (
                    <div 
                      key={cIdx} 
                      className={`h-8 rounded-lg ${bgClass} flex items-center justify-center text-[10px] font-bold transition-all hover:scale-105 cursor-pointer`}
                      title={`${level * 25}% Booked`}
                    >
                      {level > 0 && `${level * 25}%`}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          
          {/* Heatmap Legend */}
          <div className="flex items-center justify-between border-t border-beige-100 pt-4 text-xs text-charcoal-muted">
            <span>Available</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-beige-100 rounded" />
              <span className="w-3 h-3 bg-sage-200 rounded" />
              <span className="w-3 h-3 bg-sage-400 rounded" />
              <span className="w-3 h-3 bg-sage-600 rounded" />
            </div>
            <span>Fully Booked</span>
          </div>
        </div>
      </div>

      {/* Grid: Popular Services & Active Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Popular Services Tracker */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Service Popularity</h3>
            <p className="text-xs text-charcoal-muted">Top booked treatment types this month</p>
          </div>
          
          <div className="space-y-4">
            {[
              { name: 'Deep Tissue Massage', bookings: 145, pct: 45, color: '#3C5A4B' },
              { name: 'Luminous Facial Therapy', bookings: 98, pct: 30, color: '#C5A880' },
              { name: 'Aromatherapy Reflexology', bookings: 42, pct: 15, color: '#75A083' },
              { name: 'Detoxifying Mud Bath', bookings: 32, pct: 10, color: '#CBDCD0' },
            ].map((service, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-charcoal-light">{service.name}</span>
                  <span className="font-semibold text-charcoal">{service.bookings} bookings</span>
                </div>
                <div className="h-1.5 w-full bg-beige-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${service.pct}%`, backgroundColor: service.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Activity Feed / Live indicators */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-medium">Live Activity Feed</h3>
              <p className="text-xs text-charcoal-muted">Real-time status updates of active operations</p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-sage-600 bg-sage-50 px-2 py-1 rounded-full border border-sage-100 font-medium animate-pulse">
              <span className="w-1.5 h-1.5 bg-sage-600 rounded-full" />
              <span>Live Terminal Sync</span>
            </div>
          </div>
          
          <div className="divide-y divide-beige-100/60 max-h-[250px] overflow-y-auto pr-1">
            {appointments.map((app) => {
              let statusBadge = "bg-beige-100 text-charcoal";
              if (app.status === 'In Session') statusBadge = "bg-sage-600 text-white";
              if (app.status === 'Checked In') statusBadge = "bg-sage-100 text-sage-800";
              if (app.status === 'Confirmed') statusBadge = "bg-gold/10 text-gold";
              
              return (
                <div key={app.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0 hover:bg-beige-50/30 transition-colors rounded-lg px-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-beige-100 border border-beige-200 overflow-hidden flex items-center justify-center text-xs font-semibold text-sage-800">
                      {app.clientAvatar ? (
                        <img src={app.clientAvatar} alt={app.clientName} className="h-full w-full object-cover" />
                      ) : (
                        app.clientName.split(' ').map(n => n[0]).join('')
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-charcoal">{app.clientName}</h4>
                      <p className="text-xs text-charcoal-muted">
                        with <span className="font-medium text-charcoal-light">{app.therapistName}</span> • {app.service}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-charcoal-muted">{app.time}</span>
                    <span className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${statusBadge}`}>
                      {app.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
    </div>
  );
}
