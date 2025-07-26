import { ThemeProvider } from "@/components/theme-provider";
import { createBrowserRouter, RouterProvider } from "react-router";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import NotFound from "./components/Notfound";
import Signin from "./pages/Signin";

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
          path: "test",
          Component: Home,
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
