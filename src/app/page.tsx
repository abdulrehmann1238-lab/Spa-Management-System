"use client";

import React, { useState, useEffect } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Search, Bell, Sparkles, User, LogOut, ChevronDown, ChevronRight,
  Activity, Calendar, CreditCard, Users, Settings, Briefcase, Archive,
  ShieldCheck, Layout, MapPin, ListFilter, ClipboardList
} from 'lucide-react';

// Sub-views bundles imports
import DashboardView from '@/components/Views/DashboardView';
import OperationsViews from '@/components/Views/OperationsViews';
import StaffViews from '@/components/Views/StaffViews';
import BackOfficeViews from '@/components/Views/BackOfficeViews';
import FinancialViews from '@/components/Views/FinancialViews';
import MarketingViews from '@/components/Views/MarketingViews';
import GuestViews from '@/components/Views/GuestViews';
import PropertyViews from '@/components/Views/PropertyViews';
import AdminViews from '@/components/Views/AdminViews';
import LuxuryLoader from '@/components/Loader/LuxuryLoader';

// Group structures for the 50 views
const navigationGroups = [
  {
    name: 'Core Operations',
    icon: ClipboardList,
    items: [
      { id: 'dashboard', label: 'Overview Dashboard' },
      { id: 'appointments', label: 'Appointments Queue' },
      { id: 'calendar', label: 'Scheduler Grid' },
      { id: 'pos', label: 'POS Checkout Terminal' },
      { id: 'crm', label: 'CRM Guest Database' },
      { id: 'client-profile', label: 'Client Profiles Dossiers' },
      { id: 'memberships', label: 'VIP Club Memberships' },
      { id: 'packages', label: 'Wellness Packages' },
      { id: 'vouchers', label: 'Voucher Center Credit' }
    ]
  },
  {
    name: 'Specialist Staff',
    icon: Users,
    items: [
      { id: 'therapists', label: 'Therapists Roster' },
      { id: 'therapist-profile', label: 'Therapist Shift Logs' },
      { id: 'therapist-kpi', label: 'KPI Performance Grid' },
      { id: 'attendance', label: 'Shift Attendance' },
      { id: 'payroll', label: 'Payroll Simulation' }
    ]
  },
  {
    name: 'Logistics & Stock',
    icon: Archive,
    items: [
      { id: 'inventory', label: 'Stock Valuation Inventory' },
      { id: 'inventory-analytics', label: 'Stock Cost Valuations' },
      { id: 'suppliers', label: 'Verified Suppliers' },
      { id: 'expenses', label: 'Operating Costs Expenses' }
    ]
  },
  {
    name: 'Reporting & Ledger',
    icon: Briefcase,
    items: [
      { id: 'financial-reports', label: 'EBITDA Charts' },
      { id: 'profit-loss', label: 'Profit & Loss Sheets' },
      { id: 'revenue-forecast', label: 'Interactive Projections' },
      { id: 'executive-reports', label: 'Executive Board Reports' },
      { id: 'system-analytics', label: 'Server Latency Analytics' }
    ]
  },
  {
    name: 'Marketing Campaigns',
    icon: Sparkles,
    items: [
      { id: 'marketing', label: 'Marketing Center' },
      { id: 'sms-campaigns', label: 'SMS Blast Broadcast' },
      { id: 'birthday-campaigns', label: 'Birthday Vouchers Automations' },
      { id: 'activity-center', label: 'Activity Center Logs' },
      { id: 'notifications', label: 'System Alert Archives' }
    ]
  },
  {
    name: 'Guest Digital Assets',
    icon: User,
    items: [
      { id: 'online-booking', label: 'Web Booking Widget' },
      { id: 'mobile-preview', label: 'Mobile Guest App' },
      { id: 'consent-forms', label: 'Intake Consent Signature' },
      { id: 'session-tracking', label: 'SOAP Session Notes' }
    ]
  },
  {
    name: 'Facility Property',
    icon: Layout,
    items: [
      { id: 'occupancy', label: 'Bed Utilization' },
      { id: 'beds-rooms', label: 'Room Layout Map' },
      { id: 'qr-inventory', label: 'Laser Barcode Scanner' },
      { id: 'system-status', label: 'System Uptime Monitor' },
      { id: 'backup-center', label: 'Encrypted Cloud Backups' },
      { id: 'receptionist-workspace', label: 'Receptionist Checklist' },
      { id: 'branch-expansion', label: 'Branch Mapping Matrix' },
      { id: 'multi-branch', label: 'Expansion Site Feasibility' }
    ]
  },
  {
    name: 'Admin Settings',
    icon: Settings,
    items: [
      { id: 'audit-logs', label: 'Security Audit logs' },
      { id: 'user-management', label: 'User Roles Roster' },
      { id: 'permissions', label: 'RBAC Permission Matrix' },
      { id: 'settings', label: 'System Configurations' },
      { id: 'ai-insights', label: 'Sanctuary AI Chatbot' },
      { id: 'help-center', label: 'SOP Documentation Wiki' },
      { id: 'documentation', label: 'SOP Handbooks' },
      { id: 'user-profile', label: 'Admin profile settings' },
      { id: 'account-settings', label: 'Profile Configurations' }
    ]
  }
];

