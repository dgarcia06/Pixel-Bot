"use client";

import "./globals.css";

import { Box, Typography } from "@mui/material";
import GamepadIcon from '@mui/icons-material/Gamepad';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="7vh"
          bgcolor="#09152b"
          color="#99ff88"
          display="flex"
          alignItems="center"
          justifyContent="center"
          zIndex={1200}
          boxShadow="0 2px 4px rgba(0, 0, 0, 0.2)"
        >
          <Box display="flex" alignItems="center" gap={1}>
            <GamepadIcon style={{ color: "#99ff88" }} /> 
            <Typography variant="h6">PixelBot</Typography>
          </Box>
        </Box>
        <Box
          component="main"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          pt="7vh"
          overflow="hidden"
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
