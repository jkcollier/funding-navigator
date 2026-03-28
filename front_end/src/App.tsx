import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Landing from "./pages/Landing";
import PortalSelection from "./pages/PortalSelection";
import RequireFunding from "./pages/RequireFunding";
import FindFunding from "./pages/FindFunding";
import Results from "./pages/Results";
import OrganizationDetail from "./pages/OrganizationDetail";
import DownloadConfirmation from "./pages/DownloadConfirmation";
import Emergency from "./pages/Emergency";
import About from "./pages/About";
import Profile from "./pages/Profile";
import Documents from "./pages/Documents";
import Settings from "./pages/Settings";
import FAQs from "./pages/FAQs";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/portal" element={<PortalSelection />} />
                <Route path="/require-funding" element={<RequireFunding />} />
                <Route path="/find-funding" element={<FindFunding />} />
                <Route path="/results" element={<Results />} />
                <Route path="/organization/:id" element={<OrganizationDetail />} />
                <Route path="/download-confirmation" element={<DownloadConfirmation />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/about" element={<About />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/documents" element={<Documents />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/faqs" element={<FAQs />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
