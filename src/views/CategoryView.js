import React, { useCallback, useMemo } from 'react';
import { Container, Grid, Typography, Paper, List, Box, Hidden,
         ListSubheader, ListItem, ListItemText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'; 
import { useParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import WarningIcon from '@material-ui/icons/Warning';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles(theme => ({
  sideBar: {
    position: 'sticky',
    top: theme.spacing(13),
  },
  pageNotFound: {
    display: 'flex',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }
}));

const CategoryView = ({ manufacturers, products, currentManufacturer, setCurrentManufacturer }) => {
  const { category, ...params } = useParams();
  const manufacturer = params.manufacturer || currentManufacturer || manufacturers[0];
  const categoryIsInvalid = Object.keys(products).indexOf(category) === -1;
  const manufacturerIsInvalid = manufacturers.indexOf(manufacturer) === -1;

  const history = useHistory();
  const classes = useStyles();

  const productList = useMemo(() => {
    if (categoryIsInvalid || manufacturerIsInvalid) return; 
    const categoryProductsByManufacturer = products.[category].[manufacturer]
    return <ProductList products={categoryProductsByManufacturer} />
  }, [manufacturer, category, products, categoryIsInvalid, manufacturerIsInvalid]);

  const countProducts = (manufacturer) => {
    const categoryProductsByManufacturer = products.[category].[manufacturer];
    return Array.isArray(categoryProductsByManufacturer)
      ? categoryProductsByManufacturer.length
      : 0;
  };

  if (categoryIsInvalid || manufacturerIsInvalid) {
    return (
      <Box className={classes.pageNotFound}>
        <Typography variant="h2">
          <WarningIcon fontSize="inherit" color="error" />Page Not Found
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Container className={classes.root} maxWidth={false}>
        <Grid container spacing={5}> 

          <Hidden only={['xs', 'sm']}>
            <Grid item md={2} xs={12}>
              <Paper className={classes.sideBar}>
                <List
                  component="ul"
                  subheader={<ListSubheader disableSticky={true}>Brands</ListSubheader>}>
                  {manufacturers.map((manufacturerItem, index) => (
                      <ListItem
                        component='li'
                        button
                        key={manufacturerItem}
                        divider={index < manufacturers.length - 1 ? true : false}
                        selected={manufacturerItem === manufacturer}
                        onClick={() => {
                          setCurrentManufacturer(manufacturerItem);
                          history.push(`/${category}/${manufacturerItem}`);
                        }}>
                        <ListItemText primary={`${manufacturerItem} (${countProducts(manufacturerItem)})`} />
                      </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Hidden>

          <Grid item md={10} xs={12}>
            {productList}
          </Grid>

        </Grid>
      </Container>
    </>
  );
};


export default CategoryView;
