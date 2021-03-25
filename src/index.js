import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './App.css';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';


const theme = createMuiTheme();

theme.typography.h2 = {
  ...theme.typography.h2,
  [theme.breakpoints.down('xs')]: {
    fontSize: '2rem',
  },
};

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
