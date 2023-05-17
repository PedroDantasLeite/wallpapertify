import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/login";
import Main from "./pages/main";

const code = new URLSearchParams(window.location.search).get("code");

function App() {
  return code ? <Main /> : <Login />;
}

export default App;
