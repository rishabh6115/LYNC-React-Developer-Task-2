import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";
import { ContextProvider } from "./store/Context.tsx";
import { WalletContextProvider } from "./store/WalletContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <WalletContextProvider>
    <ContextProvider>
      <Router>
        <App />
      </Router>
    </ContextProvider>
  </WalletContextProvider>
);
