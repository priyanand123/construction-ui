import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ToastContainer } from "react-toastify";
//import "react-toastify/dist/ReactToastify.css";
//import "react-datepicker/dist/react-datepicker.css";

import "./App.css";
import { store, persistor } from "./app/redux/store"; // Import both store and persistor
import AppRoute from "./app/routes";

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="App">
          <ToastContainer />
          <AppRoute />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;
