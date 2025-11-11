import { Box, Container } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";

export const MainLayout = () => (
  <Box
    minH="100vh"
    bgGradient="linear(to-b, whiteAlpha.900, rgba(240, 246, 255, 0.9))"
  >
    <Navigation />
    <Container as="main" maxW="7xl" py={{ base: 8, md: 12 }}>
      <Outlet />
    </Container>
    <Footer />
  </Box>
);
