import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./components/Notfound";
import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Bookings from "./pages/bookings/Bookings";
import Careseeker from "./pages/users/Careseeker";
import Caregiver from "./pages/users/Caregiver";
import BookingDetails from "./pages/bookings/BookingDetails";
import HeroSectionManagement from "./pages/heroSection/HeroSectionManagement";
import AboutSectionManagement from "./pages/aboutSection/AboutSectionManagement";
import ResourcesManagement from "./pages/resourcesSection/Resources";
import TestimonialManagement from "./pages/testimonials/TestimonialsManagement";
import BlogManagement from "./pages/blog/BlogManagement";
import ContactManagement from "./pages/contact/ContactManagement";
import CareseekerDetail from "./components/user-management/CareseekerDetail";
import CaregiverDetail from "./components/user-management/CaregiverDetail";
import PolicyManagement from "./pages/policies/PolicyManagement";
import PersonalCare from "./pages/services/PersonalCare";
import HomeCare from "./pages/services/HomeCare";
import SpecializedCare from "./pages/services/SpecializedCare";
import SitterServices from "./pages/services/SitterServices";
import CompanionCare from "./pages/services/CompanionCare";
import TransportationCare from "./pages/services/TransportationCare";
import Inbox from "./pages/Inbox";
import FooterManagement from "./pages/FooterManagement/FooterManagement";
import WhoWeAreManagement from "./pages/WhoWeAreManagement/WhoWeAreManagement";
import FAQManagement from "./pages/faq/FAQManagement";
import BecomeCaregiverManagement from "./pages/BecomeCaregiverManagement/BecomeCaregiverManagement";
import CaregiverApplicationManagement from "./pages/CaregiverApplicationManagement/CaregiverApplicationManagement";
import VeteransHomeCare from "./pages/veterans-home-care/VeteransHomeCareAdmin";
import LocationServicesAdmin from "./pages/location-services/LocationServicesAdmin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      gcTime: 1000 * 60 * 30, // 30 minutes
    },
  },
});

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: "/profile",
          Component: Profile,
        },
        {
          path: "/care-seeker",
          children: [
            {
              index: true,
              Component: Careseeker,
            },
            {
              path: ":id",
              Component: CareseekerDetail,
            },
          ],
        },
        {
          path: "/care-giver",
          children: [
            {
              index: true,
              Component: Caregiver,
            },
            {
              path: ":id",
              Component: CaregiverDetail,
            },
          ],
        },
        {
          path: "/bookings",
          children: [
            {
              index: true,
              Component: Bookings,
            },
            {
              path: ":id",
              Component: BookingDetails,
            },
          ],
        },
        {
          path: "/inbox",
          Component: Inbox,
        },
        // New Content Management Routes
        {
          path: "/hero-section",
          Component: HeroSectionManagement,
        },
        {
          path: "/about-section",
          Component: AboutSectionManagement,
        },
        {
          path: "/resources-section",
          Component:ResourcesManagement,
        },
           {
          path: "/faq-section",
          Component:FAQManagement,
        },
        {
             path:"/who-we-are",
             Component:WhoWeAreManagement,
        },
        {
          path: "/blog-section",
          Component:  BlogManagement,
        },
        {
          path: "/testimonial-section",
          Component: TestimonialManagement,
        },
        {
          path: "/contact-section",
          Component: ContactManagement,
        },
             {
          path: "/personal-care",
          Component: PersonalCare,
        },
                

     {
          path: "/veterans-home-care",
          Component: VeteransHomeCare,
        },
        {
          path: "/home-care",
          Component: HomeCare,
        },

        {
          path: "/location-services",
          Component: LocationServicesAdmin,
        },

        {
              path:"/become-caregiver-section",
              Component:BecomeCaregiverManagement,
        },

        {
           path: "/caregiver-applications",
           Component:CaregiverApplicationManagement,
        },

        {
          path: "/specialized-care",
          Component: SpecializedCare,
        },

        {
          path: "/sitter-services",
          Component: SitterServices,
        },

        {
          path: "/companion-care",
          Component: CompanionCare,
        },

        {
          path: "/transportation-service",
          Component: TransportationCare,
        },

        {
  path: "/privacy-policy",
  Component: PolicyManagement,
},
{
  path: "/terms-and-conditions", 
  Component: PolicyManagement,
},
{
  path: "/footer-section",
  Component: FooterManagement,
},
{
  path: "/legal",
  Component: PolicyManagement,
}
      ],
    },
    {
      path: "/signin",
      Component: Signin,
    },
    {
      path: "*",
      Component: NotFound,
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;