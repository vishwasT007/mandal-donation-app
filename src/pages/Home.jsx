import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import Gallery from "../components/Gallry";

const Home = () => {
  const [donations, setDonations] = useState([]);
  const [targetAmount, setTargetAmount] = useState(50000);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  // Detect mobile device and reduce motion for better performance
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);

      // Reduce motion on mobile for better performance
      if (mobile) {
        document.documentElement.style.setProperty("--motion-reduce", "1");
      } else {
        document.documentElement.style.setProperty("--motion-reduce", "0");
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchDonations = async (retryCount = 0) => {
      try {
        const snapshot = await getDocs(collection(db, "donations"));
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDonations(data);
      } catch {
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          setTimeout(() => {
            fetchDonations(retryCount + 1);
          }, Math.pow(2, retryCount) * 1000);
        } else {
          setDonations([]);
        }
      }
    };

    const fetchTargetAmount = async (retryCount = 0) => {
      try {
        const docRef = doc(db, "settings", "donationGoal");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const target = docSnap.data().targetAmount || 50000;
          setTargetAmount(target);
        }
      } catch {
        // Retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          setTimeout(() => {
            fetchTargetAmount(retryCount + 1);
          }, Math.pow(2, retryCount) * 1000);
        } else {
          setTargetAmount(50000);
        }
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchDonations(), fetchTargetAmount()]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();

    // Check user's preferred color scheme
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setDarkMode(true);
    }
  }, []);

  const totalAmount = donations.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const donorCount = donations.length;

  // Enhanced color schemes for light/dark mode
  const colors = {
    light: {
      primary: "#ea580c",
      secondary: "#fb923c",
      accent: "#f97316",
      background: "#fefce8",
      surface: "#ffffff",
      card: "#ffffff",
      text: "#1e293b",
      muted: "#64748b",
      progress: "#22c55e",
      stats: {
        total: "#fef3c7",
        target: "#dcfce7",
        donors: "#dbeafe",
      },
    },
    dark: {
      primary: "#f97316",
      secondary: "#fb923c",
      accent: "#fdba74",
      background: "#0f172a",
      surface: "#1e293b",
      card: "#334155",
      text: "#f8fafc",
      muted: "#94a3b8",
      progress: "#4ade80",
      stats: {
        total: "#451a03",
        target: "#14532d",
        donors: "#1e3a8a",
      },
    },
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  // Optimized animation variants for mobile performance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.05 : 0.15,
        delayChildren: isMobile ? 0.05 : 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 15 : 30,
      scale: isMobile ? 0.98 : 0.95,
    },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 80 : 100,
        damping: isMobile ? 20 : 15,
        duration: isMobile ? 0.4 : 0.8,
      },
    },
  };

  const heroVariants = {
    hidden: { opacity: 0, y: isMobile ? -25 : -50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: isMobile ? 60 : 80,
        damping: isMobile ? 25 : 20,
        duration: isMobile ? 0.8 : 1.2,
      },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: isMobile ? 0.9 : 0.8 },
    show: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: isMobile ? 100 : 120,
        damping: isMobile ? 15 : 12,
        duration: isMobile ? 0.3 : 0.6,
      },
    },
  };

  return (
    <div
      className={`min-h-screen w-full transition-all duration-700 ease-out ${
        darkMode ? "dark" : ""
      }`}
      style={{
        backgroundColor: currentColors.background,
        color: currentColors.text,
        overflowX: "hidden",
        overflowY: "auto",
        height: "100vh",
        position: "relative",
      }}
    >
      {/* Enhanced Dark mode toggle with smooth transitions */}
      <motion.div
        className="fixed top-6 right-6 z-50"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <motion.button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-3 rounded-full shadow-2xl backdrop-blur-sm transition-all duration-500 ${
            darkMode
              ? "bg-yellow-200 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-yellow-200 hover:bg-gray-700"
          }`}
          whileHover={!isMobile ? { scale: 1.1, rotate: 180 } : {}}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300 }}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </motion.button>
      </motion.div>

      {/* Enhanced Hero Banner with parallax effect */}
      <motion.section
        className="relative py-20 text-center overflow-hidden"
        style={{
          backgroundColor: currentColors.primary,
          backgroundImage: `linear-gradient(135deg, ${currentColors.primary} 0%, ${currentColors.secondary} 100%)`,
        }}
        initial="hidden"
        animate="show"
        variants={heroVariants}
      >
        {/* Animated background elements - Reduced on mobile for performance */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
            <div className="absolute top-32 right-20 w-24 h-24 bg-white rounded-full"></div>
            <div className="absolute bottom-20 left-32 w-20 h-20 bg-white rounded-full"></div>
          </motion.div>
        )}

        {/* Top Right Buttons - Enhanced with better positioning */}
        <div className="fixed top-6 right-20 z-50 flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/login")}
            className={`font-bold px-6 py-3 rounded-full text-sm sm:text-base shadow-lg backdrop-blur-sm transition-all duration-500 ${
              darkMode
                ? "bg-yellow-200 text-gray-900 hover:bg-yellow-300 hover:shadow-xl"
                : "bg-white text-orange-700 hover:bg-orange-100 hover:shadow-xl"
            }`}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="hidden sm:inline">🔐 Login</span>
            <span className="sm:hidden">🔐</span>
          </motion.button>
        </div>

        {/* Enhanced Logo and Title */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
        >
          <div className="px-2 sm:px-4 mb-4 flex justify-center">
            <motion.img
              src="/logo.png"
              alt="Tiroda Cha Raja Logo"
              className="w-[140px] xs:w-[160px] sm:w-[180px] md:w-[200px] lg:w-[220px] h-auto max-w-[95%] drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]"
              whileHover={!isMobile ? { scale: 1.05, rotate: 5 } : {}}
              transition={{ type: "spring", stiffness: 200 }}
            />
          </div>
          <motion.div
            className="text-2xl sm:text-3xl font-bold text-yellow-200 italic mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
          >
            "भक्तीचा, समाजाचा, तिरोड़ाचा अभिमान"
          </motion.div>
        </motion.div>

        <motion.h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold px-4 mb-4 text-white drop-shadow-lg"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 80,
            damping: 20,
          }}
        >
          श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ, तिरोड़ा
        </motion.h1>
        <motion.p
          className="mt-4 text-xl sm:text-2xl px-4 text-yellow-100 font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
        >
          Established in 2017 • Serving Culture, Devotion & Community
        </motion.p>
      </motion.section>

      {/* Enhanced Stats Section with better animations */}
      <motion.section
        className="py-16 px-4 -mt-8 relative z-10"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              className="p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20"
              style={{
                backgroundColor: currentColors.stats.total,
                backgroundImage: `linear-gradient(135deg, ${currentColors.stats.total} 0%, ${currentColors.stats.total}dd 100%)`,
              }}
              variants={statsVariants}
              whileHover={
                !isMobile
                  ? {
                      scale: 1.05,
                      y: -8,
                      transition: { type: "spring", stiffness: 300 },
                    }
                  : {}
              }
            >
              <div className="text-center">
                <div className="text-4xl mb-3">💰</div>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: darkMode ? "#fef08a" : "#713f12" }}
                >
                  Total Donations
                </p>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: darkMode ? "#fef08a" : "#713f12" }}
                >
                  {isLoading ? (
                    <motion.div
                      className="inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    `₹${totalAmount.toLocaleString()}`
                  )}
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20"
              style={{
                backgroundColor: currentColors.stats.target,
                backgroundImage: `linear-gradient(135deg, ${currentColors.stats.target} 0%, ${currentColors.stats.target}dd 100%)`,
              }}
              variants={statsVariants}
              whileHover={
                !isMobile
                  ? {
                      scale: 1.05,
                      y: -8,
                      transition: { type: "spring", stiffness: 300 },
                    }
                  : {}
              }
            >
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: darkMode ? "#bbf7d0" : "#14532d" }}
                >
                  Expected Budget
                </p>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: darkMode ? "#bbf7d0" : "#14532d" }}
                >
                  {isLoading ? (
                    <motion.div
                      className="inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    `₹${targetAmount.toLocaleString()}`
                  )}
                </h2>
              </div>
            </motion.div>

            <motion.div
              className="p-8 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 sm:col-span-2 lg:col-span-1"
              style={{
                backgroundColor: currentColors.stats.donors,
                backgroundImage: `linear-gradient(135deg, ${currentColors.stats.donors} 0%, ${currentColors.stats.donors}dd 100%)`,
              }}
              variants={statsVariants}
              whileHover={
                !isMobile
                  ? {
                      scale: 1.05,
                      y: -8,
                      transition: { type: "spring", stiffness: 300 },
                    }
                  : {}
              }
            >
              <div className="text-center">
                <div className="text-4xl mb-3">👥</div>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
                >
                  Total Donors
                </p>
                <h2
                  className="text-3xl font-bold"
                  style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
                >
                  {isLoading ? (
                    <motion.div
                      className="inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full animate-spin"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  ) : (
                    donorCount
                  )}
                </h2>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Enhanced Progress Bar with smooth animations */}
      <motion.section
        className="py-16 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: currentColors.primary }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 150 }}
          >
            🎯 Our Target
          </motion.h2>
          <motion.p
            className="mb-8 text-lg sm:text-xl"
            style={{ color: currentColors.text }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 100 }}
          >
            We aim to raise ₹{targetAmount.toLocaleString()} to successfully
            organize the Ganesh Utsav this year. Every rupee matters! 🙏
          </motion.p>

          <motion.div
            className="w-full rounded-2xl h-8 mb-4 overflow-hidden shadow-2xl relative bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1.2, duration: 1.5, ease: "easeOut" }}
          >
            <motion.div
              className="h-full rounded-2xl relative overflow-hidden"
              style={{ backgroundColor: currentColors.progress }}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalAmount / targetAmount) * 100, 100)}%`,
                transition: { duration: 2, delay: 1.5, ease: "easeOut" },
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 3,
                }}
              />
            </motion.div>
            <motion.span
              className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white drop-shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3, duration: 0.5 }}
            >
              ₹{totalAmount.toLocaleString()}
            </motion.span>
          </motion.div>

          <motion.p
            className="text-base font-medium"
            style={{ color: currentColors.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.5, duration: 0.5 }}
          >
            ₹{totalAmount.toLocaleString()} raised out of ₹
            {targetAmount.toLocaleString()}
          </motion.p>
        </div>
      </motion.section>

      {/* Enhanced About Section with better visual hierarchy */}
      <motion.section
        className="px-4 sm:px-8 py-20 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3, type: "spring", stiffness: 80 }}
      >
        <motion.div
          className="rounded-3xl shadow-2xl border border-white/20 overflow-hidden backdrop-blur-sm"
          style={{
            backgroundColor: currentColors.card,
            backgroundImage: darkMode
              ? "linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)"
              : "linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #ffedd5 100%)",
          }}
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <div className="p-8 sm:p-12">
            <motion.h2
              className="text-3xl sm:text-5xl font-bold mb-12 text-center"
              style={{ color: currentColors.primary }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, type: "spring", stiffness: 100 }}
            >
              ✨ About Our Mandal
            </motion.h2>

            <motion.div
              className="text-lg sm:text-xl leading-relaxed space-y-8 font-medium"
              style={{ color: currentColors.text }}
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Header */}
              <motion.div
                className="text-center space-y-4"
                variants={itemVariants}
              >
                <motion.p
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: currentColors.primary }}
                >
                  Shree Ram Ganj Bazar Sarvjanik Ganesh Utsav Mandal
                </motion.p>
                <motion.p
                  className="italic text-lg sm:text-xl"
                  style={{ color: currentColors.muted }}
                >
                  Tirora Cha Raja – Since 2017
                </motion.p>
              </motion.div>

              {/* Intro */}
              <motion.p variants={itemVariants} className="text-center">
                Established in 2017, our Mandal proudly organizes{" "}
                <span
                  className="font-bold text-2xl"
                  style={{ color: currentColors.primary }}
                >
                  Tirora Cha Raja
                </span>
                , one of the most beloved and grand Ganesh Utsav celebrations in
                Tirora.
              </motion.p>

              <motion.p variants={itemVariants} className="text-center">
                Guided by deep devotion and an unshakable sense of community,
                our Mandal is a vibrant symbol of{" "}
                <span
                  className="font-bold"
                  style={{ color: currentColors.primary }}
                >
                  unity, tradition
                </span>
                , and
                <span
                  className="font-bold"
                  style={{ color: currentColors.primary }}
                >
                  {" "}
                  selfless seva
                </span>{" "}
                (service). Each year, we unite people not only in joyous
                celebration but also in social good.
              </motion.p>

              {/* Contributions */}
              <motion.div variants={itemVariants}>
                <motion.h3
                  className="text-2xl sm:text-3xl font-bold mb-8 flex items-center justify-center"
                  style={{ color: currentColors.primary }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2, type: "spring", stiffness: 150 }}
                >
                  <span className="text-3xl mr-3">✨</span> Our Core
                  Contributions
                </motion.h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      icon: "🎭",
                      text: "Organizing vibrant Ganesh Utsav events with cultural programs, spiritual gatherings, and stunning decorations.",
                    },
                    {
                      icon: "🩸",
                      text: "Hosting impactful Blood Donation Camps that support public health.",
                    },
                    {
                      icon: "🤝",
                      text: "Helping underprivileged families through community-led initiatives.",
                    },
                    {
                      icon: "🌱",
                      text: "Leading tree plantation drives and environmental awareness campaigns.",
                    },
                    {
                      icon: "🎤",
                      text: "Encouraging youth participation and providing a platform for talent.",
                    },
                    {
                      icon: "🏛️",
                      text: "Preserving and promoting our rich cultural heritage and traditions.",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-2xl backdrop-blur-sm border border-white/20"
                      style={{
                        backgroundColor: darkMode
                          ? "rgba(30, 41, 59, 0.5)"
                          : "rgba(255, 255, 255, 0.5)",
                      }}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.02,
                        y: -2,
                        transition: { type: "spring", stiffness: 300 },
                      }}
                    >
                      <span
                        className="text-3xl mt-1"
                        style={{ color: currentColors.primary }}
                      >
                        {item.icon}
                      </span>
                      <p className="font-medium leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Mission Quote */}
              <motion.div className="text-center mt-12" variants={itemVariants}>
                <motion.p
                  className="font-bold text-2xl sm:text-3xl mb-3"
                  style={{ color: currentColors.primary }}
                >
                  "Bhakti ke saath, Samaj Seva bhi"
                </motion.p>
                <motion.p
                  className="text-lg sm:text-xl"
                  style={{ color: currentColors.muted }}
                >
                  (With devotion, we serve society)
                </motion.p>
              </motion.div>

              {/* Closing */}
              <motion.p
                className="text-center text-lg sm:text-xl mt-8 font-medium"
                variants={itemVariants}
              >
                Join us and be a part of the divine celebration and noble cause
                with
                <span
                  className="font-bold ml-2 text-2xl"
                  style={{ color: currentColors.primary }}
                >
                  Tirora Cha Raja 🙏
                </span>
              </motion.p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: darkMode
            ? "linear-gradient(to bottom right, #1e293b, #334155, #475569)"
            : "linear-gradient(to bottom right, #fffbeb, #ffedd5, #fed7aa)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-4xl sm:text-5xl font-extrabold mb-12 drop-shadow-md"
            style={{ color: currentColors.primary }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <span className="mr-4">✨</span>Meet Our Visionary Team
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Row 1 */}
            <motion.div
              className="p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4"
              style={{
                backgroundColor: currentColors.card,
                borderColor: currentColors.primary,
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3
                className="text-2xl font-extrabold mb-1"
                style={{ color: currentColors.primary }}
              >
                Sandip Neware
              </h3>
              <p
                className="text-xl font-medium mb-2"
                style={{ color: currentColors.text }}
              >
                Chairman
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: currentColors.muted }}
              >
                +91 90221 14901
              </p>
            </motion.div>

            <motion.div
              className="p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4"
              style={{
                backgroundColor: currentColors.card,
                borderColor: currentColors.primary,
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3
                className="text-2xl font-extrabold mb-1"
                style={{ color: currentColors.primary }}
              >
                Sanket Kothe
              </h3>
              <p
                className="text-xl font-medium mb-2"
                style={{ color: currentColors.text }}
              >
                Vice President
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: currentColors.muted }}
              >
                +91 90211 44773
              </p>
            </motion.div>

            <motion.div
              className="p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4"
              style={{
                backgroundColor: currentColors.card,
                borderColor: currentColors.primary,
              }}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <h3
                className="text-2xl font-extrabold mb-1"
                style={{ color: currentColors.primary }}
              >
                Karan Parashar
              </h3>
              <p
                className="text-xl font-medium mb-2"
                style={{ color: currentColors.text }}
              >
                Secretary
              </p>
              <p
                className="text-sm font-semibold"
                style={{ color: currentColors.muted }}
              >
                +91 9595333733
              </p>
            </motion.div>

            {/* Row 2 - Centered and Responsive */}
            <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-8 justify-center">
              <motion.div
                className="p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4"
                style={{
                  backgroundColor: currentColors.card,
                  borderColor: currentColors.primary,
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h3
                  className="text-2xl font-extrabold mb-1"
                  style={{ color: currentColors.primary }}
                >
                  Tushar Sharma
                </h3>
                <p
                  className="text-xl font-medium mb-2"
                  style={{ color: currentColors.text }}
                >
                  Treasurer
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: currentColors.muted }}
                >
                  +91 9834873945
                </p>
              </motion.div>

              <motion.div
                className="p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4"
                style={{
                  backgroundColor: currentColors.card,
                  borderColor: currentColors.primary,
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
              >
                <h3
                  className="text-2xl font-extrabold mb-1"
                  style={{ color: currentColors.primary }}
                >
                  Atul Dipani
                </h3>
                <p
                  className="text-xl font-medium mb-2"
                  style={{ color: currentColors.text }}
                >
                  Event In-Charge
                </p>
                <p
                  className="text-sm font-semibold"
                  style={{ color: currentColors.muted }}
                >
                  +91 70380 67298
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {/* Counsellors */}
            <motion.div
              className="p-8 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: currentColors.card,
                borderColor: currentColors.primary,
              }}
              variants={itemVariants}
            >
              <h3
                className="text-3xl font-extrabold mb-5 flex items-center justify-center"
                style={{ color: currentColors.primary }}
              >
                <span className="mr-3">🧑‍⚖️</span> Our Esteemed Counsellors
              </h3>
              <div className="text-base leading-relaxed grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                {[
                  "Bhagwandas Ji Dipani",
                  "Manoj Ji Jiwtani",
                  "Suresh Ji Parashar",
                  "Pankaj Ji Dehliwal",
                  "Chetan Ji Parashar",
                  "Sanjay Ji Kothe",
                  "Bhushan Ji Zararia",
                  "Gaurav Ji Chaurasia",
                  "Kumar Ji Harode",
                  "Raju Ji Parashar",
                ].map((name, index) => (
                  <motion.span
                    key={index}
                    className="py-1 px-3 rounded-full"
                    style={{
                      backgroundColor: darkMode ? "#1e293b" : "#ffedd5",
                      color: currentColors.text,
                    }}
                    variants={itemVariants}
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Members */}
            <motion.div
              className="p-8 rounded-2xl shadow-lg border"
              style={{
                backgroundColor: currentColors.card,
                borderColor: currentColors.primary,
              }}
              variants={itemVariants}
            >
              <h3
                className="text-3xl font-extrabold mb-5 flex items-center justify-center"
                style={{ color: currentColors.primary }}
              >
                <span className="mr-3">🤝</span> Dedicated Members
              </h3>
              <div className="text-base leading-relaxed grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
                {[
                  "Uday Parashar",
                  "Ronit Ladhani",
                  "Harshal Chhattani",
                  "Pralay Neware",
                  "Aniket Kesharwani",
                  "Rohit Tarare",
                  "Niraj Tarare",
                  "Darshan Zararia",
                  "Nitin Ochani",
                  "Nikhil Kumbhare",
                  "Nikhil Shukla",
                  "Nayan Asati",
                  "Roshan Nagrikar",
                  "Saurabh Chhabadiya",
                  "Shubham Chaudhary",
                  "Satyam Sapate",
                  "Aman Bairisal",
                ].map((name, index) => (
                  <motion.span
                    key={index}
                    className="py-1 px-3 rounded-full"
                    style={{
                      backgroundColor: darkMode ? "#1e293b" : "#ffedd5",
                      color: currentColors.text,
                    }}
                    variants={itemVariants}
                  >
                    {name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Gallery */}
      <Gallery currentColors={currentColors} />

      {/* Contact Us */}
      <motion.section
        className="py-8 px-4"
        style={{ backgroundColor: currentColors.card }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: currentColors.primary }}
          >
            📞 Contact Us
          </h2>
          <p className="mb-4" style={{ color: currentColors.text }}>
            For any queries, contributions, or to volunteer, feel free to reach
            out:
          </p>
          <p className="font-semibold" style={{ color: currentColors.text }}>
            📧 tiroracharaja@gmail.com
          </p>
          <p className="font-semibold" style={{ color: currentColors.text }}>
            📱 +91 70380 67298 (Atul Dipani)
          </p>
          <p className="font-semibold" style={{ color: currentColors.text }}>
            📱 +91 95953 33733 (Karan Parashar)
          </p>
          <div className="mt-4">
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: currentColors.primary }}
            >
              📱 Follow Us
            </h3>
            <p style={{ color: currentColors.text }}>
              <a
                href="https://www.instagram.com/Tiroracharaja_"
                className="underline"
                style={{ color: currentColors.secondary }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @Tiroracharaja_
              </a>
              <br />
              <a
                href="https://www.youtube.com/results?search_query=Tirora+Cha+Raja"
                className="underline"
                style={{ color: currentColors.secondary }}
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube: Tirora Cha Raja
              </a>
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
