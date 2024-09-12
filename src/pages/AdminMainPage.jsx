// src/pages/AdminMainPage.jsx
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // For HTTP requests

function AdminMainPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const onSearch = async (event) => {
    event.preventDefault();
    try {
      // Send HTTP POST request to search songs
      const response = await axios.post('http://localhost:8080/admin/search', query, {
        headers: { 'Content-Type': 'application/json' }
      });
      const foundSongs = response.data;
      // Go to search results
      navigate('/results', { state: { query, foundSongs } });
    } catch (error) {
      console.error('Error searching songs:', error);
    }
  };

  const logoutUser = () => {
    navigate('/');  // Back to login
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Search any song...
        </Typography>
        <Box component="form" onSubmit={onSearch} sx={{ width: '100%', textAlign: 'center' }}>
          <TextField
            label="Enter song name"
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 3 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Search
          </Button>
        </Box>
        <Button onClick={logoutUser} variant="outlined" color="secondary" sx={{ mt: 3 }}>
          Log Out
        </Button>
      </Box>
    </Container>
  );
}

export default AdminMainPage;
