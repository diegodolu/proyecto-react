import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, signOut } from "../firebaseConfig";
import { ReabastecimientosMes } from "./ReabastecimientosMes";
import { ComprasPorDistrito } from "./ComprasPorDistrito";

import { Container, Grid, Button, Typography } from "@mui/material";
import { BalonesVendidos } from "./BalonesVendidos";
import { BalonesPeso } from "./BalonesPeso";

function Home() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        console.log(user);
      } else {
        setUser(null);
      }
    });

    // Limpiar la suscripción al desmontar
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        // Cierre de sesión exitoso
        navigate("/");
      })
      .catch((error) => {
        // Hubo un error al cerrar la sesión
        console.error(error);
      });
  };

  return (
    <Container sx={{marginTop: "2rem"}}>
      <nav style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={handleSignOut} variant="contained" color="primary">
          Cerrar sesión
        </Button>
      </nav>
      <Typography variant="h3" gutterBottom>
        Gráficas
      </Typography>
      <Container>
        {/* Configuración del Grid */}
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6}>
            {/* Primer gráfico */}
            <ReabastecimientosMes />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Segundo gráfico */}
            <ComprasPorDistrito />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Segundo gráfico */}
            <BalonesVendidos />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* Segundo gráfico */}
            <BalonesPeso />
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
}

export default Home;
