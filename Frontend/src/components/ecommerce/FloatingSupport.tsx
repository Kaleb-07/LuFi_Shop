import { useState } from "react";
import { MessageCircle, X, Send, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FloatingSupport = () => {
  const [isOpen, setIsOpen] = useState(false);
  const whatsappNumber = "+251921381389"; // Replace with your actual WhatsApp number
  const shopName = "LuFi Shop";

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4">
      {/* Support Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-80 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col mb-4"
          >
            {/* Header */}
            <div className="gold-gradient p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-xl font-black tracking-tight">Support Chat</h3>
              <p className="text-white/80 text-xs font-bold mt-1 uppercase tracking-widest">Typically replies in minutes</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <p className="text-sm font-medium text-slate-600 leading-relaxed">
                  Hi there! 👋 How can we help you today? Feel free to ask about orders, delivery, or products.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=Hi ${shopName}, I have a question about...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full bg-[#25D366] hover:bg-[#20ba59] text-white p-4 rounded-2xl font-black text-sm transition-all shadow-lg shadow-green-500/20 active:scale-95"
                >
                  <Phone className="h-5 w-5" />
                  Chat on WhatsApp
                </a>

                <button
                  className="flex items-center justify-center gap-3 w-full bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-2xl font-black text-sm transition-all active:scale-95"
                  onClick={() => alert("Live chat agent is currently offline. Please use WhatsApp.")}
                >
                  <Send className="h-5 w-5" />
                  Live Support
                </button>
              </div>
            </div>

            <div className="p-4 text-center border-t border-slate-50">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">LuFi Shop Support Team</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`h-16 w-16 rounded-full shadow-2xl flex items-center justify-center transition-all ${isOpen ? "bg-slate-900 text-white" : "gold-gradient text-white"
          }`}
      >
        {isOpen ? <X className="h-8 w-8" /> : <MessageCircle className="h-8 w-8" />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 border-4 border-white rounded-full" />
        )}
      </motion.button>
    </div>
  );
};

export default FloatingSupport;
