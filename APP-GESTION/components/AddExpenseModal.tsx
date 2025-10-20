import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useExpenses, Person } from "../context/ExpensesContext";

const ALL: Person[] = ["Juan", "María", "Pedro"];

const AddExpenseModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { addExpense } = useExpenses();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState<Person | null>(null);
  const [participants, setParticipants] = useState<Person[]>(ALL);
  const [receiptUri, setReceiptUri] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const pickFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso requerido", "La app necesita permiso a la cámara para tomar la foto del recibo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
  quality: 0.7,
  base64: false,
});

if (!result.canceled && result.assets && result.assets.length > 0) {
  setReceiptUri(result.assets[0].uri);
}

  };

  const toggleParticipant = (p: Person) => {
    setParticipants((prev) => (prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]));
  };

  const onSave = async () => {
    // validaciones
    if (!title.trim()) { Alert.alert("Validación", "Ingresa la descripción"); return; }
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) { Alert.alert("Validación", "Ingresa un monto válido mayor a 0"); return; }
    if (!payer) { Alert.alert("Validación", "Selecciona quién pagó"); return; }
    if (participants.length === 0) { Alert.alert("Validación", "Selecciona al menos un participante"); return; }
    if (!receiptUri) { Alert.alert("Validación", "La foto del recibo es obligatoria"); return; }

    setSubmitting(true);
    try {
      await addExpense({ title, amount: num, payer, participants, receiptUri });
      onClose();
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo guardar el gasto");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Nuevo Gasto</Text>

      <Text>Descripción</Text>
      <TextInput placeholder="Ej: Cena con amigos" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />

      <Text>Monto</Text>
      <TextInput placeholder="$ 0.00" keyboardType="numeric" value={amount} onChangeText={setAmount} style={{ borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 12 }} />

      <Text>¿Quién pagó?</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {ALL.map((p) => (
          <TouchableOpacity key={p} onPress={() => setPayer(p)} style={{ padding: 8, marginRight: 8, borderRadius: 8, backgroundColor: payer === p ? "#2b6df6" : "#eee" }}>
            <Text style={{ color: payer === p ? "white" : "black" }}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Participantes</Text>
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        {ALL.map((p) => (
          <TouchableOpacity key={p} onPress={() => toggleParticipant(p)} style={{ padding: 8, marginRight: 8, borderRadius: 20, backgroundColor: participants.includes(p) ? "#cfe3ff" : "#f0f0f0" }}>
            <Text>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Foto del Recibo *</Text>
      <TouchableOpacity onPress={pickFromCamera} style={{ height: 140, borderWidth: 1, borderStyle: "dashed", borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
        {receiptUri ? <Image source={{ uri: receiptUri }} style={{ width: "100%", height: "100%", borderRadius: 8 }} /> : <Text>Tomar Foto del Recibo</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={onSave} style={{ backgroundColor: "#2b6df6", padding: 14, borderRadius: 8, alignItems: "center", marginBottom: 12 }}>
        <Text style={{ color: "white" }}>{submitting ? "Guardando..." : "Guardar Gasto con Recibo"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose} style={{ padding: 12 }}>
        <Text style={{ color: "#444" }}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddExpenseModal;
