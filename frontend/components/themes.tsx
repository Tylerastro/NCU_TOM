"use client";
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#7482ce",
      dark: "#3452f3",
      contrastText: "#fff",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Arial",
    fontSize: 16,
  },
  spacing: (factor: number) => `${0.25 * factor}vw`,
});

export default theme;
