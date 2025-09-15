import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import { walletService } from '@/services/wallet';
import Toast from 'react-native-toast-message';
import { router } from 'expo-router';

export default function WalletActivationScreen() {
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    if (!bvn || !nin) {
      Toast.show({ type: 'error', text1: 'Both BVN and NIN are required.' });
      return;
    }
    setLoading(true);
    try {
      await walletService.createReservedAccount({ BVN: bvn, NIN: nin });
      Toast.show({ type: 'success', text1: 'Wallet activated!' });
      router.back();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Activation failed', text2: 'Please check your details and try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activate Your Wallet</Text>
      <Text style={styles.label}>BVN</Text>
      <TextInput
        style={styles.input}
        value={bvn}
        onChangeText={setBvn}
        placeholder="Enter your BVN"
        keyboardType="numeric"
      />
      <Text style={styles.label}>NIN</Text>
      <TextInput
        style={styles.input}
        value={nin}
        onChangeText={setNin}
        placeholder="Enter your NIN"
        keyboardType="numeric"
      />
      <Button text={loading ? 'Activating...' : 'Activate Wallet'} onPress={handleActivate} disabled={loading} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' },
  label: { marginTop: 16, marginBottom: 4, fontWeight: 'bold' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16 },
});