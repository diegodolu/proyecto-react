import React, { useState } from 'react';
import { FormControl, FormControlLabel, Checkbox, TextField, Grid, Typography, Box, Button } from '@mui/material';
import { database } from './firebaseConfig'; // Asegúrate de que el path sea correcto
import { ref, set } from 'firebase/database';

const gasBrands = [
  { id: '1', name: 'Solgas' },
  { id: '2', name: 'Llamagas' },
  { id: '3', name: 'Costagas' },
  // Agrega más marcas según sea necesario
];

const GasForm = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [prices, setPrices] = useState({});
  const [distributor, setDistributor] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    address: '',
    latitud: '',
    longitud: '',
    location: '',
    phone: ''
  });

  const handleBrandChange = (event) => {
    const brandId = event.target.name;
    setSelectedBrands((prev) =>
      event.target.checked ? [...prev, brandId] : prev.filter((id) => id !== brandId)
    );
  };

  const handlePriceChange = (event, brandId, valveType) => {
    const value = event.target.value;
    setPrices((prev) => ({
      ...prev,
      [brandId]: {
        ...prev[brandId],
        [valveType]: value
      }
    }));
  };

  const handleDistributorChange = (event) => {
    const { name, value } = event.target;
    setDistributor((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const distributorId = distributor.id || Date.now().toString();
      const distributorData = {
        ...distributor,
        marca: selectedBrands.reduce((acc, brandId) => {
          const brand = gasBrands.find(b => b.id === brandId);
          acc[brandId] = {
            marca_id: brandId,
            nombre: brand.name,
            valvula: {
              convencional: {
                peso: "10kg",
                precio: prices[brandId]?.convencional || 0
              },
              premium: {
                peso: "10kg",
                precio: prices[brandId]?.premium || 0
              }
            }
          };
          return acc;
        }, {})
      };

      await set(ref(database, 'distributors/' + distributorId), distributorData);
      alert('Distribuidor guardado con éxito');
    } catch (error) {
      console.error('Error al guardar el distribuidor:', error);
    }
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        Registro de Distribuidor
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            label="Nombre"
            variant="outlined"
            fullWidth
            name="name"
            value={distributor.name}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            name="email"
            value={distributor.email}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Contraseña"
            variant="outlined"
            fullWidth
            name="password"
            type="password"
            value={distributor.password}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Dirección"
            variant="outlined"
            fullWidth
            name="address"
            value={distributor.address}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Latitud"
            variant="outlined"
            fullWidth
            name="latitud"
            value={distributor.latitud}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Longitud"
            variant="outlined"
            fullWidth
            name="longitud"
            value={distributor.longitud}
            onChange={handleDistributorChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="Teléfono"
            variant="outlined"
            fullWidth
            name="phone"
            value={distributor.phone}
            onChange={handleDistributorChange}
          />
        </Grid>
      </Grid>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Seleccione las marcas que va a vender
        </Typography>
        <FormControl component="fieldset">
          {gasBrands.map((brand) => (
            <FormControlLabel
              key={brand.id}
              control={
                <Checkbox
                  checked={selectedBrands.includes(brand.id)}
                  onChange={handleBrandChange}
                  name={brand.id}
                />
              }
              label={brand.name}
            />
          ))}
        </FormControl>
      </Box>

      {selectedBrands.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Ingrese los precios por tipo de válvula
          </Typography>
          <Grid container spacing={2}>
            {selectedBrands.map((brandId) => (
              <React.Fragment key={brandId}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1">{gasBrands.find((b) => b.id === brandId).name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Precio Válvula Convencional"
                    variant="outlined"
                    fullWidth
                    value={prices[brandId]?.convencional || ''}
                    onChange={(e) => handlePriceChange(e, brandId, 'convencional')}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Precio Válvula Premium"
                    variant="outlined"
                    fullWidth
                    value={prices[brandId]?.premium || ''}
                    onChange={(e) => handlePriceChange(e, brandId, 'premium')}
                  />
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Box>
      )}

      <Box mt={4}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Guardar Distribuidor
        </Button>
      </Box>
    </Box>
  );
};

export default GasForm;
