import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router";
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
import CareseekerDetail from "./components/user-management/CareseekerDetail";
import CaregiverDetail from "./components/user-management/CaregiverDetail";

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
            },]
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
            },]
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
        <RouterProvider router={router}></RouterProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
