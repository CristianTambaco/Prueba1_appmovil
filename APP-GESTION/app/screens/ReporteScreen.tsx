// app/screens/ReporteScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useGastosContext } from '../context/GastosContext';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

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

const ReporteScreen = () => {
  const { gastos } = useGastosContext();
  const [periodoInicio, setPeriodoInicio] = useState<string>('01/10/2025');
  const [periodoFin, setPeriodoFin] = useState<string>('17/10/2025');

  const generarPDF = async () => {
    try {
      // Filtrar gastos por período
      const gastosFiltrados = gastos.filter((gasto: Gasto) => {
        const fechaGasto = new Date(gasto.fecha);
        const inicio = new Date(periodoInicio);
        const fin = new Date(periodoFin);
        return fechaGasto >= inicio && fechaGasto <= fin;
      });

      // Calcular totales
      const totalGastos = gastosFiltrados.reduce((sum: number, gasto: Gasto) => sum + gasto.monto, 0);
      const dias = Math.ceil((new Date(periodoFin).getTime() - new Date(periodoInicio).getTime()) / (1000 * 60 * 60 * 24));
      const promedioDiario = totalGastos / dias;

      // Agrupar por categoría (simulación básica)
      const categorias = {
        Comida: 0,
        Restaurantes: 0,
        Transporte: 0,
      };

      gastosFiltrados.forEach((gasto: Gasto) => {
        if (gasto.descripcion.toLowerCase().includes('comida') || gasto.descripcion.toLowerCase().includes('supermercado')) {
          categorias.Comida += gasto.monto;
        } else if (gasto.descripcion.toLowerCase().includes('restaurante') || gasto.descripcion.toLowerCase().includes('cena')) {
          categorias.Restaurantes += gasto.monto;
        } else if (gasto.descripcion.toLowerCase().includes('uber') || gasto.descripcion.toLowerCase().includes('transporte')) {
          categorias.Transporte += gasto.monto;
        }
      });

      // Crear HTML para el PDF
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #4A90E2; }
              .header { background-color: #4A90E2; color: white; padding: 15px; border-radius: 10px; }
              .stats { display: flex; justify-content: space-between; margin: 20px 0; }
              .stat-box { background-color: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
              .categoria { margin: 15px 0; }
              .categoria-title { font-weight: bold; }
              .barra { height: 20px; background-color: #ddd; border-radius: 10px; margin: 5px 0; }
              .barra-fill { height: 100%; border-radius: 10px; }
              .comida { background-color: #4A90E2; }
              .restaurantes { background-color: #9C27B0; }
              .transporte { background-color: #FF7A00; }
              .periodo { margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Reporte Mensual</h1>
              <p>${new Date(periodoInicio).toLocaleDateString()} - ${new Date(periodoFin).toLocaleDateString()}</p>
            </div>
            
            <div class="stats">
              <div class="stat-box">
                <h3>Total Gastos</h3>
                <p style="font-size: 24px; font-weight: bold;">$${totalGastos.toFixed(2)}</p>
              </div>
              <div class="stat-box">
                <h3>Promedio/día</h3>
                <p style="font-size: 24px; font-weight: bold;">$${promedioDiario.toFixed(2)}</p>
              </div>
            </div>
            
            <h2>Gastos por Categoría</h2>
            <div class="categoria">
              <div class="categoria-title">Comida</div>
              <div class="barra">
                <div class="barra-fill comida" style="width: ${categorias.Comida / Math.max(...Object.values(categorias), 1) * 100}%"></div>
              </div>
              <p>$${categorias.Comida.toFixed(2)}</p>
            </div>
            <div class="categoria">
              <div class="categoria-title">Restaurantes</div>
              <div class="barra">
                <div class="barra-fill restaurantes" style="width: ${categorias.Restaurantes / Math.max(...Object.values(categorias), 1) * 100}%"></div>
              </div>
              <p>$${categorias.Restaurantes.toFixed(2)}</p>
            </div>
            <div class="categoria">
              <div class="categoria-title">Transporte</div>
              <div class="barra">
                <div class="barra-fill transporte" style="width: ${categorias.Transporte / Math.max(...Object.values(categorias), 1) * 100}%"></div>
              </div>
              <p>$${categorias.Transporte.toFixed(2)}</p>
            </div>
            
            <div class="periodo">
              <h3>Período del Reporte</h3>
              <p>Inicio: ${periodoInicio}</p>
              <p>Fin: ${periodoFin}</p>
            </div>
            
            <h3>Detalles de Gastos</h3>
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
              <thead>
                <tr>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Pagador</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                ${gastosFiltrados.map((gasto: Gasto) => `
                  <tr>
                    <td>${gasto.descripcion}</td>
                    <td>$${gasto.monto}</td>
                    <td>${gasto.pagador}</td>
                    <td>${new Date(gasto.fecha).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;

      // Generar PDF
      const pdf = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      // Compartir PDF
      await Sharing.shareAsync(pdf.uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte',
      });

      Alert.alert('Éxito', 'Reporte generado y compartido correctamente');
    } catch (error) {
      Alert.alert('Error', 'No se pudo generar el reporte');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reporte Mensual</Text>
      <Text style={styles.subtitle}>Octubre 2025</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Gastos</Text>
          <Text style={styles.statValue}>
            ${gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.monto, 0).toFixed(2)}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Promedio/día</Text>
          <Text style={styles.statValue}>
            ${(gastos.reduce((sum: number, gasto: Gasto) => sum + gasto.monto, 0) / 31).toFixed(2)}
          </Text>
        </View>
      </View>
      
      <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
      <View style={styles.categoria}>
        <Text style={styles.categoriaTitle}>Comida</Text>
        <View style={styles.barra}>
          <View style={[styles.barraFill, styles.comida]}></View>
        </View>
        <Text style={styles.categoriaMonto}>$280</Text>
      </View>
      <View style={styles.categoria}>
        <Text style={styles.categoriaTitle}>Restaurantes</Text>
        <View style={styles.barra}>
          <View style={[styles.barraFill, styles.restaurantes]}></View>
        </View>
        <Text style={styles.categoriaMonto}>$150</Text>
      </View>
      <View style={styles.categoria}>
        <Text style={styles.categoriaTitle}>Transporte</Text>
        <View style={styles.barra}>
          <View style={[styles.barraFill, styles.transporte]}></View>
        </View>
        <Text style={styles.categoriaMonto}>$45</Text>
      </View>
      
      <View style={styles.periodoContainer}>
        <Text style={styles.periodoTitle}>Período del Reporte</Text>
        <View style={styles.dateInputs}>
          <View style={styles.dateInput}>
            <Text>{periodoInicio}</Text>
          </View>
          <View style={styles.dateInput}>
            <Text>{periodoFin}</Text>
          </View>
        </View>
      </View>
      
      <TouchableOpacity style={styles.pdfButton} onPress={generarPDF}>
        <Text style={styles.pdfButtonText}>⬇️ Generar PDF</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.compartirButton}>
        <Text style={styles.compartirButtonText}>Compartir Reporte</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: {
    fontSize: 14,
    color: 'gray',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  categoria: {
    marginBottom: 15,
  },
  categoriaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  barra: {
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  barraFill: {
    height: '100%',
    borderRadius: 10,
  },
  comida: {
    backgroundColor: '#4A90E2',
  },
  restaurantes: {
    backgroundColor: '#9C27B0',
  },
  transporte: {
    backgroundColor: '#FF7A00',
  },
  categoriaMonto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginTop: 5,
  },
  periodoContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  periodoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
  },
  pdfButton: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  compartirButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  compartirButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ReporteScreen;