import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, StatusBar, Pressable } from 'react-native';
import { router } from 'expo-router';
import ImageViewer from 'react-native-image-zoom-viewer';
import MaskedView from '@react-native-masked-view/masked-view';
import Svg, { Path } from 'react-native-svg';
import { COLOR_VARIABLES } from '@/constants/theme/ColorVariables';
import { TEXT_STYLES } from '@/constants/theme/Typography';
import { SPACING } from '@/constants/theme/Spacing';
import { ArrowLeft2 } from 'iconsax-react-native';
import { useJobStore } from '@/shared/stores/useJobStore';

const { height, width } = Dimensions.get('window');

export default function TaskImageViewer() {
  const { job } = useJobStore();   // ✅ Get job context directly
  const [currentIndex, setCurrentIndex] = useState(0);

  const imageUrls =
    job?.images
      ?.filter((x) => x && typeof x.image === 'string' && x.image.length > 0)
      .map((img) => ({ url: img.image })) ?? [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      <MaskedView
        style={styles.imageWrapper}
        maskElement={
          <Svg width={width} height={height * 0.65}>
            <Path
              d={`M0 0 
                 H${width} 
                 V${height * 0.65 - 60} 
                 Q${width / 2} ${height * 0.65} 0 ${height * 0.65 - 60} 
                 Z`}
              fill="white"
            />
          </Svg>
        }
      >
        {imageUrls.length > 0 ? (
          <ImageViewer
            imageUrls={imageUrls}
            enableSwipeDown
            backgroundColor="transparent"
            onSwipeDown={() => router.back()}
            onChange={(index) => setCurrentIndex(index || 0)}
            index={currentIndex}
            saveToLocalByLongPress={false}
            renderIndicator={() => (
              <View style={styles.counter}>
                <Text style={styles.counterText}>
                  {currentIndex + 1} / {imageUrls.length}
                </Text>
              </View>
            )}
          />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No images to display</Text>
          </View>
        )}
      </MaskedView>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <ArrowLeft2 size={24} color="#fff" />
      </Pressable>

      {/* Task details */}
      <View style={styles.infoContainer}>
        {!!job?.subject && <Text style={styles.subject}>{job.subject}</Text>}
        {!!job?.description && (
          <Text style={styles.description}>{job.description}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },
  counter: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  counterText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#fff', opacity: 0.8 },
  imageWrapper: {
    height: height * 0.65,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 30,
    padding: 8,
    zIndex: 10,
  },
  infoContainer: {
    flex: 1,
    padding: SPACING.md,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: -30,
    backgroundColor: '#111',
  },
  subject: {
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
    ...TEXT_STYLES.title,
    color: COLOR_VARIABLES.textSurfacePrimary,
  },
  description: {
    ...TEXT_STYLES.label,
    color: COLOR_VARIABLES.tabLabelText,
    lineHeight: 20,
  },
});
