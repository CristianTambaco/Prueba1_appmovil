// app/modal/NuevoGasto.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useGastosContext } from '../context/GastosContext';

interface NuevoGastoProps {
  onClose: () => void;
}

const NuevoGasto = ({ onClose }: NuevoGastoProps) => {
  const [descripcion, setDescripcion] = useState<string>('');
  const [monto, setMonto] = useState<string>('');
  const [pagador, setPagador] = useState<string>('');
  const [participantes, setParticipantes] = useState<string[]>([]);
  const [fotoRecibo, setFotoRecibo] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const { agregarGasto } = useGastosContext();

  const tomarFoto = async () => {
    // Solicitar permisos
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a tu cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoRecibo(result.assets[0].uri);
      setError('');
    }
  };

  const validarFormulario = (): boolean => {
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria');
      return false;
    }
    if (!monto || isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
      setError('El monto debe ser un número positivo');
      return false;
    }
    if (!pagador) {
      setError('Debes seleccionar quién pagó');
      return false;
    }
    if (participantes.length === 0) {
      setError('Debes seleccionar al menos un participante');
      return false;
    }
    if (!fotoRecibo) {
      setError('Es necesario tomar una foto del recibo');
      return false;
    }
    return true;
  };

  const guardarGasto = () => {
    if (!validarFormulario()) return;

    const nuevoGasto = {
      id: Date.now().toString(),
      descripcion,
      monto: parseFloat(monto),
      pagador,
      participantes,
      fotoRecibo: fotoRecibo || '',
      fecha: new Date().toISOString(),
    };

    agregarGasto(nuevoGasto);
    onClose();
  };

  const toggleParticipante = (nombre: string) => {
    if (participantes.includes(nombre)) {
      setParticipantes(participantes.filter(p => p !== nombre));
    } else {
      setParticipantes([...participantes, nombre]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuevo Gasto</Text>
      
      <TextInput
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
        style={styles.input}
      />
      
      <TextInput
        placeholder="$ 0.00"
        value={monto}
        onChangeText={setMonto}
        keyboardType="numeric"
        style={styles.input}
      />
      
      <Text style={styles.label}>¿Quién pagó?</Text>
      <View style={styles.buttonRow}>
        {['Juan', 'María', 'Pedro'].map(persona => (
          <TouchableOpacity 
            key={persona} 
            onPress={() => setPagador(persona)}
            style={[
              styles.personButton,
              { backgroundColor: pagador === persona ? '#4A90E2' : '#E0E0E0' }
            ]}
          >
            <Text>{persona}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.label}>Participantes</Text>
      <View style={styles.buttonRow}>
        {['Juan', 'María', 'Pedro'].map(persona => (
          <TouchableOpacity 
            key={persona} 
            onPress={() => toggleParticipante(persona)}
            style={[
              styles.personButton,
              { backgroundColor: participantes.includes(persona) ? '#4A90E2' : '#E0E0E0' }
            ]}
          >
            <Text>{persona}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <Text style={styles.label}>Foto del Recibo *</Text>
      <TouchableOpacity 
        onPress={tomarFoto}
        style={styles.photoContainer}
      >
        {fotoRecibo ? (
          <Image source={{ uri: fotoRecibo }} style={styles.photoPreview} />
        ) : (
          <>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.photoText}>Tomar Foto del Recibo</Text>
            <Text style={styles.photoSubtext}>Es necesario para registrar el gasto</Text>
          </>
        )}
      </TouchableOpacity>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
      
      <Button title="Guardar Gasto con Recibo" onPress={guardarGasto} />
      <Button title="Cancelar" onPress={onClose} color="#ccc" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  personButton: {
    padding: 8,
    borderRadius: 20,
    marginRight: 5,
  },
  photoContainer: {
    borderStyle: 'dashed',
    borderWidth: 1,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 5,
  },
  photoPreview: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  cameraIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  photoText: {
    marginBottom: 5,
  },
  photoSubtext: {
    fontSize: 12,
    color: 'gray',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

export default NuevoGasto;