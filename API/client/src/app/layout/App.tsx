import { ThemeProvider } from "@emotion/react";
import Header from "./Header";
import { Container, CssBaseline, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import agent from "../api/agent";
import { getCookie } from "../util/Util";
import LoadingComponent from "./LoadingComponent";
import { useAppDispatch } from "../store/configureStore";
import { setBasket } from "../../features/Basket/BasketSlice";
import { fetchCurrentUser } from "../../features/account/AcccountSlice";

function App() { // App() is a component

    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(true);
    //useeffect so we can get the cart/basket based on the cookie
    useEffect(() => {
        const buyerId = getCookie('buyerId');

        dispatch(fetchCurrentUser());

        if (buyerId) {
            agent.Basket.get() // get basket contents
                .then(basket => dispatch(setBasket(basket)))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        }
        else {
            setLoading(false);
        }
    }, [dispatch]) //needs dependency because is useEffect

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
