import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield, Radio, Ghost, Wind, Send, MapPin, Sun, Cloud, Rain,
  Zap, Lock,
} from 'lucide-react';
import { BiometricVisualizer } from './components/BiometricVisualizer';
import { TacticalMap } from './components/TacticalMap';
import { RingsAnalysis } from './components/RingsAnalysis';
import { generateTacticalIntel, createTacticalChat } from './services/intelService';
import { cn } from './lib/utils';

const StatusCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  status: string;
  color: string;
}> = ({ icon, label, status, color }) => (
  <div className="flex items-center gap-2 p-2 border-2 border-black bg-white">
    {icon}
    <div className="flex flex-col">
      <span className="text-[9px] uppercase font-bold text-zinc-500">{label}</span>
      <span className={cn('text-xs font-black uppercase tracking-tighter', color)}>{status}</span>
    </div>
  </div>
);

const App: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [input, setInput] = useState('');
  const [tacticalIntel, setTacticalIntel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const initiateHandshake = () => setIsAuthorized(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !isAuthorized) return;
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);
    try {
      const aiResponse = await createTacticalChat(userMessage);
      setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
      const intel = await generateTacticalIntel('Current Route', 'Traffic rings detected at 2 o\'clock');
      setTacticalIntel(intel);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-white text-black font-sans selection:bg-tactical-accent/30">
      {/* Sidebar */}
      <aside className="w-96 border-r-4 border-black flex flex-col bg-white z-20">
        {/* Header */}
        <div className="p-8 border-b-4 border-black bg-black text-white">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-tactical-accent border-2 border-white flex items-center justify-center rotate-3">
              <Shield className="text-white w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">
              REY<br />PROCESS
            </h1>
          </div>
          <p className="text-[11px] uppercase font-bold tracking-widest text-tactical-accent">
            Tactical Spatial Awareness
          </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Biometric Lock */}
          <section>
            <BiometricVisualizer isAuthorized={isAuthorized} />
            {!isAuthorized && (
              <button
                onClick={initiateHandshake}
                className="w-full mt-6 py-4 bg-black text-white font-black text-xl brutal-border hover:bg-tactical-accent transition-all active:translate-x-1 active:translate-y-1 active:shadow-none uppercase tracking-tighter"
              >
                INITIATE HANDSHAKE
              </button>
            )}
          </section>

          {/* System Status */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase font-black text-black border-b-2 border-black pb-1">
              SYSTEM STATUS
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <StatusCard icon={<Radio className="w-4 h-4" />} label="Waze" status="ACTIVE" color="text-black" />
              <StatusCard icon={<Zap className="w-4 h-4" />} label="Rings" status="SCANNING" color="text-tactical-accent" />
              <StatusCard icon={<Ghost className="w-4 h-4" />} label="Ghost" status={isAuthorized ? 'READY' : 'LOCKED'} color={isAuthorized ? 'text-black' : 'text-zinc-400'} />
              <StatusCard icon={<Wind className="w-4 h-4" />} label="Calm" status="OPTIMAL" color="text-black" />
            </div>
          </section>

          {/* Spatial Awareness */}
          <section className="space-y-4">
            <h3 className="text-xs uppercase font-black text-black border-b-2 border-black pb-1">
              SPATIAL AWARENESS
            </h3>
            <RingsAnalysis />
          </section>

          {/* Tactical Intel */}
          <AnimatePresence>
            {tacticalIntel && (
              <motion.section
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-tactical-accent text-white border-2 border-black shadow-[4px_4px_0px_0px_black]"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 fill-current" />
                  <span className="text-xs uppercase font-black">TACTICAL INTEL</span>
                </div>
                <div className="text-xs leading-tight font-bold prose prose-invert prose-xs max-w-none">
                  {tacticalIntel}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </aside>

      {/* Main Content - Tactical Map */}
      <div className="flex-1 relative">
        <TacticalMap />

        {/* Chat Interface */}
        <div className="absolute bottom-0 inset-x-0 pointer-events-none p-12 bg-gradient-to-t from-white via-white/80 to-transparent">
          <div className="w-full max-w-4xl mx-auto pointer-events-auto flex flex-col gap-6">
            {/* Messages */}
            <div className="flex flex-col gap-4 max-h-[30vh] overflow-y-auto mb-4 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'max-w-[70%] p-6 border-2 border-black font-bold text-sm shadow-[4px_4px_0px_0px_black]',
                    msg.role === 'user'
                      ? 'self-end bg-tactical-accent text-white'
                      : 'self-start bg-white text-black'
                  )}
                >
                  <p>{msg.text}</p>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className={cn('relative group transition-all', !isAuthorized && 'opacity-50 pointer-events-none')}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isAuthorized ? 'COMMAND REY PROCESS...' : 'AUTHORIZE BIOMETRIC LOCK...'}
                className="w-full bg-white border-4 border-black py-6 px-8 text-xl font-black uppercase placeholder:text-zinc-300 focus:outline-none focus:bg-zinc-50 transition-all shadow-[8px_8px_0px_0px_black]"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black text-white hover:bg-tactical-accent transition-colors"
              >
                <Send className="w-8 h-8" />
              </button>
            </form>
          </div>
        </div>

        {/* Top Right Status */}
        <div className="absolute top-0 inset-x-0 p-12 flex justify-between items-start pointer-events-none z-10">
          <div className="flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-tactical-accent border-2 border-black" />
              <span className="text-xs font-black tracking-widest text-black uppercase">
                REY PROCESS TACTICAL
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
