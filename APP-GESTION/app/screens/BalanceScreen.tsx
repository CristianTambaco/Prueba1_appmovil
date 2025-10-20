// app/screens/BalanceScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useGastosContext } from '../context/GastosContext';

// Definir tipos para los gastos y deudas
interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  pagador: string;
  participantes: string[];
  fotoRecibo: string;
  fecha: string;
}

interface Deuda {
  deudor: string;
  acreedor: string;
  monto: number;
}

const BalanceScreen = () => {
  const { gastos } = useGastosContext();
  const [balances, setBalances] = useState<{[key: string]: number}>({});
  const [deudas, setDeudas] = useState<Deuda[]>([]);
  const [promedio, setPromedio] = useState<number>(0);

  useEffect(() => {
    calcularBalances();
  }, [gastos]);

  const calcularBalances = () => {
    // Inicializar balances con tipos explícitos
    const balancesIniciales: {[key: string]: number} = { Juan: 0, María: 0, Pedro: 0 };
    
    // Calcular cuánto gastó cada persona
    gastos.forEach((gasto: Gasto) => {
      if (balancesIniciales[gasto.pagador] !== undefined) {
        balancesIniciales[gasto.pagador] += gasto.monto;
      }
    });
    
    // Calcular promedio
    const totalGastado = Object.values(balancesIniciales).reduce((sum, val) => sum + val, 0);
    const promedioPersona = totalGastado / 3; // 3 personas
    
    // Calcular balance final (cuánto debe o le deben)
    const balancesFinales: {[key: string]: number} = {};
    const personas = ['Juan', 'María', 'Pedro'];
    
    personas.forEach(persona => {
      if (balancesIniciales[persona] !== undefined) {
        balancesFinales[persona] = balancesIniciales[persona] - promedioPersona;
      }
    });
    
    // Calcular deudas
    const nuevasDeudas: Deuda[] = [];
    const personasConDeudas = Object.keys(balancesFinales).filter(persona => 
      balancesFinales[persona] > 0
    );
    const personasConCréditos = Object.keys(balancesFinales).filter(persona => 
      balancesFinales[persona] < 0
    );
    
    let deudasTemp = [...personasConDeudas];
    let creditosTemp = [...personasConCréditos];
    
    while (deudasTemp.length > 0 && creditosTemp.length > 0) {
      const deudor = deudasTemp[0];
      const acreedor = creditosTemp[0];
      
      // Verificar que los valores existen antes de usarlos
      const montoDeuda = Math.min(
        balancesFinales[deudor] || 0,
        Math.abs(balancesFinales[acreedor] || 0)
      );
      
      nuevasDeudas.push({
        deudor,
        acreedor,
        monto: montoDeuda
      });
      
      // Actualizar balances
      if (balancesFinales[deudor] !== undefined) {
        balancesFinales[deudor] -= montoDeuda;
      }
      if (balancesFinales[acreedor] !== undefined) {
        balancesFinales[acreedor] += montoDeuda;
      }
      
      if (balancesFinales[deudor] === 0) {
        deudasTemp.shift();
      }
      if (balancesFinales[acreedor] === 0) {
        creditosTemp.shift();
      }
    }
    
    setBalances(balancesFinales);
    setDeudas(nuevasDeudas);
    setPromedio(promedioPersona);
  };

  const renderDeuda = ({ item }: { item: Deuda }) => (
    <View style={styles.deudaItem}>
      <Text style={styles.deudor}>{item.deudor} debe a {item.acreedor}</Text>
      <Text style={styles.monto}>${item.monto.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Balance de Cuentas</Text>
      <Text style={styles.subtitle}>¿Quién debe a quién?</Text>
      
      <View style={styles.resumen}>
        <Text style={styles.resumenTitle}>Resumen de Deudas</Text>
        <FlatList
          data={deudas}
          renderItem={renderDeuda}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={<Text>No hay deudas pendientes</Text>}
        />
      </View>
      
      <View style={styles.algoritmo}>
        <Text style={styles.algoritmoTitle}>Algoritmo de División</Text>
        <Text>Método: Simplificación de deudas</Text>
        <View style={styles.detalle}>
          <Text>Juan gastó: ${balances.Juan ? (balances.Juan + promedio).toFixed(2) : '0.00'}</Text>
          <Text>María gastó: ${balances.María ? (balances.María + promedio).toFixed(2) : '0.00'}</Text>
          <Text>Pedro gastó: ${balances.Pedro ? (balances.Pedro + promedio).toFixed(2) : '0.00'}</Text>
          <Text>Promedio por persona: ${promedio.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  resumen: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  resumenTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  deudaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  deudor: {
    fontSize: 16,
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'red',
  },
  algoritmo: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 10,
  },
  algoritmoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detalle: {
    gap: 5,
  },
});

export default BalanceScreen;