import { Colors, Radius } from "@/constants/theme";
import { ProductMedia } from "@/types/product";
import { mediaUrl } from "@/utils/product";
import { Ionicons } from "@expo/vector-icons";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  useWindowDimensions,
  View,
  ViewToken,
} from "react-native";

const HEIGHT = 300;

type Item = { type: "image" | "video"; url: string };

function VideoSlide({
  url,
  width,
  active,
}: {
  url: string;
  width: number;
  active: boolean;
}) {
  const player = useVideoPlayer(url, (p) => {
    p.loop = false;
  });

  // لما يسحب لصورة تانية، منوقف الفيديو
  useEffect(() => {
    if (!active) player.pause();
  }, [active, player]);

  return (
    <VideoView
      player={player}
      style={{ width, height: HEIGHT, backgroundColor: "#000" }}
      contentFit="contain"
      nativeControls
      fullscreenOptions={{ enable: true }}
    />
  );
}

export function ProductGallery({
  images,
  videos = [],
}: {
  images: ProductMedia[];
  videos?: ProductMedia[];
}) {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const items: Item[] = [
    ...(images.map(mediaUrl).filter(Boolean) as string[]).map((url) => ({
      type: "image" as const,
      url,
    })),
    ...(videos.map(mediaUrl).filter(Boolean) as string[]).map((url) => ({
      type: "video" as const,
      url,
    })),
  ];

  const onViewable = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index != null) setIndex(viewableItems[0].index);
    },
  ).current;

  if (!items.length) {
    return (
      <View style={[styles.placeholder, { width }]}>
        <Ionicons name="image-outline" size={56} color={Colors.beige} />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={items}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, i) => `${i}-${item.url}`}
        onViewableItemsChanged={onViewable}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item, index: i }) =>
          item.type === "video" ? (
            <VideoSlide url={item.url} width={width} active={i === index} />
          ) : (
            <Image
              source={{ uri: item.url }}
              style={{ width, height: HEIGHT }}
              resizeMode="cover"
            />
          )
        }
      />

      {items.length > 1 && (
        <View style={styles.dots} pointerEvents="none">
          {items.map((item, i) =>
            item.type === "video" ? (
              <Ionicons
                key={i}
                name="play"
                size={10}
                color={i === index ? Colors.white : "rgba(255,255,255,0.6)"}
              />
            ) : (
              <View
                key={i}
                style={[styles.dot, i === index && styles.dotActive]}
              />
            ),
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    height: HEIGHT,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  dots: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    direction: "ltr",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: Radius.full,
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  dotActive: { width: 18, backgroundColor: Colors.white },
});
