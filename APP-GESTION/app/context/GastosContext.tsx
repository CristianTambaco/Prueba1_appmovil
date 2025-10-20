// app/context/GastosContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definir tipo para un gasto
export interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  pagador: string;
  participantes: string[];
  fotoRecibo: string;
  fecha: string;
}

interface GastosContextType {
  gastos: Gasto[];
  agregarGasto: (gasto: Gasto) => void;
  eliminarGasto: (id: string) => void;
}

const GastosContext = createContext<GastosContextType | undefined>(undefined);

export const GastosProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gastos, setGastos] = useState<Gasto[]>([]);

  // Cargar gastos desde AsyncStorage al iniciar la app
  useEffect(() => {
    const cargarGastos = async () => {
      try {
        const gastosGuardados = await AsyncStorage.getItem('gastos');
        if (gastosGuardados) {
          setGastos(JSON.parse(gastosGuardados));
        }
      } catch (error) {
        console.error('Error al cargar gastos:', error);
      }
    };
    cargarGastos();
  }, []);

  // Guardar gastos en AsyncStorage cuando cambian
  useEffect(() => {
    const guardarGastos = async () => {
      try {
        await AsyncStorage.setItem('gastos', JSON.stringify(gastos));
      } catch (error) {
        console.error('Error al guardar gastos:', error);
      }
    };
    guardarGastos();
  }, [gastos]);

  const agregarGasto = (nuevoGasto: Gasto) => {
    setGastos(prev => [...prev, nuevoGasto]);
  };

  const eliminarGasto = (id: string) => {
    setGastos(prev => prev.filter(gasto => gasto.id !== id));
  };

  return (
    <GastosContext.Provider value={{ gastos, agregarGasto, eliminarGasto }}>
      {children}
    </GastosContext.Provider>
  );
};

export const useGastosContext = () => {
  const context = useContext(GastosContext);
  if (context === undefined) {
    throw new Error('useGastosContext debe usarse dentro de GastosProvider');
  }
  return context;
};

export default GastosContext;