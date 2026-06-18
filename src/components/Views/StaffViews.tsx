"use client";

import React, { useState } from 'react';
import { useSpaStore, Therapist } from '@/store/spaStore';
import { 
  Star, Award, TrendingUp, Heart, Calendar, DollarSign, 
  Clock, ClipboardList, ShieldAlert, CheckCircle2, ChevronRight,
  Download, FileText, UserCheck, RefreshCw, User
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface ViewProps {
  subView: string;
}

export default function StaffViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // Payroll inputs
  const [selectedPayTherapistId, setSelectedPayTherapistId] = useState(store.therapists[0]?.id || 't-1');
  const [payrollForm, setPayrollForm] = useState({
    overtimeHours: '10',
    allowance: '300',
    deductions: '120',
    taxRate: '12' // percentage
  });

  const payTherapist = store.therapists.find(t => t.id === selectedPayTherapistId) || store.therapists[0];

  // Recalculate Payroll Variables in real-time
  const baseSalary = payTherapist?.baseSalary || 0;
  const commRate = payTherapist?.commissionRate || 15;
  
  // Calculate commission total: mock $5,000 service revenue achieved this month
  const serviceRevenue = 5400;
  const commissionEarned = serviceRevenue * (commRate / 100);
  
  const otHours = Number(payrollForm.overtimeHours) || 0;
  const otRate = payTherapist?.hourlyOvertimeRate || 35;
  const overtimePay = otHours * otRate;
  
  const allowance = Number(payrollForm.allowance) || 0;
  const grossPay = baseSalary + commissionEarned + overtimePay + allowance;
  
  const deductionsVal = Number(payrollForm.deductions) || 0;
  const taxRate = Number(payrollForm.taxRate) || 0;
  const taxVal = grossPay * (taxRate / 100);
  const totalDeductions = deductionsVal + taxVal;
  
  const netPay = grossPay - totalDeductions;

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. THERAPISTS VIEW
  if (subView === 'therapists') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Therapeutic Specialist Roster</h3>
            <p className="text-xs text-charcoal-muted">Active certifications, shift assignments, and real-time status</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {store.therapists.map(t => {
            let statusBadge = "bg-beige-100 text-charcoal";
            if (t.status === 'Available') statusBadge = "bg-natural-light text-natural border border-natural/20";
            if (t.status === 'In Session') statusBadge = "bg-sage-100 text-sage-800 border border-sage-200/50";
            
            return (
              <div key={t.id} className="bg-white p-5 rounded-2xl border border-beige-100/50 shadow-card flex flex-col justify-between hover:shadow-premium-hover transition-all duration-300">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover border border-beige-100" />
                    <div>
                      <h4 className="font-display font-semibold text-charcoal text-xs">{t.name}</h4>
                      <p className="text-[10px] text-charcoal-muted">{t.role}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${statusBadge}`}>
                      {t.status}
                    </span>
                    <div className="flex items-center gap-0.5 text-gold font-semibold">
                      <Star className="h-3.5 w-3.5 fill-gold stroke-none" />
                      <span>{t.rating}</span>
                    </div>
                  </div>

                  <div className="border-t border-beige-100 pt-3 space-y-1.5 text-[11px] text-charcoal-muted">
                    <div className="flex justify-between">
                      <span>Occupancy this week:</span>
                      <span className="font-semibold text-charcoal">{t.kpis.occupancyRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Client Retention:</span>
                      <span className="font-semibold text-charcoal">{t.kpis.retentionRate}%</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-beige-100">
                  <button 
                    onClick={() => {
                      store.selectTherapist(t.id);
                      store.setView('therapist-profile');
                    }}
                    className="flex-1 py-1.5 bg-beige-100 hover:bg-beige-200 text-charcoal rounded text-[10px] transition-all font-medium"
                  >
                    View Schedule
                  </button>
                  <button 
                    onClick={() => {
                      store.selectTherapist(t.id);
                      store.setView('therapist-kpi');
                    }}
                    className="py-1.5 px-2 bg-sage-50 text-sage-800 hover:bg-sage-600 hover:text-white rounded border border-sage-100 text-[10px] transition-all"
                  >
                    KPIs
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // 2. THERAPIST PROFILE DETAIL
  if (subView === 'therapist-profile') {
    const t = store.therapists.find(th => th.id === store.selectedTherapistId) || store.therapists[0];
    
    if (!t) return <div>Therapist not found</div>;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
        {/* Left: General Dossier */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 lg:col-span-1 h-fit">
          <div className="text-center space-y-3">
            <img src={t.avatar} alt={t.name} className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-sage-100 shadow-premium" />
            <div>
              <h3 className="text-lg font-display font-medium">{t.name}</h3>
              <p className="text-xs text-charcoal-muted">{t.role}</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className="text-[10px] bg-sage-50 text-sage-800 border border-sage-100 px-3 py-1 rounded-full font-medium">
                {t.status}
              </span>
              <span className="text-[10px] bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full flex items-center gap-1 font-semibold">
                <Star className="h-3 w-3 fill-gold stroke-none" />
                <span>{t.rating}</span>
              </span>
            </div>
          </div>

          <div className="border-t border-beige-100 pt-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Commission Level</span>
              <span className="font-semibold text-charcoal">{t.commissionRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Base Salary Allocation</span>
              <span className="font-semibold text-charcoal">${t.baseSalary.toLocaleString()}/mo</span>
            </div>
            <div className="space-y-1.5 pt-1.5">
              <span className="text-charcoal-muted font-medium">Acquired Professional Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                {t.achievements.map((a, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-beige-100 text-charcoal rounded text-[10px] font-medium border border-beige-200/50">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Daily Schedules & Assigned Rooms */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Shift Allocation Sheet</h3>
            <p className="text-xs text-charcoal-muted">Assigned rooms and guest slots for today</p>
          </div>

          <div className="space-y-3">
            {store.appointments.filter(a => a.therapistId === t.id).map(app => (
              <div key={app.id} className="p-4 border border-beige-100 hover:border-sage-500 rounded-xl flex items-center justify-between text-xs transition-all duration-300">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-charcoal">{app.clientName}</span>
                    <span className="text-[9px] text-charcoal-muted">• {app.bedId} ({app.roomName})</span>
                  </div>
                  <p className="text-charcoal-muted font-light">{app.service} ({app.duration} mins)</p>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-mono text-charcoal-light font-semibold">{app.time}</div>
                  <span className="text-[10px] text-sage-800 bg-sage-50 border border-sage-100 px-2 py-0.5 rounded font-medium">
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 3. THERAPIST KPI DASHBOARD
  if (subView === 'therapist-kpi') {
    const kpiData = store.therapists.map(th => ({
      name: th.name.split(' ')[0],
      retention: th.kpis.retentionRate,
      occupancy: th.kpis.occupancyRate,
      sales: th.kpis.salesTargetPct
    }));

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Therapist Leaderboards & Performance KPI</h3>
          <p className="text-xs text-charcoal-muted">Comparative data on client retention, occupancy rates, and sales target achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chart */}
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card lg:col-span-2 space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">KPI Comparative Metrics (%)</h4>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={kpiData}>
                  <XAxis dataKey="name" stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#7A827E" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderColor: '#E6E1D8',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="retention" name="Client Retention (%)" fill="#3C5A4B" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="occupancy" name="Room Occupancy (%)" fill="#C5A880" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="sales" name="Sales Target (%)" fill="#75A083" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Leaderboard panel */}
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Top Specialist Rankings</h4>
            <div className="divide-y divide-beige-100">
              {store.therapists.map((th, rank) => (
                <div key={th.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-mono text-charcoal-muted w-4">#{rank + 1}</span>
                    <img src={th.avatar} alt={th.name} className="h-8 w-8 rounded-full object-cover border border-beige-100" />
                    <div>
                      <div className="font-semibold text-xs text-charcoal">{th.name}</div>
                      <div className="text-[9px] text-charcoal-muted">{th.role}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-sage-800">{th.kpis.avgSatisfaction} ★</div>
                    <span className="text-[9px] text-charcoal-muted">{th.kpis.retentionRate}% Retain</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. ATTENDANCE VIEW
  if (subView === 'attendance') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Active Shift Roster</h3>
            <p className="text-xs text-charcoal-muted">Punch times, shift hours, and weekly attendance logs</p>
          </div>
          <span className="text-[10px] text-sage-600 bg-sage-50 border border-sage-100 px-3 py-1 rounded-full font-medium">All terminals synced</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                <th className="p-3">Therapist</th>
                <th className="p-3">Scheduled Shift</th>
                <th className="p-3">Clock In</th>
                <th className="p-3">Clock Out</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {store.therapists.map(th => {
                let badgeClass = "bg-beige-100 text-charcoal-muted";
                let clockIn = "08:52 AM";
                let clockOut = "—";
                
                if (th.status === 'Available' || th.status === 'In Session') {
                  badgeClass = "bg-sage-50 text-sage-800 border border-sage-100";
                } else {
                  clockIn = "—";
                }
                
                return (
                  <tr key={th.id} className="hover:bg-beige-50/20">
                    <td className="p-3 flex items-center gap-3">
                      <img src={th.avatar} alt={th.name} className="h-8 w-8 rounded-full object-cover border border-beige-100" />
                      <div>
                        <div className="font-semibold text-charcoal">{th.name}</div>
                        <div className="text-[10px] text-charcoal-muted">{th.role.split(' ')[0]}</div>
                      </div>
                    </td>
                    <td className="p-3 text-charcoal-light">09:00 AM - 06:00 PM</td>
                    <td className="p-3 font-mono font-semibold text-charcoal">{clockIn}</td>
                    <td className="p-3 font-mono text-charcoal-muted">{clockOut}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${badgeClass}`}>
                        {th.status === 'Off-Duty' ? 'Off-Duty' : 'Active'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button className="px-2 py-1 bg-beige-100 hover:bg-beige-200 text-charcoal rounded text-[10px] font-medium transition-all">
                        Adjust Shift
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 5. PAYROLL SIMULATION
  if (subView === 'payroll') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        
        {/* Left: Payroll Simulator Panel (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Payroll Simulation Engine</h3>
            <p className="text-xs text-charcoal-muted">Adjust shift metrics to preview base pay, overtime, and tax breakdowns</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-light">Select Therapist</label>
              <select
                value={selectedPayTherapistId}
                onChange={e => setSelectedPayTherapistId(e.target.value)}
                className="w-full text-xs p-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
              >
                {store.therapists.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.role.split(' ')[0]})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Overtime Hours Worked</label>
                <input 
                  type="number"
                  value={payrollForm.overtimeHours}
                  onChange={e => setPayrollForm(prev => ({ ...prev, overtimeHours: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Monthly Allowance ($)</label>
                <input 
                  type="number"
                  value={payrollForm.allowance}
                  onChange={e => setPayrollForm(prev => ({ ...prev, allowance: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">General Deductions ($)</label>
                <input 
                  type="number"
                  value={payrollForm.deductions}
                  onChange={e => setPayrollForm(prev => ({ ...prev, deductions: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Simulated Income Tax Rate (%)</label>
                <input 
                  type="number"
                  value={payrollForm.taxRate}
                  onChange={e => setPayrollForm(prev => ({ ...prev, taxRate: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: Payslip Preview (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card flex flex-col justify-between h-fit space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-medium">Payslip Mockup</h3>
            <button 
              onClick={() => window.print()}
              className="text-xs text-sage-700 hover:underline flex items-center gap-1 font-semibold"
            >
              <Download className="h-3 w-3" />
              <span>Export PDF</span>
            </button>
          </div>

          <div className="border border-dashed border-beige-200 p-4 rounded-xl text-xs space-y-3 font-mono">
            <div className="text-center border-b border-beige-100 pb-2">
              <div className="font-bold text-sm tracking-wide text-charcoal">THE SANCTUARY WELLNESS</div>
              <div className="text-[10px] text-charcoal-muted">Monthly Payslip Preview</div>
            </div>
            
            <div className="space-y-0.5 text-[10px]">
              <div>Employee: <strong>{payTherapist?.name}</strong></div>
              <div>Role: {payTherapist?.role}</div>
              <div>Period: June 2026</div>
            </div>

            <div className="border-t border-beige-100 pt-2 space-y-1.5">
              <div className="flex justify-between">
                <span>Base Salary:</span>
                <span>${baseSalary.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Commission ({commRate}%):</span>
                <span>${commissionEarned.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Overtime ({otHours} hrs):</span>
                <span>${overtimePay.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Allowances:</span>
                <span>${allowance.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-beige-100 pt-1 font-semibold text-charcoal">
                <span>Gross Earnings:</span>
                <span>${grossPay.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-beige-100 pt-2 space-y-1.5">
              <div className="flex justify-between text-coral">
                <span>Tax Withheld ({taxRate}%):</span>
                <span>-${taxVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-coral">
                <span>Deductions (Insurance/Other):</span>
                <span>-${deductionsVal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-beige-100 pt-1 font-semibold text-charcoal">
                <span>Total Deductions:</span>
                <span>-${totalDeductions.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-dashed border-beige-200 pt-2 font-bold text-sm text-sage-800">
              <span>ESTIMATED NET PAY:</span>
              <span>${netPay.toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return null;
}
