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
}) => (
  <div ref={stageContainerRef} className="bar-map-editor-stage-container">
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
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
);

export default StageArea;
