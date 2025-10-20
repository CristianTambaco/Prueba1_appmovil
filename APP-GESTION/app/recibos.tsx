import React, { useState } from "react";
import { View, FlatList, Image, TouchableOpacity, Modal } from "react-native";
import { useExpenses } from "../context/ExpensesContext";

const Recibos = () => {
  const { expenses } = useExpenses();
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={expenses}
        keyExtractor={(i) => i.id}
        numColumns={3}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setSelected(item.id)} style={{ flex: 1 / 3, padding: 6 }}>
            <Image source={{ uri: item.receiptUri }} style={{ width: "100%", height: 100, borderRadius: 8 }} />
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selected} onRequestClose={() => setSelected(null)} transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", alignItems: "center" }}>
          {selected && (
            <>
              <Image source={{ uri: expenses.find((e) => e.id === selected)!.receiptUri }} style={{ width: "90%", height: "70%", borderRadius: 12 }} />
            </>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default Recibos;
