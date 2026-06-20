import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, Mic, BrainCircuit, Users, Navigation, 
  ArrowRight, Activity, Bell, Map as MapIcon, ChevronRight, Sun, Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check initial dark mode state
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg selection:bg-primary selection:text-[var(--color-surface)]">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-x-0 border-t-0 rounded-none bg-white/80 dark:bg-[#0B1220]/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-primary/20 shadow-[0_0_10px_rgba(0,200,83,0.3)] bg-black">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-poppins font-bold text-lg tracking-wide hidden sm:block">
              Hazard<span className="text-primary">Reporter</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[color:var(--color-text-muted)]">
            <a href="#features" className="hover:text-[color:var(--color-text)] transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-[color:var(--color-text)] transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-[color:var(--color-text)] transition-colors">Live Stats</a>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full bg-dark-card border border-dark-border text-[var(--color-text)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex items-center justify-center"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button onClick={() => navigate('/dashboard')} className="primary-button text-sm py-2 px-5">
              Open Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-black/5 dark:border-white/5 rounded-full animate-[spin_60s_linear_infinite] border-dashed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/10 rounded-full animate-[spin_40s_linear_infinite_reverse] border-dashed" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col items-start text-left"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 mb-6 backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-gray-300">Live in Pakistan</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
              Making Pakistan's Roads <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                Safer Together.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
              Report potholes, flooding, broken signals, and accidents instantly using voice AI and precise GPS tracking. Built for smart cities and public safety.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="primary-button text-lg px-8 py-4">
                Explore Live Map <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button className="glass-button text-lg px-8 py-4">
                Watch Demo
              </button>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-6 text-sm text-gray-700 dark:text-gray-500 font-medium">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className={`w-10 h-10 rounded-full border-2 border-[color:var(--color-bg)] bg-[color:var(--color-surface)] flex items-center justify-center text-xs text-[color:var(--color-text)] z-[${10-i}]`}>
                    User
                  </div>
                ))}
              </div>
              <p>Join 12,500+ citizens<br/>reporting daily.</p>
            </motion.div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="relative h-[500px] w-full hidden lg:block"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--color-card)] to-transparent rounded-[2.5rem] border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden flex items-center justify-center">
              {/* Abstract Map Representation */}
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
              
              <motion.div className="relative w-full h-full p-8" animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
                {/* Mock UI Cards floating */}
                <div className="absolute top-10 left-10 glass-panel p-4 flex items-center gap-4 w-64 transform -rotate-6">
                  <div className="bg-red-500/20 p-3 rounded-xl"><ShieldAlert className="text-red-400" /></div>
                  <div>
                    <p className="text-sm font-bold">Severe Pothole</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Reported 2 mins ago</p>
                  </div>
                </div>
                
                <div className="absolute bottom-20 right-10 glass-panel p-4 flex items-center gap-4 w-64 transform rotate-6">
                  <div className="bg-blue-500/20 p-3 rounded-xl"><MapIcon className="text-blue-400" /></div>
                  <div>
                    <p className="text-sm font-bold">Waterlogging</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Verified by 5 users</p>
                  </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
                    <div className="bg-primary text-dark-bg p-4 rounded-2xl shadow-[0_0_30px_rgba(0,200,83,0.5)] relative z-10">
                      <Mic className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative bg-black/5 dark:bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-primary text-sm font-bold tracking-widest uppercase mb-3">Core Capabilities</h2>
            <h3 className="text-3xl md:text-5xl font-bold mb-6">Powered by AI.<br/>Driven by Community.</h3>
            <p className="text-gray-600 dark:text-gray-400">Our platform utilizes cutting-edge technology to ensure accurate, instant, and actionable road hazard reporting.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Mic, title: "Voice Reporting", desc: "Report hazards hands-free while driving using our smart voice recognition system.", color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: BrainCircuit, title: "AI Classification", desc: "Our AI automatically categorizes hazards and determines severity based on your description.", color: "text-purple-400", bg: "bg-purple-400/10" },
              { icon: Navigation, title: "Precision GPS", desc: "Automatically grabs exact coordinates to pinpoint the hazard on the interactive map.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
              { icon: Activity, title: "Real-time Map", desc: "View live reports on an interactive Leaflet map with clustered rendering.", color: "text-orange-400", bg: "bg-orange-400/10" },
              { icon: Users, title: "Community Verification", desc: "Citizens can upvote and verify hazards to prioritize government response.", color: "text-pink-400", bg: "bg-pink-400/10" },
              { icon: Bell, title: "Instant Alerts", desc: "Get notified about severe hazards in your vicinity before you reach them.", color: "text-yellow-400", bg: "bg-yellow-400/10" },
            ].map((feature, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx} 
                className="glass-panel p-8 hover:-translate-y-2 transition-all duration-300 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h4 className="text-xl font-bold mb-3">{feature.title}</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-5xl font-bold mb-6">How It Works</h3>
          </div>
          
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-1/2 hidden md:block"></div>
            
            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {[
                { step: "01", title: "Spot a Hazard", desc: "Notice a pothole, broken signal, or flooding." },
                { step: "02", title: "Tap to Speak", desc: "Hit the mic button and describe what you see." },
                { step: "03", title: "AI Processing", desc: "AI extracts type, severity, and exact location." },
                { step: "04", title: "Live on Map", desc: "Hazard is instantly broadcasted to the city map." }
              ].map((item, idx) => (
                <div key={idx} className="glass-panel p-6 relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 text-7xl font-bold text-black/5 dark:text-white/5 group-hover:text-primary/10 transition-colors">
                    {item.step}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[var(--color-bg)] border border-black/10 dark:border-white/10 flex items-center justify-center font-bold text-primary mb-4 relative z-10">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-bold mb-2 relative z-10">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 relative z-10">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats */}
      <section id="stats" className="py-20 bg-primary/5 border-y border-black/5 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Total Reports", value: "12,543" },
              { label: "Verified Hazards", value: "8,920" },
              { label: "Active Cities", value: "36" },
              { label: "Fixed Issues", value: "4,150" }
            ].map((stat, idx) => (
              <div key={idx}>
                <div className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-2">{stat.value}</div>
                <div className="text-sm text-primary font-medium tracking-wide uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,200,83,0.15)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Ready to make a difference?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10">Join thousands of citizens reporting hazards and helping authorities make our cities safer.</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/dashboard')} className="primary-button text-lg px-10 py-4">
              Open Dashboard
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-black/10 dark:border-white/10 py-8 text-center text-gray-500 text-sm bg-[var(--color-bg)]">
        <p>© 2026 Pakistan Road Hazard Reporter. Built for Smart Cities.</p>
      </footer>
    </div>
  );
}
