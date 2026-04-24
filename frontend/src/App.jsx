// import { useEffect, useState } from 'react';
// import { Routes, Route, useLocation } from 'react-router-dom';
// import { AnimatePresence } from 'framer-motion';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import ProtectedRoute from './components/ProtectedRoute';
// import PageTransition from './components/PageTransition';
// import LoadingScreen from './components/LoadingScreen';
// import Home from './pages/Home';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import PostRide from './pages/PostRide';
// import SearchRide from './pages/SearchRide';
// import RideDetails from './pages/RideDetails';
// import Dashboard from './pages/Dashboard';
// import Chat from './pages/Chat';
// import AdminDashboard from './pages/AdminDashboard';
// import AdminLogin from './pages/AdminLogin';
// import Profile from './pages/Profile';
// import { useAuth } from './context/AuthContext';
// import AOS from 'aos';
// import 'aos/dist/aos.css';

// function App() {
//   const { loading } = useAuth();
//   const location = useLocation();
//   const [showLoadingScreen, setShowLoadingScreen] = useState(true);

//   useEffect(() => {
//     AOS.init({ duration: 800 });
//   }, []);

//   if (showLoadingScreen) {
//     return (
//       <LoadingScreen
//         isDataLoading={loading}
//         onFinish={() => setShowLoadingScreen(false)}
//       />
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main>
//         <AnimatePresence mode="wait">
//           <Routes location={location} key={location.pathname}>
//             <Route path="/" element={<PageTransition><Home /></PageTransition>} />
//             <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
//             <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
//             <Route path="/search" element={<PageTransition><SearchRide /></PageTransition>} />
//             <Route path="/ride/:id" element={<PageTransition><RideDetails /></PageTransition>} />
//             <Route
//               path="/post-ride"
//               element={
//                 <ProtectedRoute>
//                   <PageTransition><PostRide /></PageTransition>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <PageTransition><Dashboard /></PageTransition>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chat"
//               element={
//                 <ProtectedRoute>
//                   <PageTransition><Chat /></PageTransition>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/chat/:userId"
//               element={
//                 <ProtectedRoute>
//                   <PageTransition><Chat /></PageTransition>
//                 </ProtectedRoute>
//               }
//             />
//             <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
//             <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
//             <Route
//               path="/profile"
//               element={
//                 <ProtectedRoute>
//                   <PageTransition><Profile /></PageTransition>
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </AnimatePresence>
//       </main>
//       <Footer />
//     </div>
//   );
// }

// export default App;



// -------------------------------------------- 3RD ---------------------------------
import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostRide from './pages/PostRide';
import SearchRide from './pages/SearchRide';
import RideDetails from './pages/RideDetails';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import { useAuth } from './context/AuthContext';
import AOS from 'aos';
import 'aos/dist/aos.css';

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  const [showLoadingScreen, setShowLoadingScreen] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  if (showLoadingScreen) {
    return (
      <LoadingScreen
        isDataLoading={loading}
        onFinish={() => setShowLoadingScreen(false)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/search" element={<PageTransition><SearchRide /></PageTransition>} />
            <Route path="/ride/:id" element={<PageTransition><RideDetails /></PageTransition>} />

            <Route
              path="/post-ride"
              element={
                <ProtectedRoute>
                  <PageTransition><PostRide /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <PageTransition><Dashboard /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat"
              element={
                <ProtectedRoute>
                  <PageTransition><Chat /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route
              path="/chat/:userId"
              element={
                <ProtectedRoute>
                  <PageTransition><Chat /></PageTransition>
                </ProtectedRoute>
              }
            />

            <Route path="/admin-login" element={<PageTransition><AdminLogin /></PageTransition>} />
            <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <PageTransition><Profile /></PageTransition>
                </ProtectedRoute>
              }
            />

            {/* ✅ FIX: Fallback route (VERY IMPORTANT) */}
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;