import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import { Container } from "@mui/material";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import { Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import logo from "../assets/Logo1.png";



function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // El inicio de sesión fue exitoso
        var user = userCredential.user;

        // Obtener el ID del distribuidor de la base de datos en tiempo real
        const db = getDatabase();
        const distributorsRef = ref(db, "distributors");

        onValue(distributorsRef, (snapshot) => {
          const distributors = snapshot.val();

          for (let distributorId in distributors) {
            if (distributors[distributorId].email === user.email) {
              console.log(distributors[distributorId]);
              localStorage.setItem("distributorId", distributorId);
              console.log(
                "Signed in as:",
                localStorage.getItem("distributorId")
              );
              break;
            }
          }
        });

        navigate("/home");
      })
      .catch((error) => {
        // Hubo un error en el inicio de sesión
        alert("Email o contraseña incorrectos");
      });
  };

  return (
    <Container
      maxWidth="sm"
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap="1rem"
    >
      <Container maxWidth="sm" sx={{ paddingTop: "4rem" }}>
        <img src={logo} alt="Logo GasSmart" width="400px"></img>
      </Container>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        maxWidth="sm"
        gap="1rem"
        padding="2rem"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.15)", // Color de fondo semitransparente
          backdropFilter: "blur(500px)", // Desenfoque del contenido detrás del elemento
          borderRadius: "10px", // Bordes redondeados
          padding: "1rem", // Espacio alrededor del contenido
          margin: "2rem auto",
          width: "70%",
        }}
      >
        <h2>Sign In</h2>
        <Box
          onSubmit={handleSignIn}
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="1rem"
        >
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Ingresa tu email"
            />
          </div>
          <div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
          </div>
          <Button type="submit" onClick={handleSignIn}>Sign In</Button>
        </Box>
        <Box display="flex" alignContent="center" gap="0.5rem" paddingBottom="1rem">
          <Typography variant="body1">¿No tienes una cuenta?</Typography>
          <Link
            component={RouterLink}
            to="/signup"
            sx={{ textDecoration: "none" }}
          >
            Crea una
          </Link>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
