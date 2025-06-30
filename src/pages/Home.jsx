// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs } from "firebase/firestore";
// import { db } from "../firebase";

// const Home = () => {
//   const [donations, setDonations] = useState([]);
//   const targetAmount = 50000;
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDonations = async () => {
//       const snapshot = await getDocs(collection(db, "donations"));
//       const data = snapshot.docs.map((doc) => doc.data());
//       setDonations(data);
//     };
//     fetchDonations();
//   }, []);

//   const totalAmount = donations.reduce(
//     (sum, d) => sum + Number(d.amount || 0),
//     0
//   );

//   const donorCount = donations.length;

//   return (
//     <div
//       className="h-screen overflow-y-auto bg-orange-50 w-full"
//       style={{ WebkitOverflowScrolling: "touch" }}
//     >
//       {/* Banner with login button */}
//       <section className="relative bg-orange-700 text-white py-12 text-center">
//         <div className="absolute top-4 right-4 z-10">
//           <button
//             onClick={() => navigate("/login")}
//             className="bg-white text-orange-700 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-orange-100 transition text-sm sm:text-base"
//           >
//             🔐 Login
//           </button>
//         </div>
//         <h1 className="text-4xl font-bold px-4">
//           श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ
//         </h1>
//         <p className="mt-2 text-lg px-4">
//           Established in 1998 • Serving Culture, Devotion & Community
//         </p>
//       </section>

//       {/* About Section */}
//       <section className="p-6 max-w-3xl mx-auto text-center">
//         <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//           About Us
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//           We are a group of passionate volunteers and devotees celebrating
//           Ganesh Chaturthi with grandeur, devotion, and community spirit. Each
//           year, we organize cultural events, community activities, and more.
//           Your support helps us keep this tradition alive!
//         </p>
//       </section>
//       {/* Stats Section */}
//       <section className="bg-white py-6 px-4">
//         <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
//           <div className="bg-yellow-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Total Donations</p>
//             <h2 className="text-xl font-bold text-yellow-800">
//               ₹{totalAmount.toLocaleString()}
//             </h2>
//           </div>
//           <div className="bg-green-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Expected Budget</p>
//             <h2 className="text-xl font-bold text-green-800">
//               ₹{targetAmount.toLocaleString()}
//             </h2>
//           </div>
//           <div className="bg-blue-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Total Donors</p>
//             <h2 className="text-xl font-bold text-blue-800">
//               {donations.length}
//             </h2>
//           </div>
//         </div>
//       </section>

//       {/* Donation Progress */}
//       <section className="bg-white py-6 px-4">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-2">
//             Our Target
//           </h2>
//           <p className="mb-4">
//             We aim to raise ₹{targetAmount.toLocaleString()} to successfully
//             organize the Ganesh Utsav this year. Every rupee matters! 🙏
//           </p>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden shadow-inner relative">
//             <div
//               className="bg-green-500 h-full rounded-full"
//               style={{
//                 width: `${Math.min((totalAmount / targetAmount) * 100, 100)}%`,
//               }}
//             ></div>
//             <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow">
//               ₹{totalAmount.toLocaleString()}
//             </span>
//           </div>

//           <p className="text-sm text-gray-600">
//             ₹{totalAmount.toLocaleString()} raised out of ₹
//             {targetAmount.toLocaleString()}
//           </p>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section className="bg-orange-50 py-8 px-4">
//         <div className="max-w-5xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//             📸 Gallery
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             <img src="/img1.jpg" alt="ganesh1" className="rounded-xl shadow" />
//             <img src="/img2.jpg" alt="ganesh2" className="rounded-xl shadow" />
//             <img src="/img3.jpg" alt="ganesh3" className="rounded-xl shadow" />
//           </div>
//         </div>
//       </section>

//       {/* Contact Us */}
//       <section className="bg-white py-8 px-4">
//         <div className="max-w-xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//             📞 Contact Us
//           </h2>
//           <p className="text-gray-700">
//             Feel free to reach out for any queries, contributions or volunteer
//             opportunities!
//           </p>
//           <p className="mt-2 font-semibold">📱 +91 9876543210</p>
//           <p className="font-semibold">📧 ganpatimandal@email.com</p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";

// const Home = () => {
//   const [donations, setDonations] = useState([]);
//   const [targetAmount, setTargetAmount] = useState(50000);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchDonations = async () => {
//       const snapshot = await getDocs(collection(db, "donations"));
//       const data = snapshot.docs.map((doc) => doc.data());
//       setDonations(data);
//     };

//     const fetchTargetAmount = async () => {
//       const docRef = doc(db, "settings", "donationGoal");
//       const docSnap = await getDoc(docRef);
//       if (docSnap.exists()) {
//         setTargetAmount(docSnap.data().targetAmount || 50000);
//       }
//     };

//     fetchDonations();
//     fetchTargetAmount();
//   }, []);

//   const totalAmount = donations.reduce(
//     (sum, d) => sum + Number(d.amount || 0),
//     0
//   );

//   const donorCount = donations.length;

//   return (
//     <div
//       className="h-screen overflow-y-auto bg-orange-50 w-full"
//       style={{ WebkitOverflowScrolling: "touch" }}
//     >
//       {/* Banner with login button */}
//       <section className="relative bg-orange-700 text-white py-12 text-center">
//         <div className="absolute top-4 right-4 z-10">
//           <button
//             onClick={() => navigate("/login")}
//             className="bg-white text-orange-700 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-orange-100 transition text-sm sm:text-base"
//           >
//             🔐 Login
//           </button>
//         </div>
//         <h1 className="text-4xl font-bold px-4">
//           श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ
//         </h1>
//         <p className="mt-2 text-lg px-4">
//           Established in 1998 • Serving Culture, Devotion & Community
//         </p>
//       </section>

//       {/* About Section */}
//       <section className="p-6 max-w-3xl mx-auto text-center">
//         <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//           About Us
//         </h2>
//         <p className="text-gray-700 leading-relaxed">
//           We are a group of passionate volunteers and devotees celebrating
//           Ganesh Chaturthi with grandeur, devotion, and community spirit. Each
//           year, we organize cultural events, community activities, and more.
//           Your support helps us keep this tradition alive!
//         </p>
//       </section>
//       {/* Stats Section */}
//       <section className="bg-white py-6 px-4">
//         <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
//           <div className="bg-yellow-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Total Donations</p>
//             <h2 className="text-xl font-bold text-yellow-800">
//               ₹{totalAmount.toLocaleString()}
//             </h2>
//           </div>
//           <div className="bg-green-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Expected Budget</p>
//             <h2 className="text-xl font-bold text-green-800">
//               ₹{targetAmount.toLocaleString()}
//             </h2>
//           </div>
//           <div className="bg-blue-100 p-4 rounded-xl shadow">
//             <p className="text-sm text-gray-600">Total Donors</p>
//             <h2 className="text-xl font-bold text-blue-800">{donorCount}</h2>
//           </div>
//         </div>
//       </section>

//       {/* Donation Progress */}
//       <section className="bg-white py-6 px-4">
//         <div className="max-w-3xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-2">
//             Our Target
//           </h2>
//           <p className="mb-4">
//             We aim to raise ₹{targetAmount.toLocaleString()} to successfully
//             organize the Ganesh Utsav this year. Every rupee matters! 🙏
//           </p>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden shadow-inner relative">
//             <div
//               className="bg-green-500 h-full rounded-full"
//               style={{
//                 width: `${Math.min((totalAmount / targetAmount) * 100, 100)}%`,
//               }}
//             ></div>
//             <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow">
//               ₹{totalAmount.toLocaleString()}
//             </span>
//           </div>

//           <p className="text-sm text-gray-600">
//             ₹{totalAmount.toLocaleString()} raised out of ₹
//             {targetAmount.toLocaleString()}
//           </p>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section className="bg-orange-50 py-8 px-4">
//         <div className="max-w-5xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//             📸 Gallery
//           </h2>
//           <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
//             <img src="/img1.jpg" alt="ganesh1" className="rounded-xl shadow" />
//             <img src="/img2.jpg" alt="ganesh2" className="rounded-xl shadow" />
//             <img src="/img3.jpg" alt="ganesh3" className="rounded-xl shadow" />
//           </div>
//         </div>
//       </section>

//       {/* Contact Us */}
//       <section className="bg-white py-8 px-4">
//         <div className="max-w-xl mx-auto text-center">
//           <h2 className="text-2xl font-semibold text-orange-700 mb-4">
//             📞 Contact Us
//           </h2>
//           <p className="text-gray-700">
//             Feel free to reach out for any queries, contributions or volunteer
//             opportunities!
//           </p>
//           <p className="mt-2 font-semibold">📱 +91 9876543210</p>
//           <p className="font-semibold">📧 ganpatimandal@email.com</p>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const Home = () => {
  const [donations, setDonations] = useState([]);
  const [targetAmount, setTargetAmount] = useState(50000);
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
  }, []);

  const totalAmount = donations.reduce(
    (sum, d) => sum + Number(d.amount || 0),
    0
  );

  const donorCount = donations.length;

  return (
    <div
      className="h-screen overflow-y-auto bg-orange-50 w-full"
      style={{ WebkitOverflowScrolling: "touch" }}
    >
      {/* Banner */}
      <section className="relative bg-orange-700 text-white py-12 text-center">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => navigate("/login")}
            className="bg-white text-orange-700 font-semibold px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-orange-100 transition text-sm sm:text-base"
          >
            🔐 Login
          </button>
        </div>
        <h1 className="text-4xl font-bold px-4">
          श्रीराम गंज बाजार सार्वजनिक गणेश उत्सव मंडळ, तिरोड़ा
        </h1>
        <p className="mt-2 text-lg px-4">
          Established in 2017 • Serving Culture, Devotion & Community
        </p>
      </section>

      {/* Stats */}
      <section className="bg-white py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-yellow-100 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600">Total Donations</p>
            <h2 className="text-xl font-bold text-yellow-800">
              ₹{totalAmount.toLocaleString()}
            </h2>
          </div>
          <div className="bg-green-100 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600">Expected Budget</p>
            <h2 className="text-xl font-bold text-green-800">
              ₹{targetAmount.toLocaleString()}
            </h2>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl shadow">
            <p className="text-sm text-gray-600">Total Donors</p>
            <h2 className="text-xl font-bold text-blue-800">{donorCount}</h2>
          </div>
        </div>
      </section>

      {/* Progress Bar */}
      <section className="bg-white py-6 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-orange-700 mb-2">
            Our Target
          </h2>
          <p className="mb-4">
            We aim to raise ₹{targetAmount.toLocaleString()} to successfully
            organize the Ganesh Utsav this year. Every rupee matters! 🙏
          </p>
          <div className="w-full bg-gray-200 rounded-full h-6 mb-2 overflow-hidden shadow-inner relative">
            <div
              className="bg-green-500 h-full rounded-full"
              style={{
                width: `${Math.min((totalAmount / targetAmount) * 100, 100)}%`,
              }}
            ></div>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-white drop-shadow">
              ₹{totalAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-gray-600">
            ₹{totalAmount.toLocaleString()} raised out of ₹
            {targetAmount.toLocaleString()}
          </p>
        </div>
      </section>

      {/* About Us */}

      <section className="p-8 max-w-4xl mx-auto bg-gradient-to-br from-orange-50 via-white to-orange-100 rounded-xl shadow-2xl text-center">
        <h2 className="text-4xl font-bold text-orange-700 mb-6 animate-fade-in">
          About Our Mandal
        </h2>
        <p className="text-gray-700 leading-relaxed text-justify text-lg font-light">
          <strong className="text-orange-800 text-xl block mb-1">
            Shree Ram Ganj Bazar Sarvjanik Ganesh Utsav Mandal
          </strong>
          <em className="text-gray-600 text-base italic block mb-4">
            Tirora Cha Raja – Since 2017
          </em>
          <br />
          Established in 2017, our Mandal proudly organizes **Tirora Cha Raja**,
          one of the most beloved and grand celebrations of Ganesh Utsav in
          Tirora.
          <br />
          <br />
          Driven by profound devotion and an unyielding community spirit, our
          Mandal stands as a vibrant symbol of **unity, tradition, and selfless
          seva** (service). Each year, we unite people not only in joyous
          festivities but also through meaningful charity and impactful social
          initiatives.
          <br />
          <br />
          <div className="flex items-center justify-center mb-3">
            <span className="text-3xl mr-3">✨</span>{" "}
            <strong className="text-orange-700 text-2xl">
              Our Core Contributions:
            </strong>
          </div>
          <ul className="list-disc list-inside text-left mx-auto max-w-lg space-y-2 text-gray-700">
            <li>
              Organizing magnificent Ganesh Utsav celebrations featuring rich
              cultural programs, profound spiritual events, and enchanting
              decorations.
            </li>
            <li>
              Hosting essential Blood Donation Camps to contribute to public
              health and well-being.
            </li>
            <li>
              Providing compassionate assistance to underprivileged families,
              fostering a more equitable community.
            </li>
            <li>
              Leading impactful environmental awareness drives and significant
              tree plantation campaigns for a greener future.
            </li>
            <li>
              Actively encouraging youth participation and promoting emerging
              talents within our community.
            </li>
          </ul>
          <br />
          Our enduring mission is beautifully encapsulated:{" "}
          <em className="text-orange-600 font-bold text-xl block mt-4">
            "Bhakti ke saath, Samaj Seva bhi"
          </em>{" "}
          (With devotion, we serve society).
          <br />
          <br />
          Join us and become a cherished part of the divine celebration and
          noble cause with Tirora Cha Raja{" "}
          <span className="text-orange-600 text-2xl ml-2">🙏</span>
        </p>
      </section>

      {/* Team Section */}
      {/* <section className="bg-white py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">
            👥 Our Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-left">
            <div className="bg-orange-100 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-orange-800">
                Sandip Neware
              </h3>
              <p>अध्यक्ष</p>
              <p className="text-sm text-gray-600">+91 90221 14901</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-orange-800">
                Sanket Kothe
              </h3>
              <p>उपाध्यक्ष</p>
              <p className="text-sm text-gray-600">+91 90211 44773</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-orange-800">
                Mihir Ochani
              </h3>
              <p>सचिव</p>
              <p className="text-sm text-gray-600">+91 91560 45562</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-orange-800">
                Karan Parashar
              </h3>
              <p>खजिनदार</p>
              <p className="text-sm text-gray-600">+91 95953 33733</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-xl shadow">
              <h3 className="text-lg font-bold text-orange-800">Atul Dipani</h3>
              <p>Event In-Charge</p>
              <p className="text-sm text-gray-600">+91 70380 67298</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-orange-700 mt-8 mb-2">
            🧑‍⚖️ Counsellors
          </h3>
          <p className="text-gray-700 text-sm">
            Bhagwandas Ji Dipani, Manoj Ji Jiwtani, Suresh Ji Parashar, Chetan
            Ji Parashar, Sanjay Ji Kothe, Bhushan Ji Zararia, Gaurav Ji
            Chaurasia, Kumar Ji Harode, Raju Ji Parashar
          </p>

          <h3 className="text-xl font-semibold text-orange-700 mt-6 mb-2">
            👥 Members
          </h3>
          <p className="text-gray-700 text-sm">
            Uday Parashar, Ronit Ladhani, Harshal Chhattani, Pralay Neware,
            Aniket Kesharwani, Rohit Tarare, Niraj Tarare, Tushar Sharma,
            Darshan Zararia, Nitin Ochani, Nikhil Kumbhare, Nikhil Shukla, Nayan
            Asati, Roshan Nagrikar, Saurabh Chhabadiya, Shubham Chaudhary,
            Satyam Sapate, Aman Bairisal
          </p>
        </div>
      </section> */}

      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-extrabold text-orange-800 mb-12 drop-shadow-md">
            <span className="mr-4">✨</span>Meet Our Visionary Team
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-16">
            {/* Team Member Card */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-orange-600">
              <h3 className="text-2xl font-extrabold text-orange-900 mb-1">
                Sandip Neware
              </h3>
              <p className="text-gray-800 text-xl font-medium mb-2">अध्यक्ष</p>
              <p className="text-sm text-gray-600 font-semibold">
                +91 90221 14901
              </p>
            </div>

            {/* Repeat for other team members */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-orange-600">
              <h3 className="text-2xl font-extrabold text-orange-900 mb-1">
                Sanket Kothe
              </h3>
              <p className="text-gray-800 text-xl font-medium mb-2">
                उपाध्यक्ष
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                +91 90211 44773
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-orange-600">
              <h3 className="text-2xl font-extrabold text-orange-900 mb-1">
                Mihir Ochani
              </h3>
              <p className="text-gray-800 text-xl font-medium mb-2">सचिव</p>
              <p className="text-sm text-gray-600 font-semibold">
                +91 91560 45562
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-orange-600">
              <h3 className="text-2xl font-extrabold text-orange-900 mb-1">
                Karan Parashar
              </h3>
              <p className="text-gray-800 text-xl font-medium mb-2">खजिनदार</p>
              <p className="text-sm text-gray-600 font-semibold">
                +91 95953 33733
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-7 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-b-4 border-orange-600">
              <h3 className="text-2xl font-extrabold text-orange-900 mb-1">
                Atul Dipani
              </h3>
              <p className="text-gray-800 text-xl font-medium mb-2">
                Event In-Charge
              </p>
              <p className="text-sm text-gray-600 font-semibold">
                +91 70380 67298
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg border border-orange-200">
              <h3 className="text-3xl font-extrabold text-orange-700 mb-5 flex items-center justify-center">
                <span className="mr-3">🧑‍⚖️</span> Our Esteemed Counsellors
              </h3>
              <div className="text-gray-700 text-lg leading-relaxed flex flex-wrap justify-center gap-x-4 gap-y-2">
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Bhagwandas Ji Dipani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Manoj Ji Jiwtani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Suresh Ji Parashar
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Chetan Ji Parashar
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Sanjay Ji Kothe
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Bhushan Ji Zararia
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Gaurav Ji Chaurasia
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Kumar Ji Harode
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Raju Ji Parashar
                </span>
              </div>
            </div>

            <div className="bg-orange-50 p-8 rounded-2xl shadow-lg border border-orange-200">
              <h3 className="text-3xl font-extrabold text-orange-700 mb-5 flex items-center justify-center">
                <span className="mr-3">🤝</span> Dedicated Members
              </h3>
              <div className="text-gray-700 text-lg leading-relaxed flex flex-wrap justify-center gap-x-4 gap-y-2">
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Uday Parashar
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Ronit Ladhani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Harshal Chhattani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Pralay Neware
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Aniket Kesharwani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Rohit Tarare
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Niraj Tarare
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Tushar Sharma
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Darshan Zararia
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Nitin Ochani
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Nikhil Kumbhare
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Nikhil Shukla
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Nayan Asati
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Roshan Nagrikar
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Saurabh Chhabadiya
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Shubham Chaudhary
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Satyam Sapate
                </span>
                <span className="py-1 px-3 bg-orange-100 rounded-full">
                  Aman Bairisal
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-orange-50 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">
            📸 Gallery
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <img src="/img1.jpg" alt="ganesh1" className="rounded-xl shadow" />
            <img src="/img2.jpg" alt="ganesh2" className="rounded-xl shadow" />
            <img src="/img3.jpg" alt="ganesh3" className="rounded-xl shadow" />
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="bg-white py-8 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold text-orange-700 mb-4">
            📞 Contact Us
          </h2>
          <p className="text-gray-700">
            For any queries, contributions, or to volunteer, feel free to reach
            out:
          </p>
          <p className="mt-2 font-semibold">📧 tiroracharaja@gmail.com</p>
          <p className="font-semibold">📱 +91 70380 67298 (Atul Dipani)</p>
          <p className="font-semibold">📱 +91 95953 33733 (Karan Parashar)</p>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-orange-700">
              📱 Follow Us
            </h3>
            <p>
              <a
                href="https://www.instagram.com/Tiroracharaja_"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram @Tiroracharaja_
              </a>
              <br />
              <a
                href="https://www.youtube.com/results?search_query=Tirora+Cha+Raja"
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                YouTube: Tirora Cha Raja
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
