import { Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Home from './components/Home';
import NavBar from './components/NavBar';
import CharacterListings from './components/CharacterListings';
import CharacterDetails from './components/CharacterDetails';
import { useState } from 'react';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<CharacterListings loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/characters/:characterId" element={<CharacterDetails loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App