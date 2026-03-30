import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";

const queryClient = new QueryClient();
const routerBasename = import.meta.env.PROD ? "/app" : undefined;
const Landing = lazy(() => import("./pages/Landing"));
const PortalSelection = lazy(() => import("./pages/PortalSelection"));
const RequireFunding = lazy(() => import("./pages/RequireFunding"));
const FindFunding = lazy(() => import("./pages/FindFunding"));
const Results = lazy(() => import("./pages/Results"));
const OrganizationDetail = lazy(() => import("./pages/OrganizationDetail"));
const ApplicationPreview = lazy(() => import("./pages/ApplicationPreview"));
const ApplicationConfirm = lazy(() => import("./pages/ApplicationConfirm"));
const DownloadConfirmation = lazy(() => import("./pages/DownloadConfirmation"));
const Emergency = lazy(() => import("./pages/Emergency"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const Documents = lazy(() => import("./pages/Documents"));
const Settings = lazy(() => import("./pages/Settings"));
const FAQs = lazy(() => import("./pages/FAQs"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={routerBasename}>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">Loading…</div>}>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/portal" element={<PortalSelection />} />
                  <Route path="/require-funding" element={<RequireFunding />} />
                  <Route path="/find-funding" element={<FindFunding />} />
                  <Route path="/results" element={<Results />} />
                  <Route path="/organization/:id" element={<OrganizationDetail />} />
                  <Route path="/application-preview/:id" element={<ApplicationPreview />} />
                  <Route path="/application-confirm/:id" element={<ApplicationConfirm />} />
                  <Route path="/download-confirmation" element={<DownloadConfirmation />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/faqs" element={<FAQs />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
