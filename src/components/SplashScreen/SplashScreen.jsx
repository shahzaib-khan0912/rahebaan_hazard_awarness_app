import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShieldAlert, Navigation } from 'lucide-react';

export default function SplashScreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // Wait for fade out animation
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] bg-dark-bg flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
              className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.15)_0%,rgba(11,18,32,1)_50%)]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center text-center px-4">
            {/* Logo Animation */}
            <motion.div 
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 15, stiffness: 100, delay: 0.2 }}
              className="relative w-32 h-32 mb-8 flex items-center justify-center"
            >
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 border-2 border-primary rounded-full"
              />
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-[-20px] border border-primary rounded-full"
              />
              
              <div className="bg-dark-card backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(0,200,83,0.3)]">
                <MapPin className="text-primary w-12 h-12" />
              </div>

              {/* Floating Icons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -40, opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                className="absolute top-0 right-[-20px]"
              >
                <ShieldAlert className="text-accent w-6 h-6" />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: -30, x: -30, opacity: [0, 1, 0] }}
                transition={{ duration: 2, delay: 1.5, ease: "easeOut" }}
                className="absolute top-10 left-[-20px]"
              >
                <Navigation className="text-secondary w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Typography Animation */}
            <motion.div className="overflow-hidden">
              <motion.h2 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
                className="text-primary font-semibold tracking-widest uppercase text-sm mb-2"
              >
                Welcome to
              </motion.h2>
            </motion.div>

            <motion.div className="overflow-hidden">
              <motion.h1 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: [0.2, 0.8, 0.2, 1] }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 leading-tight"
              >
                Pakistan Hazard<br/>Reporter
              </motion.h1>
            </motion.div>

            <motion.div className="overflow-hidden mt-6">
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.8 }}
                className="text-gray-400 font-inter text-lg max-w-md mx-auto"
              >
                Making Pakistan's Roads Safer with AI and Community Power
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
