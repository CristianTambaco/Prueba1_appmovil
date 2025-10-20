// app/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useGastosContext } from '../context/GastosContext';
import { useRouter } from 'expo-router';

// Definir tipo para un gasto
interface Gasto {
  id: string;
  descripcion: string;
  monto: number;
  pagador: string;
  participantes: string[];
  fotoRecibo: string;
  fecha: string;
}

const HomeScreen = () => {
  const { gastos } = useGastosContext();
  const router = useRouter();

  const renderGasto = ({ item }: { item: Gasto }) => (
    <TouchableOpacity 
      style={styles.gastoItem}
      onPress={() => router.push(`/gasto/${item.id}`)}
    >
      <View style={styles.gastoHeader}>
        <Text style={styles.descripcion}>{item.descripcion}</Text>
        <Text style={styles.monto}>${item.monto}</Text>
      </View>
      <View style={styles.gastoFooter}>
        <Text style={styles.pagador}>Pagado por {item.pagador}</Text>
        <Text style={styles.fecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      <View style={styles.participantes}>
        {item.participantes.map((participante: string) => (
          <View key={participante} style={styles.participanteBadge}>
            <Text style={styles.participanteText}>{participante.charAt(0)}</Text>
          </View>
        ))}
        <Text style={styles.reciboStatus}>✅ Recibo verificado</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gastos Compartidos</Text>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total gastado</Text>
          <Text style={styles.totalAmount}>
            ${gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.monto, 0).toFixed(2)}
          </Text>
          <Text style={styles.periodo}>Octubre 2025</Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Gastos</Text>
      <FlatList
        data={gastos}
        renderItem={renderGasto}
        keyExtractor={(item: Gasto) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay gastos registrados</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#4A90E2',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  totalContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  periodo: {
    fontSize: 14,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  gastoItem: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gastoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  descripcion: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  monto: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  gastoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  pagador: {
    fontSize: 14,
    color: 'gray',
  },
  fecha: {
    fontSize: 14,
    color: 'gray',
  },
  participantes: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  participanteBadge: {
    backgroundColor: '#4A90E2',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participanteText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reciboStatus: {
    fontSize: 12,
    color: 'green',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default HomeScreen;