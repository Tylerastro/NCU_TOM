"use client";
import Spinner from "@/components/Spinner";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { login as setAuth } from "@/redux/features/authSlice";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

export default function SignIn() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    login(formData)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
        toast.success("Logged in successfully");
        router.push("/");
      })
      .catch((error) => {
        toast.error("Invalid username or password");
      });
  };

  const [formData, setFormData] = React.useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            NCU TOM
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={onChange}
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              onChange={onChange}
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              disabled={isLoading}
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <Spinner /> : "Sign in"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/auth/register" variant="body2">
                  {"Sign Up"}
                </Link>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs sx={{ backgroundColor: "red", color: "white" }}>
                Note: Database is frequently reset at this stage. If you cannot
                log in, please sign up again.
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
