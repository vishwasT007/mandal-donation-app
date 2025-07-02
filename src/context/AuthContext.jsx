// import { createContext, useContext, useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "../firebase";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // { uid, email, name, role }
//   const [loading, setLoading] = useState(true); // NEW

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const docRef = doc(db, "users", currentUser.uid);
//         const docSnap = await getDoc(docRef);
//         setUser({
//           uid: currentUser.uid,
//           email: currentUser.email,
//           ...docSnap.data(),
//         });
//       } else {
//         setUser(null);
//       }
//       setLoading(false); // DONE
//     });

//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => useContext(AuthContext);

// New code

// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { uid, email, name, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          let userData = {
            uid: currentUser.uid,
            email: currentUser.email,
          };

          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            userData = {
              ...userData,
              ...docSnap.data(),
            };
          } else {
            console.warn("⚠️ Firestore user document not found.");
            userData = {
              ...userData,
              name: "Unknown",
              role: "guest", // optional fallback
            };
          }

          setUser(userData);
        } catch (error) {
          console.error("❌ Error fetching user document:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
