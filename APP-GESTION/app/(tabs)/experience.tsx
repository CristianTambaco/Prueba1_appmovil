// app/experience.tsx

// app/experience.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { InputField } from "../../components/InputField";
import { NavigationButton } from "../../components/NavigationButton";
import { useCVContext } from "../../context/CVContext";
import { Experience } from "../../types/cv.types";
import { useForm, Controller } from "react-hook-form";

export default function ExperienceScreen() {
  const router = useRouter();
  const { cvData, addExperience, deleteExperience } = useCVContext();

  const currentYear = new Date().getFullYear();
  const minYear = 1980;

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [selectedExp, setSelectedExp] = useState<Experience | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  });

  // meses en español
  const meses = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","septiembre","octubre","noviembre","diciembre"
  ];

  // formatDate: construye "15 enero 2025" (sin las "de")
  const formatDate = (d: Date) => {
    const day = d.getDate();
    const month = meses[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  // parseSpanishDate: acepta "15 enero 2025" y también "15 de enero de 2025"
  const parseSpanishDate = (dateString: string | undefined | null) => {
    if (!dateString) return null;
    const cleaned = dateString
      .toLowerCase()
      .replace(/\s+de\s+/g, " ") // convierte "15 de enero de 2025" -> "15 enero 2025"
      .trim();
    const parts = cleaned.split(" ").filter(Boolean); // [day, month, year]
    if (parts.length < 3) return null;
    const day = parseInt(parts[0], 10);
    const monthName = parts[1];
    const year = parseInt(parts[2], 10);
    const monthIndex = meses.indexOf(monthName);
    if (isNaN(day) || isNaN(year) || monthIndex === -1) return null;
    return new Date(year, monthIndex, day);
  };

  const onSubmit = (data: Omit<Experience, "id">) => {
    const start = parseSpanishDate(data.startDate);
    const end = data.endDate ? parseSpanishDate(data.endDate) : null;

    if (!start) {
      return Alert.alert("Error", "La fecha de inicio no es válida.");
    }
    if (data.endDate && !end) {
      return Alert.alert("Error", "La fecha de fin no es válida.");
    }

    const startYear = start.getFullYear();
    const endYear = end?.getFullYear();

    if (startYear < minYear || startYear > currentYear) {
      return Alert.alert(
        "Error",
        `La fecha de inicio debe estar entre ${minYear} y ${currentYear}.`
      );
    }

    if (endYear && (endYear < minYear || endYear > currentYear)) {
      return Alert.alert(
        "Error",
        `La fecha de fin debe estar entre ${minYear} y ${currentYear}.`
      );
    }

    if (endYear && startYear > endYear) {
      return Alert.alert(
        "Error",
        "La fecha de fin no puede ser anterior a la fecha de inicio."
      );
    }

    const newExperience: Experience = {
      id: Date.now().toString(),
      ...data,
      startDate: formatDate(start),
      endDate: end ? formatDate(end) : "",
    };
    addExperience(newExperience);
    Alert.alert("Éxito", "Experiencia agregada correctamente");
    reset();
  };

  const handleDelete = (id: string) => {
    Alert.alert("Confirmar", "¿Deseas eliminar esta experiencia?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => deleteExperience(id),
      },
    ]);
  };

  const openModal = (exp: Experience) => {
    setSelectedExp(exp);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedExp(null);
    setModalVisible(false);
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="p-5">
        <Text className="text-xl font-bold text-slate-800 mb-4">
          Agregar Nueva Experiencia
        </Text>

        {/* === EMPRESA === */}
        <Controller
          name="company"
          control={control}
          rules={{
            required: "La empresa es obligatoria",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          }}
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Empresa *"
              placeholder="Nombre de la empresa"
              value={value}
              onChangeText={onChange}
              error={errors.company?.message}
            />
          )}
        />

        {/* === CARGO === */}
        <Controller
          name="position"
          control={control}
          rules={{
            required: "El cargo es obligatorio",
            pattern: {
              value: /^[A-Za-zÀ-ÿ\s]+$/,
              message: "Solo se permiten letras y espacios",
            },
          }}
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Cargo *"
              placeholder="Tu posición"
              value={value}
              onChangeText={onChange}
              error={errors.position?.message}
            />
          )}
        />

        {/* === FECHA DE INICIO === */}
        <Controller
          name="startDate"
          control={control}
          rules={{ required: "La fecha de inicio es obligatoria" }}
          render={({ field: { value, onChange } }) => (
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-1">Fecha de Inicio *</Text>
              <TouchableOpacity
                onPress={() => setShowStartPicker(true)}
                className="bg-white border border-gray-300 rounded-lg p-3"
              >
                <Text>{value ? value : "Selecciona una fecha"}</Text>
              </TouchableOpacity>

              {showStartPicker && (
                <DateTimePicker
                  value={value ? parseSpanishDate(value) || new Date() : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date(minYear, 0, 1)}
                  maximumDate={new Date(currentYear, 11, 31)}
                  onChange={(event, selectedDate) => {
                    setShowStartPicker(false);
                    if (selectedDate) {
                      const year = selectedDate.getFullYear();
                      if (year < minYear || year > currentYear) {
                        Alert.alert(
                          "Fecha inválida",
                          `El año debe estar entre ${minYear} y ${currentYear}.`
                        );
                        return;
                      }
                      onChange(formatDate(selectedDate));
                    }
                  }}
                />
              )}
              {errors.startDate && (
                <Text className="text-red-500 text-sm">{errors.startDate.message}</Text>
              )}
            </View>
          )}
        />

        {/* === FECHA DE FIN === */}
        <Controller
          name="endDate"
          control={control}
          render={({ field: { value, onChange } }) => (
            <View className="mb-4">
              <Text className="text-slate-700 font-semibold mb-1">Fecha de Fin</Text>
              <TouchableOpacity
                onPress={() => setShowEndPicker(true)}
                className="bg-white border border-gray-300 rounded-lg p-3"
              >
                <Text>{value ? value : "Selecciona una fecha (opcional)"}</Text>
              </TouchableOpacity>

              {showEndPicker && (
                <DateTimePicker
                  value={value ? parseSpanishDate(value) || new Date() : new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  minimumDate={new Date(minYear, 0, 1)}
                  maximumDate={new Date(currentYear, 11, 31)}
                  onChange={(event, selectedDate) => {
                    setShowEndPicker(false);
                    if (selectedDate) {
                      const year = selectedDate.getFullYear();
                      if (year < minYear || year > currentYear) {
                        Alert.alert(
                          "Fecha inválida",
                          `El año debe estar entre ${minYear} y ${currentYear}.`
                        );
                        return;
                      }
                      onChange(formatDate(selectedDate));
                    }
                  }}
                />
              )}
              {errors.endDate && (
                <Text className="text-red-500 text-sm">{errors.endDate.message}</Text>
              )}
            </View>
          )}
        />

        {/* === DESCRIPCIÓN === */}
        <Controller
          name="description"
          control={control}
          render={({ field: { value, onChange } }) => (
            <InputField
              label="Descripción"
              placeholder="Describe tus responsabilidades..."
              value={value}
              onChangeText={onChange}
              multiline
              numberOfLines={4}
              style={{ height: 100, textAlignVertical: "top" }}
              error={errors.description?.message}
            />
          )}
        />

        {/* === BOTÓN AGREGAR === */}
        <NavigationButton title="Agregar Experiencia" onPress={handleSubmit(onSubmit)} />

        {/* === LISTA DE EXPERIENCIAS === */}
        {cvData.experiences.length > 0 && (
          <>
            <Text className="text-lg font-semibold text-slate-800 mt-6 mb-3">Experiencias Agregadas</Text>
            {cvData.experiences.map((exp) => (
              <TouchableOpacity
                key={exp.id}
                onPress={() => openModal(exp)}
                className="bg-white rounded-lg p-4 mb-3 shadow shadow-black/10"
              >
                <Text className="text-base font-semibold text-slate-800 mb-1">{exp.position}</Text>
                <Text className="text-sm text-gray-600 mb-1">{exp.company}</Text>
                <Text className="text-xs text-gray-500">{exp.startDate} - {exp.endDate || "Actual"}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}

        <NavigationButton title="Volver" onPress={() => router.back()} variant="secondary" />
      </View>

      {/* === MODAL DE DETALLE === */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={closeModal}>
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white w-80 rounded-2xl p-5 shadow">
            {selectedExp ? (
              <>
                <Text className="text-xl font-bold text-slate-800 mb-2">{selectedExp.position}</Text>
                <Text className="text-gray-600 mb-1">{selectedExp.company}</Text>
                <Text className="text-sm text-gray-500 mb-3">{selectedExp.startDate} - {selectedExp.endDate || "Actual"}</Text>
                <Text className="text-gray-700 mb-4">{selectedExp.description || "Sin descripción"}</Text>

                <TouchableOpacity onPress={() => { handleDelete(selectedExp.id); closeModal(); }} className="bg-red-500 p-2 rounded-lg mb-2">
                  <Text className="text-white text-center font-semibold">Eliminar</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={closeModal} className="bg-gray-300 p-2 rounded-lg">
                  <Text className="text-center text-gray-800 font-semibold">Cerrar</Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
