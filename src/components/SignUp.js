import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, get, child, push } from "firebase/database";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import {
  Container,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/system";

const auth = getAuth();
const db = getDatabase();

const libraries = ["places"];

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [conventionalValve, setConventionalValve] = useState("");
  const [premiumValve, setPremiumValve] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "", // Reemplaza esto con tu propia clave de API
    libraries,
  });

  useEffect(() => {
    const loadBrands = async () => {
      const brandsSnapshot = await get(child(ref(db), "marcas"));
      if (brandsSnapshot.exists()) {
        const brandsData = brandsSnapshot.val();
        const brandsArray = Object.keys(brandsData).map((key) => ({
          id: key,
          ...brandsData[key],
        }));
        setBrands(brandsArray);
      } else {
        console.log("No brands found");
      }
    };

    loadBrands();
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleMapClick = (event) => {
    setLocation({ lat: event.latLng.lat(), lng: event.latLng.lng() });
  };

  const handleAddBrand = () => {
    if (selectedBrand && conventionalValve && premiumValve) {
      setSelectedBrands([
        ...selectedBrands,
        {
          id: selectedBrand,
          name: brands.find((brand) => brand.id === selectedBrand)?.name,
          valvula: {
            convencional: {
              peso: "10kg",
              precio: Number(conventionalValve),
            },
            premium: {
              peso: "10kg",
              precio: Number(premiumValve),
            },
          },
        },
      ]);
      setSelectedBrand("");
      setConventionalValve("");
      setPremiumValve("");
    } else {
      alert("Por favor, seleccione una marca y complete los precios.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const distributorRef = push(child(ref(db), "distributors"));
      const distributorId = distributorRef.key;

      await set(distributorRef, {
        id: distributorId,
        email: user.email,
        password,
        phone,
        name,
        address,
        latitud: location.lat, // Guardar latitud
        longitud: location.lng, // Guardar longitud
        location: `${location.lat},${location.lng}`, // Guardar location como una cadena de texto
        marca: selectedBrands.map((brand) => ({
          marca_id: brand.id,
          nombre: brand.name,
          valvula: brand.valvula,
        })),
      });

      navigate("/");
    } catch (error) {
      console.error("Error en el registro:", error);
      alert("Error en el registro");
    }
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";

  return (
    <Container maxWidth="sm" sx={{ marginTop: "2rem", marginBottom: "2rem" }}>
      <Typography variant="h4" gutterBottom>
        Regístrate
      </Typography>
      <form onSubmit={handleSignUp}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              value={`${location.lat}, ${location.lng}`}
              readOnly
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <GoogleMap
              id="map"
              mapContainerStyle={{ width: "100%", height: "400px" }}
              center={location}
              zoom={14}
              onClick={handleMapClick}
            >
              {location.lat && location.lng && <Marker position={location} />}
            </GoogleMap>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Marca</InputLabel>
              <Select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                label="Marca"
              >
                {brands.map((brand) => (
                  <MenuItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Precio (Válvula convencional)"
              type="number"
              value={conventionalValve}
              onChange={(e) => setConventionalValve(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Precio (Válvula premium)"
              type="number"
              value={premiumValve}
              onChange={(e) => setPremiumValve(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddBrand}
            >
              Agregar marca
            </Button>
          </Grid>
          <Grid item xs={12}>
            {selectedBrands.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6">Marcas Seleccionadas</Typography>
                <ul>
                  {selectedBrands.map((brand) => (
                    <li key={brand.id}>
                      {brand.name} - Convencional:{" "}
                      {brand.valvula.convencional.precio} - Premium:{" "}
                      {brand.valvula.premium.precio}
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </Grid>
          <Grid container item xs={4} margin="0 auto">
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Sign Up
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default SignUp;
