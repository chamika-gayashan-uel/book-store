import { Routes, Route } from 'react-router-dom';
import Books from './pages/BooksPage';
import RegistrationPage from './pages/RegistrationPage';
import LoginPage from './pages/LoginPage';
import WelcomePage from './pages/WelcomePage';
import ProfilePage from './pages/ProfilePage';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import CreateBookPage from './pages/CreateBookPage';
import BookDetailsPage from './pages/BookDetailsPage';
import { getEthPriceUsd } from './controllers/bookController';

const App = () => {
  const { enqueueSnackbar } = useSnackbar();
  const state = useSelector((state) => state);

  useEffect(() => {
    getEthPriceUsd();
  }, [])

  useEffect(() => {
    if (state.notification?.message) {
      enqueueSnackbar(state.notification.message, {
        variant: state.notification.variant,
      });
    }
  }, [state.notification, enqueueSnackbar]);

  return (
    <Routes>
      <Route path='/' element={<WelcomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/registration' element={<RegistrationPage />} />
      <Route path='/books' element={<Books />} />
      <Route path='/profile' element={state.user != null ? <ProfilePage /> : <WelcomePage />} />
      <Route path='/new-book' element={state.user != null ? <CreateBookPage /> : <WelcomePage />} />
      <Route path='/edit-book/:id' element={state.user != null ? <CreateBookPage /> : <WelcomePage />} />
      <Route path='/view-book/:id' element={state.user != null ? <BookDetailsPage /> : <WelcomePage />} />
    </Routes>
  );
};

export default App;
