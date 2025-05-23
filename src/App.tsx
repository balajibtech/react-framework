import ServerError from "./pages/ServerError/ServerError";
import { HelmetProvider } from "react-helmet-async";
import ThemeManager from "@/components/ThemeManager/ThemeManager";
import AppRoute from "./routes/index.route";
import { DocumentHead } from "./components/DocumentHead/DocumentHead";
import { ErrorBoundary } from "react-error-boundary";

/**
 * The main App component, wrapped with the Redux store provider.
 * @param {AppProps} props - The props passed to the App component.
 * @returns {JSX.Element} The main application JSX element.
 */
const App = () => {

  return (
    <HelmetProvider>
      <div className="App">
        <ErrorBoundary fallback={<ServerError />}>
          <ThemeManager>
            <AppRoute />
            <DocumentHead />
          </ThemeManager>
        </ErrorBoundary>
      </div>
    </HelmetProvider>
  );
}

export default App;
