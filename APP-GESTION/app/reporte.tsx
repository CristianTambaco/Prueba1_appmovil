import React from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useExpenses } from "../context/ExpensesContext";

const Reporte = () => {
  const { expenses } = useExpenses();

  const generateHtml = () => {
    const total = expenses.reduce((a, b) => a + b.amount, 0);
    const rows = expenses.map((e) => `<tr><td>${e.title}</td><td>${e.payer}</td><td>$${e.amount.toFixed(2)}</td><td>${new Date(e.date).toLocaleDateString()}</td></tr>`).join("");
    const html = `
      <html>
      <body>
        <h1>Resumen de Gastos</h1>
        <p>Total: $${total.toFixed(2)}</p>
        <table border="1" cellpadding="8" style="border-collapse:collapse;">
          <thead><tr><th>Título</th><th>Pagó</th><th>Monto</th><th>Fecha</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
      </html>
    `;
    return html;
  };

  const onPrintAndShare = async () => {
    try {
      const html = generateHtml();
      const { uri } = await Print.printToFileAsync({ html });
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("PDF generado", `Archivo en: ${uri}`);
        return;
      }
      await Sharing.shareAsync(uri);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "No se pudo generar o compartir el PDF");
    }
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>Reporte</Text>
      <TouchableOpacity onPress={onPrintAndShare} style={{ padding: 12, backgroundColor: "#2b6df6", borderRadius: 8 }}>
        <Text style={{ color: "white" }}>Generar PDF y Compartir</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Reporte;
