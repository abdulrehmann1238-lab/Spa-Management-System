"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useSpaStore } from '@/store/spaStore';
import { 
  Check, Smartphone, ShieldAlert, Award, FileText, CheckSquare,
  Sparkles, RefreshCw, PenTool, Eraser
} from 'lucide-react';

interface ViewProps {
  subView: string;
}

export default function GuestViews({ subView }: ViewProps) {
  const store = useSpaStore();
  
  // Public Booking Form state
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    service: 'Deep Tissue Harmony',
    date: new Date().toISOString().substring(0, 10),
    time: '10:00 AM',
    therapistId: 't-1'
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Consent Form Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signedName, setSignedName] = useState('Alexandra Vance');

  // Canvas Drawing Logic
  useEffect(() => {
    if (subView === 'consent-forms') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.strokeStyle = '#3C5A4B';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
    }
  }, [subView]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const autoSign = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    clearSignature();
    ctx.font = '32px "Plus Jakarta Sans", cursive';
    ctx.fillStyle = '#3C5A4B';
    ctx.fillText(signedName, 50, 95);
  };

  // SOAP notes state
  const [soapNotes, setSoapNotes] = useState({
    subjective: 'Client reporting stiffness in upper traps and shoulder blades due to desk posture.',
    objective: 'Moderate palpation trigger points identified along the rhomboids.',
    assessment: 'Stiffness responsive to myofascial release. Recommend scheduling next session in 14 days.',
    plan: 'Apply organic almond oil with high warm stone concentration. Focus scapula region.'
  });

  // ----------------------------------------------------
  // VIEW RENDERERS
  // ----------------------------------------------------

  // 1. PUBLIC WEB ONLINE BOOKING ENGINE
  if (subView === 'online-booking') {
    const handlePublicSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const t = store.therapists.find(th => th.id === bookingForm.therapistId);
      
      store.addAppointment({
        clientId: `c-${store.clients.length + 1}`,
        clientName: bookingForm.name,
        therapistId: bookingForm.therapistId,
        therapistName: t ? t.name : ' Elena Rostova',
        service: bookingForm.service,
        time: bookingForm.time,
        duration: 60,
        bedId: 'Bed 102',
        roomName: 'Jasmine suite',
        status: 'Confirmed',
        price: 150,
        date: bookingForm.date
      });

      setBookingSuccess(true);
      setTimeout(() => setBookingSuccess(false), 4000);
      setBookingForm(prev => ({ ...prev, name: '', email: '' }));
    };

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        {/* Public view (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6">
          <div>
            <h3 className="text-lg font-display font-medium">Guest Booking Engine Simulator</h3>
            <p className="text-xs text-charcoal-muted">This preview renders exactly what your clients see on your website</p>
          </div>

          {bookingSuccess ? (
            <div className="bg-sage-50 border border-sage-200 p-6 rounded-xl text-center space-y-3">
              <div className="h-10 w-10 bg-sage-600 text-white rounded-full flex items-center justify-center mx-auto">
                <Check className="h-5 w-5" />
              </div>
              <h4 className="font-semibold text-charcoal text-sm">Booking Confirmed!</h4>
              <p className="text-xs text-charcoal-muted max-w-xs mx-auto">Your appointment is scheduled. An confirmation SMS and calendar invite has been sent.</p>
            </div>
          ) : (
            <form onSubmit={handlePublicSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal-light">Your Full Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cynthia Nixon"
                  value={bookingForm.name}
                  onChange={e => setBookingForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-light">Preferred Therapy</label>
                  <select 
                    value={bookingForm.service}
                    onChange={e => setBookingForm(prev => ({ ...prev, service: e.target.value }))}
                    className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
                  >
                    <option value="Deep Tissue Harmony">Deep Tissue Harmony ($180)</option>
                    <option value="Hot Stone Ritual">Hot Stone Ritual ($150)</option>
                    <option value="Luminous Facial">Luminous Facial ($130)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-light">Select Specialist</label>
                  <select 
                    value={bookingForm.therapistId}
                    onChange={e => setBookingForm(prev => ({ ...prev, therapistId: e.target.value }))}
                    className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
                  >
                    {store.therapists.map(t => (
                      <option key={t.id} value={t.id}>{t.name} (★{t.rating})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-light">Date</label>
                  <input 
                    type="date" 
                    value={bookingForm.date}
                    onChange={e => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 text-charcoal"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-charcoal-light">Time Slot</label>
                  <select 
                    value={bookingForm.time}
                    onChange={e => setBookingForm(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 bg-white"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-medium transition-all"
              >
                Book Appointment
              </button>
            </form>
          )}
        </div>

        {/* Info panel (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
          <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display">SaaS Customization Advantages</h4>
          <div className="space-y-3 text-xs leading-relaxed font-light text-charcoal-muted">
            <p>Your client booking engine integrates as an embeddable iframe or widget directly inside custom domains (e.g. members.spawellness.com).</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Direct visual styling matches your hotels branding system.</li>
              <li>Therapist schedules block in real-time, preventing double booking.</li>
              <li>Integrates with credit cards or local wallets (GCash/Maya) for pre-paid bookings.</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // 2. MOBILE PREVIEW
  if (subView === 'mobile-preview') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        
        {/* Device frame (5 Cols) */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="w-[280px] h-[550px] border-[10px] border-charcoal bg-beige-50 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col justify-between p-3 select-none">
            {/* Camera notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-charcoal rounded-full z-20" />
            
            {/* Screen Content */}
            <div className="flex-1 flex flex-col justify-between text-charcoal space-y-3 pt-6 overflow-y-auto">
              <div className="flex justify-between items-center text-[10px] border-b border-beige-200 pb-2">
                <span className="font-bold">Sanctuary Club</span>
                <span className="text-charcoal-muted">LTE • 94%</span>
              </div>

              {/* Booking Dashboard Mock */}
              <div className="space-y-3 flex-1 pt-2">
                <div className="p-3 bg-white rounded-xl border border-beige-100 space-y-1.5 shadow-sm">
                  <span className="text-[9px] uppercase tracking-wider text-gold font-semibold">Active Tier</span>
                  <h5 className="font-semibold text-xs leading-tight">Alexandra's Emerald Card</h5>
                  <p className="text-[10px] text-charcoal-muted">Balance: 98 Loyalty Points</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-charcoal-light">My Next Booking:</span>
                  <div className="p-2.5 bg-sage-600 text-white rounded-lg text-[10px] flex items-center justify-between">
                    <div>
                      <div className="font-semibold">Deep Tissue Harmony</div>
                      <div className="opacity-80">Elena • Bed 101</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">June 19</div>
                      <div>10:00 AM</div>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2 bg-beige-100 border border-beige-200 rounded-lg text-[10px] font-semibold text-charcoal text-center">
                  Book A New Session
                </button>
              </div>

              <div className="text-center text-[9px] text-charcoal-muted">
                Copyright © 2026 The Sanctuary
              </div>
            </div>
            
            {/* Bottom Home Indicator */}
            <div className="w-24 h-1 bg-charcoal/30 mx-auto mt-2 rounded-full flex-shrink-0" />
          </div>
        </div>

        {/* Mock Benefits Info (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
          <h3 className="text-lg font-display font-medium">Guest-Facing PWA App</h3>
          <p className="text-xs text-charcoal-muted">Provide a premium native app-like experience for booking, membership barcodes, and receipts.</p>
          <ul className="space-y-2.5 text-xs text-charcoal-light font-light list-disc list-inside">
            <li>Guests add the app to their home screens directly from Safari or Chrome.</li>
            <li>Enables real-time push alerts for therapist delays or booking swaps.</li>
            <li>No App Store taxes or developer account costs.</li>
          </ul>
        </div>

      </div>
    );
  }

  // 3. CLINICAL CONSENT FORMS (HTML5 CANVAS DRAWING)
  if (subView === 'consent-forms') {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
        
        {/* Drawing Canvas (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-lg font-display font-medium">Digital Liability Release & Intake</h3>
            <p className="text-xs text-charcoal-muted">Draw your signature inside the canvas or simulate an auto-written script</p>
          </div>

          <div className="space-y-3">
            <div className="bg-beige-50/50 p-4 border border-beige-100 rounded-lg text-[11px] leading-relaxed text-charcoal-light font-light h-[160px] overflow-y-auto">
              <strong>Liability Release Clause:</strong> By signing below, the client agrees to release The Sanctuary from any liability regarding myofascial soreness or minor skin redness occurring as a natural response to deep tissue massage. The client confirms they have disclosed all clinical allergies and skin sensitivities.
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-charcoal-light">Interactive Signature Area (Draw here):</label>
              <div className="border border-beige-100 rounded-xl bg-beige-50/20 overflow-hidden relative h-[140px]">
                <canvas 
                  ref={canvasRef}
                  width={400}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  className="w-full h-full cursor-crosshair"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 justify-between items-center text-xs pt-4 border-t border-beige-100">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Full Name" 
                value={signedName}
                onChange={e => setSignedName(e.target.value)}
                className="px-2.5 py-1.5 border border-beige-100 rounded-lg text-xs w-36"
              />
              <button 
                onClick={autoSign}
                className="px-3 py-1.5 bg-beige-100 hover:bg-beige-200 text-charcoal rounded-lg font-medium"
              >
                Auto Sign
              </button>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={clearSignature}
                className="px-3 py-1.5 border border-beige-100 text-charcoal rounded-lg hover:bg-beige-50 font-medium"
              >
                Clear
              </button>
              <button 
                onClick={() => alert('Consent Form signature saved to Guest CRM profile.')}
                className="px-3 py-1.5 bg-sage-600 hover:bg-sage-700 text-white rounded-lg font-semibold"
              >
                Submit Form
              </button>
            </div>
          </div>
        </div>

        {/* Details side (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-4">
          <h4 className="text-xs font-semibold text-charcoal-light uppercase tracking-wider font-display">Signed Disclosures</h4>
          <div className="space-y-3 pt-2 text-xs leading-normal font-light">
            <div className="p-3 bg-sage-50/50 border border-sage-100 rounded-lg">
              <div className="font-semibold text-charcoal">Alexandra Vance</div>
              <p className="text-[10px] text-charcoal-muted">Signed: June 15, 2026 • Verified via TouchID</p>
            </div>
            <div className="p-3 bg-sage-50/50 border border-sage-100 rounded-lg">
              <div className="font-semibold text-charcoal">Dorian Sterling</div>
              <p className="text-[10px] text-charcoal-muted">Signed: April 05, 2025 • Verified via SMS OTP</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 4. SESSION TRACKING SOAP NOTES
  if (subView === 'session-tracking') {
    return (
      <div className="bg-white p-6 rounded-2xl border border-beige-100/50 shadow-card space-y-6 animate-in fade-in duration-500">
        <div>
          <h3 className="text-lg font-display font-medium">Session Tracking Progress Notes</h3>
          <p className="text-xs text-charcoal-muted">Therapist progress entries utilizing the clinical SOAP standard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-light">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-light">S - Subjective Symptoms</label>
              <textarea rows={3} value={soapNotes.subjective} onChange={e => setSoapNotes(prev => ({ ...prev, subjective: e.target.value }))} className="w-full p-2.5 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 font-sans" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-light">O - Objective Palpations</label>
              <textarea rows={3} value={soapNotes.objective} onChange={e => setSoapNotes(prev => ({ ...prev, objective: e.target.value }))} className="w-full p-2.5 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 font-sans" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-light">A - Assessment Details</label>
              <textarea rows={3} value={soapNotes.assessment} onChange={e => setSoapNotes(prev => ({ ...prev, assessment: e.target.value }))} className="w-full p-2.5 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 font-sans" />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-charcoal-light">P - Future Plan Recommendations</label>
              <textarea rows={3} value={soapNotes.plan} onChange={e => setSoapNotes(prev => ({ ...prev, plan: e.target.value }))} className="w-full p-2.5 border border-beige-100 rounded-lg focus:outline-none focus:border-sage-500 font-sans" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-beige-100">
          <button 
            onClick={() => alert('SOAP notes saved successfully and synced to therapist dashboard.')}
            className="px-4 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-lg text-xs font-semibold transition-all"
          >
            Save SOAP Record
          </button>
        </div>
      </div>
    );
  }

  return null;
}
