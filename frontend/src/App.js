import './App.css';
import AppRoutes from './routes/AppRoutes';
import CandidateWaiting from './components/shared/waiting/CandidateWaiting';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return <AppRoutes />;
}



{/*

function App() {

  return (

    <BrowserRouter>

      <CandidateWaiting />

    </BrowserRouter>
  );
}

*/}


export default App;