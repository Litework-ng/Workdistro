import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";

interface Props {
  onSuccess: (data: { nin: string; bvn: string }) => void;
  onFailure: () => void;
}

const DojahWebview: React.FC<Props> = ({ onSuccess, onFailure }) => {
  const widgetUrl = "https://identity.dojah.io?widget_id=678511fa16c040c124413bfa"; // replace with your actual Dojah widget URL

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;

    if (url.includes("verification-success")) {
      // ✅ Example: Extract params from URL if Dojah appends them
      const nin = extractParamFromUrl(url, "nin");
      const bvn = extractParamFromUrl(url, "bvn");

      onSuccess({ nin, bvn });
    }

    if (url.includes("verification-failed")) {
      onFailure();
    }
  };

  const extractParamFromUrl = (url: string, key: string) => {
    const match = url.match(new RegExp(`[?&]${key}=([^&]+)`));
    return match ? decodeURIComponent(match[1]) : "";
  };

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: widgetUrl }}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
        javaScriptEnabled
        onNavigationStateChange={handleNavigationStateChange}
        onError={(e) => {
          console.error("Dojah Webview error:", e);
          onFailure();
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DojahWebview;
