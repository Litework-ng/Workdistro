import React, { useState } from "react";
import { View, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Camera } from "iconsax-react-native";
import * as ImagePicker from "expo-image-picker";

import Header from "@/components/Header";
import InputField from "@/components/InputField";
import Button from "@/components/Button";

import { useAuthStore } from "@/shared/stores/useAuthStore";
import { userService } from "@/services/user";
import api from "@/lib/api";

import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { SPACING } from "@/constants/theme/Spacing";
import { TEXT_STYLES } from "@/constants/theme/Typography";

export default function EditProfileClient() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();

  const [profileName, setProfileName] = useState(user?.name || "");
   const [aboutMe, setAboutMe] = useState(user?.bio || '');
    const [location, setLocation] = useState(user?.location || '/');
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await userService.updateUser({
        name: profileName, about_me: aboutMe, location: location, 
      });
      const updatedUser = await userService.getUser();
      setUser(updatedUser);
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Failed to update profile", error);
      Alert.alert("Error", "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Permission required to access gallery.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        await uploadProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const uploadProfilePhoto = async (imageUri: string) => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("image", {
        uri: imageUri,
        name: "profile.jpg",
        type: "image/jpeg",
      } as any);

      const response = await api.patch("user/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201 || response.status === 200) {
        const updatedUser = await userService.getUser();
        setUser(updatedUser);
        Alert.alert("Success", "Profile photo updated.");
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      console.error("Failed to upload profile photo", error);
      alert("Failed to upload profile photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Edit Profile" />

      <View style={styles.profileImageContainer}>
        <Image
          source={
            user?.profile_photo
              ? { uri: user.profile_photo }
              : require("@/assets/images/images/user.png")
          }
          style={styles.profileImage}
        />
        {isUploading && (
          <View style={styles.overlay}>
            <ActivityIndicator size="small" color="grey" />
          </View>
        )}
        <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
          <Camera size={18} color="#000" />
        </TouchableOpacity>
      </View>

      <InputField
        label="Name"
        placeholder="Enter your name"
        value={profileName}
        onChangeText={setProfileName}
      />

      <InputField
        label="Email Address"
        placeholder="Email"
        value={user?.email || ""}
        onChangeText={() => {}}
        editable={false}
      />

      <InputField
        label="Phone Number"
        placeholder="Phone number"
        value={user?.phone_number || ""}
        onChangeText={() => {}}
        editable={false}
      />

      <View style={styles.buttonContainer}>

      <Button
        text="Save Changes"
        onPress={handleSave}
        loading={loading}
        disabled={loading}
        variant="secondary"
      />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingHorizontal: SPACING.md,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: SPACING.lg,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  cameraIcon: {
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    width: 32,
    height: 32,
    borderRadius: 16,
    position: "absolute",
    bottom: 0,
    right: 110,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer:{
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  }
});
