import React, { createContext, useContext, useState } from 'react';

export const PersonajeContext = createContext({
  personaje: null,
  setPersonaje: (p: any) => {},
});

export const usePersonaje = () => useContext(PersonajeContext);

export const PersonajeProvider = ({ children }: { children: React.ReactNode }) => {
  const [personaje, setPersonaje] = useState(null);
  return (
    <PersonajeContext.Provider value={{ personaje, setPersonaje }}>
      {children}
    </PersonajeContext.Provider>
  );
};
