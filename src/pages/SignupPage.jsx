import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, MenuItem, Select, FormControl, InputLabel, Link, Alert } from '@mui/material';
import axios from 'axios';

function SignupPage() {
  const [user, setUser] = useState({ username: '', password: '', role: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const onChange = (event) => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    try {
      setSuccessMessage('');
      setErrorMessage('');

      let endpoint = '/user';

      if (user.role === 'ADMIN') {
        endpoint = '/admin/signup';
      }

      const response = await axios.post(`http://localhost:8080${endpoint}`, user);

      setSuccessMessage('Registration successful! You can now log in.');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(`Registration failed: ${error.response.data.message}`);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f9f9f9',
          padding: 4,
          borderRadius: 2,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign Up
        </Typography>
        
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

        <Box component="form" onSubmit={onSubmit} sx={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={onChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            onChange={onChange}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role-select"
              value={user.role}
              label="Role"
              name="role"
              onChange={onChange}
            >
              <MenuItem value="PLAYER">Player</MenuItem>
              <MenuItem value="SINGER">Singer</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Sign Up
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link href="/" variant="body2" underline="hover">
            Back to login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default SignupPage;
