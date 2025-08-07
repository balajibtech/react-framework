import { Provider } from "react-redux";
import store from "./store";
import AppRoutes from "./routes";
import "./i18n";
import "./styles/index.scss";

const App: React.FC = () => (
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);

export default App;
