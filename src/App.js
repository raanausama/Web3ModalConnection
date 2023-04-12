import { useEffect, forwardRef, useState } from 'react';
import {
  Dialog, DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Stack,
  Typography
} from '@mui/material';

import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import io from 'socket.io-client';

import 'react-toastify/dist/ReactToastify.css';

// theme
import ThemeProvider from './theme';
// routes
import Router from './routes';
// components
import 'react-dropzone-uploader/dist/styles.css';
import './app.css';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import ScrollToTop from './components/ScrollToTop';
// ----------------------------------------------------------------------

const socket = io.connect(`${process.env.REACT_APP_SOCKET_URL}`);


const Transition = forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function App() {
  const [offline, setOffline] = useState(false);
  const [online, setOnline] = useState(false);

  window.ononline = () => {
    toast.success('Back Online!', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setOffline(false);
  };

  window.onoffline = () => {
    setOffline(true);
    setOnline(false);
  };

  return (
    <ThemeProvider>
      <ToastContainer />
      <Dialog open={offline} TransitionComponent={Transition}>
        <DialogTitle justifyContent="center">
          <Grid container justifyContent="center">
            <Stack>
              <img
                src="/static/no-wifi.png"
                alt=""
                style={{ height: 100, width: 100, margin: 'auto', justifyContent: 'space-between', padding: '10px' }}
              />

              <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                 You are Offline!
              </Typography>
            </Stack>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ p: 1 }}>
            <strong>   Please check your internet connection   </strong>
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router socket={socket} />
    </ThemeProvider>
  );
}
