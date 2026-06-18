"use client";

import React, { useState } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  ShieldCheck, HelpCircle, User, Award, Plus, Trash2, Check,
  Sparkles, RefreshCw, Send, Shield, Info, Download
} from 'lucide-react';

interface ViewProps {
  subView: string;
}

export default function AdminViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // AI Insights State
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { sender: 'ai', text: 'Good day! I am Sanctuary AI, your wellness operations intelligence assistant. How can I help optimize your spa today?' }
  ]);
  const [typing, setTyping] = useState(false);

  const triggerAIQuery = (query: string) => {
    setMessages(prev => [...prev, { sender: 'user', text: query }]);
    setTyping(true);
    
    setTimeout(() => {
      setTyping(false);
      let responseText = '';
      if (query.includes('occupancy')) {
        responseText = 'Based on booking logs for next Tuesday, your occupancy rate is pacing at 52% (slightly below your 70% baseline). Recommendation: Trigger an automated SMS blast to guests inactive for 45+ days, offering a complimentary 15-minute peptide facial upgrade for any booking between 9:00 AM and 1:00 PM next Tuesday. Historically, this campaign triggers a 18% lift in midweek occupancy.';
      } else if (query.includes('variance') || query.includes('EBITDA')) {
        responseText = 'Q1 EBITDA was $42,000, representing a positive variance of +6.4% over your initial business projection. This was primarily driven by a 14% lift in Sandalwood oil product retail sales and a reduction in linen wastage costs.';
      } else {
        responseText = 'The Deep Tissue Harmony ($180) and Luminous Facial ($130) represent your highest margin services at 82% and 78% margins respectively. I recommend grouping them as a "Solstice Revive" package to maximize transaction size.';
      }
      setMessages(prev => [...prev, { sender: 'ai', text: responseText }]);
    }, 2000);
  };

  // RBAC Roles state
  const [roles, setRoles] = useState([
    { role: 'Manager', dashboard: true, pos: true, financial: true, crm: true },
    { role: 'Receptionist', dashboard: true, pos: true, financial: false, crm: true },
    { role: 'Therapist', dashboard: false, pos: false, financial: false, crm: false }
  ]);

  // Settings states
  const [currency, setCurrency] = useState('USD');
  const [taxRate, setTaxRate] = useState('12');

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. AUDIT LOGS
  if (subView === 'audit-logs') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Immutable Security Audit Ledger</h3>
            <p className="text-xs text-charcoal-muted">System access logs, user changes, and API actions</p>
          </div>
          <button 
            onClick={() => alert('CSV Security log export simulated.')}
            className="px-3 py-1.5 bg-sage-50 text-sage-800 border border-sage-100 hover:bg-sage-600 hover:text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
          >
            <Download className="h-3.5 w-3.5" />
            <span>CSV Export</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold font-display">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Staff Operator</th>
                <th className="p-3">Secure Action</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Terminal IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100 font-light">
              {store.auditLogs.map(log => (
                <tr key={log.id} className="hover:bg-beige-50/20">
                  <td className="p-3 font-mono text-charcoal-muted">{log.timestamp}</td>
                  <td className="p-3 font-medium text-charcoal">{log.user}</td>
                  <td className="p-3 font-semibold text-sage-800 uppercase text-[9px] tracking-wider">{log.action}</td>
                  <td className="p-3 text-charcoal-light">{log.details}</td>
                  <td className="p-3 text-right font-mono text-charcoal-muted">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 2. USER MANAGEMENT & ROLE PERMISSIONS
  if (subView === 'user-management' || subView === 'permissions') {
    const handleTogglePermission = (roleIndex: number, field: 'dashboard' | 'pos' | 'financial' | 'crm') => {
      const updated = [...roles];
      updated[roleIndex][field] = !updated[roleIndex][field];
      setRoles(updated);
    };

    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Role-Based Access Control (RBAC)</h3>
          <p className="text-xs text-charcoal-muted font-light">Configure view permission privileges per employee role group</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                <th className="p-3">Role Group</th>
                <th className="p-3 text-center">Dashboard Summary</th>
                <th className="p-3 text-center">POS Terminal Charge</th>
                <th className="p-3 text-center">EBITDA & Profit Sheets</th>
                <th className="p-3 text-center">Guest CRM Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {roles.map((roleObj, idx) => (
                <tr key={idx} className="hover:bg-beige-50/20">
                  <td className="p-3 font-semibold text-charcoal flex items-center gap-2">
                    <Shield className="h-4 w-4 text-sage-600" />
                    <span>{roleObj.role}</span>
                  </td>
                  
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={roleObj.dashboard} 
                      onChange={() => handleTogglePermission(idx, 'dashboard')}
                      className="h-4 w-4 accent-sage-600 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={roleObj.pos} 
                      onChange={() => handleTogglePermission(idx, 'pos')}
                      className="h-4 w-4 accent-sage-600 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={roleObj.financial} 
                      onChange={() => handleTogglePermission(idx, 'financial')}
                      className="h-4 w-4 accent-sage-600 cursor-pointer"
                    />
                  </td>
                  <td className="p-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={roleObj.crm} 
                      onChange={() => handleTogglePermission(idx, 'crm')}
                      className="h-4 w-4 accent-sage-600 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 3. AI INSIGHTS CHAT DEMO
  if (subView === 'ai-insights') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center border border-gold/30">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-lg font-display font-medium">Sanctuary AI Operations Assistant</h3>
              <p className="text-xs text-charcoal-muted">NLP predictive model sync</p>
            </div>
          </div>
        </div>

        {/* Chat display box */}
        <div className="border border-beige-100 rounded-xl bg-beige-50/20 p-4 h-[280px] overflow-y-auto space-y-4 text-xs font-light">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-xl max-w-[80%] leading-relaxed border ${m.sender === 'user' ? 'bg-sage-600 text-white border-sage-700' : 'bg-white text-charcoal border-beige-100 shadow-sm'}`}>
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-xl border border-beige-100 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-sage-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* NLP suggestion cards */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-charcoal-light">Optimized NLP Prompts Query Suggestions:</span>
          <div className="flex flex-wrap gap-2">
            {[
              'How do I increase occupancy next Tuesday?',
              'What was the EBITDA variance in Q1?',
              'Identify high profit margin services.'
            ].map((q, idx) => (
              <button 
                key={idx}
                onClick={() => triggerAIQuery(q)}
                className="px-3.5 py-2 bg-beige-100 hover:bg-beige-200 text-charcoal text-xs rounded-lg font-medium transition-all"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 4. HELP CENTER & DOCUMENTATION
  if (subView === 'help-center' || subView === 'documentation') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Front Desk Documentation Wiki</h3>
          <p className="text-xs text-charcoal-muted">Employee standard operating procedures (SOP) manuals</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed font-light">
          {[
            { title: 'POS Checkout Protocols', doc: 'Review split payment balances before triggering credit card authorization keys. Print receipt copies automatically.' },
            { title: 'Therapist Shift Schedule Adjustments', doc: 'Modify schedules at least 24 hours in advance to prevent double-booking room overrides.' },
            { title: 'Liability Release Form Filing', doc: 'Always request digital signatures on the liability consent iPad prior to therapeutic body wraps.' }
          ].map((wiki, idx) => (
            <div key={idx} className="p-4 border border-beige-100 rounded-xl space-y-2">
              <h4 className="font-semibold text-charcoal font-display">{wiki.title}</h4>
              <p className="text-charcoal-muted">{wiki.doc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. USER PROFILE & SETTINGS
  if (subView === 'user-profile' || subView === 'settings' || subView === 'account-settings') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">System Configuration</h3>
          <p className="text-xs text-charcoal-muted font-light">Base settings for pricing currencies, taxes, and system layouts</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-light">Display Pricing Currency</label>
              <select 
                value={currency} 
                onChange={e => setCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
              >
                <option value="USD">USD ($) Dollar</option>
                <option value="EUR">EUR (€) Euro</option>
                <option value="PHP">PHP (₱) Peso</option>
              </select>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-light">Applied VAT Tax Rate (%)</label>
              <input 
                type="number" 
                value={taxRate} 
                onChange={e => setTaxRate(e.target.value)}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
              />
            </div>
          </div>

          <div className="p-4 border border-beige-100 bg-beige-50/20 rounded-xl flex items-start gap-3 h-fit">
            <Info className="h-5 w-5 text-gold flex-shrink-0" />
            <div className="space-y-1 font-light leading-relaxed">
              <span className="font-semibold text-charcoal">Global Configurations</span>
              <p className="text-[10px] text-charcoal-muted">Tax rate adjustments will update POS calculations immediately. Local values are stored locally.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
