import { useState, useEffect, useRef } from 'react';
import { Switch, BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Backdrop, CircularProgress, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CategoryView from './views/CategoryView';
import Header from './components/Header';


const API_URL = process.env.REACT_APP_LOCAL_API || '/api';
const RETRY_TIME_IN_SECONDS = 15;
const NEXT_UPDATE_INTERVAL = 1000*60*5;
const NEXT_UPDATE_IN_SECONDS = NEXT_UPDATE_INTERVAL / 1000;
const CATEGORIES = ['gloves', 'facemasks', 'beanies'];

const useStyles = makeStyles(theme => ({
  backdrop: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.primary.main,
  },
  loginMessage: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
}));

function App() {
  const [collection, setCollection] = useState({});
  const [currentTab, setCurrentTab] = useState();
  const [currentManufacturer, setCurrentManufacturer] = useState(false);
  const [manufacturers, setManufacturers] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [retryTimer, setRetryTimer] = useState();
  const [nextUpdateTimer, setNextUpdateTimer] = useState(NEXT_UPDATE_IN_SECONDS);
  const timerId = useRef({ countdown: null, next: null });

  const classes = useStyles();

  const retryCountdown = async seconds => {
    for (let i = seconds; i > 0; i--) {
      setRetryTimer(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const updateNextUpdateTimer = () => {
    setNextUpdateTimer(NEXT_UPDATE_IN_SECONDS);
    timerId.current.countdown = setInterval(() => {
      setNextUpdateTimer(prevState => prevState - 1);
    } , 1000);

  }

  const fetchData = async () => {
    let repeat = true;
    while (repeat) {
      try {
        setLoadingMessage(false);
        const res = await fetch(API_URL);
        if (res.status === 503) {
          setLoading(true);
          setLoadingMessage('Service unavailable.');
          await retryCountdown(RETRY_TIME_IN_SECONDS);
        } else {
          const data = await res.json();
          setCollection(data);
          setLoading(false);
          repeat = false;
        }
      } catch (err) {
        console.log(err);
        setLoading(true)
        setLoadingMessage('Failed fetching data...');
        await retryCountdown(RETRY_TIME_IN_SECONDS);
      }
    }
  };

  const fetchDataPeriodically = async () => {
    clearInterval(timerId.current.countdown);
    clearTimeout(timerId.current.next);
    await fetchData();
    updateNextUpdateTimer()
    timerId.current.next = setTimeout(fetchDataPeriodically, NEXT_UPDATE_INTERVAL);
  };


  useEffect(() => {
    fetchDataPeriodically();
  }, []);

  useEffect(() => {
    if (!Object.keys(collection).length) return;

    const extractManufacturers = () => {
      return Object.keys(collection.[CATEGORIES[0]]);
    };

    setManufacturers(extractManufacturers()); 
    setLoading(false);
  }, [collection]);

  if (isLoading) {
    return (
      <Backdrop
        color="primary"
        className={classes.backdrop}
        open={isLoading}>
        <Box className={classes.loginMessage}>
          <CircularProgress color="inherit" />
          <Box m={2}>
            <Typography component="div">
              { loadingMessage
                ? `${loadingMessage}. Retrying in ${retryTimer}`
                : 'Loading...' }
            </Typography>
          </Box>
        </Box>
      </Backdrop>
    );
  }

  return (
    <Router>
      <Header
        categories={CATEGORIES}
        currentTab={currentTab}
        manufacturers={manufacturers}
        currentManufacturer={currentManufacturer}
        setCurrentManufacturer={setCurrentManufacturer}
        nextUpdateTimer={nextUpdateTimer}
        lastUpdateTime={collection.time}
        setCurrentTab={setCurrentTab} />
      <Switch>
        <Route exact path={['/:category', '/:category/:manufacturer']} render={() => (
          <CategoryView
            manufacturers={manufacturers}
            currentManufacturer={currentManufacturer}
            setCurrentManufacturer={setCurrentManufacturer}
            products={collection} />
        )} />
        <Route path='/'>
          <Redirect to={`/${CATEGORIES[0]}`} />
        </Route>
      </Switch>
    </Router>
  );
}


export default App;
