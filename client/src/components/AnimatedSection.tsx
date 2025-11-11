import { chakra, shouldForwardProp } from "@chakra-ui/react";
import { isValidMotionProp, motion, Variants } from "framer-motion";
import { ReactNode } from "react";

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop),
});

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: custom },
  }),
};

type AnimatedSectionProps = {
  children: ReactNode;
  delay?: number;
  variants?: Variants;
};

export const AnimatedSection = ({
  children,
  delay = 0,
  variants = defaultVariants,
}: AnimatedSectionProps) => (
  <MotionBox
    variants={variants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    custom={delay}
  >
    {children}
  </MotionBox>
);
