import { ThemeProvider } from "@emotion/react";
import Header from "./Header";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() { // App() is a component

    const [darkMode, setDarkMode] = useState(false);
    const paletteType = darkMode ? 'dark' : 'light';

    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: paletteType === 'light' ? '#eaeaea' : '#121212'
            }
        }
    })

    function HandleThemeChange() {
        setDarkMode(!darkMode);
    }
  return (
      <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
          <CssBaseline />
          <Header darkMode={darkMode} handleThemeChange={HandleThemeChange} />
          <Container>
              <Outlet />
          </Container>
   

      </ThemeProvider>
  )
}

export default App
