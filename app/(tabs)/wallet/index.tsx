import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SectionList,
  Image,
} from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import Button from '@/components/Button';
import Header from '@/components/Header';
import Deposit from '@/assets/icons/Deposit.svg';
import Withdraw from '@/assets/icons/Withdraw.svg';
import { walletService } from '@/services/wallet';
import { Alert } from '@/components/Alert';
import { useRouter } from 'expo-router';

const mockTransactions = [
  {
    title: '20th May 2023',
    data: [
      { id: '1', name: 'Paystacks', time: '7:50pm', amount: 5000, type: 'inflow' },
      { id: '2', name: 'Tosin Alabi', time: '7:50pm', amount: 5000, type: 'outflow', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '3', name: 'Paystacks', time: '7:50pm', amount: 5000, type: 'inflow' },
    ],
  },
  {
    title: '19th May 2023',
    data: [
      { id: '4', name: 'Paystacks', time: '7:50pm', amount: 5000, type: 'inflow' },
      { id: '5', name: 'Tosin Alabi', time: '7:50pm', amount: 5000, type: 'outflow', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '6', name: 'Paystacks', time: '7:50pm', amount: 5000, type: 'inflow' },
    ],
  },
];
export default function WalletScreen() {
  const router = useRouter();
  const [showBalance, setShowBalance] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState(null);
  const [showActivationAlert, setShowActivationAlert] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationError, setActivationError] = useState('');
  const [bvnOrNin, setBvnOrNin] = useState('');

  useEffect(() => {
    walletService.getWallet()
      .then(data => {
        setBalance(data?.balance?.availableBalance ?? 0);
        setWallet(data);
      })
      .catch(() => setBalance(0))
      .finally(() => setLoading(false));
  }, []);

  const isWalletActivated = wallet?.status === 'active' && wallet?.account_number;

  const handleDepositOrWithdraw = () => {
    if (!isWalletActivated) {
      setShowActivationAlert(true);
      return;
    }
    // ...proceed with deposit/withdrawal logic
  };

  const handleActivateWallet = async () => {
    setActivationLoading(true);
    setActivationError('');
    try {
      await walletService.createReservedAccount({ BVN: bvnOrNin }); // or { NIN: bvnOrNin }
      setShowActivationAlert(false);
      // Refetch wallet details
      const updatedWallet = await walletService.getWallet();
      setWallet(updatedWallet);
    } catch (e) {
      setActivationError('Activation failed. Please check your BVN/NIN and try again.');
    } finally {
      setActivationLoading(false);
    }
  };

  const handleDeposit = () => {
    // TODO: Implement deposit navigation/logic
    console.log('Deposit pressed');
  };

  const handleWithdrawal = () => {
    // TODO: Implement withdrawal navigation/logic
    console.log('Withdrawal pressed');
  };

  const renderEmptyComponent = () => (
    <View style={{ marginTop: 40, alignItems: 'center' }}>
      <Text style={{ color: COLOR_VARIABLES.textShade }}>No transactions yet.</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title="Wallet" showBackButton={false}/>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <TouchableOpacity
          onPress={() => setShowBalance(!showBalance)}
          accessibilityLabel={showBalance ? 'Hide balance' : 'Show balance'}
        >
          {showBalance ? (
            <Eye size={18} color={COLOR_VARIABLES.textSurfaceGen} />
          ) : (
            <EyeSlash size={18} color={COLOR_VARIABLES.textSurfaceGen} />
          )}
        </TouchableOpacity>
      </View>
       <Text style={styles.balanceValue}>
        {loading
          ? 'Loading...'
          : showBalance
            ? `₦${Number(balance).toLocaleString()}`
            : '***********'}
      </Text>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleDeposit}
          accessibilityLabel="Deposit funds"
        >
         <Deposit/>
          <Text style={styles.actionText}>Deposit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleWithdrawal}
          accessibilityLabel="Withdraw funds"
        >
          <Withdraw/>
          <Text style={styles.actionText}>Withdrawal</Text>
        </TouchableOpacity>
      </View>

      {/* Transactions Header */}
      <Text style={styles.transactionsHeader}>All Transactions</Text>

      {/* Transactions List */}
      <SectionList
        sections={mockTransactions}
        keyExtractor={(item) => item.id}
        stickySectionHeadersEnabled={false}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.initialCircle}>
                <Text style={styles.initial}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionName}>{item.name}</Text>
              <Text style={styles.transactionTime}>{item.time}</Text>
            </View>
            <Text
              style={[
                styles.transactionAmount,
                {
                  color:
                    item.type === 'inflow'
                      ? COLOR_VARIABLES.surfaceGen
                      : COLOR_VARIABLES.dangerText,
                },
              ]}
            >
              {item.type === 'inflow' ? '+' : '-'}₦{item.amount.toLocaleString()}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: SPACING.lg }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent}
      />

          <Alert
            visible={showActivationAlert}
            onClose={() => setShowActivationAlert(false)}
            title="Activate Your Wallet"
            description="To use your wallet, please activate it by providing your BVN or NIN."
            primaryAction={{
              label: 'Activate Now',
              onPress: () => {
                setShowActivationAlert(false);
                router.push('/wallet/activate');
              }
            }}
            variant="info"
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    ...TEXT_STYLES.header,
    textAlign: 'center',
    marginBottom: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  balanceValue: {
    ...TEXT_STYLES.header,
    marginVertical: SPACING.sm,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent:'center',
    marginVertical: SPACING.lg,
  },
  actionButton: {
    alignItems: 'center',
    borderRadius: 10,
    width: '25%',
  },
  actionIcon: {
    fontSize: 24,
  },
  actionText: {
    marginTop: 5,
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  transactionsHeader: {
    ...TEXT_STYLES.label,
    marginBottom: SPACING.md,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  sectionHeader: {
    backgroundColor: '#EEF0FB',
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.lg,

  },
  sectionHeaderText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  initialCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8EBF3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  transactionName: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  transactionTime: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  transactionAmount: {
    ...TEXT_STYLES.body,
    fontWeight: 'bold',
  },
});