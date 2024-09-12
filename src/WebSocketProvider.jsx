import React, { createContext, useRef, useEffect, useContext, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

export const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const connect = () => {
      const socket = new SockJS('http://localhost:8080/ws');
      stompClient.current = Stomp.over(socket);

      stompClient.current.connect({}, () => {
        console.log('Connected to WebSocket');
        setConnected(true);
      }, (error) => {
        console.error('WebSocket connection error:', error);
        setConnected(false);
        setTimeout(connect, 5000); // Reconnect after 5 seconds
      });
    };

    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
        connect(); // Reconnect
      });
    } else {
      connect();
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect(() => {
          console.log('Disconnected from WebSocket');
          setConnected(false);
        });
      }
    };
  }, []);

  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.disconnect(() => {
        console.log('Disconnected from WebSocket');
        setConnected(false);
      });
    }
  };

  return (
    <WebSocketContext.Provider value={{ stompClient: stompClient.current, connected, disconnectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  return useContext(WebSocketContext);
};
