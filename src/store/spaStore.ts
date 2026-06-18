import { create } from 'zustand';

// --- TYPE DEFINITIONS ---

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'VIP' | 'Member' | 'Standard' | 'Prospect';
  gender: string;
  loyaltyScore: number;
  totalSpend: number;
  visits: number;
  allergies: string[];
  notes: string;
  favoriteTherapist: string;
  favoriteTreatment: string;
  consentSigned: boolean;
  avatar: string;
  journey: { stage: string; date: string; note: string }[];
  sessions: { date: string; service: string; therapist: string; notes: string }[];
}

export interface Therapist {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  activeBookings: number;
  commissionRate: number; // percentage
  status: 'Available' | 'In Session' | 'Off-Duty';
  baseSalary: number;
  allowance: number;
  overtimeHours: number;
  hourlyOvertimeRate: number;
  deductions: number;
  kpis: {
    retentionRate: number;
    occupancyRate: number;
    salesTargetPct: number;
    avgSatisfaction: number;
  };
  achievements: string[];
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar?: string;
  therapistId: string;
  therapistName: string;
  service: string;
  time: string;
  duration: number; // mins
  bedId: string;
  roomName: string;
  status: 'Confirmed' | 'Checked In' | 'In Session' | 'Completed' | 'Cancelled';
  price: number;
  date: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Massage Oil' | 'Facial Product' | 'Essential Oil' | 'Linens' | 'Teas & Snacks';
  sku: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  supplier: string;
}

export interface POSItem {
  id: string;
  name: string;
  type: 'service' | 'product';
  price: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  ip: string;
}

interface SpaState {
  // Navigation & Sub-views
  currentView: string;
  selectedClientId: string;
  selectedTherapistId: string;
  
  // Data lists
  clients: Client[];
  therapists: Therapist[];
  appointments: Appointment[];
  inventory: InventoryItem[];
  auditLogs: AuditLog[];
  
  // Notification logs
  notifications: { id: string; title: string; desc: string; type: 'info' | 'alert' | 'success'; read: boolean; date: string }[];
  
  // POS System State
  cart: { item: POSItem; quantity: number }[];
  discountPercent: number;
  splitPayments: {
    cash: number;
    card: number;
    gcash: number;
    maya: number;
  };
  checkoutStatus: 'idle' | 'processing' | 'success';
  lastReceipt: {
    receiptId: string;
    clientName: string;
    subtotal: number;
    discountAmount: number;
    tax: number;
    total: number;
    payments: { type: string; amount: number }[];
    date: string;
  } | null;
  
  // Marketing Campaigns
  smsCampaigns: { id: string; name: string; message: string; target: string; status: 'Draft' | 'Sent'; sentCount: number; date: string }[];
  
  // Receptionist Workspace Quick Tasks
  receptionistTasks: { id: string; task: string; completed: boolean }[];

  // Actions
  setView: (view: string) => void;
  selectClient: (id: string) => void;
  selectTherapist: (id: string) => void;
  
