"use client";

import React, { useState } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  Send, Users, Mail, Percent, Sparkles, Plus, Trash2, 
  Check, Play, ArrowRight, ShieldCheck, HelpCircle, Bell
} from 'lucide-react';

interface ViewProps {
  subView: string;
}

export default function MarketingViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // New Campaign Form State
  const [newCampName, setNewCampName] = useState('');
  const [newCampMsg, setNewCampMsg] = useState('Hello {name}, enjoy 20% off all holistic services this month. Rejuvenate at The Sanctuary. Reply STOP to opt out.');
  const [newCampTarget, setNewCampTarget] = useState('All VIP Clients');

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName || !newCampMsg) return;
    store.addSMSCampaign({
      name: newCampName,
      message: newCampMsg,
      target: newCampTarget
    });
    setNewCampName('');
    setNewCampMsg('Hello {name}, enjoy 20% off all holistic services this month. Rejuvenate at The Sanctuary. Reply STOP to opt out.');
  };

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. MARKETING CENTER OVERVIEW
  if (subView === 'marketing') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Marketing Campaign Center</h3>
          <p className="text-xs text-charcoal-muted">Promotional automations and engagement tracking for client retention</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white p-5 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-charcoal-muted">Active SMS Subscribers</span>
            <div className="text-2xl font-bold text-sage-800 mt-1">1,450 clients</div>
            <span className="text-[10px] text-natural font-medium">92% consent rating</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-charcoal-muted">Avg. Campaign CTR</span>
            <div className="text-2xl font-bold text-sage-800 mt-1">24.2% Click-Through</div>
            <span className="text-[10px] text-natural font-medium">+4% above industry standard</span>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-charcoal-muted">Attributed Revenue</span>
            <div className="text-2xl font-bold text-sage-800 mt-1">$4,850 this month</div>
            <span className="text-[10px] text-charcoal-muted">Calculated via redeemable codes</span>
          </div>
        </div>

        {/* Marketing campaign journey preview */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
          <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display">Automated Guest Journey Triggers</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {[
              { title: 'New Intake Greeting', trigger: 'Consent signed', action: 'Send welcome SMS + booking link' },
              { title: '60-Day Inactive Drift', trigger: '60 days since last visit', action: 'Send re-balance promotion + free facial offer' },
              { title: 'Birthday Surprise', trigger: '7 days before birthday', action: 'Offer complementary aromatherapy room upgrade' }
            ].map((journey, idx) => (
              <div key={idx} className="p-4 border border-beige-100 rounded-xl space-y-2 hover:border-sage-500 transition-all">
                <span className="font-semibold text-charcoal">{journey.title}</span>
                <div className="text-[10px] text-charcoal-light">
                  <strong>When:</strong> {journey.trigger}
                </div>
                <div className="text-[11px] text-sage-800 font-medium">
                  {journey.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. SMS CAMPAIGNS (LIVE BUILDER WOW)
  if (subView === 'sms-campaigns') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        
        {/* Left: Campaign creator (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 h-fit">
          <div>
            <h3 className="text-lg font-display font-medium">Compose SMS Broadcast</h3>
            <p className="text-xs text-charcoal-muted">Dispatch custom text sequences to segmented user listings</p>
          </div>

          <form onSubmit={handleCreateCampaign} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Campaign Identifier Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Summer Solstice Retreat Special" 
                value={newCampName}
                onChange={e => setNewCampName(e.target.value)}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Target Segment Group</label>
              <select 
                value={newCampTarget}
                onChange={e => setNewCampTarget(e.target.value)}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
              >
                <option value="All VIP Clients">All VIP Clients</option>
                <option value="Members Only">Members Only</option>
                <option value="All CRM Listing">All CRM Listing (1,450 contacts)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">SMS Message Text</label>
              <textarea 
                rows={4} 
                required
                value={newCampMsg}
                onChange={e => setNewCampMsg(e.target.value)}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal font-sans"
              />
              <span className="text-[10px] text-charcoal-muted italic">Variables support: {'{name}'} maps recipient name automatically.</span>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Save Campaign Draft</span>
            </button>
          </form>
        </div>

        {/* Right: Campaigns logs and dispatchers (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-display font-medium">Campaign Dispatch Ledger</h3>
            <p className="text-xs text-charcoal-muted">Review saved templates and dispatch simulated SMS blasts</p>
          </div>

          <div className="divide-y divide-beige-100/60 overflow-y-auto max-h-[350px]">
            {store.smsCampaigns.map((camp) => (
              <div key={camp.id} className="py-4 first:pt-0 last:pb-0 text-xs space-y-2.5">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold text-charcoal">{camp.name}</h4>
                    <p className="text-[10px] text-charcoal-muted">Target: {camp.target} • {camp.date}</p>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider ${camp.status === 'Sent' ? 'bg-sage-50 text-sage-800 border border-sage-100' : 'bg-beige-100 text-charcoal-muted'}`}>
                    {camp.status}
                  </span>
                </div>
                
                <p className="bg-beige-50/50 p-2.5 rounded-lg text-charcoal-light leading-relaxed font-light italic border border-beige-100/30">
                  {camp.message}
                </p>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-charcoal-muted">
                    {camp.status === 'Sent' ? `Dispatched to ${camp.sentCount} recipients` : 'Waiting for dispatcher triggers'}
                  </span>
                  
                  {camp.status === 'Draft' && (
                    <button 
                      onClick={() => store.sendSMSCampaign(camp.id)}
                      className="px-3 py-1.5 bg-sage-50 text-sage-700 hover:bg-sage-600 hover:text-white rounded border border-sage-100 transition-all font-semibold flex items-center gap-1"
                    >
                      <Play className="h-3 w-3" />
                      <span>Dispatch Broadcast</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // 3. BIRTHDAY CAMPAIGNS
  if (subView === 'birthday-campaigns') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Automated Birthday Surprises</h3>
            <p className="text-xs text-charcoal-muted">Trigger rules for complimentary guest birthday vouchers</p>
          </div>
          <span className="text-xs text-sage-700 bg-sage-50 border border-sage-100 px-3 py-1 rounded-full font-semibold">Active automation</span>
        </div>

        <div className="space-y-4 text-xs font-light">
          <div className="p-4 border border-beige-100 rounded-xl space-y-3 bg-beige-50/20">
            <h4 className="font-semibold text-charcoal font-display text-sm">Active Ruleset Blueprint</h4>
            <ul className="space-y-2 list-disc list-inside text-charcoal-muted leading-relaxed">
              <li>Scan CRM records daily at 08:00 AM.</li>
              <li>Filter entries matching: (Birthday = Today + 7 days) AND (Loyalty Score &gt; 50).</li>
              <li>Generate custom single-use code: <strong>{`BDAY-{name}-15`}</strong> (Value: 15% off).</li>
              <li>SMS welcome blast is dispatched immediately.</li>
            </ul>
          </div>
          
          <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display pt-2">Upcoming Birthdays This Week</h4>
          <div className="divide-y divide-beige-100/50">
            {[
              { name: 'Arthur Pendelton', date: 'June 22', status: 'Queued', code: 'BDAY-ART-15' },
              { name: 'Seraphina Thorne', date: 'June 24', status: 'Queued', code: 'BDAY-SER-15' },
              { name: 'Elena Rostova', date: 'June 26', status: 'Queued', code: 'BDAY-ELE-15' }
            ].map((bday, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-charcoal">{bday.name}</span>
                  <span className="text-[10px] text-charcoal-muted ml-2">Birthday: {bday.date}</span>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <span className="font-mono text-sage-800 text-[10px] font-semibold bg-sage-50 px-2 py-0.5 border border-sage-100 rounded">{bday.code}</span>
                  <span className="text-[10px] text-natural font-medium">{bday.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. ACTIVITY CENTER
  if (subView === 'activity-center' || subView === 'notifications') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Notification Center & Audits</h3>
          <p className="text-xs text-charcoal-muted">Consolidated alerts, system warnings, and notifications</p>
        </div>

        <div className="divide-y divide-beige-100">
          {store.notifications.map((notif) => {
            let iconClass = "bg-beige-100 text-charcoal";
            if (notif.type === 'alert') iconClass = "bg-coral-light text-coral border border-coral/10";
            if (notif.type === 'success') iconClass = "bg-sage-50 text-sage-700 border border-sage-100";
            
            return (
              <div key={notif.id} className="py-4 flex items-start justify-between first:pt-0 last:pb-0 gap-4">
                <div className="flex gap-3">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconClass}`}>
                    <Bell className="h-4 w-4" />
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-semibold text-charcoal">{notif.title}</h4>
                    <p className="text-charcoal-muted leading-relaxed font-light">{notif.desc}</p>
                  </div>
                </div>
                
                <span className="text-[10px] font-mono text-charcoal-muted whitespace-nowrap">{notif.date}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return null;
}
