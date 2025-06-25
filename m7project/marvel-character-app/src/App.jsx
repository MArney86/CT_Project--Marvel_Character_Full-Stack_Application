import { Routes, Route } from 'react-router-dom';
import NotFound from './components/NotFound';
import Home from './components/Home';
import NavBar from './components/NavBar';
import CharacterListings from './components/CharacterListings';
import CharacterDetails from './components/CharacterDetails';
import AddCharacter from './components/AddCharacter';
import UpdateCharacter from './components/UpdateCharacter';
import DeleteCharacter from './components/DeleteCharacter';
import { useState } from 'react';

function App() {
  // State to manage loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <>
    <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/characters" element={<CharacterListings loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/characters/:characterId" element={<CharacterDetails loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/new" element={<AddCharacter loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/update" element={<UpdateCharacter loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/delete" element={<DeleteCharacter loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/update/:characterId" element={<UpdateCharacter loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="/delete/:characterId" element={<DeleteCharacter loading={loading} setLoading={setLoading} error={error} setError={setError} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App