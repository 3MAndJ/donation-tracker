import React, { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import queries from '../models/queries';
import useToken from '../hooks/useToken';
import { UserContext } from '../hooks/userContext';
import { Divider } from '@mui/material';
import { useMutation } from '@apollo/client';

export default function Login() {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
  });

  const { setToken } = useToken();
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const location = useLocation();
  const [login, {data, loading, error}] = useMutation(queries.login);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }));
  };
  const handleSubmit = async (event) => {

    event.preventDefault();
    login({
      variables:{
        email: inputs.email,
        password: inputs.password,
      }
    })
      .then(res => {
        setInputs({
          email: '',
          password: '',
        });
        setToken(res.data.login.token);
        setUser({...res.data.login.user});
        navigate(location.state?.path || '/chapter/dashboard');
      });
  };

  return (
    <Container component="div" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'warning.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box id="login" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={inputs.email || ''}
            autoComplete="email"
            autoFocus
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            value={inputs.password || ''}
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
