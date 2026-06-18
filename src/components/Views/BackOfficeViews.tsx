"use client";

import React, { useState } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  Plus, Minus, AlertTriangle, TrendingDown, Clipboard, Mail, Check,
  ChevronRight, DollarSign, Calendar, Filter, FileText, Send
} from 'lucide-react';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

interface ViewProps {
  subView: string;
}

const COLORS = ['#3C5A4B', '#C5A880', '#75A083', '#CBDCD0', '#D3C7A3'];

export default function BackOfficeViews({ subView }: ViewProps) {
  const store = useSpaStore();
  const [supplierEmail, setSupplierEmail] = useState<{ open: boolean; to: string; subject: string; body: string } | null>(null);
  
  // Expenses state
  const [expenses, setExpenses] = useState([
    { id: 1, name: 'Water & Electricity Utilities', amount: 840, category: 'Utilities', date: '2026-06-15' },
    { id: 2, name: 'Sage & Lavender Oil Supplies', amount: 450, category: 'Supplies', date: '2026-06-12' },
    { id: 3, name: 'Facility Lease', amount: 3500, category: 'Rent', date: '2026-06-01' },
    { id: 4, name: 'Laundry Linen Services', amount: 320, category: 'Maintenance', date: '2026-06-10' }
  ]);
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', category: 'Supplies', date: new Date().toISOString().substring(0, 10) });

  const totalInventoryVal = store.inventory.reduce((sum, item) => sum + (item.stock * item.cost), 0);
  const totalRetailVal = store.inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. INVENTORY VIEW
  if (subView === 'inventory') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-medium">Boutique Inventory Stock</h3>
            <p className="text-xs text-charcoal-muted">Adjust units in real-time. Low stock items are flagged dynamically.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-charcoal bg-beige-100 px-3 py-1.5 rounded-lg border border-beige-200">
              Total Stock Value: <strong>${totalInventoryVal.toLocaleString()}</strong>
            </span>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                <th className="p-3">Product Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Stock level</th>
                <th className="p-3">Supplier</th>
                <th className="p-3 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige-100">
              {store.inventory.map(item => {
                const isLow = item.stock <= item.minStock;
                
                return (
                  <tr key={item.id} className="hover:bg-beige-50/20 transition-colors">
                    <td className="p-3 font-medium text-charcoal">
                      <div className="flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {isLow && (
                          <span className="h-4 w-4 text-coral animate-pulse" title="Low Stock Alert">
                            <AlertTriangle className="h-3.5 w-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-charcoal-muted">{item.category}</td>
                    <td className="p-3 font-mono font-semibold text-charcoal-light">{item.sku}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${isLow ? 'bg-coral-light text-coral border border-coral/20' : 'bg-sage-50 text-sage-800'}`}>
                        {item.stock} left (min: {item.minStock})
                      </span>
                    </td>
                    <td className="p-3 text-charcoal-muted">{item.supplier}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => store.adjustStock(item.id, -1)}
                          className="h-7 w-7 rounded bg-beige-100 hover:bg-beige-200 text-charcoal flex items-center justify-center font-bold active:scale-90 transition-transform"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <button 
                          onClick={() => store.adjustStock(item.id, 1)}
                          className="h-7 w-7 rounded bg-sage-50 border border-sage-100 hover:bg-sage-600 hover:text-white hover:border-sage-600 text-sage-700 flex items-center justify-center font-bold active:scale-90 transition-transform"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
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

  // 2. INVENTORY ANALYTICS
  if (subView === 'inventory-analytics') {
    const pieData = store.inventory.map(i => ({
      name: i.name.split(' ').slice(0,2).join(' '),
      value: i.stock * i.cost
    }));

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Inventory Cost Valuations</h3>
          <p className="text-xs text-charcoal-muted">Valuation summaries and cost metrics for retail assets</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card stats */}
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-xs text-charcoal-muted">Asset Value (At Cost)</span>
            <h4 className="text-3xl font-display font-semibold mt-2">${totalInventoryVal.toLocaleString()}</h4>
            <p className="text-[10px] text-charcoal-muted mt-1">Capital invested in active raw goods</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-xs text-charcoal-muted">Est. Retail Value</span>
            <h4 className="text-3xl font-display font-semibold mt-2">${totalRetailVal.toLocaleString()}</h4>
            <p className="text-[10px] text-charcoal-muted mt-1">Potential gross revenue on boutique sales</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card">
            <span className="text-xs text-charcoal-muted">Est. Gross Margin</span>
            <h4 className="text-3xl font-display font-semibold mt-2">
              {totalRetailVal > 0 ? (((totalRetailVal - totalInventoryVal) / totalRetailVal) * 100).toFixed(0) : 0}%
            </h4>
            <p className="text-[10px] text-charcoal-muted mt-1">Calculated margin on current inventory levels</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider">Product Value Distribution</h4>
            <div className="h-[250px] w-full flex justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `$${v}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
            <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display">Utilized Ingredients (L/kg)</h4>
            <div className="space-y-3 pt-2 text-xs">
              {[
                { name: 'Organic Almond Massage Oil', used: '4.2L', loss: '0.1L' },
                { name: 'Pure Sandalwood Extract', used: '1.2L', loss: '0.05L' },
                { name: 'Chamomile Soothing Tea', used: '2.5kg', loss: '0.0kg' }
              ].map((util, uIdx) => (
                <div key={uIdx} className="flex justify-between items-center bg-beige-50/50 p-3 rounded-lg border border-beige-100/20">
                  <span className="font-medium text-charcoal">{util.name}</span>
                  <div className="text-right">
                    <div className="font-semibold text-sage-800">Used: {util.used}</div>
                    <div className="text-[10px] text-coral font-light">Spill/Loss: {util.loss}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. SUPPLIERS
  if (subView === 'suppliers') {
    const handleDraftEmail = (supplier: string, email: string) => {
      setSupplierEmail({
        open: true,
        to: email,
        subject: `The Sanctuary — Supply Reorder Request`,
        body: `Dear Sales Team,\n\nWe would like to request an invoice for a reorder of:\n- 5x Organic Almond Massage Oil (MO-ALM-5L)\n- 3x Pure Sandalwood Extract (EO-SAN-250)\n\nPlease charge our card on file and coordinate shipping next Tuesday.\n\nWarm regards,\nArthur Pendelton\nManager, The Sanctuary`
      });
    };

    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Verified Supplier Directory</h3>
          <p className="text-xs text-charcoal-muted">Automated reordering channels for bulk botanicals and custom linens</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: 'Nirvana Botanical Wholesalers', contact: 'sales@nirvanabotanicals.com', lead: '3 Business Days', cat: 'Oils & Salves' },
            { name: 'Himalayan Flora Imports', contact: 'import-desk@himalayanflora.co.uk', lead: '7 Business Days', cat: 'Extracts & Teas' },
            { name: 'Elite Cosmeceuticals Co', contact: 'accounts@elitecosme.com', lead: '2 Business Days', cat: 'Facial Serums' },
            { name: 'Linen Luxe Guild', contact: 'support@linenluxeguild.com', lead: '5 Business Days', cat: 'Egyptian Cottons' }
          ].map((sup, idx) => (
            <div key={idx} className="p-4 border border-beige-100 rounded-xl flex items-center justify-between hover:border-sage-500 transition-all">
              <div className="space-y-1 text-xs">
                <h4 className="font-semibold text-charcoal">{sup.name}</h4>
                <p className="text-charcoal-muted font-light">{sup.cat} • Lead Time: {sup.lead}</p>
                <div className="text-[10px] text-charcoal-muted font-mono">{sup.contact}</div>
              </div>
              <button 
                onClick={() => handleDraftEmail(sup.name, sup.contact)}
                className="px-3 py-1.5 bg-sage-50 text-sage-800 hover:bg-sage-600 hover:text-white rounded border border-sage-100 text-xs font-semibold transition-all flex items-center gap-1"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Reorder</span>
              </button>
            </div>
          ))}
        </div>

        {/* Email Modal */}
        {supplierEmail && (
          <div className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white p-6 rounded-2xl border border-beige-200 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="font-display font-medium text-lg text-charcoal">Draft Supply Order</h3>
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal-light">Send To:</label>
                  <input type="text" value={supplierEmail.to} readOnly className="w-full px-3 py-1.5 border border-beige-100 rounded focus:outline-none bg-beige-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal-light">Subject:</label>
                  <input type="text" value={supplierEmail.subject} readOnly className="w-full px-3 py-1.5 border border-beige-100 rounded focus:outline-none bg-beige-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-charcoal-light">Message Body:</label>
                  <textarea rows={6} value={supplierEmail.body} onChange={e => setSupplierEmail(prev => prev ? { ...prev, body: e.target.value } : null)} className="w-full px-3 py-2 border border-beige-100 rounded focus:outline-none text-charcoal font-sans" />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setSupplierEmail(null)} className="px-4 py-2 bg-beige-100 text-charcoal text-xs rounded-lg font-medium">Cancel</button>
                <button 
                  onClick={() => {
                    alert('Order Dispatch Simulated Successfully.');
                    setSupplierEmail(null);
                  }}
                  className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white text-xs rounded-lg font-medium flex items-center gap-1"
                >
                  <Send className="h-3 w-3" />
                  <span>Send Reorder Email</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 4. EXPENSES
  if (subView === 'expenses') {
    const handleAddExpense = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newExpense.name || !newExpense.amount) return;
      setExpenses(prev => [
        { id: prev.length + 1, name: newExpense.name, amount: Number(newExpense.amount), category: newExpense.category, date: newExpense.date },
        ...prev
      ]);
      setNewExpense({ name: '', amount: '', category: 'Supplies', date: new Date().toISOString().substring(0, 10) });
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
        {/* Left: Input */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 lg:col-span-1 h-fit">
          <div>
            <h3 className="text-lg font-display font-medium">File Expense Ledger</h3>
            <p className="text-xs text-charcoal-muted">Log facility, supplies, and maintenance fees</p>
          </div>

          <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-medium text-charcoal-light">Description</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Lavender linen replacement pack" 
                value={newExpense.name}
                onChange={e => setNewExpense(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Expense Amount ($)</label>
                <input 
                  type="number" 
                  required
                  placeholder="250" 
                  value={newExpense.amount}
                  onChange={e => setNewExpense(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-charcoal-light">Category</label>
                <select 
                  value={newExpense.category}
                  onChange={e => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
                >
                  <option value="Supplies">Supplies</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Rent">Rent</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all"
            >
              Log Expense
            </button>
          </form>
        </div>

        {/* Right: Table Ledger */}
        <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card lg:col-span-2 space-y-4">
          <div>
            <h3 className="text-lg font-display font-medium">Expense Log Ledger</h3>
            <p className="text-xs text-charcoal-muted font-light">Historical operating cost log</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-beige-50/50 border-b border-beige-100 text-charcoal-light font-semibold">
                  <th className="p-3">Description</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige-100">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-beige-50/20">
                    <td className="p-3 font-medium text-charcoal">{exp.name}</td>
                    <td className="p-3 text-charcoal-muted">{exp.category}</td>
                    <td className="p-3 font-semibold text-coral">-${exp.amount.toFixed(2)}</td>
                    <td className="p-3 text-right font-mono text-charcoal-muted">{exp.date}</td>
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
