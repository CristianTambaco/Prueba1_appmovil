// app/index.tsx

import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,  
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCVContext } from "../../context/CVContext";

import "../../global.css"; // Asegurarse de tener este archivo para estilos globales si es necesario

export default function HomeScreen() {
  const router = useRouter();
  const { cvData } = useCVContext();

  const isPersonalInfoComplete =
    cvData.personalInfo.fullName && cvData.personalInfo.email;
  const hasExperience = cvData.experiences.length > 0;
  const hasEducation = cvData.education.length > 0;
  const hasPhoto = !!cvData.personalInfo.profileImage;
  const hasSkills = cvData.skills.length > 0;

  return (
    <ScrollView
      className="flex-1 bg-gray-100 p-5 pb-10"
      contentContainerStyle={{ paddingBottom: 40 }} // Usando paddingBottom directamente
      showsVerticalScrollIndicator={true}
    >
      <Text className="text-2xl font-bold text-center text-gray-800 mb-6">
        Crea tu CV Profesional
      </Text>

      {/* Sección: Foto de Perfil */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Foto de Perfil
            </Text>
            <Text className="text-sm text-green-600">
              {hasPhoto ? "✓ Agregada" : "Opcional"}
            </Text>
          </View>
          {hasPhoto && cvData.personalInfo.profileImage && (
            <Image
              source={{ uri: cvData.personalInfo.profileImage }}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => router.push("/photo")}
          className="bg-blue-500 py-3 rounded-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            {hasPhoto ? "Cambiar Foto" : "Subir Foto"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Información Personal */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          1. Información Personal
        </Text>
        <Text className="text-sm text-green-600 mb-3">
          {isPersonalInfoComplete ? "✓ Completado" : "Pendiente"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/personal-info")}
          className="bg-blue-500 py-3 rounded-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Editar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Experiencia */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          2. Experiencia
        </Text>
        <Text className="text-sm text-green-600 mb-3">
          {hasExperience
            ? `✓ ${cvData.experiences.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/experience")}
          className="bg-blue-500 py-3 rounded-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Educación */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          3. Educación
        </Text>
        <Text className="text-sm text-green-600 mb-3">
          {hasEducation
            ? `✓ ${cvData.education.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/education")}
          className="bg-blue-500 py-3 rounded-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Sección: Habilidades */}
      <View className="bg-white p-4 rounded-xl mb-4 shadow-md">
        <Text className="text-lg font-semibold text-gray-800 mb-2">
          4. Habilidades
        </Text>
        <Text className="text-sm text-green-600 mb-3">
          {hasSkills
            ? `✓ ${cvData.skills.length} agregada(s)`
            : "Pendiente"}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/skills")}
          className="bg-blue-500 py-3 rounded-md"
        >
          <Text className="text-white text-center font-semibold text-base">
            Agregar
          </Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Vista Previa */}
      <View className="my-5">
        <TouchableOpacity
          onPress={() => router.push("/preview")}
          activeOpacity={0.8}
          className="bg-green-500 p-5 rounded-xl items-center shadow-md"
        >
          <Text className="text-3xl mb-2">👁️</Text>
          <Text className="text-white text-lg font-bold text-center">
            Ver Vista Previa del CV
          </Text>
        </TouchableOpacity>
      </View>

      {/* Espacio adicional al final para evitar que el último elemento quede oculto */}
      <View style={{ height: 20 }} />

      

      {/* Nativewind! */}
      
      {/* <View className="flex-1 items-center justify-center bg-white">

      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>

      </View> */}

      
    </ScrollView>
  );
}


