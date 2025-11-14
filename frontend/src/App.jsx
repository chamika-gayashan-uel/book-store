import { Routes, Route } from 'react-router-dom';
import Books from './pages/Books';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<WelcomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/registration' element={<RegistrationPage />} />
      <Route path='/books' element={<Books />} />
      <Route path='/profile' element={<ProfilePage />} />
    </Routes>
  );
};

export default App;
