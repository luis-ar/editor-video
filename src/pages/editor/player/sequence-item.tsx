import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence } from "remotion";
import TextLayer from "./editable-text";
import MainLayerBackground from "./main-layer-background";
import {
  IAudio,
  ICaption,
  IImage,
  IItem,
  IText,
  IVideo
} from "@designcombo/types";

const REMOTION_SAFE_FRAME = 0;

interface SequenceItemOptions {
  handleTextChange?: (id: string, text: string) => void;
  fps: number;
  editableTextId?: string | null;
  currentTime?: number;
}

const calculateFrames = (
  display: { from: number; to: number },
  fps: number
) => {
  const from = (display.from / 1000) * fps;
  const durationInFrames = (display.to / 1000) * fps - from;
  return { from, durationInFrames };
};

export const SequenceItem: Record<
  string,
  (item: IItem, options: SequenceItemOptions) => JSX.Element
> = {
  text: (item, options: SequenceItemOptions) => {
    const { handleTextChange, fps, editableTextId } = options;
    const { id, details } = item as IText;
    const { from, durationInFrames } = calculateFrames(item.display, fps);
    const boxShadowAsShadow = item.details.boxShadow
      ? `${item.details.boxShadow.x}px ${item.details.boxShadow.y}px ${item.details.boxShadow.blur}px ${item.details.boxShadow.color}`
      : "";
    return (
      <Sequence
        className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type} pointer-events-none`}
        key={item.id}
        from={from}
        durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
        data-track-item="transition-element"
        style={{
          position: "absolute",
          width: details.width || 300,
          height: details.height || 400,
          transform: details.transform || "none",
          fontSize: details.fontSize || "16px",
          textAlign: details.textAlign || "left",
          top: details.top || 300,
          left: details.left || 600,
          color: details.color || "#000000",
          backgroundColor: details.backgroundColor || "transparent",
          border: details.border || "none",
          opacity: details.opacity! / 100,
          fontFamily: details.fontFamily || "Arial",
          fontWeight: details.fontWeight || "normal",
          lineHeight: details.lineHeight || "normal",
          letterSpacing: details.letterSpacing || "normal",
          wordSpacing: details.wordSpacing || "normal",
          wordWrap: details.wordWrap || "",
          wordBreak: details.wordBreak || "normal",
          pointerEvents: "auto",
          textTransform: details.textTransform || "none"
        }}
      >
        <TextLayer
          key={id}
          id={id}
          content={details.text}
          editable={editableTextId === id}
          onChange={handleTextChange}
          style={{
            position: "relative",
            textDecoration: details.textDecoration || "none",
            WebkitTextStroke: `${item.details.borderWidth}px ${item.details.borderColor}`, // Outline/stroke color and thickness
            paintOrder: "stroke fill", // Order of painting
            textShadow: boxShadowAsShadow
          }}
        />
      </Sequence>
    );
  },
  caption: (item, options: SequenceItemOptions) => {
    const { handleTextChange, fps, editableTextId } = options;
    const { id, details } = item as ICaption;
    const { from, durationInFrames } = calculateFrames(item.display, fps);
    const boxShadowAsShadow = item.details.boxShadow
      ? `${item.details.boxShadow.x}px ${item.details.boxShadow.y}px ${item.details.boxShadow.blur}px ${item.details.boxShadow.color}`
      : "";
    return (
      <Sequence
        className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type} pointer-events-none`}
        key={item.id}
        from={from}
        durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
        data-track-item="transition-element"
        style={{
          position: "absolute",
          width: details.width || 300,
          height: details.height || 400,
          transform: item.details?.transform || "none",
          fontSize: details.fontSize || "16px",
          textAlign: details.textAlign || "left",
          top: details.top || 300,
          left: details.left || 600,
          color: details.color || "#000000",
          backgroundColor: details.backgroundColor || "transparent",
          border: details.border || "none",
          opacity: details.opacity! / 100,
          fontFamily: details.fontFamily || "Arial",
          fontWeight: details.fontWeight || "normal",
          lineHeight: details.lineHeight || "normal",
          letterSpacing: details.letterSpacing || "normal",
          wordSpacing: details.wordSpacing || "normal",
          wordWrap: details.wordWrap || "normal",
          wordBreak: details.wordBreak || "normal",
          textTransform: details.textTransform || "none",
          pointerEvents: "auto"
        }}
      >
        <TextLayer
          key={id}
          id={id}
          content={details.text}
          editable={editableTextId === id}
          onChange={handleTextChange}
          style={{
            position: "relative",
            textDecoration: details.textDecoration || "none",
            WebkitTextStroke: `${item.details.borderWidth}px ${item.details.borderColor}`, // Outline/stroke color and thickness
            paintOrder: "stroke fill", // Order of painting
            textShadow: boxShadowAsShadow
          }}
        />
      </Sequence>
    );
  },
  image: (item, options: SequenceItemOptions) => {
    const { fps } = options;
    const { details } = item as IImage;
    const { from, durationInFrames } = calculateFrames(item.display, fps);

    const crop = details.crop || {
      x: 0,
      y: 0,
      width: item.details.width,
      height: item.details.height
    };
    const boxShadowAsOutline = `0 0 0 ${item.details.borderWidth}px ${item.details.borderColor}`;
    const boxShadowAsShadow = item.details.boxShadow
      ? `${item.details.boxShadow.x}px ${item.details.boxShadow.y}px ${item.details.boxShadow.blur}px ${item.details.boxShadow.color}`
      : "";

    return (
      <Sequence
        key={item.id}
        from={from}
        durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
        style={{ pointerEvents: "none" }}
      >
        {item.isMain && (
          <MainLayerBackground
            key={item.id + "background"}
            background={details.background}
          />
        )}
        <AbsoluteFill
          data-track-item="transition-element"
          className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type}`}
          style={{
            pointerEvents: "auto",
            top: item?.details?.top || 0,
            left: item?.details?.left || 0,
            width: crop.width || "100%", // Default width
            height: crop.height || "auto", // Default height
            transform: details.transform || "none",
            opacity:
              item?.details?.opacity !== undefined
                ? item.details.opacity / 100
                : 1,
            borderRadius: `${Math.min(crop.width, crop.height) * ((item.details.borderRadius || 0) / 100)}px`, // Default border radius
            boxShadow:
              boxShadowAsOutline +
              (boxShadowAsShadow ? ", " + boxShadowAsShadow : ""), // Default box shadow
            overflow: "hidden",
            transformOrigin: details.transformOrigin || "center center",
            filter: `brightness(${details.brightness}%) blur(${details.blur}px)`
          }}
        >
          <div
            style={{
              width: item.details.width || "100%", // Default width
              height: item.details.height || "auto", // Default height
              position: "relative",
              overflow: "hidden",
              pointerEvents: "none",
              scale: `${details.flipX ? "-1" : "1"} ${
                details.flipY ? "-1" : "1"
              }`
            }}
          >
            <Img
              style={{
                pointerEvents: "none",
                top: -crop.y || 0,
                left: -crop.x || 0,
                width: item.details.width || "100%", // Default width
                height: item.details.height || "auto", // Default height
                position: "absolute"
              }}
              data-id={item.id}
              src={details.src}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    );
  },
  video: (item, options: SequenceItemOptions) => {
    const { fps } = options;
    const { details } = item as IVideo;
    const playbackRate = item.playbackRate || 1;
    const { from, durationInFrames } = calculateFrames(
      {
        from: item.display.from / playbackRate,
        to: item.display.to / playbackRate
      },
      fps
    );
    const trim = {
      from: (item.trim?.from || item.display.from) / playbackRate,
      to: (item.trim?.to || item.display.to) / playbackRate
    };
    const crop = details.crop || {
      x: 0,
      y: 0,
      width: item.details.width,
      height: item.details.height
    };
    const boxShadowAsOutline = `0 0 0 ${item.details.borderWidth}px ${item.details.borderColor}`;
    const boxShadowAsShadow = item.details.boxShadow
      ? `${item.details.boxShadow.x}px ${item.details.boxShadow.y}px ${item.details.boxShadow.blur}px ${item.details.boxShadow.color}`
      : "";

    return (
      <Sequence
        key={item.id}
        from={from}
        durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
        style={{ pointerEvents: "none" }}
      >
        {item.isMain && (
          <MainLayerBackground
            key={item.id + "background"}
            background={details.background || "#ffffff"}
          />
        )}
        <AbsoluteFill
          data-track-item="transition-element"
          className={`designcombo-scene-item id-${item.id} designcombo-scene-item-type-${item.type}`}
          style={{
            pointerEvents: "auto",
            top: item?.details?.top || 0,
            left: item?.details?.left || 0,
            width: crop.width || "100%", // Default width
            height: crop.height || "auto", // Default height
            transform: item.details?.transform || "none",
            opacity:
              item?.details?.opacity !== undefined
                ? item.details.opacity / 100
                : 1,
            borderRadius: `${Math.min(crop.width!, crop.height!) * ((item.details.borderRadius || 0) / 100)}px`, // Default border radius
            boxShadow:
              boxShadowAsOutline +
              (boxShadowAsShadow ? ", " + boxShadowAsShadow : ""), // Default box shadow
            overflow: "hidden",
            transformOrigin: details.transformOrigin || "center center",
            filter: `brightness(${details.brightness}%) blur(${details.blur}px)`
          }}
        >
          <div
            style={{
              width: item.details.width || "100%", // Default width
              height: item.details.height || "auto", // Default height
              position: "relative",
              overflow: "hidden",
              pointerEvents: "none",
              scale: `${details.flipX ? "-1" : "1"} ${
                details.flipY ? "-1" : "1"
              }`
            }}
          >
            <OffthreadVideo
              startFrom={(trim.from / 1000) * fps}
              endAt={(trim.to / 1000) * fps + REMOTION_SAFE_FRAME}
              playbackRate={playbackRate}
              src={details.src}
              volume={details.volume || 0 / 100}
              style={{
                pointerEvents: "none",
                top: -crop.y || 0,
                left: -crop.x || 0,
                width: item.details.width || "100%", // Default width
                height: item.details.height || "auto", // Default height
                position: "absolute"
              }}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    );
  },
  audio: (item, options: SequenceItemOptions) => {
    const { fps } = options;
    const { details } = item as IAudio;
    const playbackRate = item.playbackRate || 1;
    const { from, durationInFrames } = calculateFrames(
      {
        from: item.display.from / playbackRate,
        to: item.display.to / playbackRate
      },
      fps
    );
    const trim = {
      from: (item.trim?.from || item.display.from) / playbackRate,
      to: (item.trim?.to || item.display.to) / playbackRate
    };
    return (
      <Sequence
        key={item.id}
        from={from}
        durationInFrames={durationInFrames + REMOTION_SAFE_FRAME}
        style={{
          userSelect: "none",
          pointerEvents: "none"
        }}
      >
        <AbsoluteFill>
          <Audio
            startFrom={(trim.from / 1000) * fps}
            endAt={(trim.to / 1000) * fps + REMOTION_SAFE_FRAME}
            playbackRate={playbackRate}
            src={details.src}
            volume={details.volume! / 100}
          />
        </AbsoluteFill>
      </Sequence>
    );
  }
};
