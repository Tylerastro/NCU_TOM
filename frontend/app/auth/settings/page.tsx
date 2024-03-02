"use client";
import Container from "@mui/material/Container";
import { ThemeProvider, useTheme } from "@mui/material/styles";

import CardSettings from "@/components/CardSettings";

export default function Settings() {
  const theme = useTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="md">
          <CardSettings />
        </Container>
      </ThemeProvider>
    </>
  );
}
