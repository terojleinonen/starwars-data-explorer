export const reveal = {
  hidden: {
    opacity: 0,
    y: 6,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: "easeOut",
      delay,
    },
  }),
};