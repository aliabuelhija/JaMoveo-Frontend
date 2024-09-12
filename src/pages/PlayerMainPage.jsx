import React, { useState, useEffect } from 'react';
import { Typography, Container, Box, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from '../WebSocketProvider';

function PlayerMainPage() {
  const [waiting, setWaiting] = useState(true);
  const [selectedSong, setSelectedSong] = useState(null);
  const { stompClient, connected } = useWebSocket(); // Use WebSocket from context
  const navigate = useNavigate(); // Use to navigate to other pages

  useEffect(() => {
    if (connected && stompClient) {
      const songSubscription = stompClient.subscribe('/send/join', (message) => {
        const songData = JSON.parse(message.body);
        setSelectedSong(songData); 
        setWaiting(false); // Stop showing the waiting screen
        navigate('/live', { state: { selectedSong: songData } }); // Navigate to live page with song details
      });

      return () => {
        songSubscription.unsubscribe(); // Clean up the subscription
      };
    }
  }, [stompClient, connected, navigate]);

  const logoutUser = () => {
    navigate('/');  // Redirect to the login page
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
          textAlign: 'center',
        }}
      >
        {waiting ? (
          <>
            <Typography component="h1" variant="h4">
              Waiting for the next song...
            </Typography>
            <CircularProgress sx={{ mt: 2 }} />
          </>
        ) : (
          <Typography component="h1" variant="h4">
            {`A song has been selected: ${selectedSong.title}`}
          </Typography>
        )}

        <Button
          variant="contained"
          color="secondary"
          onClick={logoutUser}
          sx={{ mt: 4 }}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
}

export default PlayerMainPage;
