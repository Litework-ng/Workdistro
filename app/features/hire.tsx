import React, { useState } from 'react';
import { 
  View, Text,  StyleSheet, Image, Modal, ActivityIndicator 
} from 'react-native';
import { router } from 'expo-router';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { SPACING } from '@/constants/theme/Spacing';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import ClientFeedback from '@/components/ClientFeedback';
import Header from "@/components/Header";
import  Button  from '@/components/Button';
import {Alert} from '@/components/Alert';
import Exclamation from '@/assets/icons/Exclamation.svg';
import { useAuthStore } from '@/shared/stores/useAuthStore';
import { useJobStore } from '@/shared/stores/useJobStore';
import { taskService } from '@/services/task';

export default function HireScreen() {
   const { worker, bid, job } = useJobStore();   
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalProps, setModalProps] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showVerifyAlert, setShowVerifyAlert] = useState(false);

  // For demonstration, discount is 0
  const { user } = useAuthStore();
  const discount = 0;
  const totalAmount = bid ? Number(bid.bid) - discount : 0;

  // Simulate hiring process
  const handleHire = async () => {
    // if (!user?.is_verified) {
    //   setShowVerifyAlert(true);
    //   return;
    // }
    if (isProcessing) return;
    setIsProcessing(true);
    setIsModalVisible(true);

    try {
      await taskService.hireWorker(job.id, bid.id);
      // After API call, show modal and wait for worker response via WebSocket
      setIsModalVisible(false);
      // Feedback modal will be triggered by WebSocket event (not here)
      // To set feedback modal props, listen for the worker response via WebSocket elsewhere (e.g., in a useEffect).
      // When the response arrives, call:
            setModalProps({
        image: require('@/assets/images/images/accepted.png'),
        title: 'Worker Accepted the Job!',
        subtext: 'The worker is available for your task.',
        onNext: () => handleNextPress(),
        onClose: () => handleCloseModal(),
        isJobAccepted: true,
      });
      // setShowFeedbackModal(true);
    } catch (error) {
      setIsModalVisible(false);
      Alert.alert('Error', 'Failed to send hire request.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextPress = () => {
    setShowFeedbackModal(false);
    router.replace('/features/client-task?tabIndex=1');
  };

  const handleCloseModal = () => {
    setShowFeedbackModal(false);
    router.back();
  };
    if (!worker || !bid || !job) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>No hire data available.</Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: COLOR_VARIABLES.surfacePrimary, flex: 1 }}>
      {/* Header */}
      <Header title="Reviews" />

      {/* Worker Info */}
      <View style={styles.workerInfo}>
        <Image
          source={worker?.profile_photo ? { uri: worker.profile_photo } : require('@/assets/images/images/user.png')}
          style={styles.workerImage}
        />
        <Text style={styles.workerName}>
          Hire {worker.name} For: {job.subject}
        </Text>
      </View>

      {/* Price Details */}
      <View style={styles.priceDetails}>
        <Text style={styles.label}>Amount</Text>
        <Text style={styles.value}>₦{bid?.bid?.toLocaleString()}.00</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={styles.label}>Discount</Text>
        <Text style={styles.value}>₦{discount}.00</Text>
      </View>
      <View style={styles.priceDetails}>
        <Text style={styles.label}>Total Amount</Text>
        <Text style={styles.value}>₦{totalAmount?.toLocaleString()}.00</Text>
      </View>

      {/* Hire Button */}
      <View style={styles.hireButton}>
        <Button
        variant="secondary"
        onPress={handleHire}
        disabled={isProcessing}
        loading={isProcessing}
        text={isProcessing ? "Processing..." : "Confirm & Hire"}
        />
      </View>

      {/* Loading Modal */}
      <Modal visible={isModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color={COLOR_VARIABLES.surfacePrimary} />
            <Text style={styles.modalTitle}>Processing...</Text>
            <Text style={styles.modalSubTitle}>Your request is being processed</Text>
            <Text style={styles.modalDescription}>
              Please wait while we confirm worker availability to your task. This may take a few moments.
            </Text>
          </View>
        </View>
      </Modal>

      {/* Feedback Modal */}
      <ClientFeedback visible={showFeedbackModal} {...modalProps} />

       <Alert
        visible={showVerifyAlert}
        variant="action"
        icon={<Exclamation />}
        showBackIcon={true}
        onClose={() => setShowVerifyAlert(false)}
        title="Account Not Verified"
        description="Please verify your account to hire a worker."
        primaryAction={{
          label: 'Verify Now',
          onPress: () => {
            setShowVerifyAlert(false);
            router.push('/(tabs)/profile/Verify/Verify');
          },
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.lg,
    marginTop: SPACING.xl,
    paddingLeft: SPACING.md,
    gap: SPACING.xl,
  },
  backButton: {
    padding: SPACING.xs,
    borderRadius: 50,
    backgroundColor: COLOR_VARIABLES.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: {
    ...TEXT_STYLES.header,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontWeight: 'bold',
  },
  headerText: {
    ...TEXT_STYLES.header,
    color: COLOR_VARIABLES.textSurfaceGen,
    marginLeft: SPACING.lg,
  },
  workerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderColor: COLOR_VARIABLES.borderSec,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  workerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLOR_VARIABLES.borderSec,
  },
  workerName: {
    ...TEXT_STYLES.body,
    fontWeight: "600",
    color: COLOR_VARIABLES.textSurfaceGen,
    flex: 1,
    flexWrap: 'wrap',
  },
  priceDetails: {
    paddingHorizontal: SPACING.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  label: {
    ...TEXT_STYLES.body,
    fontWeight: "500",
    color: COLOR_VARIABLES.textShade,
  },
  value: {
    ...TEXT_STYLES.body,
    fontWeight: "400",
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  hireButton: {
    padding: SPACING.md,
    marginTop: SPACING.xl * 2,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    padding: SPACING.lg,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    borderRadius: 16,
    alignItems: "center",
    margin: 10,
  },
  modalTitle: {
    ...TEXT_STYLES.header,
    textAlign: "center",
    marginTop: SPACING.lg,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  modalSubTitle: {
    ...TEXT_STYLES.body,
    textAlign: "center",
    marginTop: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceSecondary,
  },
  modalDescription: {
    ...TEXT_STYLES.caption,
    textAlign: "center",
    marginTop: SPACING.sm,
    color: COLOR_VARIABLES.textShade,
  },
});