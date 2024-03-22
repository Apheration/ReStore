import { ThemeProvider } from "@mui/material";
import Header from "./Header";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { fetchBasketAsync } from "../../features/Basket/BasketSlice";
import { fetchCurrentUser } from "../../features/account/AcccountSlice";

function App() { // App() is a component

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    //useeffect so we can get the cart/basket based on the cookie

 const initApp = useCallback(async () => {
        try {
            await dispatch(fetchCurrentUser());
            await dispatch(fetchBasketAsync());
        } catch (error) {
            console.log(error);
        }
 }, [dispatch])

    useEffect(() => {
 
        initApp().then(() => setLoading(false));
 
    }, [initApp]) 

    const [darkMode, setDarkMode] = useState(true);
    const paletteType = darkMode ? 'dark' : 'light';
    const theme = createTheme({
        palette: {
            mode: paletteType,
            background: {
                default: (paletteType === 'light') ? '#eaeaea' : '#121212'
            }
        }
    })

    function HandleThemeChange() {

        setDarkMode(!darkMode);
    }

    if(loading) return <LoadingComponent message="Initializing..." />
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
