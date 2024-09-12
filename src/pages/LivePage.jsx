import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, Avatar } from '@mui/material';
import axios from 'axios';
import { useWebSocket } from '../WebSocketProvider';

function LivePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedSong = location.state?.selectedSong || { title: 'No song selected', artist: 'Unknown artist', imageUrl: '', htmlContent: '' };

  const [role, setRole] = useState(localStorage.getItem('role') || 'USER');
  const [songHtml, setSongHtml] = useState('');

  const { stompClient, connected } = useWebSocket();

  useEffect(() => {
    if (role === 'ADMIN' && selectedSong.title !== 'No song selected') {
      axios.post('http://localhost:8080/admin/show', selectedSong)
        .then(response => {
          console.log('Song data requested:', response.data);
        })
        .catch(error => {
          console.error('Failed to request song data:', error);
        });
    }
  }, [role, selectedSong]);

  useEffect(() => {
    if (connected && stompClient) {
      let songSubscription;

      // Subscription for ADMIN role
      if (role === 'ADMIN') {
        songSubscription = stompClient.subscribe('/send/song', (message) => {
          const songData = JSON.parse(message.body);
          console.log('Admin received song data:', songData);
        });
      }
      // Subscription for PLAYER role
      else if (role === 'PLAYER') {
        songSubscription = stompClient.subscribe('/send/song/player', (message) => {
          console.log('Player received HTML content:', message.body);
          setSongHtml(message.body); // Assuming this is HTML content
        });
      }
      // Subscription for SINGER role
      else if (role === 'SINGER') {
        songSubscription = stompClient.subscribe('/send/song/singer', (message) => 
          {
            console.log('singer received HTML content:', message.body);

          setSongHtml(message.body); 
        });
      }

      let exitSubscription;
      if (role !== 'ADMIN') {
        exitSubscription = stompClient.subscribe('/send/exit', () => {
          console.log('Admin has exited the session.');
          navigate('/player'); 
        });
      }

      return () => {
        if (songSubscription) {
          songSubscription.unsubscribe();
        }
        if (exitSubscription) {
          exitSubscription.unsubscribe();
        }
      };
    }
  }, [stompClient, connected, role, navigate]);

  const onExit = async () => {
    if (role === 'ADMIN') {
      try {
        await axios.post('http://localhost:8080/admin/exit');
        navigate('/admin');
      } catch (error) {
        console.error('Failed to exit the rehearsal:', error);
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
        }}
      >
        {role === 'ADMIN' && (
          <>
            <Avatar
              src={selectedSong.imageUrl}
              alt={selectedSong.title}
              sx={{ width: 150, height: 150, mb: 4 }}
            />
            <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
              {selectedSong.title} - {selectedSong.artist}
            </Typography>
          </>
        )}

        {role === 'PLAYER' && (
          <Box
            sx={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '1rem',
              width: '100%',
              bgcolor: 'background.paper',
              p: 2,
              mb: 4,
            }}
            dangerouslySetInnerHTML={{ __html: songHtml }} 
          />
        )}

        {role === 'SINGER' && (
          <Box
            sx={{
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
              fontFamily: 'monospace',
              fontSize: '1rem',
              width: '100%',
              bgcolor: 'background.paper',
              p: 2,
              mb: 4,
            }}
            dangerouslySetInnerHTML={{ __html: songHtml }}  
          />
        )}

        {role === 'ADMIN' && (
          <Button
            variant="contained"
            color="secondary"
            onClick={onExit}
            sx={{ mt: 4 }}
          >
            EXIT
          </Button>
        )}
      </Box>
    </Container>
  );
}

export default LivePage;
