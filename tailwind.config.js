/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        genesis: {
          bg: "#EEF5F7",
          ink: "#0E2430",
          inkSoft: "#5B6B77",
          primary: "#123543",
          primarySoft: "#0F2E3A",
          primary50: "#0A2430",
          accent: "#19B0A8",
          chip: "#E7F2F4",
        },
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl2: "14px",
      },
    },
  },
  plugins: [],
};
