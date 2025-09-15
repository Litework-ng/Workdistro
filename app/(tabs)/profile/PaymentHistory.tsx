import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ArrowLeft2, ArrowDown2, ArrowUp2 } from "iconsax-react-native";
import MonthDropdown from "@/components/MonthDropdown";
import { COLOR_VARIABLES } from "@/constants/theme/ColorVariables";
import { TEXT_STYLES } from "@/constants/theme/Typography";
import { SPACING } from "@/constants/theme/Spacing";
import Header from "@/components/Header";

const TransactionFeed = ({
  payer,
  time,
  amount,
  avatar, // add this line
  type,
}: {
  payer: string;
  time: string;
  amount: string;
  avatar?: string | null;
  type: "credit" | "debit";
}) => {
  const amountColor =
    type === "credit" ? COLOR_VARIABLES.surfaceGen : COLOR_VARIABLES.dangerText;

  const renderAvatar = () => {
    if (avatar) {
      return (
        <View style={styles.avatarCircle}>
             <Image
              source={{ uri: avatar }}
              style={styles.avatarImage}
            />
        </View>
      );
    } else {
      return (
        <View style={styles.avatarCircle}>
        <View >
          <Text style={styles.avatarLetter}>{payer.charAt(0).toUpperCase()}</Text>
        </View>
        </View>
      );
    }
  };

  return (
    <View style={styles.transactionRow}>
      <View style={styles.payerContainer}>
        {renderAvatar()}
        <View>
          <Text style={styles.payerText}>{payer}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>
      </View>
      <Text style={[styles.amountText, { color: amountColor }]}>{amount}</Text>
    </View>
  );
};




const PaymentHistory = () => {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState("May");

  const transactions = [
    {
      id: "1",
      payer: "Paystacks",
      time: "7:50pm",
      amount: "+N5000",
      type: "credit",
      date: "20th May 2023",
    },
    {
      id: "2",
      payer: "Tosin Alabi",
      time: "7:50pm",
      amount: "-N5000",
      type: "debit",
      date: "20th May 2023",
    },
    {
      id: "3",
      payer: "Paystacks",
      time: "7:50pm",
      amount: "+N5000",
      type: "credit",
      date: "19th May 2023",
    },
  ];

  const grouped = transactions.reduce((acc, tx) => {
    if (!acc[tx.date]) acc[tx.date] = [];
    acc[tx.date].push(tx);
    return acc;
  }, {} as Record<string, typeof transactions>);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: COLOR_VARIABLES.surfacePrimary, padding: SPACING.md }}>
      <Header title="Payment History" />

      <View style={styles.dropdownContainer}>
        <MonthDropdown
          selectedMonth={selectedMonth}
          onSelect={(value) => setSelectedMonth(value)}
        />
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>In</Text>
          <Text style={styles.summaryValue}>N20,000.00</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Out</Text>
          <Text style={styles.summaryValue}>N10,000.00</Text>
        </View>
      </View>

      {Object.entries(grouped).map(([date, txs]) => (
        <View key={date}>
          <Text style={styles.dateHeader}>{date}</Text>
          {txs.map((tx) => (
            <TransactionFeed
              key={tx.id}
              payer={tx.payer}
              time={tx.time}
              amount={tx.amount}
              type={tx.type}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryContainer: {
    flexDirection: "row",
    gap: 15,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  summaryItem: {
    flexDirection: "row",
    gap: 5,
    alignItems: 'center',
  },
  summaryLabel: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  summaryValue: {
    ...TEXT_STYLES.body,
    color: COLOR_VARIABLES.textSurfaceGen,
    fontWeight: "600",
  },
  dateHeader: {
    backgroundColor: '#EEF0FB',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginVertical:SPACING.sm,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  
  avatarLetter: {
    ...TEXT_STYLES.title,
    fontWeight: "600",
        
  },
  payerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth:1,
    borderColor:COLOR_VARIABLES.surfaceSecondary,
    backgroundColor: COLOR_VARIABLES.surfacePrimary,
    justifyContent: "center",
    alignItems: "center",
  }
,
  payerText: {
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfaceGen,
  },
  timeText: {
    ...TEXT_STYLES.caption,
    color: COLOR_VARIABLES.textShade,
  },
  amountText: {
    ...TEXT_STYLES.body,
    fontWeight: "600",
  },
});

export default PaymentHistory;
