import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { MobileNotice } from "@/components/MobileNotice";
import { ModePickerModal } from "@/components/ModePickerModal";
import Index from "./pages/Index.tsx";
import MyWall from "./pages/MyWall.tsx";
import Gallery from "./pages/Gallery.tsx";
import Auth from "./pages/Auth.tsx";
import Admin from "./pages/Admin.tsx";
import About from "./pages/About.tsx";
import Terms from "./pages/Terms.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

function NonStudioBottomNav() {
  const location = useLocation();
  const isStudio = location.pathname === '/' || location.pathname === '/create';
  if (isStudio) return null;
  return <MobileBottomNav />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/create" element={<Index />} />
            <Route path="/wall" element={<MyWall />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NonStudioBottomNav />
          <MobileNotice />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
