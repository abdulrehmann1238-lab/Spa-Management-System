"use client";

import React, { useState } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  Check, CheckSquare, Plus, Trash2, ShieldAlert, Database, 
  MapPin, ShieldCheck, Cpu, RefreshCw, Barcode, HelpCircle, Layout
} from 'lucide-react';

interface ViewProps {
  subView: string;
}

export default function PropertyViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // Barcode Scanner State
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ name: string; sku: string; stock: number } | null>(null);

  // Backup state
  const [backupStatus, setBackupStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // New Receptionist Task
  const [newTaskInput, setNewTaskInput] = useState('');

  const triggerScan = () => {
    setScanning(true);
    setScanResult(null);
    setTimeout(() => {
      setScanning(false);
      setScanResult({
        name: 'Organic Cold-Pressed Almond Oil',
        sku: 'MO-ALM-5L',
        stock: 12
      });
    }, 2500);
  };

  const runBackup = () => {
    setBackupStatus('running');
    setTimeout(() => {
      setBackupStatus('done');
    }, 3000);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput) return;
    store.addTask(newTaskInput);
    setNewTaskInput('');
  };

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. OCCUPANCY & BEDS-ROOMS
  if (subView === 'occupancy' || subView === 'beds-rooms') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-display font-medium">Beds & Treatment Rooms Map</h3>
            <p className="text-xs text-charcoal-muted">Active occupancy state of hotel wellness rooms</p>
          </div>
          <span className="text-[10px] text-sage-800 bg-sage-50 border border-sage-100 px-3 py-1 rounded-full font-medium">Synced today</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[
            { name: 'Santal Suite', bed: 'Bed 101', therapist: 'Elena Rostova', client: 'Alexandra Vance', status: 'In Session', color: 'border-sage-300 bg-sage-50/20' },
            { name: 'Lotus Lounge', bed: 'Bed 102', therapist: 'Seraphina Thorne', client: 'Elena Rostova A', status: 'Confirmed', color: 'border-gold bg-beige-50/20' },
            { name: 'Jasmine suite', bed: 'Bed 104', therapist: 'Julian Mercer', client: 'Dorian Sterling', status: 'Confirmed', color: 'border-gold bg-beige-50/20' },
            { name: 'Bamboo Zen', bed: 'Bed 105', therapist: '—', client: '—', status: 'Available', color: 'border-beige-200 bg-white' },
            { name: 'Eucalyptus Room', bed: 'Bed 106', therapist: '—', client: '—', status: 'Available', color: 'border-beige-200 bg-white' }
          ].map((room, idx) => (
            <div key={idx} className={`p-4 rounded-xl border flex flex-col justify-between h-[120px] transition-all hover:scale-[1.02] ${room.color}`}>
              <div className="flex justify-between items-start text-xs">
                <div>
                  <h4 className="font-semibold text-charcoal font-display">{room.name}</h4>
                  <span className="text-[10px] text-charcoal-muted font-mono">{room.bed}</span>
                </div>
                <span className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase ${room.status === 'Available' ? 'bg-natural-light text-natural' : room.status === 'In Session' ? 'bg-sage-600 text-white' : 'bg-gold/10 text-gold'}`}>
                  {room.status}
                </span>
              </div>
              
              <div className="text-[11px] text-charcoal-muted">
                {room.status === 'Available' ? (
                  <span>Ready for sanitation prep</span>
                ) : (
                  <span>Guest: <strong className="font-medium text-charcoal">{room.client}</strong> with <strong className="font-medium text-charcoal">{room.therapist}</strong></span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. QR INVENTORY BARCODE SCANNER
  if (subView === 'qr-inventory') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Boutique QR & Barcode Scanner</h3>
          <p className="text-xs text-charcoal-muted font-light">Simulate scanning a product QR code for instant stock count lookup</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Scanning Box */}
          <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-beige-200 rounded-2xl bg-beige-50/30 text-center space-y-4">
            <div className="w-[220px] h-[160px] bg-charcoal rounded-xl relative overflow-hidden flex items-center justify-center">
              {scanning ? (
                <>
                  <Barcode className="h-16 w-16 text-sage-300 animate-pulse" />
                  {/* Laser line */}
                  <div className="absolute left-0 right-0 h-1 bg-coral top-1/2 -translate-y-1/2 animate-bounce" />
                </>
              ) : (
                <Barcode className="h-16 w-16 text-beige-200" />
              )}
            </div>

            {scanning ? (
              <button disabled className="px-4 py-2 bg-sage-50 text-sage-800 border border-sage-100 rounded-lg text-xs font-semibold cursor-wait flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Reading Laser Tags...</span>
              </button>
            ) : (
              <button 
                onClick={triggerScan}
                className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
              >
                <span>Trigger Laser Scanner</span>
              </button>
            )}
          </div>

          {/* Results Box */}
          <div className="space-y-4 text-xs font-light">
            <h4 className="font-semibold text-charcoal font-display text-sm">Product Detail Lookup</h4>
            {scanResult ? (
              <div className="p-4 bg-sage-50/50 border border-sage-100 rounded-xl space-y-2.5 animate-in slide-in-from-right duration-300">
                <div className="font-semibold text-charcoal text-base">{scanResult.name}</div>
                <div className="text-[10px] text-charcoal-muted font-mono">SKU: {scanResult.sku}</div>
                <div className="flex justify-between items-center text-xs">
                  <span>Current Stock Level:</span>
                  <span className="font-bold text-sage-800">{scanResult.stock} bottles left</span>
                </div>
                <span className="text-[10px] text-natural font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Product records synced. Stock healthy.</span>
                </span>
              </div>
            ) : (
              <p className="text-charcoal-muted italic">Awaiting laser barcode scanner signal. Click trigger scanner on the left to simulate.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 3. RECEPTIONIST WORKSPACE
  if (subView === 'receptionist-workspace') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
        
        {/* Left: Quick Tasks List (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-display font-medium">Daily Front Desk Handovers</h3>
              <p className="text-xs text-charcoal-muted font-light">Operational checkout procedures and receptionist tasks</p>
            </div>
          </div>

          <form onSubmit={handleAddTask} className="flex gap-2 text-xs">
            <input 
              type="text" 
              required
              placeholder="e.g. Sanitize steam room bench towels" 
              value={newTaskInput}
              onChange={e => setNewTaskInput(e.target.value)}
              className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
            />
            <button 
              type="submit"
              className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
            >
              Add Task
            </button>
          </form>

          <div className="divide-y divide-beige-100/60 text-xs">
            {store.receptionistTasks.map(task => (
              <div 
                key={task.id} 
                onClick={() => store.toggleTask(task.id)}
                className="py-3 flex items-center gap-3 cursor-pointer hover:bg-beige-50/20 px-2 rounded-lg transition-colors select-none"
              >
                <div className={`h-4.5 w-4.5 rounded border flex items-center justify-center flex-shrink-0 ${task.completed ? 'bg-sage-600 border-sage-600 text-white' : 'border-beige-300'}`}>
                  {task.completed && <Check className="h-3 w-3 stroke-[3px]" />}
                </div>
                <span className={`text-charcoal-light ${task.completed ? 'line-through text-charcoal-muted font-light' : 'font-medium'}`}>
                  {task.task}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Quick actions summary */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display">Front Desk Handovers</h4>
          <div className="space-y-4 text-xs font-light">
            <div className="p-3 bg-beige-50/50 border border-beige-100/50 rounded-xl space-y-1">
              <span className="font-semibold text-charcoal">Shift Balance Check:</span>
              <p className="text-[10px] text-charcoal-muted leading-relaxed">Ensure physical drawer balances matches the POS ledger ($240 cash float).</p>
            </div>
            <div className="p-3 bg-beige-50/50 border border-beige-100/50 rounded-xl space-y-1">
              <span className="font-semibold text-charcoal">Pre-Tea Lounge Stock:</span>
              <p className="text-[10px] text-charcoal-muted leading-relaxed">Boil chamomile herbal teas and arrange honey jars pre-shift.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. SYSTEM STATUS & BACKUP CENTER
  if (subView === 'system-status' || subView === 'backup-center') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Backup & Database Cloud Archive</h3>
          <p className="text-xs text-charcoal-muted">Compile database tables into encrypted offline zip records</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="p-6 border border-beige-100 rounded-2xl bg-beige-50/20 text-center space-y-4">
            <div className="h-12 w-12 bg-sage-50 text-sage-600 rounded-full flex items-center justify-center mx-auto">
              <Database className="h-6 w-6" />
            </div>
            
            {backupStatus === 'running' ? (
              <button disabled className="px-4 py-2 bg-sage-50 text-sage-800 border border-sage-100 rounded-lg text-xs font-semibold cursor-wait flex items-center gap-2 mx-auto">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Encrypting Tables...</span>
              </button>
            ) : (
              <button 
                onClick={runBackup}
                className="px-4 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold transition-all"
              >
                Trigger Encrypted Cloud Backup
              </button>
            )}
            
            {backupStatus === 'done' && (
              <div className="text-xs text-natural font-medium animate-pulse pt-1">
                ✓ Cloud Archive zip compiled (5.4MB encrypted pack sent to S3 AWS).
              </div>
            )}
          </div>

          <div className="space-y-4 text-xs font-light">
            <h4 className="font-semibold text-charcoal font-display text-sm">Archived Tables Records</h4>
            <div className="divide-y divide-beige-100">
              <div className="py-2.5 flex justify-between">
                <span>sanctuary-backup-20260618.zip</span>
                <span className="font-mono text-charcoal-muted">5.4MB • June 18</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span>sanctuary-backup-20260611.zip</span>
                <span className="font-mono text-charcoal-muted">5.2MB • June 11</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. BRANCH EXPANSION & MULTI-BRANCH PREVIEWS
  if (subView === 'branch-expansion' || subView === 'multi-branch') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Global Branch Matrix</h3>
          <p className="text-xs text-charcoal-muted">Comparative revenues across active and target expansion zones</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-light">
          {[
            { location: 'Manila Sanctuary (HQ)', rev: '$42,500/mo', status: 'Operational', color: 'border-sage-300' },
            { location: 'Kyoto Sanctuary Garden', rev: '$28,000/mo (Est)', status: 'In Construction (Q4)', color: 'border-gold' },
            { location: 'Beverly Hills Suite', rev: 'Pending Approval', status: 'Feasibility Study', color: 'border-beige-200' }
          ].map((branch, idx) => (
            <div key={idx} className={`p-4 border rounded-xl space-y-3 ${branch.color}`}>
              <div className="flex items-center gap-2 text-sage-800">
                <MapPin className="h-4 w-4" />
                <span className="font-semibold text-charcoal">{branch.location}</span>
              </div>
              <div className="space-y-1">
                <div className="text-[11px] text-charcoal-muted">Status: <strong className="font-semibold text-charcoal-light">{branch.status}</strong></div>
                <div className="text-sm font-bold text-sage-800">{branch.rev}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
