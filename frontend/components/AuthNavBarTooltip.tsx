import {
  useLogoutMutation,
  useRetrieveUserQuery,
} from "@/redux/features/authApiSlice";
import { logout as setLogout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hook";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function AuthTooltip() {
  const settings = [
    { name: "Dashboard", url: "/dashboard", disabled: true },
    { name: "Settings", url: "/settings", disabled: true },
    { name: "Logout", url: "/", disabled: false },
  ];

  const { data } = useRetrieveUserQuery();
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => {
        router.push("/");
      });
  };

  return (
    <>
      <Tooltip title="Open settings">
        <Button
          onClick={handleOpenUserMenu}
          variant="contained"
          sx={{ textTransform: "capitalize" }}
        >
          Hi, {data?.username}
        </Button>
      </Tooltip>
      <Menu
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        {settings.map((setting) => (
          <MenuItem
            disabled={setting.disabled}
            key={setting.name}
            onClick={() => {
              handleCloseUserMenu();
              if (setting.name === "Logout") {
                handleLogout();
              }
            }}
          >
            <Link href={setting.url} passHref>
              <Typography textAlign="center">{setting.name}</Typography>
            </Link>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
