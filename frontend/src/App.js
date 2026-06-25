import { Toaster } from "react-hot-toast";
import './App.css';
import AppRoutes from './routes/AppRoutes';
import Home from './components/home/Home';



function App() {


  
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <AppRoutes />
    </>
  );
}

  {/*

function App() {
  return <Home />;
}
*/}

export default App;