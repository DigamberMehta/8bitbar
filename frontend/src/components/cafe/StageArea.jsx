import React from "react";
import { Stage, Layer, Image as KonvaImage } from "react-konva";

const StageArea = ({
  shapes,
  renderShape,
  mapImage,
  scale,
  stageContainerRef,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  deviceType,
}) => (
  <div
    ref={stageContainerRef}
    className="bar-map-editor-stage-container border border-gray-600 rounded overflow-auto"
    style={{
      maxHeight: "600px",
      maxWidth: "100%",
      width: "100%",
    }}
  >
    <div
      style={{
        width: CANVAS_WIDTH * scale,
        height: CANVAS_HEIGHT * scale,
        minWidth: "100%",
        minHeight: "400px",
      }}
    >
      <Stage
        width={CANVAS_WIDTH * scale}
        height={CANVAS_HEIGHT * scale}
        scaleX={scale}
        scaleY={scale}
      >
        <Layer>
          {mapImage && (
            <KonvaImage
              image={mapImage}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />
          )}
          {shapes.map((shape) => renderShape(shape))}
        </Layer>
      </Stage>
    </div>
  </div>
);

export default StageArea;
