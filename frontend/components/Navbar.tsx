"use client";
import AuthTooltip from "@/components/AuthNavBarTooltip";
import UnAuthTooltip from "@/components/UnauthNavBarTooltip";
import { useAppSelector } from "@/redux/hook";
import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import Link from "next/link";
import * as React from "react";

const pages = [
  {
    name: "Targets",
    link: "/targets",
    enabled: true,
  },
  {
    name: "Observations",
    link: "/observations",
    enabled: true,
  },
  {
    name: "Data Products",
    link: "/data-products",
    enabled: false,
  },
  {
    name: "Annoucements",
    link: "/announcements",
    enabled: true,
  },
  {
    name: "About us",
    link: "/about",
    enabled: true,
  },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const { isAuthenticated }: { isAuthenticated: boolean } = useAppSelector(
    (state) => state.auth
  );

  const theme = useTheme();

  return (
    <AppBar position="static">
      <Container
        maxWidth={false}
        style={{ background: theme.palette.primary.main }}
      >
        <Toolbar
          disableGutters
          style={{
            paddingLeft: theme.spacing(18),
            paddingRight: theme.spacing(18),
          }}
        >
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                letterSpacing: ".3rem",
                color: theme.palette.primary.contrastText,
                textDecoration: "none",
              }}
            >
              NCU Tom
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Link href={page.link} passHref>
                    <Typography textAlign="center">{page.name}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link
                key={page.name}
                href={page.enabled ? page.link : "#"}
                passHref
              >
                <Button
                  size="large"
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                    textTransform: "capitalize",
                    fontSize: "1.2rem",
                  }}
                  disabled={!page.enabled}
                >
                  {page.name}
                </Button>
              </Link>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? <AuthTooltip /> : <UnAuthTooltip />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
