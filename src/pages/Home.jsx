import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";
import Gallery from "../components/Gallry";

const Home = () => {
  const [donations, setDonations] = useState([]);
  const [targetAmount, setTargetAmount] = useState(50000);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDonations = async () => {
      const snapshot = await getDocs(collection(db, "donations"));
      const data = snapshot.docs.map((doc) => doc.data());
      setDonations(data);
    };

    const fetchTargetAmount = async () => {
      const docRef = doc(db, "settings", "donationGoal");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTargetAmount(docSnap.data().targetAmount || 50000);
      }
    };

    fetchDonations();
    fetchTargetAmount();

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

  // Color schemes for light/dark mode
  const colors = {
    light: {
      primary: "#c2410c",
      secondary: "#ea580c",
      background: "#fffbeb",
      card: "#ffffff",
      text: "#1e293b",
      muted: "#64748b",
      progress: "#22c55e",
      stats: {
        total: "#fef08a",
        target: "#bbf7d0",
        donors: "#bfdbfe",
      },
    },
    dark: {
      primary: "#f97316",
      secondary: "#fb923c",
      background: "#1e293b",
      card: "#334155",
      text: "#f8fafc",
      muted: "#94a3b8",
      progress: "#4ade80",
      stats: {
        total: "#713f12",
        target: "#14532d",
        donors: "#1e3a8a",
      },
    },
  };

  const currentColors = darkMode ? colors.dark : colors.light;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div
      className={`min-h-screen w-full transition-colors duration-300 ${
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
      {/* Dark mode toggle */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full shadow-lg ${
            darkMode
              ? "bg-yellow-200 text-gray-900"
              : "bg-gray-800 text-yellow-200"
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      {/* Banner */}
      <motion.section
        className="relative py-12 text-center"
        style={{ backgroundColor: currentColors.primary, color: "white" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Top Right Buttons - Optimized for all devices */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          {/* Login Button - appears first on mobile */}
          <motion.button
            onClick={() => navigate("/login")}
            className={`font-semibold px-3 py-1 rounded-full text-sm sm:text-base ${
              darkMode
                ? "bg-yellow-200 text-gray-900 hover:bg-yellow-300"
                : "bg-white text-orange-700 hover:bg-orange-100"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="hidden sm:inline">🔐 Login</span>
            <span className="sm:hidden">🔐</span>
          </motion.button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-full shadow-lg ${
              darkMode
                ? "bg-yellow-200 text-gray-900"
                : "bg-gray-800 text-yellow-200"
            }`}
            aria-label={
              darkMode ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Added Tirora Cha Raja in Hindi with creative styling */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="px-2 sm:px-4 mb-1 sm:mb-2 flex justify-center">
            <img
              src="/logo.png"
              alt="Tiroda Cha Raja Logo"
              className="w-[120px] xs:w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px] h-auto max-w-[95%] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
            />
          </div>
          <div className="text-xl sm:text-2xl font-semibold text-yellow-200 italic">
            "भक्तीचा, समाजाचा, तिरोड़ाचा अभिमान"
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl font-bold px-4"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ, तिरोड़ा
        </motion.h1>
        <motion.p
          className="mt-2 text-lg px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Established in 2017 • Serving Culture, Devotion & Community
        </motion.p>
      </motion.section>

      {/* Rest of the code remains exactly the same */}
      {/* Stats */}
      {/* Stats */}
      <motion.section
        className="py-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* First row - always shows first two stats */}
          <div className="grid grid-cols-2 gap-4 text-center mb-4 sm:mb-0 sm:grid-cols-3">
            <motion.div
              className="p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: currentColors.stats.total }}
              whileHover={{ scale: 1.03 }}
              variants={itemVariants}
            >
              <p
                className="text-sm"
                style={{ color: darkMode ? "#fef08a" : "#713f12" }}
              >
                Total Donations
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: darkMode ? "#fef08a" : "#713f12" }}
              >
                ₹{totalAmount.toLocaleString()}
              </h2>
            </motion.div>
            <motion.div
              className="p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: currentColors.stats.target }}
              whileHover={{ scale: 1.03 }}
              variants={itemVariants}
            >
              <p
                className="text-sm"
                style={{ color: darkMode ? "#bbf7d0" : "#14532d" }}
              >
                Expected Budget
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: darkMode ? "#bbf7d0" : "#14532d" }}
              >
                ₹{targetAmount.toLocaleString()}
              </h2>
            </motion.div>

            {/* Third stat - hidden on mobile in this row */}
            <motion.div
              className="hidden sm:block p-4 rounded-xl shadow-lg"
              style={{ backgroundColor: currentColors.stats.donors }}
              whileHover={{ scale: 1.03 }}
              variants={itemVariants}
            >
              <p
                className="text-sm"
                style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
              >
                Total Donors
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
              >
                {donorCount}
              </h2>
            </motion.div>
          </div>

          {/* Second row - only shows on mobile */}
          <div className="sm:hidden flex justify-center">
            <motion.div
              className="p-4 rounded-xl shadow-lg w-full max-w-[200px]"
              style={{ backgroundColor: currentColors.stats.donors }}
              whileHover={{ scale: 1.03 }}
              variants={itemVariants}
            >
              <p
                className="text-sm"
                style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
              >
                Total Donors
              </p>
              <h2
                className="text-xl font-bold"
                style={{ color: darkMode ? "#bfdbfe" : "#1e3a8a" }}
              >
                {donorCount}
              </h2>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Progress Bar */}
      <motion.section
        className="py-6 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl font-semibold mb-2"
            style={{ color: currentColors.primary }}
          >
            Our Target
          </h2>
          <p className="mb-4" style={{ color: currentColors.text }}>
            We aim to raise ₹{targetAmount.toLocaleString()} to successfully
            organize the Ganesh Utsav this year. Every rupee matters! 🙏
          </p>
          <div
            className="w-full rounded-full h-6 mb-2 overflow-hidden shadow-inner relative"
            style={{ backgroundColor: darkMode ? "#334155" : "#e2e8f0" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: currentColors.progress }}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min((totalAmount / targetAmount) * 100, 100)}%`,
                transition: { duration: 1, delay: 0.6 },
              }}
            ></motion.div>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm" style={{ color: currentColors.muted }}>
            ₹{totalAmount.toLocaleString()} raised out of ₹
            {targetAmount.toLocaleString()}
          </p>
        </div>
      </motion.section>

      {/* About */}
      <motion.section
        className="px-4 sm:px-8 py-10 max-w-4xl mx-auto rounded-xl shadow-2xl my-8"
        style={{
          backgroundColor: currentColors.card,
          backgroundImage: darkMode
            ? "linear-gradient(to bottom right, #1e293b, #334155, #475569)"
            : "linear-gradient(to bottom right, #fffbeb, #ffffff, #ffedd5)",
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <h2
          className="text-2xl sm:text-4xl font-bold mb-6 text-center"
          style={{ color: currentColors.primary }}
        >
          About Our Mandal
        </h2>

        <motion.div
          className="text-[1.05rem] sm:text-lg leading-[1.75rem] sm:leading-8 space-y-6 font-[500]"
          style={{ color: currentColors.text }}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div className="text-center space-y-2" variants={itemVariants}>
            <p
              className="text-lg sm:text-xl font-semibold"
              style={{ color: currentColors.primary }}
            >
              Shree Ram Ganj Bazar Sarvjanik Ganesh Utsav Mandal
            </p>
            <p
              className="italic text-sm sm:text-base"
              style={{ color: currentColors.muted }}
            >
              Tirora Cha Raja – Since 2017
            </p>
          </motion.div>

          {/* Intro */}
          <motion.p variants={itemVariants}>
            Established in 2017, our Mandal proudly organizes{" "}
            <span
              className="font-semibold"
              style={{ color: currentColors.primary }}
            >
              Tirora Cha Raja
            </span>
            , one of the most beloved and grand Ganesh Utsav celebrations in
            Tirora.
          </motion.p>

          <motion.p variants={itemVariants}>
            Guided by deep devotion and an unshakable sense of community, our
            Mandal is a vibrant symbol of{" "}
            <span
              className="font-semibold"
              style={{ color: currentColors.primary }}
            >
              unity, tradition
            </span>
            , and
            <span
              className="font-semibold"
              style={{ color: currentColors.primary }}
            >
              {" "}
              selfless seva
            </span>{" "}
            (service). Each year, we unite people not only in joyous celebration
            but also in social good.
          </motion.p>

          {/* Contributions */}
          <motion.div variants={itemVariants}>
            <h3
              className="text-xl font-semibold mb-4 flex items-center"
              style={{ color: currentColors.primary }}
            >
              <span className="text-2xl mr-2">✨</span> Our Core Contributions
            </h3>

            <div className="space-y-4">
              <motion.div
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <span className="mt-1" style={{ color: currentColors.primary }}>
                  ➡️
                </span>
                <p className="font-medium">
                  Organizing vibrant Ganesh Utsav events with cultural programs,
                  spiritual gatherings, and stunning decorations.
                </p>
              </motion.div>
              <motion.div
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <span className="mt-1" style={{ color: currentColors.primary }}>
                  🩸
                </span>
                <p className="font-medium">
                  Hosting impactful Blood Donation Camps that support public
                  health.
                </p>
              </motion.div>
              <motion.div
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <span className="mt-1" style={{ color: currentColors.primary }}>
                  🤝
                </span>
                <p className="font-medium">
                  Helping underprivileged families through community-led
                  initiatives.
                </p>
              </motion.div>
              <motion.div
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <span className="mt-1" style={{ color: currentColors.primary }}>
                  🌱
                </span>
                <p className="font-medium">
                  Leading tree plantation drives and environmental awareness
                  campaigns.
                </p>
              </motion.div>
              <motion.div
                className="flex items-start gap-2"
                variants={itemVariants}
              >
                <span className="mt-1" style={{ color: currentColors.primary }}>
                  🎤
                </span>
                <p className="font-medium">
                  Encouraging youth participation and providing a platform for
                  talent.
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Mission Quote */}
          <motion.div className="text-center mt-6" variants={itemVariants}>
            <p
              className="font-bold text-lg sm:text-xl"
              style={{ color: currentColors.primary }}
            >
              "Bhakti ke saath, Samaj Seva bhi"
            </p>
            <p className="text-sm mt-1" style={{ color: currentColors.muted }}>
              (With devotion, we serve society)
            </p>
          </motion.div>

          {/* Closing */}
          <motion.p
            className="text-center text-base sm:text-lg mt-4 font-medium"
            variants={itemVariants}
          >
            Join us and be a part of the divine celebration and noble cause with
            <span
              className="font-semibold ml-1"
              style={{ color: currentColors.primary }}
            >
              Tirora Cha Raja 🙏
            </span>
          </motion.p>
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
                Mihir Ochani
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
                +91 91560 45562
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
                  Karan Parashar
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
                  +91 95953 33733
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
                  "Tushar Sharma",
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
