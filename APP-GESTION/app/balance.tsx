import React, { useMemo } from "react";
import { View, Text, FlatList } from "react-native";
import { useExpenses } from "../context/ExpensesContext";

const PEOPLE = ["Juan", "María", "Pedro"] as const;

const Balance = () => {
  const { expenses } = useExpenses();

  // Calcula gasto total por persona (lo que pagó cada uno)
  const totals = useMemo(() => {
    const map = new Map<string, number>();
    PEOPLE.forEach((p) => map.set(p, 0));
    expenses.forEach((e) => {
      map.set(e.payer, (map.get(e.payer) || 0) + e.amount);
    });
    return map;
  }, [expenses]);

  const totalAll = Array.from(totals.values()).reduce((a, b) => a + b, 0);
  const perPersonShould = totalAll / PEOPLE.length;

  // balance: positivo = la persona pagó de más (le deben), negativo = debe a otros
  const balance = new Map<string, number>();
  PEOPLE.forEach((p) => balance.set(p, (totals.get(p) || 0) - perPersonShould));

  // Generar lista de deudas simplificada: empareja deudores (balance <0) con acreedores (balance >0)
  const getDebts = () => {
    const debtList: { from: string; to: string; amount: number }[] = [];
    const debtors = [...balance.entries()].filter(([,v]) => v < -0.005).map(([p,v])=>({p, v: -v}));
    const creditors = [...balance.entries()].filter(([,v]) => v > 0.005).map(([p,v])=>({p, v}));

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const owe = debtors[i];
      const lend = creditors[j];
      const m = Math.min(owe.v, lend.v);
      if (m > 0.009) {
        debtList.push({ from: owe.p, to: lend.p, amount: parseFloat(m.toFixed(2)) });
        owe.v -= m;
        lend.v -= m;
      }
      if (owe.v <= 0.009) i++;
      if (lend.v <= 0.009) j++;
    }
    return debtList;
  };

  const debts = getDebts();

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>Balance</Text>
      <Text>Total gastado: ${totalAll.toFixed(2)}</Text>
      <Text>Promedio por persona: ${perPersonShould.toFixed(2)}</Text>

      <FlatList
        data={Array.from(balance.entries())}
        keyExtractor={(i) => i[0]}
        renderItem={({ item }) => (
          <View style={{ marginTop: 8, padding: 10, backgroundColor: "#fff", borderRadius: 8 }}>
            <Text style={{ fontWeight: "700" }}>{item[0]}</Text>
            <Text>{item[1] >= 0 ? `Le deben $${item[1].toFixed(2)}` : `Debe $${Math.abs(item[1]).toFixed(2)}`}</Text>
          </View>
        )}
      />

      <Text style={{ marginTop: 16, fontSize: 18, fontWeight: "700" }}>Deudas</Text>
      {debts.length === 0 ? <Text style={{ marginTop: 8 }}>No hay deudas</Text> : debts.map((d, idx) => (
        <View key={idx} style={{ marginTop: 8 }}>
          <Text>{d.from} → {d.to}: ${d.amount.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

export default Balance;
