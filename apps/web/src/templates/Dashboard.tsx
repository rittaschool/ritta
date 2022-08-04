import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from "@mantine/core";
import {
  useColorScheme,
  useHotkeys,
  useInterval,
  useLocalStorage,
} from "@mantine/hooks";
import { Outlet } from "react-router-dom";
import { theme } from "../theme";
import "../styles/App.css";
import Layout from "../components/Layout";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function App({ isAdmin }: { isAdmin: boolean }) {
  // Save colorScheme to localStorage and the default value is the preferred colorScheme
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "ritta-color-scheme",
    defaultValue: preferredColorScheme,
  });

  const { i18n } = useTranslation();
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([
    ["mod+J", () => toggleColorScheme()],
    [
      "mod+K",
      () => {
        const langs = ["fi", "en"];
        i18n.changeLanguage(
          langs[langs.indexOf(i18n.language) + 1] || langs[0]
        );
      },
    ],
  ]);

  const interval = useInterval(() => {
    console.log("\n\n\n\n\n");
    console.log(
      "%c VAROITUS! WARNING! ",
      "background: #000000; color: red; font-size: 3em;"
    );
    console.log(
      "%cJos joku pyysi/käski sinua liittämään tänne tekstiä, hän 110% on huijari.",
      "font-size: 2em;"
    );
    console.log(
      "%cTänne tuntemattomien koodinpätkien liitäminen voi johtaa tilisi hakkerointiin.",
      "font-size: 2em;color:red;font-weight: bold;"
    );
    console.log(
      "%cEllet ole TÄYSIN VARMA että tiedät mitä teet, sulje tämä ikkuna välittömästi.",
      "font-size: 2em;"
    );
    console.log(
      "%c WARNING! WARNING! ",
      "background: #000000; color: red; font-size: 3em;"
    );
    console.log(
      "%cIf someone asked you to paste something here, theres a 110% chance that you are being scammed.",
      "font-size: 2em;"
    );
    console.log(
      "%cPasting unknown text here could lead to your account getting hacked.",
      "font-size: 2em;color:red;font-weight: bold;"
    );
    console.log(
      "%cIf you do not know what you are doing, CLOSE THIS WINDOW IMMEDIATELY.",
      "font-size: 2em;"
    );
    console.log("\n\n\n\n\n");
  }, 10000);

  useEffect(() => {
    if (import.meta.env.PROD) {
      console.log("\n\n\n\n\n");
      console.log(
        "%c VAROITUS! WARNING! ",
        "background: #000000; color: red; font-size: 3em;"
      );
      console.log(
        "%cJos joku pyysi/käski sinua liittämään tänne tekstiä, hän 110% on huijari.",
        "font-size: 2em;"
      );
      console.log(
        "%cTänne tuntemattomien koodinpätkien liitäminen voi johtaa tilisi hakkerointiin.",
        "font-size: 2em;color:red;font-weight: bold;"
      );
      console.log(
        "%cEllet ole TÄYSIN VARMA että tiedät mitä teet, sulje tämä ikkuna välittömästi.",
        "font-size: 2em;"
      );
      console.log(
        "%c WARNING! WARNING! ",
        "background: #000000; color: red; font-size: 3em;"
      );
      console.log(
        "%cIf someone asked you to paste something here, theres a 110% chance that you are being scammed.",
        "font-size: 2em;"
      );
      console.log(
        "%cPasting unknown text here could lead to your account getting hacked.",
        "font-size: 2em;color:red;font-weight: bold;"
      );
      console.log(
        "%cIf you do not know what you are doing, CLOSE THIS WINDOW IMMEDIATELY.",
        "font-size: 2em;"
      );
      console.log("\n\n\n\n\n");
      interval.start();
      return interval.stop;
    }
  }, []);

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
          <Layout isAdmin={isAdmin}>
            <Outlet />
          </Layout>
        </div>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
