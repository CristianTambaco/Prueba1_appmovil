import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

export type Person = "Juan" | "María" | "Pedro";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  payer: Person;
  participants: Person[]; // subset of people
  date: string; // ISO
  receiptUri: string; // local uri
};

type ContextType = {
  expenses: Expense[];
  addExpense: (e: Omit<Expense, "id" | "date">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  loadExpenses: () => Promise<void>;
};

const KEY = "EXPENSES_STORAGE_V1";

const ExpensesContext = createContext<ContextType | undefined>(undefined);

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const saveToStorage = async (list: Expense[]) => {
    await AsyncStorage.setItem(KEY, JSON.stringify(list));
  };

  const loadExpenses = async () => {
    try {
      const raw = await AsyncStorage.getItem(KEY);
      if (raw) setExpenses(JSON.parse(raw));
    } catch (e) {
      console.error("Error loading expenses", e);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const addExpense = async (e: Omit<Expense, "id" | "date">) => {
    const expense: Expense = {
      ...e,
      id: uuidv4(),
      date: new Date().toISOString(),
    };
    const newList = [expense, ...expenses];
    setExpenses(newList);
    await saveToStorage(newList);
  };

  const removeExpense = async (id: string) => {
    const newList = expenses.filter((x) => x.id !== id);
    setExpenses(newList);
    await saveToStorage(newList);
  };

  return (
    <ExpensesContext.Provider value={{ expenses, addExpense, removeExpense, loadExpenses }}>
      {children}
    </ExpensesContext.Provider>
  );
};

export const useExpenses = () => {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error("useExpenses must be used within ExpensesProvider");
  return ctx;
};
