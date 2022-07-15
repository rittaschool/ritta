import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Outlet, useNavigate } from "react-router-dom";
import { theme } from "../theme";
import "../styles/App.css";
import Layout from "../components/AuthLayout";
import useAuthentication from "../hooks/useAuthentication";
import { useEffect } from "react";

function App() {
  // Save colorScheme to localStorage and the default value is the preferred colorScheme
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "ritta-color-scheme",
    defaultValue: preferredColorScheme,
  });

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([
    ["mod+J", () => toggleColorScheme()],
    ["mod+K", () => console.log("huut")],
  ]);

  /*const { authenticated } = useAuthentication();
  const navigate = useNavigate();

  useEffect(() => {
    if (authenticated) {
      navigate("/");
    }
  }, []);

  if (authenticated) {
    return <></>;
  }*/

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{ ...theme, colorScheme }}
        withGlobalStyles
        withNormalizeCSS
      >
        <div className="App">
          <Layout>
            <Outlet />
          </Layout>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
