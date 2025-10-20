// app/screens/GastoDetalle.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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

interface GastoDetalleProps {
  route: {
    params: {
      id: string;
    };
  };
}

const GastoDetalle = ({ route }: GastoDetalleProps) => {
  const { id } = route.params;
  const { gastos, eliminarGasto } = useGastosContext();
  const router = useRouter();
  
  const gasto = gastos.find((g: Gasto) => g.id === id);
  
  if (!gasto) {
    return (
      <View style={styles.container}>
        <Text>Gasto no encontrado</Text>
      </View>
    );
  }

  const handleEliminar = () => {
    Alert.alert(
      'Eliminar Gasto',
      '¿Estás seguro de eliminar este gasto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            eliminarGasto(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{gasto.descripcion}</Text>
      
      <Image 
        source={{ uri: gasto.fotoRecibo }} 
        style={styles.reciboImage}
        resizeMode="contain"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Monto:</Text>
        <Text style={styles.infoValue}>${gasto.monto}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Pagado por:</Text>
        <Text style={styles.infoValue}>{gasto.pagador}</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Participantes:</Text>
        <View style={styles.participantesContainer}>
          {gasto.participantes.map((participante: string) => (
            <View key={participante} style={styles.participanteBadge}>
              <Text style={styles.participanteText}>{participante}</Text>
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>Fecha:</Text>
        <Text style={styles.infoValue}>{new Date(gasto.fecha).toLocaleDateString()}</Text>
      </View>
      
      <TouchableOpacity style={styles.eliminarButton} onPress={handleEliminar}>
        <Text style={styles.eliminarButtonText}>🗑️ Eliminar Gasto</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
  },
  reciboImage: {
    width: '100%',
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 120,
  },
  infoValue: {
    flex: 1,
  },
  participantesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participanteBadge: {
    backgroundColor: '#4A90E2',
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  participanteText: {
    color: 'white',
  },
  eliminarButton: {
    backgroundColor: '#ff4444',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  eliminarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default GastoDetalle;