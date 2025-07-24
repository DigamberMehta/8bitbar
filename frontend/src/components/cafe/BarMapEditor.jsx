import React, { useState, useRef } from "react"; // Modified: Imported useRef
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Rect,
  Text,
} from "react-konva";
import useImage from "use-image";
import "./BarMapEditor.css";
import Toolbar from "./Toolbar";
import StageArea from "./StageArea";
import ShapeRenderer from "./ShapeRenderer";

const MAP_URL =
  "https://8bitbar.com.au/wp-content/uploads/2025/06/map-layout-0-resturant-scaled.jpg";
const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 2400;

// --- Initial Data ---
const initialShapes = [
  // Round Tables
  { id: "t1", type: "round-table", x: 200, y: 200, radius: 40 },
  { id: "t2", type: "round-table", x: 400, y: 300, radius: 40 },
  { id: "t3", type: "round-table", x: 600, y: 500, radius: 40 },
  // Chairs
  { id: "c1", type: "chair", x: 170, y: 170, width: 32, height: 32 },
  { id: "c2", type: "chair", x: 230, y: 170, width: 32, height: 32 },
  { id: "c3", type: "chair", x: 170, y: 230, width: 32, height: 32 },
  { id: "c4", type: "chair", x: 230, y: 230, width: 32, height: 32 },
  { id: "c5", type: "chair", x: 370, y: 270, width: 32, height: 32 },
  { id: "c6", type: "chair", x: 430, y: 330, width: 32, height: 32 },
];

// --- Default Styles ---
const DEFAULT_TABLE_COLOR = "#228B22"; // ForestGreen
const DEFAULT_CHAIR_COLOR = "#A0522D"; // Sienna
const DEFAULT_TEXT_COLOR = "#000000";
const FONT_SIZE = 22;

const BarMapEditor = () => {
  const [shapes, setShapes] = useState(initialShapes);
  const [selectedId, setSelectedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [scale, setScale] = useState(1);
  const [mapImage] = useImage(MAP_URL);

  const [tableColor, setTableColor] = useState(DEFAULT_TABLE_COLOR);
  const [chairColor, setChairColor] = useState(DEFAULT_CHAIR_COLOR);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);

  const stageContainerRef = useRef(null); // Added: Ref for the stage container

  // --- Helper to get next ID for any shape ---
  const getNextId = (prefix) => {
    const nums = shapes
      .map((s) => parseInt(s.id.replace(prefix, ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `${prefix}${max + 1}`;
  };

  // --- Handlers for adding new shapes ---
  const handleAddShape = (type) => {
    let newShape;

    // Modified: Calculate position based on the visible center of the stage
    if (!stageContainerRef.current) return;
    const container = stageContainerRef.current;
    const position = {
      x: (container.scrollLeft + container.clientWidth / 2) / scale,
      y: (container.scrollTop + container.clientHeight / 2) / scale,
    };

    switch (type) {
      case "round-table":
        newShape = {
          id: getNextId("t"),
          type,
          ...position,
          radius: 40,
        };
        break;
      case "corner-table":
        newShape = {
          id: getNextId("ct"),
          type,
          ...position,
          width: 70,
          height: 70,
        };
        break;
      case "chair":
        newShape = {
          id: getNextId("c"),
          type,
          ...position,
          width: 32,
          height: 32,
        };
        break;
      case "text":
        newShape = {
          id: getNextId("txt"),
          type,
          text: "New Text",
          ...position,
        };
        break;
      default:
        return;
    }
    setShapes([...shapes, newShape]);
  };

  const handleDeleteSelected = () => {
    if (!selectedId) return;
    setShapes(shapes.filter((shape) => shape.id !== selectedId));
    setSelectedId(null);
  };

  const handleDragEnd = (id, e) => {
    const newShapes = shapes.slice();
    const shape = newShapes.find((s) => s.id === id);
    if (shape) {
      shape.x = e.target.x();
      shape.y = e.target.y();
      setShapes(newShapes);
    }
  };

  const handleZoom = (direction) => {
    const scaleBy = 1.1;
    setScale(direction === "in" ? scale * scaleBy : scale / scaleBy);
  };

  const handleColorChange = (color, typesToUpdate) => {
    if (typesToUpdate.includes("chair")) setChairColor(color);
    if (typesToUpdate.some((t) => t.includes("table"))) setTableColor(color);
  };

  const getShapeFillColor = (shape) => {
    switch (shape.type) {
      case "round-table":
      case "corner-table":
        return tableColor;
      case "chair":
        return chairColor;
      case "text":
        return textColor;
      default:
        return "black";
    }
  };

  const renderShape = (shape) => {
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      draggable: true,
      onClick: () => setSelectedId(shape.id),
      onTap: () => setSelectedId(shape.id),
      onDragEnd: (e) => handleDragEnd(shape.id, e),
      onMouseEnter: () => setHoveredId(shape.id),
      onMouseLeave: () => setHoveredId(null),
      stroke:
        selectedId === shape.id
          ? "red"
          : hoveredId === shape.id
          ? "yellow"
          : "black",
      strokeWidth: selectedId === shape.id ? 5 : hoveredId === shape.id ? 4 : 2,
    };

    const textLabel = (
      <Text
        x={shape.x - (shape.width || shape.radius * 2) / 2}
        y={shape.y - FONT_SIZE / 2}
        width={shape.width || shape.radius * 2}
        text={shape.id}
        fontSize={FONT_SIZE}
        fontStyle="bold"
        fill="#fff"
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    );

    switch (shape.type) {
      case "round-table":
        return (
          <React.Fragment key={shape.id}>
            <Circle
              {...commonProps}
              radius={shape.radius}
              fill={getShapeFillColor(shape)}
            />
            {textLabel}
          </React.Fragment>
        );
      case "corner-table":
      case "chair":
        return (
          <React.Fragment key={shape.id}>
            <Rect
              {...commonProps}
              width={shape.width}
              height={shape.height}
              fill={getShapeFillColor(shape)}
              offsetX={shape.width / 2}
              offsetY={shape.height / 2}
            />
            {textLabel}
          </React.Fragment>
        );
      case "text":
        return (
          <Text
            {...commonProps}
            text={shape.text}
            fontSize={FONT_SIZE}
            fontStyle="bold"
            fill={textColor}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bar-map-editor-root">
      <Toolbar
        onAddShape={handleAddShape}
        onZoom={handleZoom}
        onDeleteSelected={handleDeleteSelected}
        selectedId={selectedId}
        tableColor={tableColor}
        chairColor={chairColor}
        onColorChange={handleColorChange}
      />
      <StageArea
        shapes={shapes}
        renderShape={renderShape}
        mapImage={mapImage}
        scale={scale}
        stageContainerRef={stageContainerRef}
        CANVAS_WIDTH={CANVAS_WIDTH}
        CANVAS_HEIGHT={CANVAS_HEIGHT}
      />
    </div>
  );
};

// --- Styles ---
// REMOVE the styles object entirely

export default BarMapEditor;