  // Appointment Actions
  addAppointment: (app: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  
  // POS Actions
  addToCart: (item: POSItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQty: (itemId: string, qty: number) => void;
  setDiscount: (percent: number) => void;
  updateSplitPayments: (payments: Partial<SpaState['splitPayments']>) => void;
  clearCart: () => void;
  runCheckout: (clientName: string) => Promise<void>;
  
  // Inventory Actions
  adjustStock: (id: string, qty: number) => void;
  
  // Campaign Actions
  addSMSCampaign: (campaign: Omit<SpaState['smsCampaigns'][0], 'id' | 'status' | 'sentCount' | 'date'>) => void;
  sendSMSCampaign: (id: string) => void;
  
  // Task Actions
  toggleTask: (id: string) => void;
  addTask: (task: string) => void;
}

// Generate Realistic Client Lists (100+ clients)
const generateClients = (): Client[] => {
  const names = [
    'Alexandra Vance', 'Julian Mercer', 'Seraphina Thorne', 'Valerie Dubois', 'Dorian Sterling',
    'Elena Rostova', 'Alistair Sterling', 'Clara Montgomery', 'Marcus Vance', 'Gabriella Thorne',
    'Lucian Brooks', 'Isabella Calloway', 'Maxwell Sinclair', 'Amara Patel', 'Sebastian Cole',
    'Genevieve Vance', 'Vivian Mercer', 'Evelyn Sterling', 'Arthur Pendelton', 'Florence Nightingale',
    'Harrison Cole', 'Penelope Cruz', 'Leonardo Caprio', 'Angelina Jolie', 'Brad Pitt',
    'Cynthia Nixon', 'Devin Booker', 'Gigi Hadid', 'Kendall Jenner', 'Bella Hadid',
    'Zayn Malik', 'Selena Gomez', 'Taylor Swift', 'Travis Kelce', 'Bill Gates'
  ];
  
  const therapists = ['Elena Rostova', 'Julian Mercer', 'Seraphina Thorne', 'Alistair Sterling'];
  const treatments = ['Deep Tissue Harmony', 'Hot Stone Ritual', 'Luminous Facial', 'Eucalyptus Detox Bath', 'Sandalwood Body Polish'];
  const allergiesPool = ['Eucalyptus Oil', 'Nut oils', 'Lavender', 'Citrus elements', 'None'];

  // Seed baseline VIP clients
  const coreClients: Client[] = [
    {
      id: 'c-1',
      name: 'Alexandra Vance',
      email: 'alexandra.vance@vanguard.com',
      phone: '+1 (555) 019-2834',
      status: 'VIP',
      gender: 'Female',
      loyaltyScore: 98,
      totalSpend: 14250,
      visits: 42,
      allergies: ['Eucalyptus Oil'],
      notes: 'Prefers deep tissue therapies. Prefers lemongrass hot herbal tea served pre-treatment.',
      favoriteTherapist: 'Elena Rostova',
      favoriteTreatment: 'Deep Tissue Harmony',
      consentSigned: true,
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      journey: [
        { stage: 'Onboarding & Discovery', date: '2025-01-12', note: 'Expressed need for chronic shoulder pain relief.' },
        { stage: 'Tailored Core Program', date: '2025-02-15', note: 'Switched to Hot Stone Ritual for myofascial release.' },
        { stage: 'VIP Upgrade', date: '2025-05-01', note: 'Reached $5,000 spend. Granted custom lounge access.' }
      ],
      sessions: [
        { date: '2026-06-15', service: 'Deep Tissue Harmony', therapist: 'Elena Rostova', notes: 'Knots in shoulder blade area. Focus on upper scapula.' },
        { date: '2026-05-20', service: 'Luminous Facial', therapist: 'Julian Mercer', notes: 'Requested hydrating serum enhancement.' }
      ]
    },
    {
      id: 'c-2',
      name: 'Dorian Sterling',
      email: 'dorian@sterlingholdings.co',
      phone: '+1 (555) 014-9988',
      status: 'Member',
      gender: 'Male',
      loyaltyScore: 85,
      totalSpend: 8900,
      visits: 24,
      allergies: ['None'],
      notes: 'Executive high stress. Needs aromatherapy (lavender & sandalwood) enabled in room prior.',
      favoriteTherapist: 'Julian Mercer',
      favoriteTreatment: 'Hot Stone Ritual',
      consentSigned: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      journey: [
        { stage: 'Onboarding', date: '2025-04-05', note: 'Stress management and posture correction program.' },
        { stage: 'Bi-weekly Routine', date: '2025-08-20', note: 'Consistent weekend sessions for muscle recovery.' }
      ],
      sessions: [
        { date: '2026-06-12', service: 'Hot Stone Ritual', therapist: 'Julian Mercer', notes: 'Relaxation achieved. Left leg muscle tightness noted.' }
      ]
    }
  ];

  // Dynamic generate to total 102 clients
  for (let i = 3; i <= 102; i++) {
    const rawName = names[i % names.length] + ' ' + String.fromCharCode(65 + (i % 26));
    const isVip = i % 8 === 0;
    const isMember = i % 3 === 0;
    const gender = i % 2 === 0 ? 'Female' : 'Male';
    const status = isVip ? 'VIP' : isMember ? 'Member' : i % 5 === 0 ? 'Prospect' : 'Standard';
    const visits = Math.floor(Math.random() * 25) + 1;
    const spend = Math.floor(visits * (120 + Math.random() * 80));
    
    coreClients.push({
      id: `c-${i}`,
      name: rawName,
      email: `${rawName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      phone: `+1 (555) 01${Math.floor(1000 + Math.random() * 9000)}`,
      status,
      gender,
      loyaltyScore: Math.floor(Math.random() * 60) + 40,
      totalSpend: spend,
      visits,
      allergies: [allergiesPool[i % allergiesPool.length]],
      notes: 'Client prefers dim lighting. Check for allergy warning before treatments.',
      favoriteTherapist: therapists[i % therapists.length],
      favoriteTreatment: treatments[i % treatments.length],
      consentSigned: i % 10 !== 0, // 90% have consent signed
      avatar: gender === 'Female' 
        ? `https://images.unsplash.com/photo-${1500000000000 + i}?auto=format&fit=crop&q=80&w=200`
        : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      journey: [
        { stage: 'Onboarding & Intake', date: '2025-10-05', note: 'Standard wellness checklist submitted.' }
      ],
      sessions: [
        { date: '2026-06-01', service: treatments[i % treatments.length], therapist: therapists[i % therapists.length], notes: 'Completed normal sequence. Excellent feedback.' }
      ]
    });
  }

  return coreClients;
};

// Generate Therapists
const initTherapists = (): Therapist[] => [
  {
    id: 't-1',
    name: 'Elena Rostova',
    role: 'Lead Wellness Specialist',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    rating: 4.96,
    activeBookings: 6,
    commissionRate: 18,
    status: 'In Session',
    baseSalary: 4500,
    allowance: 450,
    overtimeHours: 12,
    hourlyOvertimeRate: 45,
    deductions: 180,
    kpis: {
      retentionRate: 94,
      occupancyRate: 88,
      salesTargetPct: 114,
      avgSatisfaction: 4.96
    },
    achievements: ['Specialist of the Month', '100% Safety Compliance', 'Top Retainer 2025']
  },
  {
    id: 't-2',
    name: 'Julian Mercer',
    role: 'Myofascial & Deep Tissue Expert',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200',
    rating: 4.88,
    activeBookings: 4,
    commissionRate: 15,
    status: 'Available',
    baseSalary: 3800,
    allowance: 300,
    overtimeHours: 6,
    hourlyOvertimeRate: 35,
    deductions: 120,
    kpis: {
      retentionRate: 89,
      occupancyRate: 74,
      salesTargetPct: 98,
      avgSatisfaction: 4.88
    },
    achievements: ['Deep Tissue Certification', 'Customer Favorite Q1']
  },
  {
    id: 't-3',
    name: 'Seraphina Thorne',
    role: 'Aromatherapy & Holistic Practitioner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
    rating: 4.92,
    activeBookings: 5,
    commissionRate: 16,
    status: 'Available',
    baseSalary: 4000,
    allowance: 350,
    overtimeHours: 8,
    hourlyOvertimeRate: 40,
    deductions: 140,
    kpis: {
      retentionRate: 91,
      occupancyRate: 82,
      salesTargetPct: 105,
      avgSatisfaction: 4.92
    },
    achievements: ['Aromatherapy Excellence Award', 'Holistic Touch Certified']
  },
  {
    id: 't-4',
    name: 'Alistair Sterling',
    role: 'Shiatsu & Energy Balancing Specialist',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200',
    rating: 4.79,
    activeBookings: 3,
    commissionRate: 14,
    status: 'Off-Duty',
    baseSalary: 3600,
    allowance: 250,
    overtimeHours: 4,
    hourlyOvertimeRate: 35,
    deductions: 110,
    kpis: {
      retentionRate: 84,
      occupancyRate: 68,
      salesTargetPct: 92,
      avgSatisfaction: 4.79
    },
    achievements: ['Eastern Therapy Diploma']
  }
];

// Initialize Appointments
const initAppointments = (): Appointment[] => [
  {
    id: 'a-1',
    clientId: 'c-1',
    clientName: 'Alexandra Vance',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    therapistId: 't-1',
    therapistName: 'Elena Rostova',
    service: 'Deep Tissue Harmony',
    time: '10:00 AM',
    duration: 90,
    bedId: 'Bed 101',
    roomName: 'Santal Room',
    status: 'In Session',
    price: 180,
    date: '2026-06-19'
  },
  {
    id: 'a-2',
    clientId: 'c-2',
    clientName: 'Dorian Sterling',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    therapistId: 't-2',
    therapistName: 'Julian Mercer',
    service: 'Hot Stone Ritual',
    time: '11:30 AM',
    duration: 60,
    bedId: 'Bed 104',
    roomName: 'Jasmine suite',
    status: 'Confirmed',
    price: 150,
    date: '2026-06-19'
  },
  {
    id: 'a-3',
    clientId: 'c-3',
    clientName: 'Elena Rostova A',
    therapistId: 't-3',
    therapistName: 'Seraphina Thorne',
    service: 'Luminous Facial',
    time: '01:00 PM',
    duration: 60,
    bedId: 'Bed 102',
    roomName: 'Lotus Lounge',
    status: 'Confirmed',
    price: 130,
    date: '2026-06-19'
  },
  {
    id: 'a-4',
    clientId: 'c-4',
    clientName: 'Julian Mercer B',
    therapistId: 't-1',
    therapistName: 'Elena Rostova',
    service: 'Eucalyptus Detox Bath',
    time: '02:30 PM',
    duration: 75,
    bedId: 'Bed 101',
    roomName: 'Santal Room',
    status: 'Checked In',
    price: 145,
    date: '2026-06-19'
  },
  {
    id: 'a-5',
    clientId: 'c-5',
    clientName: 'Seraphina Thorne C',
    therapistId: 't-2',
    therapistName: 'Julian Mercer',
    service: 'Sandalwood Body Polish',
    time: '04:00 PM',
    duration: 90,
    bedId: 'Bed 105',
    roomName: 'Bamboo Zen',
    status: 'Confirmed',
    price: 210,
    date: '2026-06-19'
  }
];

// Initialize Inventory
const initInventory = (): InventoryItem[] => [
  { id: 'i-1', name: 'Organic Cold-Pressed Almond Oil', category: 'Massage Oil', sku: 'MO-ALM-5L', stock: 12, minStock: 5, price: 95, cost: 40, supplier: 'Nirvana Botanical Wholesalers' },
  { id: 'i-2', name: 'Ultra-Pure Sandalwood Extract', category: 'Essential Oil', sku: 'EO-SAN-250', stock: 3, minStock: 4, price: 165, cost: 90, supplier: 'Himalayan Flora Imports' },
  { id: 'i-3', name: 'Active Peptide Lifting Mask', category: 'Facial Product', sku: 'FP-PEP-X', stock: 45, minStock: 15, price: 45, cost: 18, supplier: 'Elite Cosmeceuticals Co' },
  { id: 'i-4', name: 'Premium Egyptian Cotton Towels', category: 'Linens', sku: 'LN-EGY-T', stock: 85, minStock: 20, price: 28, cost: 12, supplier: 'Linen Luxe Guild' },
  { id: 'i-5', name: 'Soothe Organic Chamomile Herbal Tea', category: 'Teas & Snacks', sku: 'TS-CHA-1KG', stock: 8, minStock: 3, price: 34, cost: 14, supplier: 'Earth & Tea Importers' }
];

// Initialize Audit Logs
const initAuditLogs = (): AuditLog[] => [
  { id: 'l-1', timestamp: '2026-06-18 22:45:10', user: 'Receptionist Sarah', action: 'Create Booking', details: 'Added Alexandra Vance (c-1) for 2026-06-19 at 10:00 AM', ip: '192.168.1.45' },
  { id: 'l-2', timestamp: '2026-06-18 22:50:34', user: 'Receptionist Sarah', action: 'POS Transaction', details: 'Completed Order ID #10423 for Dorian Sterling ($150)', ip: '192.168.1.45' },
  { id: 'l-3', timestamp: '2026-06-18 23:12:00', user: 'Manager Arthur', action: 'Adjust Stock', details: 'Deducted 1 Organic Almond Oil due to treatment room spill', ip: '192.168.1.2' }
];

// Initialize SMS Campaigns
const initSMSCampaigns = (): SpaState['smsCampaigns'] => [
  { id: 'm-1', name: 'Summer Solstice Wellness Offer', message: 'Hello {name}, enjoy 20% off all holistic services this month. Rejuvenate at The Sanctuary. Reply STOP to opt out.', target: 'All VIP Clients', status: 'Sent', sentCount: 42, date: '2026-06-10' },
  { id: 'm-2', name: 'Midweek Rebalance Campaign', message: 'Rebalance your energy. Book any treatment on Tuesday or Wednesday and receive a free botanical face serum gift. Book at sanctuaryspa.com', target: 'Clients inactive for 60+ days', status: 'Draft', sentCount: 0, date: '2026-06-18' }
];

// Initialize Notifications
const initNotifications = (): SpaState['notifications'] => [
  { id: 'n-1', title: 'Low Stock Alert', desc: 'Sandalwood Extract stock is below the minimum threshold (3 left).', type: 'alert', read: false, date: '1 hour ago' },
  { id: 'n-2', title: 'VIP Client Checked In', desc: 'Alexandra Vance is now in the lounge. Prepare Santal Tea.', type: 'success', read: false, date: '10 mins ago' },
  { id: 'n-3', title: 'System Backup Complete', desc: 'Cloud archive successful (5.2MB encrypted database zip).', type: 'info', read: true, date: 'Last night' }
];

// Initialize Receptionist Tasks
const initReceptionistTasks = (): SpaState['receptionistTasks'] => [
  { id: 'rt-1', task: 'Check chamomile flower inventory in tea lounge', completed: false },
  { id: 'rt-2', task: 'Review Elena\'s scheduling adjustments for Saturday', completed: true },
  { id: 'rt-3', task: 'Prep hot stone warmers for Dorian\'s 11:30 appointment', completed: false },
  { id: 'rt-4', task: 'Print physical check-in forms for walk-in arrivals', completed: false }
];

// --- ZUSTAND STORE CREATION ---

export const useSpaStore = create<SpaState>((set) => ({
  // Active Navigation and Views
  currentView: 'dashboard',
  selectedClientId: 'c-1',
  selectedTherapistId: 't-1',
  
  // Data State
  clients: generateClients(),
  therapists: initTherapists(),
  appointments: initAppointments(),
  inventory: initInventory(),
  auditLogs: initAuditLogs(),
  notifications: initNotifications(),
  smsCampaigns: initSMSCampaigns(),
  receptionistTasks: initReceptionistTasks(),
  
  // POS System State
  cart: [],
  discountPercent: 0,
  splitPayments: { cash: 0, card: 0, gcash: 0, maya: 0 },
  checkoutStatus: 'idle',
  lastReceipt: null,
  
  // Basic Switcher Actions
  setView: (view) => set({ currentView: view }),
  selectClient: (id) => set({ selectedClientId: id }),
  selectTherapist: (id) => set({ selectedTherapistId: id }),
  
  // Appointment Actions
  addAppointment: (app) => set((state) => {
    const newApp: Appointment = {
      ...app,
      id: `a-${state.appointments.length + 1}`
    };
    
    // Log Audit action
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Receptionist System',
      action: 'Create Booking',
      details: `Added ${newApp.clientName} for ${newApp.date} at ${newApp.time}`,
      ip: '127.0.0.1'
    };

    return {
      appointments: [...state.appointments, newApp],
      auditLogs: [newLog, ...state.auditLogs]
    };
  }),
  
  updateAppointmentStatus: (id, status) => set((state) => {
    const updated = state.appointments.map(a => a.id === id ? { ...a, status } : a);
    const app = state.appointments.find(a => a.id === id);
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Receptionist System',
      action: 'Update Status',
      details: `Status of appointment for ${app?.clientName || 'Client'} updated to ${status}`,
      ip: '127.0.0.1'
    };

    return {
      appointments: updated,
      auditLogs: [newLog, ...state.auditLogs]
    };
  }),

  // POS Actions
  addToCart: (item) => set((state) => {
    const existingIndex = state.cart.findIndex(i => i.item.id === item.id);
    if (existingIndex > -1) {
      const newCart = [...state.cart];
      newCart[existingIndex].quantity += 1;
      return { cart: newCart };
    }
    return { cart: [...state.cart, { item, quantity: 1 }] };
  }),
  
  removeFromCart: (itemId) => set((state) => ({
    cart: state.cart.filter(i => i.item.id !== itemId)
  })),
  
  updateCartQty: (itemId, qty) => set((state) => ({
    cart: state.cart.map(i => i.item.id === itemId ? { ...i, quantity: Math.max(1, qty) } : i)
  })),
  
  setDiscount: (percent) => set({ discountPercent: percent }),
  
  updateSplitPayments: (payments) => set((state) => ({
    splitPayments: { ...state.splitPayments, ...payments }
  })),
  
  clearCart: () => set({
    cart: [],
    discountPercent: 0,
    splitPayments: { cash: 0, card: 0, gcash: 0, maya: 0 },
    checkoutStatus: 'idle',
    lastReceipt: null
  }),
  
  runCheckout: async (clientName) => {
    set({ checkoutStatus: 'processing' });
    
    // Simulate payment api latency
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    set((state) => {
      const subtotal = state.cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
      const discountAmount = subtotal * (state.discountPercent / 100);
      const tax = (subtotal - discountAmount) * 0.12; // 12% VAT
      const total = subtotal - discountAmount + tax;
      
      // Compute split payments if unallocated
      const filledPayments = [];
      const sp = state.splitPayments;
      const totalAllocated = sp.cash + sp.card + sp.gcash + sp.maya;
      
      if (totalAllocated === 0) {
        // Default to Full Card
        filledPayments.push({ type: 'Card Payment', amount: total });
      } else {
        if (sp.cash > 0) filledPayments.push({ type: 'Cash', amount: sp.cash });
        if (sp.card > 0) filledPayments.push({ type: 'Credit Card', amount: sp.card });
        if (sp.gcash > 0) filledPayments.push({ type: 'GCash e-Wallet', amount: sp.gcash });
        if (sp.maya > 0) filledPayments.push({ type: 'Maya e-Wallet', amount: sp.maya });
      }
      
      const receiptId = `REC-${10000 + Math.floor(Math.random() * 90000)}`;
      const receipt = {
        receiptId,
        clientName,
        subtotal,
        discountAmount,
        tax,
        total,
        payments: filledPayments,
        date: new Date().toLocaleDateString('en-US', { hour: '2-digit', minute: '2-digit' })
      };
      
      // Update inventory stock if items are retail products
      const updatedInventory = [...state.inventory];
      state.cart.forEach(cartItem => {
        if (cartItem.item.type === 'product') {
          const invItemIndex = updatedInventory.findIndex(i => i.id === cartItem.item.id);
          if (invItemIndex > -1) {
            updatedInventory[invItemIndex].stock = Math.max(0, updatedInventory[invItemIndex].stock - cartItem.quantity);
          }
        }
      });
      
      const newLog: AuditLog = {
        id: `l-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: 'Receptionist System',
        action: 'POS Transaction',
        details: `Successful POS payment client: ${clientName}, Total: $${total.toFixed(2)}, Receipt: ${receiptId}`,
        ip: '127.0.0.1'
      };

      return {
        checkoutStatus: 'success',
        lastReceipt: receipt,
        inventory: updatedInventory,
        auditLogs: [newLog, ...state.auditLogs]
      };
    });
  },
  
  // Inventory Stock Adjustment
  adjustStock: (id, qty) => set((state) => {
    const updated = state.inventory.map(item => {
      if (item.id === id) {
        return { ...item, stock: Math.max(0, item.stock + qty) };
      }
      return item;
    });
    
    const affected = state.inventory.find(i => i.id === id);
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Inventory Manager',
      action: 'Adjust Stock',
      details: `Adjusted Stock of ${affected?.name || 'Item'} by ${qty > 0 ? '+' : ''}${qty}`,
      ip: '127.0.0.1'
    };

    return {
      inventory: updated,
      auditLogs: [newLog, ...state.auditLogs]
    };
  }),
  
  // Campaign Actions
  addSMSCampaign: (campaign) => set((state) => {
    const newCampaign = {
      ...campaign,
      id: `m-${state.smsCampaigns.length + 1}`,
      status: 'Draft' as const,
      sentCount: 0,
      date: new Date().toISOString().substring(0, 10)
    };
    return {
      smsCampaigns: [...state.smsCampaigns, newCampaign]
    };
  }),
  
  sendSMSCampaign: (id) => set((state) => {
    const updated = state.smsCampaigns.map(c => {
      if (c.id === id) {
        const targetClients = state.clients.filter(cl => {
          if (c.target === 'All VIP Clients') return cl.status === 'VIP';
          if (c.target === 'Members Only') return cl.status === 'Member';
          return true;
        });
        return {
          ...c,
          status: 'Sent' as const,
          sentCount: targetClients.length
        };
      }
      return c;
    });
    
    const target = state.smsCampaigns.find(c => c.id === id);
    const newLog: AuditLog = {
      id: `l-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: 'Marketing System',
      action: 'SMS Blast Dispatch',
      details: `Dispatched campaign "${target?.name || 'Campaign'}"`,
      ip: '127.0.0.1'
    };

    return {
      smsCampaigns: updated,
      auditLogs: [newLog, ...state.auditLogs]
    };
  }),
  
  // Quick Tasks
  toggleTask: (id) => set((state) => ({
    receptionistTasks: state.receptionistTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  
  addTask: (task) => set((state) => ({
    receptionistTasks: [
      ...state.receptionistTasks,
      { id: `rt-${Date.now()}`, task, completed: false }
    ]
  }))
}));
