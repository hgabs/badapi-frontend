import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, TableContainer, Table, TableHead, TableBody,
         TableRow, TableCell, TablePagination, TableFooter } from '@material-ui/core';


const useStyles = makeStyles(theme => ({
  productTable: {
    '& .MuiTableRow-root:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover
    }
  }
}));

const ManufacturerProductList = ({products, className}) => {
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const innerHeight = window.innerHeight < 1024 ? 10 : 15;
  const [rowsPerPage, setRowsPerPage] = useState(innerHeight);


  useEffect(() => setPage(0), [products]);

  if (!products) return <></>;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const orderByName = (a, b) => {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    } else {
      return 0;
    }
  };

  return (
    <>
      <TableContainer className={classes.productTable} component={Paper}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Stock</TableCell>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Manufacturer</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Colors</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            { (rowsPerPage > 0
                 ? products
                  .sort(orderByName)
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                 : products)
                  .sort(orderByName)
                  .map(product => (
              <TableRow key={product.id}>
                <TableCell>{product.availability}</TableCell>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.manufacturer}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.color.join(', ')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                page={page}
                count={products.length}
                rowsPerPage={rowsPerPage}
                rowsPerPageOptions={[10, 15, 50]}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage} />
              </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </>
  );
}

export default ManufacturerProductList;
