// app/screens/RecibosScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
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

const RecibosScreen = () => {
  const { gastos } = useGastosContext();
  const router = useRouter();

  const renderRecibo = ({ item }: { item: Gasto }) => (
    <TouchableOpacity 
      style={styles.reciboItem}
      onPress={() => router.push(`/recibo/${item.id}`)}
    >
      <Image 
        source={{ uri: item.fotoRecibo }} 
        style={styles.reciboImage}
        resizeMode="cover"
      />
      <View style={styles.reciboInfo}>
        <Text style={styles.reciboTitulo}>{item.descripcion}</Text>
        <View style={styles.reciboDetails}>
          <Text style={styles.reciboFecha}>{new Date(item.fecha).toLocaleDateString()}</Text>
          <Text style={styles.reciboMonto}>${item.monto}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Galería de Recibos</Text>
        <Text style={styles.subtitle}>{gastos.length} recibos registrados</Text>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>📌 Recibos Verificados</Text>
        <Text style={styles.infoText}>Todos los gastos incluyen foto del recibo para mayor control</Text>
      </View>
      
      <FlatList
        data={gastos}
        renderItem={renderRecibo}
        keyExtractor={(item: Gasto) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={<Text style={styles.emptyText}>No hay recibos registrados</Text>}
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
    backgroundColor: '#FF7A00',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: 'gray',
  },
  row: {
    marginBottom: 10,
  },
  reciboItem: {
    flex: 1,
    margin: 5,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reciboImage: {
    width: '100%',
    height: 150,
  },
  reciboInfo: {
    padding: 10,
  },
  reciboTitulo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reciboDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reciboFecha: {
    fontSize: 12,
    color: 'gray',
  },
  reciboMonto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
});

export default RecibosScreen;