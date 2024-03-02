"use client";
import Spinner from "@/components/Spinner";
import { useRegisterMutation } from "@/redux/features/authApiSlice";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "react-toastify";

export default function SignUp() {
  const [register, { isLoading }] = useRegisterMutation();
  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    register(formData)
      .unwrap()
      .then(() => {
        toast.success("Account created successfully");
        router.push("/auth/signin");
      })
      .catch((error) => {
        for (const key in error.data) {
          toast.error(`${key}: ` + error.data[key][0]);
        }
        toast.error(error.data.message);
      });
  };

  const theme = useTheme();

  const [formData, setFormData] = React.useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    re_password: "",
    title: "",
    institute: "",
    role: "",
  });

  const handleChange = (event: SelectChangeEvent) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const {
    first_name,
    last_name,
    username,
    email,
    password,
    re_password,
    title,
    institute,
    role,
  } = formData;
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            Sign up
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={onChange}
                  name="first_name"
                  value={first_name}
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={onChange}
                  required
                  fullWidth
                  id="last_name"
                  label="Last Name"
                  name="last_name"
                  value={last_name}
                  autoComplete="family-name"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  onChange={onChange}
                  name="username"
                  required
                  fullWidth
                  value={username}
                  id="userName"
                  label="Username"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="title">Title</InputLabel>
                  <Select
                    onChange={handleChange}
                    fullWidth
                    labelId="title"
                    name="title"
                    id="title"
                    value={title}
                    label="title"
                  >
                    <MenuItem value={1}>Prof.</MenuItem>
                    <MenuItem value={2}>Dr.</MenuItem>
                    <MenuItem value={3}>M.S.</MenuItem>
                    <MenuItem value={4}>B.S.</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="role">Role</InputLabel>
                  <Select
                    onChange={handleChange}
                    fullWidth
                    labelId="role"
                    name="role"
                    id="role"
                    value={role}
                    label="role"
                  >
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={2}>Faculty</MenuItem>
                    <MenuItem value={3}>Professor</MenuItem>
                    <MenuItem value={4}>Student</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  onChange={onChange}
                  label="Email Address"
                  name="email"
                  value={email}
                  autoComplete="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={onChange}
                  name="password"
                  value={password}
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  onChange={onChange}
                  name="re_password"
                  value={re_password}
                  label="Confirm Password"
                  type="password"
                  id="re_password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  onChange={onChange}
                  name="institute"
                  value={institute}
                  label="Institute"
                  type="institute"
                  id="institute"
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox value="allowExtraEmails" color="primary" />
                  }
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
            </Grid>
            <Button
              type="submit"
              color="primary"
              fullWidth
              variant="outlined"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? <Spinner /> : "Sign Up"}
            </Button>
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/auth/signin" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