// Flat list for Search functionality
const allPages = navigationGroups.flatMap(g => g.items.map(item => ({ ...item, group: g.name })));

export default function RootPage() {
  const [loading, setLoading] = useState(true);
  const { currentView, setView, notifications } = useSpaStore();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openGroup, setOpenGroup] = useState<string | null>('Core Operations');
  
  // Search bar dropdown states
  const [searchVal, setSearchVal] = useState('');
  const [searchDropdown, setSearchDropdown] = useState(false);
  
  // Notification menu
  const [notifDropdown, setNotifDropdown] = useState(false);

  // Quick navigation page search filtering
  const filteredSearch = allPages.filter(p => 
    p.label.toLowerCase().includes(searchVal.toLowerCase()) || 
    p.id.toLowerCase().includes(searchVal.toLowerCase())
  );

  const handleSelectView = (viewId: string) => {
    setView(viewId);
    setSearchVal('');
    setSearchDropdown(false);
  };

  // Auto layout spacing fixes
  const renderActiveView = () => {
    if (currentView === 'dashboard') return <DashboardView />;
    
    // Core Operations
    if (['appointments', 'calendar', 'pos', 'crm', 'client-profile', 'memberships', 'packages', 'vouchers'].includes(currentView)) {
      return <OperationsViews subView={currentView} />;
    }
    
    // Specialist Staff
    if (['therapists', 'therapist-profile', 'therapist-kpi', 'attendance', 'payroll'].includes(currentView)) {
      return <StaffViews subView={currentView} />;
    }

    // Logistics & Stock
    if (['inventory', 'inventory-analytics', 'suppliers', 'expenses'].includes(currentView)) {
      return <BackOfficeViews subView={currentView} />;
    }

    // Reporting & Ledger
    if (['financial-reports', 'profit-loss', 'revenue-forecast', 'executive-reports', 'system-analytics'].includes(currentView)) {
      return <FinancialViews subView={currentView} />;
    }

    // Marketing & Alerts
    if (['marketing', 'sms-campaigns', 'birthday-campaigns', 'activity-center', 'notifications'].includes(currentView)) {
      return <MarketingViews subView={currentView} />;
    }

    // Guest Digital Assets
    if (['online-booking', 'mobile-preview', 'consent-forms', 'session-tracking'].includes(currentView)) {
      return <GuestViews subView={currentView} />;
    }

    // Property Facility
    if (['occupancy', 'beds-rooms', 'qr-inventory', 'system-status', 'backup-center', 'receptionist-workspace', 'branch-expansion', 'multi-branch'].includes(currentView)) {
      return <PropertyViews subView={currentView} />;
    }

    // Settings Admin
    if (['audit-logs', 'user-management', 'permissions', 'settings', 'ai-insights', 'help-center', 'documentation', 'user-profile', 'account-settings'].includes(currentView)) {
      return <AdminViews subView={currentView} />;
    }

    return <DashboardView />;
  };

  // Elegant title mapping
  const currentViewLabel = allPages.find(p => p.id === currentView)?.label || 'Overview Dashboard';

  if (loading) {
    return <LuxuryLoader onComplete={() => setLoading(false)} />;
  }

  return (
    <div className="min-h-screen flex text-charcoal font-sans relative overflow-hidden bg-background-marble">
      
      {/* Sidebar Navigation */}
      <aside 
        className={`bg-white border-r border-beige-100/60 shadow-premium flex flex-col justify-between transition-all duration-300 z-30 flex-shrink-0 ${
          sidebarOpen ? 'w-[260px]' : 'w-0 -translate-x-full md:w-20 md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-beige-100/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-sage-50 border border-sage-100 rounded-lg flex items-center justify-center text-sage-600">
                🌿
              </div>
              {sidebarOpen && (
                <span className="font-display font-medium text-sm tracking-widest uppercase text-charcoal">
                  Sanctuary
                </span>
              )}
            </div>
          </div>

          {/* Navigation Accordion List */}
          <div className="flex-1 overflow-y-auto py-6 px-4 space-y-4">
            {navigationGroups.map(group => {
              const Icon = group.icon;
              const isGroupOpen = openGroup === group.name;
              
              return (
                <div key={group.name} className="space-y-1.5">
                  <button 
                    onClick={() => setOpenGroup(isGroupOpen ? null : group.name)}
                    className="w-full flex items-center justify-between text-xs font-semibold uppercase text-charcoal-muted tracking-wider hover:text-sage-700 py-1.5 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5 text-sage-600/70" />
                      {sidebarOpen && <span>{group.name}</span>}
                    </div>
                    {sidebarOpen && (
                      isGroupOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {(!sidebarOpen || isGroupOpen) && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-0.5 overflow-hidden pl-5"
                      >
                        {group.items.map(item => (
                          <button 
                            key={item.id}
                            onClick={() => setView(item.id)}
                            className={`w-full text-left py-1.5 px-3 rounded-lg text-xs transition-all font-light ${
                              currentView === item.id 
                                ? 'bg-sage-50 text-sage-800 border-l-2 border-sage-600 font-medium' 
                                : 'text-charcoal-light hover:bg-beige-50/50 hover:text-charcoal'
                            }`}
                          >
                            {sidebarOpen ? item.label : item.label.substring(0,3)}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer */}
        {sidebarOpen && (
          <div className="p-4 border-t border-beige-100/40 text-xs text-charcoal-muted flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-natural rounded-full animate-ping" />
              <span>Shift active</span>
            </div>
            <button className="hover:text-coral transition-colors">
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </aside>

      {/* Main Canvas Shell */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white border-b border-beige-100/40 flex items-center justify-between px-6 md:px-8 z-20 flex-shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-lg relative">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 border border-beige-100 rounded-lg hover:bg-beige-50 transition-all interactive-scale"
            >
              <Menu className="h-4 w-4 text-charcoal-light" />
            </button>
            
            {/* Search Input Bar */}
            <div className="flex items-center gap-2.5 border border-beige-100 rounded-xl px-3 py-2 flex-1 max-w-sm relative">
              <Search className="h-4 w-4 text-charcoal-muted" />
              <input 
                type="text" 
                placeholder="Jump instantly to any of the 50 pages..." 
                value={searchVal}
                onChange={e => {
                  setSearchVal(e.target.value);
                  setSearchDropdown(true);
                }}
                onFocus={() => setSearchDropdown(true)}
                className="w-full text-xs focus:outline-none text-charcoal bg-transparent"
              />
              
              {/* Instant page query dropdown */}
              {searchDropdown && searchVal.length > 0 && (
                <div className="absolute top-12 left-0 right-0 bg-white border border-beige-200 rounded-xl shadow-2xl overflow-hidden max-h-[220px] overflow-y-auto z-40 text-xs">
                  {filteredSearch.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => handleSelectView(p.id)}
                      className="w-full text-left px-4 py-2 hover:bg-sage-50/50 hover:text-sage-800 transition-colors border-b border-beige-100 last:border-0"
                    >
                      <div className="font-medium">{p.label}</div>
                      <div className="text-[9px] text-charcoal-muted uppercase">{p.group}</div>
                    </button>
                  ))}
                  {filteredSearch.length === 0 && (
                    <div className="p-3 text-center text-charcoal-muted italic">No matching spa views.</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Quick Widgets Right */}
          <div className="flex items-center gap-4">
            
            {/* Receptionist quick shift indicator */}
            <div 
              onClick={() => setView('receptionist-workspace')}
              className="hidden lg:flex items-center gap-2 border border-sage-100 text-sage-800 bg-sage-50 px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer interactive-scale"
            >
              <span className="w-1.5 h-1.5 bg-sage-600 rounded-full pulse-indicator" />
              <span>Desk Sarah check-in</span>
            </div>

            {/* Notification alert widget */}
            <div className="relative">
              <button 
                onClick={() => setNotifDropdown(!notifDropdown)}
                className="p-2 border border-beige-100 rounded-lg hover:bg-beige-50 transition-all relative interactive-scale"
              >
                <Bell className="h-4 w-4 text-charcoal-light" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-coral rounded-full" />
              </button>
              
              {notifDropdown && (
                <div className="absolute top-12 right-0 bg-white border border-beige-200 rounded-xl shadow-2xl w-72 overflow-hidden z-40 text-xs">
                  <div className="p-3 bg-beige-50 font-semibold border-b border-beige-100 flex justify-between items-center text-charcoal">
                    <span>Recent Spa Alerts</span>
                    <span className="text-[9px] bg-coral-light text-coral px-2 py-0.5 rounded font-bold">NEW</span>
                  </div>
                  <div className="divide-y divide-beige-100">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 hover:bg-beige-50/30 transition-colors">
                        <div className="font-semibold text-charcoal">{n.title}</div>
                        <p className="text-charcoal-muted leading-relaxed mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => {
                      setView('notifications');
                      setNotifDropdown(false);
                    }}
                    className="w-full text-center py-2 border-t border-beige-100 text-[10px] text-sage-700 font-semibold hover:underline"
                  >
                    View All Archives
                  </button>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <button 
              onClick={() => setView('user-profile')}
              className="flex items-center gap-2 p-1.5 border border-beige-100 rounded-xl hover:bg-beige-50 transition-all interactive-scale"
            >
              <div className="h-7 w-7 rounded-lg bg-sage-600 text-white flex items-center justify-center font-display font-medium text-xs">
                A
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-charcoal-light pr-1">Arthur P.</span>
            </button>

          </div>
        </header>

        {/* Content canvas area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* View Breadcrumb / Header Title */}
            <div className="flex justify-between items-center border-b border-beige-100/40 pb-4">
              <div>
                <span className="text-[10px] uppercase font-semibold text-charcoal-muted tracking-widest font-display">
                  Spa Console // {currentView}
                </span>
                <h2 className="text-2xl font-display font-semibold text-charcoal">{currentViewLabel}</h2>
              </div>
              
              <div className="text-xs text-charcoal-muted">
                Server Latency: <span className="text-sage-700 font-semibold">48ms</span>
              </div>
            </div>

            {/* Active view renderer */}
            {renderActiveView()}

          </div>
        </main>

      </div>
    </div>
  );
}
