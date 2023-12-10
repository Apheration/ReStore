import { ThemeProvider } from "@emotion/react";
import Catalog from "../../features/catalog/catalog";
import Header from "./Header";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useState } from "react";

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
          <CssBaseline />
          <Header darkMode={darkMode} handleThemeChange={HandleThemeChange} />
          <Container>
              <Catalog />
          </Container>

      </ThemeProvider>
  )
}

export default App
