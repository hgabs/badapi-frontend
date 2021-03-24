import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { AppBar, Tabs, Tab, Tooltip, Toolbar, Typography, Select,
         Button, Box, SwipeableDrawer, List, ListItem, MenuItem,
         ListSubheader, ListItemText, IconButton } from '@material-ui/core';
import UpdateIcon from '@material-ui/icons/Update';
import TimerIcon from '@material-ui/icons/Timer';
import MenuIcon from '@material-ui/icons/Menu';


const useStyles = makeStyles(theme => ({
  tab: { minHeight: '64px', },
  icon: { marginRight: theme.spacing(1) },
  menu: { marginLeft: theme.spacing(7) },
  tabIndicator: { height: '3px' },
  drawerCategories: { width: '250px' },
  selectManufacturer: { width: '100%' },
  title: {
    whiteSpace: 'nowrap',
    fontFamily: 'Bungee',
    textShadow: `1px 1px 1px ${theme.palette.grey.[900]}, -1px -1px 1px ${theme.palette.grey.[700]}`,
    fontSize: '24pt',
    color: theme.palette.grey.[200]
  },
  drawerInfoWrapper: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  infoWrapper: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    justifyContent: 'flex-end'
  },
  appBar: {
    paddingLeft: theme.spacing(2),
    marginBottom: theme.spacing(5),
    backgroundColor: theme.palette.primary.main
  },
  updateInfo: { 
    marginRight: theme.spacing(2),
    '& .MuiButton-label': {
      whiteSpace: 'nowrap',
    }
  }
}));


const Header = ({ categories, setCurrentTab, currentManufacturer, lastUpdateTime,
                  setCurrentManufacturer, nextUpdateTimer, manufacturers }) => {

  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch('/:category');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const currentTab = match && match.params.category ? categories.indexOf(match.params.category) : 0;
  const validCurrentManufacturer = currentManufacturer && manufacturers.indexOf(currentManufacturer) >= 0
  const lastUpdateTimeString = new Date(lastUpdateTime).toLocaleTimeString();

  const toggleDrawer = open => event => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setIsDrawerOpen(open);
  };

  return (
    <>
      <SwipeableDrawer
        anchor={'left'}
        open={isDrawerOpen}
        onOpen={toggleDrawer(true)}
        onClose={toggleDrawer(false)}>

        <List
          component="ul"
          className={classes.drawerCategories}
          subheader={<ListSubheader disableSticky={true}>Categories</ListSubheader>}>
          {categories.map((category, index) => (
              <ListItem
                button
                component="li"
                key={category}
                divider={index < categories.length - 1 ? true : false}
                selected={currentTab >= 0 ? categories[currentTab] === category : false}
                onClick={() => {
                  const path = validCurrentManufacturer
                    ? `/${category}/${currentManufacturer}`
                    : `/${category}`;
                  history.push(path)}}>
                <ListItemText primary={category} />
              </ListItem>
          ))}
        </List>

        <ListSubheader>Manufacturers</ListSubheader>
        <Box mx={2}>
          <Select
            className={classes.selectManufacturer}
            value={validCurrentManufacturer ? currentManufacturer : manufacturers[0]}
            onChange={event => {
              const selectedManufacturer = event.target.value;
              setCurrentManufacturer(selectedManufacturer);
              const path = `/${categories[currentTab]}/${selectedManufacturer}`
              history.push(path)}}>
            {manufacturers.map(manufacturer => (
              <MenuItem
                key={manufacturer}
                value={manufacturer}>
                {manufacturer}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Box className={classes.drawerInfoWrapper} my={5} mx={1}>
          <Box>
            <Tooltip title="Next update" aria-label="next update">
              <Button
                color="secondary"
                variant="contained"
                aria-label="Last Update"
                fullWidth>
                <TimerIcon className={classes.icon} />{nextUpdateTimer}
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Last update" aria-label="last update">
              <Button variant="contained" aria-label="Last Update" fullWidth>
                <UpdateIcon className={classes.icon} />{lastUpdateTimeString}
              </Button>
            </Tooltip>
          </Box>
        </Box>

      </SwipeableDrawer>

      <AppBar className={classes.appBar} color="primary" position="sticky">
        <Toolbar disableGutters={true}>

          <Box display={{ md: 'none', lg: 'none', xl: 'none' }}>
            <IconButton 
              className={classes.menuButton}
              color="inherit"
              disableRipple={true}
              onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>

          <Button
            className={classes.title}
            onClick={() => history.push('/')}>
            <Typography className={classes.title} variant="h5">BAD API</Typography>
          </Button>

          <Box
            className={classes.menu}
            display={{ xs: 'none', sm: 'none', md: 'block', lg: 'block', xl: 'block' }}>
            <Tabs
              aria-label="category tabs"
              classes={{ indicator: classes.tabIndicator }}
              value={currentTab >= 0 ? currentTab : false}
              onChange={(event, newValue) => {
                const path = validCurrentManufacturer
                  ? `/${categories[newValue]}/${currentManufacturer}`
                  : `/${categories[newValue]}`;
                history.push(path);
              }}>
              {categories.map(category => ( 
                <Tab key={category} className={classes.tab} label={category} />
              ))}
            </Tabs>
          </Box>

          <Box className={classes.infoWrapper}>
            <Box
              className={classes.updateInfo}
              display={{ xs: 'none', sm: 'none', md: 'flex', lg: 'flex', xl: 'flex' }}>
              <Tooltip title="Next update" aria-label="next update">
              <Button color="secondary" variant="contained" aria-label="Last Update">
                <TimerIcon className={classes.icon} />{nextUpdateTimer}
              </Button>
              </Tooltip>
            </Box>

            <Box
              className={classes.updateInfo}
              display={{ xs: 'none', sm: 'none', md: 'flex', lg: 'flex', xl: 'flex' }}>
              <Tooltip title="Last update" aria-label="last update">
              <Button variant="contained" aria-label="Last Update" mr={2}>
                <UpdateIcon className={classes.icon} />{lastUpdateTimeString}
              </Button>
              </Tooltip>
            </Box>
          </Box>

        </Toolbar>
      </AppBar>
    </>
  );
};


export default Header;
