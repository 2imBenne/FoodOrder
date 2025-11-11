import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FiShoppingBag, FiBell, FiMenu, FiX } from "react-icons/fi";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useNotifications } from "../contexts/NotificationContext";

const links = [
  { label: "Trang chủ", to: "/" },
  { label: "Menu", to: "/menu" },
  { label: "Giỏ hàng", to: "/cart" },
  { label: "Đơn hàng", to: "/orders", protected: true },
];

export const Navigation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const glassBg = useColorModeValue(
    "rgba(255,255,255,0.9)",
    "rgba(13,25,46,0.85)"
  );
  const borderColor = useColorModeValue("whiteAlpha.700", "whiteAlpha.300");
  const { user, logout } = useAuthContext();
  const { items } = useCart();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = links.filter(
    (link) => !link.protected || (link.protected && user)
  );

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Box position="sticky" top={0} zIndex={30}>
      <Box
        bgGradient="linear(to-b, rgba(255,255,255,0.95), rgba(255,255,255,0))"
        backdropFilter="blur(8px)"
      >
        <Flex
          maxW="7xl"
          mx="auto"
          px={{ base: 4, md: 6 }}
          py={3}
          align="center"
          justify="space-between"
          bg={glassBg}
          border="1px solid"
          borderColor={borderColor}
          borderRadius="full"
          mt={4}
          boxShadow="0 20px 60px rgba(15,23,42,0.12)"
        >
          <HStack spacing={4}>
            <IconButton
              aria-label="Toggle menu"
              display={{ base: "flex", md: "none" }}
              variant="ghost"
              icon={isOpen ? <FiX /> : <FiMenu />}
              onClick={isOpen ? onClose : onOpen}
            />
            <Text
              as={RouterLink}
              to="/"
              fontSize="xl"
              fontWeight="bold"
              color="brand.500"
              letterSpacing="-0.04em"
            >
              FoodOrder
            </Text>
            <HStack spacing={2} display={{ base: "none", md: "flex" }}>
              {navItems.map((link) => (
                <Button
                  key={link.to}
                  as={RouterLink}
                  to={link.to}
                  size="sm"
                  variant={location.pathname === link.to ? "solid" : "ghost"}
                  colorScheme={location.pathname === link.to ? "brand" : "gray"}
                >
                  {link.label}
                </Button>
              ))}
            </HStack>
          </HStack>

          <HStack spacing={1}>
            <IconButton
              aria-label="Toggle color mode"
              variant="ghost"
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              onClick={toggleColorMode}
            />
            <Button
              leftIcon={<FiShoppingBag />}
              variant="ghost"
              size="sm"
              onClick={() => navigate("/cart")}
            >
              Giỏ hàng
              {cartCount > 0 && (
                <Badge ml={2} colorScheme="pink">
                  {cartCount}
                </Badge>
              )}
            </Button>
            {user ? (
              <>
                <IconButton
                  aria-label="Notifications"
                  variant="ghost"
                  icon={<FiBell />}
                  onClick={() => navigate("/orders")}
                />
                {unreadCount > 0 && (
                  <Badge colorScheme="red">{unreadCount}</Badge>
                )}
                <Button size="sm" onClick={logout}>
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button size="sm" onClick={() => navigate("/register")}>
                  Đăng ký
                </Button>
              </>
            )}
            {user?.role === "ADMIN" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate("/admin")}
              >
                Admin
              </Button>
            )}
          </HStack>
        </Flex>
      </Box>

      {isOpen && (
        <Box px={4} pb={4} display={{ md: "none" }}>
          <Stack
            spacing={3}
            bg={glassBg}
            borderRadius="2xl"
            border="1px solid"
            borderColor={borderColor}
            mt={3}
            p={4}
          >
            {navItems.map((link) => (
              <Button
                key={link.to}
                as={RouterLink}
                to={link.to}
                variant={location.pathname === link.to ? "solid" : "ghost"}
                onClick={onClose}
              >
                {link.label}
              </Button>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};
