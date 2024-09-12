import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // For navigation
import axios from 'axios'; 

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error message
    const navigate = useNavigate(); //

    const onUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const onPasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        try {
            // Clear any previous error messages
            setErrorMessage('');

            // Send login request to the backend
            const response = await axios.post('https://jamoveo-backend-fork.onrender.com/login', { username, password });
            const role = response.data.role;
            if (!role) {
                setErrorMessage('Invalid username or password. Please try again.');
            } else {
                localStorage.setItem('role', role);
                console.log('Role:', role);  
                // next page based on the role
                if (role === 'ADMIN') {
                    navigate('/admin');
                } else if (role === 'PLAYER' || role === 'SINGER') {
                    navigate('/player');
                }
            }
        } catch (error) {
            console.error('Login failed:', error);
            // Show an error message
            setErrorMessage('Login failed. Please check your credentials.');
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
                    Login
                </Typography>

                {/* Show error message if it exists */}
                {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}

                <Box component="form" onSubmit={onSubmit} noValidate sx={{ width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={onUsernameChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onPasswordChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Enter
                    </Button>
                </Box>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account?{' '}
                    <Link href="/signup" variant="body2" underline="hover">
                        Sign up
                    </Link>
                </Typography>
            </Box>
        </Container>
    );
}

export default LoginPage;
