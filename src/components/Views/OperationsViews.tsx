"use client";

import React, { useState } from 'react';
import { useSpaStore, Appointment, Client, POSItem } from '@/store/spaStore';
import { 
  Calendar as CalIcon, Clock, Plus, Trash2, CreditCard, Search, 
  Sparkles, Filter, Check, ShieldCheck, ChevronRight, Download, 
  Award, RefreshCw, ShoppingCart, Percent, User, ArrowRight, Printer, AlertTriangle
} from 'lucide-react';

interface ViewProps {
  subView: string;
}

export default function OperationsViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // Local state helper for forms/toggles
  const [searchQuery, setSearchQuery] = useState('');
  const [crmFilter, setCrmFilter] = useState<'All' | 'VIP' | 'Member' | 'Standard'>('All');
  
  // New Appointment state
  const [newApp, setNewApp] = useState({
    clientName: '',
    therapistId: store.therapists[0]?.id || '',
    service: 'Deep Tissue Harmony',
    time: '09:00 AM',
    duration: 60,
    bedId: 'Bed 101',
    roomName: 'Santal Room',
    price: 150,
    date: new Date().toISOString().substring(0, 10)
  });

  // POS State
  const [posClient, setPosClient] = useState('Alexandra Vance');
  const [customDiscount, setCustomDiscount] = useState('0');
  
  // Custom split payments inputs
  const [splitInput, setSplitInput] = useState({
    cash: '',
    card: '',
    gcash: '',
    maya: ''
  });

  // New Voucher Generator
  const [vouchers, setVouchers] = useState([
    { code: 'SAN-50GIFT', client: 'Seraphina T.', amount: 50, status: 'Active' },
    { code: 'VIP-MASSAGE', client: 'Alexandra V.', amount: 180, status: 'Redeemed' }
  ]);
  const [newVoucher, setNewVoucher] = useState({ client: '', amount: '100' });

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. APPOINTMENTS VIEW
  if (subView === 'appointments') {
    const handleAddApp = (e: React.FormEvent) => {
      e.preventDefault();
      const therapist = store.therapists.find(t => t.id === newApp.therapistId);
      store.addAppointment({
        clientId: 'c-' + (store.clients.length + 1),
        clientName: newApp.clientName,
        therapistId: newApp.therapistId,
        therapistName: therapist ? therapist.name : 'Unknown',
        service: newApp.service,
        time: newApp.time,
        duration: Number(newApp.duration),
        bedId: newApp.bedId,
        roomName: newApp.roomName,
        status: 'Confirmed',
        price: Number(newApp.price),
        date: newApp.date
      });
      // reset name
      setNewApp(prev => ({ ...prev, clientName: '' }));
    };

    return (
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Left: Schedule Form */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 xl:col-span-1 h-fit">
          <div>
            <h3 className="text-lg font-display font-medium">Create New Booking</h3>
            <p className="text-xs text-charcoal-muted font-light">Schedule therapist & spa bed availability</p>
          </div>
          
          <form onSubmit={handleAddApp} className="space-y-4 text-sm">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Client Full Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Florence Miller"
                value={newApp.clientName}
                onChange={e => setNewApp(prev => ({ ...prev, clientName: e.target.value }))}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Therapist</label>
                <select 
                  value={newApp.therapistId}
                  onChange={e => setNewApp(prev => ({ ...prev, therapistId: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal bg-white"
                >
                  {store.therapists.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Bed Assignment</label>
                <select 
                  value={newApp.bedId}
                  onChange={e => setNewApp(prev => ({ ...prev, bedId: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal bg-white"
                >
                  <option value="Bed 101">Bed 101 (Santal)</option>
                  <option value="Bed 102">Bed 102 (Lotus)</option>
                  <option value="Bed 103">Bed 103 (Jasmine)</option>
                  <option value="Bed 104">Bed 104 (Jasmine)</option>
                  <option value="Bed 105">Bed 105 (Bamboo)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Date</label>
                <input 
                  type="date" 
                  value={newApp.date}
                  onChange={e => setNewApp(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Time Slot</label>
                <select 
                  value={newApp.time}
                  onChange={e => setNewApp(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal bg-white"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="02:30 PM">02:30 PM</option>
                  <option value="04:00 PM">04:00 PM</option>
                  <option value="05:30 PM">05:30 PM</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Service Price ($)</label>
                <input 
                  type="number"
                  value={newApp.price}
                  onChange={e => setNewApp(prev => ({ ...prev, price: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Duration (mins)</label>
                <input 
                  type="number" 
                  value={newApp.duration}
                  onChange={e => setNewApp(prev => ({ ...prev, duration: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="h-4 w-4" />
              <span>Confirm Appointment</span>
            </button>
          </form>
        </div>

        {/* Right: Appointments List */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-display font-medium">Daily Bookings Log</h3>
              <p className="text-xs text-charcoal-muted">Active queues and treatment statuses</p>
            </div>
            <span className="text-xs bg-sage-50 text-sage-700 px-3 py-1 rounded-full border border-sage-100 font-medium">
              Today: {store.appointments.length} scheduled
            </span>
          </div>

          <div className="divide-y divide-beige-100/60">
            {store.appointments.map((app) => (
              <div key={app.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-beige-100 text-sage-800 font-semibold rounded-full border border-beige-200 overflow-hidden flex items-center justify-center">
                    {app.clientAvatar ? (
                      <img src={app.clientAvatar} alt={app.clientName} className="h-full w-full object-cover" />
                    ) : (
                      app.clientName.split(' ').map(n => n[0]).join('')
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal">{app.clientName}</h4>
                    <p className="text-xs text-charcoal-muted">
                      {app.service} ({app.duration} mins) • <span className="font-medium text-charcoal-light">{app.roomName}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-semibold text-charcoal">${app.price}</div>
                    <div className="text-xs text-charcoal-muted font-mono">{app.time}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select 
                      value={app.status}
                      onChange={(e) => store.updateAppointmentStatus(app.id, e.target.value as Appointment['status'])}
                      className="text-xs px-2.5 py-1.5 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Checked In">Checked In</option>
                      <option value="In Session">In Session</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. CALENDAR VIEW
  if (subView === 'calendar') {
    const hours = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
    
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-medium">Interactive Scheduler</h3>
            <p className="text-xs text-charcoal-muted">Therapist & Bed availability allocation grid</p>
          </div>
          <div className="flex bg-beige-100/50 p-0.5 rounded-lg text-xs border border-beige-100 w-fit">
            <button className="px-3 py-1.5 rounded-md bg-white shadow-card font-medium">Day Timeline</button>
            <button className="px-3 py-1.5 rounded-md text-charcoal-muted">Week View</button>
            <button className="px-3 py-1.5 rounded-md text-charcoal-muted">Month View</button>
          </div>
        </div>

        {/* Timeline visualization */}
        <div className="border border-beige-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 bg-beige-50 border-b border-beige-100 text-xs font-semibold text-charcoal-light py-2 text-center">
            <div className="border-r border-beige-100">Therapist</div>
            <div className="col-span-3">Daily Grid & Assigned Sessions (Drag-and-Drop Simulated)</div>
          </div>
          
          <div className="divide-y divide-beige-100 text-sm">
            {store.therapists.map(therapist => {
              const assigned = store.appointments.filter(a => a.therapistId === therapist.id);
              
              return (
                <div key={therapist.id} className="grid grid-cols-4 min-h-[80px]">
                  {/* Left Column: Therapist */}
                  <div className="p-3 border-r border-beige-100 flex items-center gap-3 bg-beige-50/20">
                    <img src={therapist.avatar} alt={therapist.name} className="h-8 w-8 rounded-full object-cover border border-beige-100" />
                    <div>
                      <div className="font-medium text-xs text-charcoal">{therapist.name}</div>
                      <div className="text-[10px] text-charcoal-muted">{therapist.role.split(' ')[0]}</div>
                    </div>
                  </div>
                  
                  {/* Right Column: Dynamic Blocks representing schedule */}
                  <div className="col-span-3 p-3 flex gap-2 overflow-x-auto items-center relative">
                    {assigned.length === 0 ? (
                      <span className="text-xs text-charcoal-muted italic ml-2">No active sessions allocated</span>
                    ) : (
                      assigned.map(app => (
                        <div 
                          key={app.id} 
                          className="bg-sage-50 border border-sage-200/60 p-2.5 rounded-lg flex flex-col justify-between min-w-[150px] shadow-sm cursor-pointer hover:border-sage-500 hover:bg-sage-100/50 transition-all duration-300"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] font-semibold text-sage-800 truncate">{app.clientName}</span>
                            <span className="text-[9px] font-mono text-sage-600">{app.time}</span>
                          </div>
                          <span className="text-[10px] text-charcoal-light truncate">{app.service}</span>
                          <div className="flex justify-between items-center mt-1 border-t border-sage-200/40 pt-1 text-[9px] text-charcoal-muted">
                            <span>{app.bedId}</span>
                            <span className="font-semibold text-sage-800">{app.status}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-charcoal-muted bg-beige-50 p-3 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-gold flex-shrink-0" />
          <span>Double-booking conflicts are automatically flagged in red. Grab the handles to shift schedules dynamically (auto-saved to cloud database).</span>
        </div>
      </div>
    );
  }

  // 3. POS CHECKOUT
  if (subView === 'pos') {
    const posServices: POSItem[] = [
      { id: 'pos-s1', name: 'Deep Tissue Harmony Treatment', type: 'service', price: 180 },
      { id: 'pos-s2', name: 'Hot Stone Renewal Massage', type: 'service', price: 150 },
      { id: 'pos-s3', name: 'Luminous Facial Therapy', type: 'service', price: 130 },
      { id: 'pos-s4', name: 'Detoxifying Eucalyptus Soak', type: 'service', price: 110 }
    ];
    
    const posRetail: POSItem[] = [
      { id: 'i-1', name: 'Organic Cold-Pressed Almond Oil', type: 'product', price: 95 },
      { id: 'i-2', name: 'Ultra-Pure Sandalwood Extract', type: 'product', price: 165 },
      { id: 'i-3', name: 'Active Peptide Lifting Mask', type: 'product', price: 45 }
    ];

    const subtotal = store.cart.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
    const discountAmt = subtotal * (store.discountPercent / 100);
    const tax = (subtotal - discountAmt) * 0.12;
    const finalTotal = subtotal - discountAmt + tax;

    const handleApplyDiscount = () => {
      store.setDiscount(Number(customDiscount));
    };

    const handleCheckout = () => {
      // Setup split payment allocation
      store.updateSplitPayments({
        cash: Number(splitInput.cash) || 0,
        card: Number(splitInput.card) || 0,
        gcash: Number(splitInput.gcash) || 0,
        maya: Number(splitInput.maya) || 0
      });
      store.runCheckout(posClient);
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        {/* Left: Product/Service Catalog (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Checkout Catalog</h3>
            <p className="text-xs text-charcoal-muted">Select guest treatments & boutique retail items</p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Treatments & Therapies</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posServices.map(item => (
                <button
                  key={item.id}
                  onClick={() => store.addToCart(item)}
                  className="p-3.5 border border-beige-100 rounded-xl hover:border-sage-500 text-left hover:bg-sage-50/10 group transition-all"
                >
                  <div className="font-medium text-xs text-charcoal truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-sage-800">${item.price}</span>
                    <span className="text-[10px] text-sage-600 bg-sage-50 px-2 py-0.5 rounded border border-sage-100/50 font-medium">Add to Cart</span>
                  </div>
                </button>
              ))}
            </div>
            
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider pt-2">Boutique Products</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {posRetail.map(item => (
                <button
                  key={item.id}
                  onClick={() => store.addToCart(item)}
                  className="p-3.5 border border-beige-100 rounded-xl hover:border-sage-500 text-left hover:bg-sage-50/10 group transition-all"
                >
                  <div className="font-medium text-xs text-charcoal truncate">{item.name}</div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-semibold text-sage-800">${item.price}</span>
                    <span className="text-[10px] text-sage-600 bg-sage-50 px-2 py-0.5 rounded border border-sage-100/50 font-medium">Add to Cart</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Cart Summary & Split Checkout (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card flex flex-col h-fit space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-medium">Checkout Cart</h3>
            <button onClick={store.clearCart} className="text-xs text-coral hover:underline flex items-center gap-1 font-medium">
              <Trash2 className="h-3 w-3" />
              <span>Reset POS</span>
            </button>
          </div>

          {/* Client Selection */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal-light">Assigned Guest CRM Record</label>
            <select
              value={posClient}
              onChange={e => setPosClient(e.target.value)}
              className="w-full text-xs p-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
            >
              {store.clients.slice(0, 10).map(c => (
                <option key={c.id} value={c.name}>{c.name} ({c.status})</option>
              ))}
            </select>
          </div>

          {/* Cart items list */}
          <div className="divide-y divide-beige-100 overflow-y-auto max-h-[160px] pr-1">
            {store.cart.length === 0 ? (
              <div className="py-6 text-center text-xs text-charcoal-muted italic">Cart is empty. Select items on the left to begin.</div>
            ) : (
              store.cart.map(cartItem => (
                <div key={cartItem.item.id} className="py-2.5 flex items-center justify-between text-xs first:pt-0">
                  <div className="max-w-[70%]">
                    <div className="font-medium text-charcoal truncate">{cartItem.item.name}</div>
                    <div className="text-[10px] text-charcoal-muted">${cartItem.item.price} each</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={cartItem.quantity}
                      onChange={e => store.updateCartQty(cartItem.item.id, Number(e.target.value))}
                      className="w-10 px-1 py-0.5 border border-beige-100 rounded text-center"
                    />
                    <button onClick={() => store.removeFromCart(cartItem.item.id)} className="text-charcoal-muted hover:text-coral">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Discount Field */}
          <div className="flex gap-2 items-center pt-2 border-t border-beige-100">
            <input 
              type="number" 
              placeholder="Discount %" 
              value={customDiscount}
              onChange={e => setCustomDiscount(e.target.value)}
              className="w-full text-xs px-2.5 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500"
            />
            <button 
              onClick={handleApplyDiscount}
              className="px-3 py-2 bg-beige-100 hover:bg-beige-200 text-charcoal text-xs rounded-lg font-medium transition-all"
            >
              Apply
            </button>
          </div>

          {/* Pricing Totals */}
          <div className="bg-beige-50/50 p-4 rounded-xl text-xs space-y-1.5 border border-beige-100/50">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Subtotal</span>
              <span className="font-semibold text-charcoal">${subtotal.toFixed(2)}</span>
            </div>
            {discountAmt > 0 && (
              <div className="flex justify-between text-coral">
                <span>Discount ({store.discountPercent}%)</span>
                <span>-${discountAmt.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-charcoal-muted">
              <span>VAT Tax (12%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-beige-100 pt-2 text-sm">
              <span className="font-medium text-charcoal">Total Due</span>
              <span className="font-bold text-sage-800">${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Split payments calculator */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-charcoal-light">Split Payments Allocations (Optional)</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <input 
                type="number" 
                placeholder="Cash Amount" 
                value={splitInput.cash}
                onChange={e => setSplitInput(prev => ({ ...prev, cash: e.target.value }))}
                className="px-2 py-1.5 border border-beige-100 rounded focus:outline-none text-charcoal"
              />
              <input 
                type="number" 
                placeholder="Credit Card" 
                value={splitInput.card}
                onChange={e => setSplitInput(prev => ({ ...prev, card: e.target.value }))}
                className="px-2 py-1.5 border border-beige-100 rounded focus:outline-none text-charcoal"
              />
              <input 
                type="number" 
                placeholder="GCash Pay" 
                value={splitInput.gcash}
                onChange={e => setSplitInput(prev => ({ ...prev, gcash: e.target.value }))}
                className="px-2 py-1.5 border border-beige-100 rounded focus:outline-none text-charcoal"
              />
              <input 
                type="number" 
                placeholder="Maya e-Wallet" 
                value={splitInput.maya}
                onChange={e => setSplitInput(prev => ({ ...prev, maya: e.target.value }))}
                className="px-2 py-1.5 border border-beige-100 rounded focus:outline-none text-charcoal"
              />
            </div>
          </div>

          {/* Checkout triggers */}
          {store.checkoutStatus === 'processing' ? (
            <button disabled className="w-full py-2.5 bg-sage-600 text-white rounded-lg flex items-center justify-center gap-2 cursor-wait">
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Authorizing Split Terminals...</span>
            </button>
          ) : (
            <button 
              onClick={handleCheckout}
              disabled={store.cart.length === 0}
              className="w-full py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2 disabled:bg-sage-100 disabled:text-charcoal-muted disabled:pointer-events-none"
            >
              <CreditCard className="h-4 w-4" />
              <span>Charge ${finalTotal.toFixed(2)}</span>
            </button>
          )}

          {/* Fake Success Modal overlay */}
          {store.checkoutStatus === 'success' && store.lastReceipt && (
            <div className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white p-6 rounded-2xl border border-beige-200 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-1">
                  <div className="h-10 w-10 bg-sage-100 text-sage-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-medium text-lg text-charcoal">Charge Successful</h3>
                  <p className="text-xs text-charcoal-muted">Receipt {store.lastReceipt.receiptId} Generated</p>
                </div>

                <div className="border-t border-b border-dashed border-beige-200 py-3 text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span className="font-medium text-charcoal">{store.lastReceipt.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span>{store.lastReceipt.date}</span>
                  </div>
                  <div className="divide-y divide-beige-100 pt-2">
                    {store.cart.map(i => (
                      <div key={i.item.id} className="flex justify-between py-1">
                        <span>{i.item.name} x{i.quantity}</span>
                        <span>${(i.item.price * i.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between border-t border-beige-100 pt-2 font-semibold">
                    <span>Paid Total (inc VAT):</span>
                    <span>${store.lastReceipt.total.toFixed(2)}</span>
                  </div>
                  <div className="pt-1.5 space-y-0.5">
                    {store.lastReceipt.payments.map((p, idx) => (
                      <div key={idx} className="flex justify-between text-[11px] text-sage-800">
                        <span>• via {p.type}:</span>
                        <span>${p.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => { window.print(); }} 
                    className="flex-1 py-2 bg-beige-100 hover:bg-beige-200 text-charcoal text-xs rounded-lg font-medium transition-all flex items-center justify-center gap-1"
                  >
                    <Printer className="h-3 w-3" />
                    <span>Print</span>
                  </button>
                  <button 
                    onClick={store.clearCart} 
                    className="flex-1 py-2 bg-sage-600 hover:bg-sage-700 text-white text-xs rounded-lg font-medium transition-all"
                  >
                    Close Terminal
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 4. CLIENTS CRM
  if (subView === 'crm') {
    const filtered = store.clients.filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            client.phone.includes(searchQuery) ||
                            client.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = crmFilter === 'All' ? true : client.status === crmFilter;
      return matchesSearch && matchesFilter;
    });

    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-medium">Guest Database CRM</h3>
            <p className="text-xs text-charcoal-muted font-light">Search, manage levels, and review history of {store.clients.length} guests</p>
          </div>
          <div className="flex bg-beige-100/50 p-0.5 rounded-lg text-xs border border-beige-100 w-fit">
            {(['All', 'VIP', 'Member', 'Standard'] as const).map(t => (
              <button 
                key={t}
                onClick={() => setCrmFilter(t)}
                className={`px-3 py-1.5 rounded-md transition-all ${crmFilter === t ? 'bg-white text-charcoal shadow-card font-medium' : 'text-charcoal-muted'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Search tool */}
        <div className="flex items-center gap-3 border border-beige-100 rounded-lg px-3 py-2 w-full max-w-sm">
          <Search className="h-4 w-4 text-charcoal-muted" />
          <input 
            type="text" 
            placeholder="Search client name, email, or mobile..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs focus:outline-none text-charcoal"
          />
        </div>

        {/* Database List */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                <th className="p-3">Client</th>
                <th className="p-3">Level</th>
                <th className="p-3">Visits</th>
                <th className="p-3">Lifetime Spend</th>
                <th className="p-3">Pref. Specialist</th>
                <th className="p-3">Allergies</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {filtered.slice(0, 15).map(client => {
                let badgeClass = "bg-beige-100 text-charcoal";
                if (client.status === 'VIP') badgeClass = "bg-gold/10 text-gold font-semibold border border-gold/20";
                if (client.status === 'Member') badgeClass = "bg-sage-50 text-sage-800 border border-sage-100";
                
                return (
                  <tr key={client.id} className="hover:bg-beige-50/25 transition-colors">
                    <td className="p-3 flex items-center gap-3">
                      <img src={client.avatar} alt={client.name} className="h-8 w-8 rounded-full object-cover border border-beige-100" />
                      <div>
                        <div className="font-semibold text-charcoal">{client.name}</div>
                        <div className="text-[10px] text-charcoal-muted">{client.email}</div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider ${badgeClass}`}>
                        {client.status}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-charcoal">{client.visits}</td>
                    <td className="p-3 font-semibold text-charcoal-light">${client.totalSpend.toLocaleString()}</td>
                    <td className="p-3 text-charcoal-muted">{client.favoriteTherapist}</td>
                    <td className="p-3 truncate max-w-[150px]">
                      {client.allergies.map((a, aIdx) => (
                        <span key={aIdx} className={`px-1.5 py-0.5 rounded text-[9px] mr-1 ${a === 'None' ? 'bg-beige-50 text-charcoal-muted' : 'bg-coral-light text-coral font-medium'}`}>
                          {a}
                        </span>
                      ))}
                    </td>
                    <td className="p-3 text-right">
                      <button 
                        onClick={() => {
                          store.selectClient(client.id);
                          store.setView('client-profile');
                        }}
                        className="px-2 py-1 bg-sage-50 text-sage-700 hover:bg-sage-600 hover:text-white rounded border border-sage-100 text-[10px] transition-all font-medium"
                      >
                        Inspect Dossier
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-charcoal-muted italic">No clients found matching the query.</div>
          )}
        </div>
      </div>
    );
  }

  // 5. CLIENT PROFILE DETAIL
  if (subView === 'client-profile') {
    const client = store.clients.find(c => c.id === store.selectedClientId) || store.clients[0];
    
    if (!client) return <div>Client not found</div>;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
        {/* Left: General Dossier */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 lg:col-span-1 h-fit">
          <div className="text-center space-y-3">
            <img src={client.avatar} alt={client.name} className="h-24 w-24 rounded-full object-cover mx-auto border-2 border-sage-100 shadow-premium" />
            <div>
              <h3 className="text-lg font-display font-medium">{client.name}</h3>
              <p className="text-xs text-charcoal-muted">{client.email} | {client.phone}</p>
            </div>
            <div className="flex justify-center gap-2">
              <span className="text-[10px] uppercase tracking-wider bg-gold/10 text-gold px-3 py-1 rounded-full font-semibold border border-gold/20">
                {client.status} Level
              </span>
              {client.consentSigned ? (
                <span className="text-[10px] bg-sage-50 text-sage-800 border border-sage-100 px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Consent Signed</span>
                </span>
              ) : (
                <span className="text-[10px] bg-coral-light text-coral border border-coral/20 px-3 py-1 rounded-full font-medium">
                  Needs Consent Sign
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-beige-100 pt-4 space-y-3 text-xs">
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Loyalty Balance</span>
              <span className="font-semibold text-sage-800">{client.loyaltyScore} pts</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Favorite Therapist</span>
              <span className="font-semibold text-charcoal">{client.favoriteTherapist}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-charcoal-muted">Favorite Therapy</span>
              <span className="font-semibold text-charcoal">{client.favoriteTreatment}</span>
            </div>
            <div className="space-y-1">
              <span className="text-charcoal-muted">Clinical Contraindications / Allergies:</span>
              <div className="flex flex-wrap gap-1">
                {client.allergies.map((a, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-coral-light text-coral font-medium rounded text-[10px]">
                    {a}
                  </span>
                ))}
              </div>
            </div>
            <div className="space-y-1 pt-1.5">
              <span className="text-charcoal-muted">General Concierge Notes:</span>
              <p className="text-charcoal bg-beige-50/50 p-2.5 rounded-lg italic leading-relaxed text-[11px] border border-beige-100/50">{client.notes}</p>
            </div>
          </div>
        </div>

        {/* Right: Journey Maps & past sessions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Journey Roadmap */}
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
            <div>
              <h3 className="text-lg font-display font-medium">Guest Journey Milestone Map</h3>
              <p className="text-xs text-charcoal-muted font-light">Custom therapeutic development roadmap</p>
            </div>
            
            <div className="relative pl-6 border-l border-beige-200 space-y-6">
              {client.journey.map((j, jIdx) => (
                <div key={jIdx} className="relative">
                  <div className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full bg-sage-600 border-2 border-white ring-4 ring-sage-50" />
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-charcoal">{j.stage}</span>
                      <span className="text-charcoal-muted font-mono">{j.date}</span>
                    </div>
                    <p className="text-xs text-charcoal-muted leading-relaxed font-light">{j.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Past sessions log */}
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
            <div>
              <h3 className="text-lg font-display font-medium">Therapeutic Session Log</h3>
              <p className="text-xs text-charcoal-muted font-light">Progress details of past physical wellness visits</p>
            </div>
            
            <div className="divide-y divide-beige-100">
              {client.sessions.map((s, sIdx) => (
                <div key={sIdx} className="py-3.5 first:pt-0 last:pb-0 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-charcoal">{s.service}</span>
                    <span className="text-charcoal-muted font-mono">{s.date}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-charcoal-light font-light">
                    <span>Practitioner: <strong className="font-medium">{s.therapist}</strong></span>
                    <span>Status: Checked Out</span>
                  </div>
                  <p className="bg-beige-50/30 p-2 border border-beige-100/40 rounded italic text-charcoal-muted leading-normal">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 6. MEMBERSHIPS VIEW
  if (subView === 'memberships') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">VIP Club Membership Tiers</h3>
          <p className="text-xs text-charcoal-muted">Loyalty systems and automated subscription benefits</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Pearl Sanctuary Tier',
              price: 150,
              period: 'month',
              color: 'border-beige-200 bg-white',
              benefits: ['1 Wellness Therapy/Month', '10% Retail Boutique Discount', 'Lemongrass Pre-Tea Lounge Access', 'Standard Booking priority'],
              sales: 124
            },
            {
              name: 'Emerald Sanctuary Tier',
              price: 290,
              period: 'month',
              color: 'border-sage-300 bg-sage-50/10 shadow-premium',
              benefits: ['2 Premium Therapies/Month', '15% Retail Boutique Discount', 'Lemongrass Pre-Tea Lounge Access', 'Priority Booking Guarantee', 'Free Birthday Body Oil Gift Set'],
              sales: 84
            },
            {
              name: 'Diamond Sanctuary Tier',
              price: 550,
              period: 'month',
              color: 'border-gold bg-white relative',
              benefits: ['Unlimited Soaking Pool Access', '4 Premium Therapies/Month', '20% Retail Boutique Discount', 'Private Lavender Suite Priority', 'Express Checkout Split Facility', 'Personal Concierge Specialist Desk'],
              sales: 32,
              ribbon: 'Most Luxurious'
            }
          ].map((tier, idx) => (
            <div key={idx} className={`p-6 rounded-2xl border shadow-card flex flex-col justify-between ${tier.color}`}>
              {tier.ribbon && (
                <span className="absolute -top-3 right-6 bg-gold text-charcoal text-[9px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full">
                  {tier.ribbon}
                </span>
              )}
              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-semibold text-charcoal text-base">{tier.name}</h4>
                  <p className="text-xs text-charcoal-muted mt-1">{tier.sales} active members enrolled</p>
                </div>
                
                <div className="flex items-baseline text-charcoal">
                  <span className="text-3xl font-display font-bold">${tier.price}</span>
                  <span className="text-xs text-charcoal-muted font-light">/{tier.period}</span>
                </div>
                
                <ul className="space-y-2.5 pt-4 border-t border-beige-100 text-xs">
                  {tier.benefits.map((b, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-sage-600 mt-0.5 flex-shrink-0" />
                      <span className="text-charcoal-light font-light">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <button className="w-full mt-6 py-2 border border-beige-100 hover:bg-sage-600 hover:text-white hover:border-sage-600 rounded-lg text-xs font-semibold text-charcoal transition-all">
                Subscribe Guest
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 7. PACKAGES VIEW
  if (subView === 'packages') {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Bundled Wellness Packages</h3>
          <p className="text-xs text-charcoal-muted">Multi-service treatment sequences for couples or corporate clients</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: 'Nirvana Couples Retreat',
              desc: 'Designed for pairs seeking deep relaxation and somatic balancing.',
              price: 420,
              items: ['60m Hot Stone Ritual', '30m Hydrating Mud Wrap', '30m Lavender Soaking Tub Session', 'Complimentary Champagne & Strawberries'],
              val: '2 Hours 40 Mins'
            },
            {
              name: 'Absolute Botanical Purification Series',
              desc: 'High-potency skin detoxification and core muscle release.',
              price: 380,
              items: ['75m Deep Tissue Harmony', '45m Peptide Face Renewal', '25m Steam Room Pre-Warm', 'Take-home Sandalwood Oil Bottle'],
              val: '2 Hours 25 Mins'
            }
          ].map((pkg, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-display font-semibold text-charcoal text-base">{pkg.name}</h4>
                    <p className="text-xs text-charcoal-muted leading-relaxed mt-1 font-light">{pkg.desc}</p>
                  </div>
                  <span className="bg-sage-50 text-sage-800 text-[10px] px-2.5 py-1 rounded font-semibold border border-sage-100 whitespace-nowrap">
                    {pkg.val}
                  </span>
                </div>
                
                <div className="space-y-2 text-xs">
                  <span className="font-semibold text-charcoal-light">Sequence Flow:</span>
                  <div className="grid grid-cols-2 gap-2 text-charcoal-muted font-light">
                    {pkg.items.map((it, iIdx) => (
                      <div key={iIdx} className="flex gap-1 items-center">
                        <span className="text-gold font-bold">•</span>
                        <span>{it}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-beige-100 mt-6 pt-4">
                <div>
                  <span className="text-[10px] text-charcoal-muted font-light">Package Pricing:</span>
                  <div className="text-lg font-bold text-sage-800">${pkg.price}</div>
                </div>
                <button 
                  onClick={() => {
                    store.setView('pos');
                    store.addToCart({ id: `pkg-${idx}`, name: pkg.name, type: 'service', price: pkg.price });
                  }}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <span>Ring Up POS</span>
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 8. VOUCHER CENTER
  if (subView === 'vouchers') {
    const handleCreateVoucher = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newVoucher.client) return;
      const code = `SAN-${Math.floor(100 + Math.random() * 900)}${newVoucher.client.substring(0, 3).toUpperCase()}`;
      setVouchers(prev => [
        { code, client: newVoucher.client, amount: Number(newVoucher.amount), status: 'Active' },
        ...prev
      ]);
      setNewVoucher({ client: '', amount: '100' });
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in duration-500">
        {/* Left: Generator */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 md:col-span-1 h-fit">
          <div>
            <h3 className="text-lg font-display font-medium">Issue Gift Voucher</h3>
            <p className="text-xs text-charcoal-muted">Print code vouchers for store credit redemption</p>
          </div>

          <form onSubmit={handleCreateVoucher} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Recipient Guest Name</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Clara Montgomery" 
                value={newVoucher.client}
                onChange={e => setNewVoucher(prev => ({ ...prev, client: e.target.value }))}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Voucher Credit Value ($)</label>
              <select 
                value={newVoucher.amount}
                onChange={e => setNewVoucher(prev => ({ ...prev, amount: e.target.value }))}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal bg-white"
              >
                <option value="50">$50 Voucher</option>
                <option value="100">$100 Voucher</option>
                <option value="150">$150 Voucher</option>
                <option value="200">$200 Voucher</option>
                <option value="300">$300 VIP Voucher</option>
              </select>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Generate Code</span>
            </button>
          </form>
        </div>

        {/* Right: Active vouchers log */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card md:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-display font-medium">Voucher Ledger</h3>
            <p className="text-xs text-charcoal-muted font-light">Status tracking of active promotional and gift balances</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                  <th className="p-3">Voucher Code</th>
                  <th className="p-3">Recipient</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {vouchers.map((v, idx) => (
                  <tr key={idx} className="hover:bg-beige-50/20">
                    <td className="p-3 font-mono font-semibold text-sage-800">{v.code}</td>
                    <td className="p-3 text-charcoal">{v.client}</td>
                    <td className="p-3 font-semibold text-charcoal-light">${v.amount}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${v.status === 'Active' ? 'bg-sage-50 text-sage-800 border border-sage-100' : 'bg-beige-100 text-charcoal-muted'}`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {v.status === 'Active' ? (
                        <button 
                          onClick={() => {
                            const updated = [...vouchers];
                            updated[idx].status = 'Redeemed';
                            setVouchers(updated);
                          }}
                          className="px-2 py-1 bg-sage-50 hover:bg-sage-600 hover:text-white rounded border border-sage-100 text-[10px] transition-all"
                        >
                          Redeem in POS
                        </button>
                      ) : (
                        <span className="text-[10px] text-charcoal-muted italic">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
