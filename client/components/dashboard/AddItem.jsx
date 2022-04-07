import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import { InputLabel, Select } from '@mui/material';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';


const categories = ['Childcare', 'Clothing', 'Education', 'Food', 'Healthcare', 'Homegoods', 'Personal hygiene', 'Other'];

export default function Add() {
  
  const [inputs, setInputs] = useState({
    name: '',
    category: '',
    total_needed: 0,
    items: [],
  });

  useEffect(() => {
    fetch('/api/items')
      .then((data) => data.json())
      .then((rows) => {
        console.log(rows);
        setTableData(rows);
      });
  }, []);


  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({...values, [name]: value}));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let data = new FormData(document.getElementById('addItem'));
    data = Object.fromEntries(data);
    const test = JSON.stringify(data);
    console.log('test', test);
    // console.log('name', data.get('name'), 'category', data.get('category'), 'total_needed', data.get('total_needed'));

    fetch('/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    })
      .then(res => console.log(res));

    setInputs({
      name: '',
      category: '',
      total_needed: 0,
    });
  };

  return (
    <Container maxWidth="xs">
      <Typography component="h1" variant="h5" sx={{mt: 3}}>
        New Donation
      </Typography>
      <Box id="addItem" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <FormControl sx={{ mx: 'auto', width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="item"
            label="Item"
            name="name"
            value= { inputs.name || '' }
            autoComplete="item"
            autoFocus

            onChange = { handleChange }
          />
        </FormControl>
        <Grid item xs={12}>
          <FormControl sx={{ mt: 1, width: '100%' }}>
            <InputLabel id='outlined-category-label'>Category</InputLabel>
            <Select
              labelId='outlined-category-label'
              id='category-select'
              name='category'
              value={inputs.category || ''}
              input={<OutlinedInput label="Category" />}
              onChange={handleChange}
            >
              {categories.map((category) => {
                return (
                  <MenuItem
                    key={category}
                    value={category}
                  >
                    {category}
                  </MenuItem>);
              })}
            </Select>
          </FormControl>
        </Grid>
        <FormControl sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="total_needed"
            value = { inputs.total_needed || 0}
            label="Quantity"
            type="number"
            id="quantity"
            autoComplete="quantity"
            onChange = { handleChange }
          />
        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ width: '100%', mt: 2, mb: 1 }}
        >
            Add Item
        </Button>
      </Box>
    </Container>
  );
}
