import React, { useEffect, useRef, useState } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Button from '@/components/Button';
import { taskService } from '@/services/hire';

type JobOfferSheetProps = {
  visible: boolean;
  job: { title: string; [key: string]: any };
  bidId: string ;
  onClose: (answer: 'yes' | 'no') => void;
};

export function JobOfferSheet({ visible, job, bidId, onClose }: JobOfferSheetProps) {
  const [timer, setTimer] = useState(30);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (visible) {
      setTimer(30);
      timerRef.current = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [visible]);

  useEffect(() => {
    if (timer === 0 && visible) {
      handleRespond('no');
    }
  }, [timer, visible]);

  const handleRespond = async (answer: 'yes' | 'no') => {
    if (timerRef.current) clearInterval(timerRef.current);
    await taskService.updateHireStatus(bidId, answer);
    onClose(answer);
  };

  return (
    <BottomSheet index={visible ? 0 : -1} snapPoints={['45%']}>
      <View style={{ padding: 24 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Job Offer</Text>
        <Text style={{ marginVertical: 8 }}>{job.title}</Text>
        <Text>Respond within <Text style={{ fontWeight: 'bold' }}>{timer}s</Text></Text>
        <View style={{ flexDirection: 'row', marginTop: 24, gap: 16 }}>
          <Button text="Accept" onPress={() => handleRespond('yes')} />
          <Button text="Decline" variant="secondary" onPress={() => handleRespond('no')} />
        </View>
      </View>
    </BottomSheet>
  );
}