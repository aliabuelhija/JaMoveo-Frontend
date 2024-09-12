import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { Container, Typography, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios'; 

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = location.state?.query || ''; 
  const [results, setResults] = useState([]); // State to hold search results
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post('https://jamoveo-backend-fork.onrender.com/admin/search', query);
        setResults(response.data); // Set the results in the state
        setLoading(false); // Set loading to false after receiving data
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false); // Set loading to false in case of error
      }
    };

    fetchResults();
  }, [query]);

  const onSongSelect = async (song) => {
    console.log('Selected song:', song);
  
    try {
      const response = await axios.post('https://jamoveo-backend-fork.onrender.com/admin/movetolive', JSON.stringify(song), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Server response:', response.data);
      navigate('/live', { state: { selectedSong: song } });
    } catch (error) {
      console.error('Error selecting song:', error);
    }
  };
  

  if (loading) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 4 }}>
          Results for "{query}"
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {results.map((song, index) => (
            <ListItem key={index} button onClick={() => onSongSelect(song)}>
              <ListItemText primary={`${song.title} by ${song.artist}`} />
              <img src={song.imageUrl} alt={song.title} width={50} height={50} />
            </ListItem>
          ))}
        </List>
        <Button
          onClick={() => navigate('/admin')}
          variant="outlined"
          sx={{ mt: 3 }}
        >
          Back to Search
        </Button>
      </Box>
    </Container>
  );
}

export default ResultsPage;
