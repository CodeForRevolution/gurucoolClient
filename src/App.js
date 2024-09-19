import logo from './logo.svg';
import './App.css';
import {Routes,Route} from 'react-router-dom'
import LobbyScreen from './Screen/lobbyScreen';
import { SocketProvider } from './context/socketProvider';
import Room from './Screen/room';
function App() {
  return (
    <div className="App">
     <Routes>
      <Route path='/' element={<LobbyScreen/>}></Route>
      <Route path='/room/:roomId' element={<Room/>}></Route>
     </Routes>
    </div>
  );
}

export default App;
