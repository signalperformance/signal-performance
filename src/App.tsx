
import { Toaster } from "@/components/ui/toaster";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "./pages/Index";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedAdminRoute } from "@/components/admin/ProtectedAdminRoute";
import { SubdomainRouter } from "@/components/SubdomainRouter";

// Lazy load non-critical pages for better initial load performance
const Assessment = lazy(() => import("./pages/Assessment"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const ClientLogin = lazy(() => import("./pages/ClientLogin"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <TooltipProvider>
    <AuthProvider>
      <AdminAuthProvider>
        <Toaster />
        
        <SubdomainRouter />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route 
            path="/assessment" 
            element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                <Assessment />
              </Suspense>
            } 
          />
          <Route 
            path="/admin/login" 
            element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                <AdminLogin />
              </Suspense>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                  <Admin />
                </Suspense>
              </ProtectedAdminRoute>
            } 
          />
          <Route 
            path="/client/login" 
            element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                <ClientLogin />
              </Suspense>
            } 
          />
          <Route 
            path="/client" 
            element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                <ClientPortal />
              </Suspense>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route 
            path="*" 
            element={
              <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-signal-gold border-t-transparent rounded-full"></div></div>}>
                <NotFound />
              </Suspense>
            } 
          />
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  </TooltipProvider>
);

export default App;
