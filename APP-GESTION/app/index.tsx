import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, Modal } from "react-native";
import { useExpenses } from "../context/ExpensesContext";
import AddExpenseModal from "../components/AddExpenseModal";

const Inicio = () => {
  const { expenses } = useExpenses();
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 12 }}>Gastos Compartidos</Text>

      <FlatList
        data={expenses}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 10 }}>
            <Text style={{ fontWeight: "700" }}>{item.title}</Text>
            <Text>Pagado por: {item.payer}</Text>
            <Text>Monto: ${item.amount.toFixed(2)}</Text>
            <Text>Participantes: {item.participants.join(", ")}</Text>
            <TouchableOpacity style={{ marginTop: 8 }}>
              <Image source={{ uri: item.receiptUri }} style={{ width: 80, height: 60, borderRadius: 6 }} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={() => <Text style={{ marginTop: 20 }}>No hay gastos aún</Text>}
      />

      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={{
          position: "absolute",
          right: 18,
          bottom: 18,
          backgroundColor: "#2b6df6",
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: "white", fontSize: 28 }}>+</Text>
      </TouchableOpacity>

      <Modal visible={open} animationType="slide" onRequestClose={() => setOpen(false)}>
        <AddExpenseModal onClose={() => setOpen(false)} />
      </Modal>
    </View>
  );
};

export default Inicio;
