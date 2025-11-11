import { extendTheme, ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const glassLayer = {
  bg: "whiteAlpha.800",
  backdropFilter: "blur(18px)",
  boxShadow: "0 15px 45px rgba(15, 23, 42, 0.12)",
  border: "1px solid",
  borderColor: "whiteAlpha.500",
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
    body: "Inter, system-ui, -apple-system, BlinkMacSystemFont",
  },
  colors: {
    brand: {
      50: "#f3fff4",
      100: "#c6f7d6",
      200: "#98efb7",
      300: "#6ae798",
      400: "#41df7c",
      500: "#28c663",
      600: "#1fa14f",
      700: "#157a3a",
      800: "#0b5326",
      900: "#032d12",
    },
    accent: {
      50: "#f1f7ff",
      100: "#c7e0ff",
      200: "#9ccaff",
      300: "#71b3ff",
      400: "#479dff",
      500: "#2e84e6",
      600: "#2167b4",
      700: "#154a82",
      800: "#083050",
      900: "#01131f",
    },
  },
  styles: {
    global: {
      "html, body": {
        bg: "gray.50",
        color: "gray.800",
        minHeight: "100%",
        scrollBehavior: "smooth",
      },
      body: {
        backgroundImage:
          "radial-gradient(circle at 10% 20%, rgba(104, 211, 145, 0.18) 0, transparent 40%), radial-gradient(circle at 90% 10%, rgba(78, 156, 250, 0.2) 0, transparent 45%)",
      },
    },
  },
  shadows: {
    outline: "0 0 0 3px rgba(40, 198, 99, 0.4)",
    soft: "0 20px 80px rgba(15, 23, 42, 0.08)",
  },
  layerStyles: {
    glass: glassLayer,
    card: {
      ...glassLayer,
      borderRadius: "24px",
      p: 6,
    },
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "full",
        fontWeight: "600",
      },
      defaultProps: {
        colorScheme: "brand",
      },
      variants: {
        glass: {
          bg: "whiteAlpha.800",
          color: "gray.800",
          borderRadius: "full",
          px: 6,
          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
          _hover: {
            transform: "translateY(-2px)",
            boxShadow: "0 15px 30px rgba(15, 23, 42, 0.12)",
          },
        },
      },
    },
    Card: {
      baseStyle: {
        ...glassLayer,
        borderRadius: "2xl",
        borderColor: "whiteAlpha.400",
      },
    },
    Heading: {
      baseStyle: {
        fontWeight: "700",
        letterSpacing: "-0.02em",
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.400",
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: "brand.400",
      },
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "brand.400",
      },
    },
  },
});
