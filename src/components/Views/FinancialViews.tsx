"use client";

import React, { useState } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  TrendingUp, TrendingDown, DollarSign, Download, ArrowUpRight,
  Sparkles, RefreshCw, Layers, Database, ShieldAlert, Cpu
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ViewProps {
  subView: string;
}

export default function FinancialViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // Forecast Sliders State
  const [priceSlider, setPriceSlider] = useState(10); // +10% price
  const [occupancySlider, setOccupancySlider] = useState(15); // +15% occupancy

  // Baseline Monthly revenue: $32,000
  const baselineRev = 32000;
  const priceMultiplier = 1 + (priceSlider / 100);
  const occupancyMultiplier = 1 + (occupancySlider / 100);
  const projectedMonthlyRev = baselineRev * priceMultiplier * occupancyMultiplier;
  
  // Dynamic projected chart data
  const forecastData = [
    { name: 'Jul 26', baseline: 32000, projected: Math.round(projectedMonthlyRev) },
    { name: 'Aug 26', baseline: 33500, projected: Math.round(projectedMonthlyRev * 1.05) },
    { name: 'Sep 26', baseline: 31000, projected: Math.round(projectedMonthlyRev * 0.97) },
    { name: 'Oct 26', baseline: 34000, projected: Math.round(projectedMonthlyRev * 1.06) },
    { name: 'Nov 26', baseline: 38000, projected: Math.round(projectedMonthlyRev * 1.18) },
    { name: 'Dec 26', baseline: 45000, projected: Math.round(projectedMonthlyRev * 1.40) },
  ];

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. FINANCIAL REPORTS
  if (subView === 'financial-reports') {
    const data = [
      { quarter: 'Q1 2026', ebitda: 42000, margin: 38 },
      { quarter: 'Q2 2026', ebitda: 58000, margin: 42 },
      { quarter: 'Q3 2026', ebitda: 64000, margin: 44 },
      { quarter: 'Q4 2026 (Est)', ebitda: 89000, margin: 48 },
    ];

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Financial EBITDA Tracking</h3>
          <p className="text-xs text-charcoal-muted">Quarterly profit earnings and margin logs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Quarterly EBITDA ($)</h4>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <XAxis dataKey="quarter" stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip formatter={(v) => `$${v}`} />
                  <Bar dataKey="ebitda" name="EBITDA ($)" fill="#3C5A4B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card flex flex-col justify-between">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Operational Profit Margin</h4>
              <div className="space-y-3 pt-2 text-xs">
                {data.map((d, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-beige-100 last:border-0">
                    <span className="font-medium text-charcoal">{d.quarter}</span>
                    <span className="font-semibold text-sage-800">{d.margin}% Margin</span>
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full mt-6 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1">
              <Download className="h-3.5 w-3.5" />
              <span>Download Comprehensive Audit Pack</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. PROFIT & LOSS
  if (subView === 'profit-loss') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Profit & Loss Ledger</h3>
            <p className="text-xs text-charcoal-muted">Consolidated operating metrics for the active financial period</p>
          </div>
          <span className="text-[10px] font-mono text-charcoal-muted">June 2026</span>
        </div>

        <div className="space-y-4 text-xs">
          <div className="grid grid-cols-4 bg-beige-50 border-b border-beige-100 text-charcoal-light font-semibold py-2 px-3">
            <div className="col-span-2">Revenue / Expense Line Item</div>
            <div className="text-right">Period (Est)</div>
            <div className="text-right">Variance</div>
          </div>
          
          {[
            { name: 'Gross Wellness Treatment Sales', amount: 38500, type: 'revenue', val: '+14%' },
            { name: 'Retail Boutique Merchandising', amount: 4800, type: 'revenue', val: '+8%' },
            { name: 'Cost of Goods Sold (Massage Oils/Serums)', amount: -2100, type: 'expense', val: '-2%' },
            { name: 'Therapist Shift Payroll & Commission', amount: -18400, type: 'expense', val: '+5%' },
            { name: 'Facility Leasehold Rental', amount: -3500, type: 'expense', val: '0%' },
            { name: 'Marketing SMS & Automated Campaigns', amount: -650, type: 'expense', val: '-8%' }
          ].map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 py-2 border-b border-beige-100/40 px-3 hover:bg-beige-50/10">
              <div className="col-span-2 font-medium text-charcoal">{item.name}</div>
              <div className={`text-right font-semibold ${item.type === 'revenue' ? 'text-sage-800' : 'text-coral'}`}>
                {item.amount > 0 ? `+$${item.amount.toLocaleString()}` : `-$${Math.abs(item.amount).toLocaleString()}`}
              </div>
              <div className={`text-right font-mono text-[10px] ${item.val.startsWith('+') ? 'text-sage-600' : 'text-coral'}`}>{item.val}</div>
            </div>
          ))}

          <div className="grid grid-cols-4 bg-sage-50/50 py-3 px-3 border border-sage-100 font-bold text-sm text-sage-900 rounded-lg">
            <div className="col-span-2">Net Estimated Income (Pre-tax)</div>
            <div className="text-right">$18,650</div>
            <div className="text-right font-mono text-xs text-sage-700">+11.2%</div>
          </div>
        </div>
      </div>
    );
  }

  // 3. REVENUE FORECAST (INTERACTIVE SLIDERS WOW)
  if (subView === 'revenue-forecast') {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in duration-500">
        
        {/* Sliders Panel */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 xl:col-span-1 h-fit">
          <div>
            <h3 className="text-lg font-display font-medium">Projection Simulator</h3>
            <p className="text-xs text-charcoal-muted">Adjust wellness parameters to model forecasted growth trajectories</p>
          </div>

          <div className="space-y-6 text-xs">
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-charcoal-light">Base Service Price Shift:</span>
                <span className="text-sage-700">+{priceSlider}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="50" 
                value={priceSlider}
                onChange={e => setPriceSlider(Number(e.target.value))}
                className="w-full h-1.5 bg-beige-100 rounded-lg appearance-none cursor-pointer accent-sage-600"
              />
              <span className="text-[10px] text-charcoal-muted leading-relaxed font-light">Simulates an increase in deep tissue and facial menu rates.</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span className="text-charcoal-light">Target Occupancy Rate Increase:</span>
                <span className="text-sage-700">+{occupancySlider}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                value={occupancySlider}
                onChange={e => setOccupancySlider(Number(e.target.value))}
                className="w-full h-1.5 bg-beige-100 rounded-lg appearance-none cursor-pointer accent-sage-600"
              />
              <span className="text-[10px] text-charcoal-muted leading-relaxed font-light">Simulates filling open morning and weekday slots.</span>
            </div>

            <div className="bg-beige-50/50 p-4 rounded-xl border border-beige-100 space-y-2">
              <span className="text-[10px] uppercase text-charcoal-muted tracking-wider font-semibold">Projected Monthly Gross Pacing</span>
              <div className="text-2xl font-bold text-sage-800">${Math.round(projectedMonthlyRev).toLocaleString()}</div>
              <div className="text-[10px] text-natural font-medium">
                +${Math.round(projectedMonthlyRev - baselineRev).toLocaleString()} above baseline ($32,000)
              </div>
            </div>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card xl:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-display font-medium">Growth Target Projections</h3>
            <p className="text-xs text-charcoal-muted font-light">Projected sales vs historical baselines (interactive simulation)</p>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C5A880" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#C5A880" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F4F1EA" />
                <XAxis dataKey="name" stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => `$${v}`} />
                <Area type="monotone" dataKey="baseline" name="Baseline Rev ($)" stroke="#7A827E" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                <Area type="monotone" dataKey="projected" name="Projected Rev ($)" stroke="#C5A880" strokeWidth={2} fillOpacity={1} fill="url(#colorProjected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    );
  }

  // 4. EXECUTIVE REPORTS
  if (subView === 'executive-reports') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Executive Board Room Files</h3>
          <p className="text-xs text-charcoal-muted">Compile and print official financial sheets for board audits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'EBITDA Margin Summary Q2', size: '2.4MB', format: 'PDF Document' },
            { title: 'Boutique Product Margin Sheet', size: '1.8MB', format: 'Excel Sheet' },
            { title: 'Employee Attendance & Shift Hours', size: '940KB', format: 'CSV Ledger' },
            { title: 'Facility Operating Cost Audit', size: '4.2MB', format: 'PDF Document' }
          ].map((report, idx) => (
            <div key={idx} className="p-4 border border-beige-100 rounded-xl flex items-center justify-between hover:border-sage-500 transition-all">
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-charcoal">{report.title}</h4>
                <p className="text-charcoal-muted font-light">{report.format} • Size: {report.size}</p>
              </div>
              <button 
                onClick={() => alert(`Export of ${report.title} simulated successfully.`)}
                className="px-3 py-1.5 bg-sage-50 text-sage-800 hover:bg-sage-600 hover:text-white rounded border border-sage-100 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. SYSTEM ANALYTICS (CLINIC TERMINAL)
  if (subView === 'system-analytics') {
    const logs = [
      'SECURE SYSTEM CONNECT: Database sync active (50ms latency)',
      'STATE RESTORE: Restored client-side Zustand store cache successfully',
      'API ROUTE SYNC: Mock Supabase client mapping initialized',
      'RFID CARD SYNC: Assigned active employee terminal tags',
      'METRICS ENGINE: Computed daily EBITDA gross pacing +12%'
    ];

    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Server Uptime & System Health</h3>
          <p className="text-xs text-charcoal-muted">Hardware health metrics and live application logs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center text-xs">
          <div className="p-4 border border-beige-100 rounded-xl bg-beige-50/20">
            <span className="text-charcoal-muted font-medium">Database Latency</span>
            <div className="text-2xl font-bold text-sage-700 mt-1">48ms</div>
            <span className="text-[10px] text-natural font-medium">Optimal health</span>
          </div>
          <div className="p-4 border border-beige-100 rounded-xl bg-beige-50/20">
            <span className="text-charcoal-muted font-medium">Cloud Sync Queue</span>
            <div className="text-2xl font-bold text-sage-700 mt-1">0 pending</div>
            <span className="text-[10px] text-natural font-medium">Fully cached</span>
          </div>
          <div className="p-4 border border-beige-100 rounded-xl bg-beige-50/20">
            <span className="text-charcoal-muted font-medium">Memory Utilization</span>
            <div className="text-2xl font-bold text-sage-700 mt-1">14.2 MB</div>
            <span className="text-[10px] text-charcoal-muted">SPA bundle clean</span>
          </div>
        </div>

        {/* Live logs terminal mockup */}
        <div className="space-y-2 text-xs">
          <h4 className="font-semibold text-charcoal-light uppercase tracking-wider">Live System Sync Stream</h4>
          <div className="bg-charcoal text-beige-100 p-4 rounded-xl font-mono space-y-1.5 overflow-x-auto select-none leading-relaxed">
            {logs.map((log, idx) => (
              <div key={idx} className="flex gap-2 items-start">
                <span className="text-gold font-bold">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
