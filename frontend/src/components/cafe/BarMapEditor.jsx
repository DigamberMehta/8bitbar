import React, { useState } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Circle,
  Rect,
  Text,
} from "react-konva";
import useImage from "use-image";

const MAP_URL =
  "https://8bitbar.com.au/wp-content/uploads/2025/06/map-layout-0-resturant-scaled.jpg";
const CANVAS_WIDTH = 1400; // Increased width
const CANVAS_HEIGHT = 1000; // Increased height

const initialTables = [
  { id: "t1", x: 200, y: 200 },
  { id: "t2", x: 400, y: 300 },
  { id: "t3", x: 600, y: 500 },
];

const initialChairs = [
  { id: "c1", x: 170, y: 170 },
  { id: "c2", x: 230, y: 170 },
  { id: "c3", x: 170, y: 230 },
  { id: "c4", x: 230, y: 230 },
  { id: "c5", x: 370, y: 270 },
  { id: "c6", x: 430, y: 330 },
];

const TABLE_RADIUS = 30;
const CHAIR_SIZE = 20;

const BarMapEditor = () => {
  const [tables, setTables] = useState(initialTables);
  const [chairs, setChairs] = useState(initialChairs);
  const [hoveredId, setHoveredId] = useState(null);
  const [mapImage] = useImage(MAP_URL);

  // Helper to get next table id
  const getNextTableId = () => {
    const nums = tables
      .map((t) => parseInt(t.id.replace("t", ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `t${max + 1}`;
  };
  // Helper to get next chair id
  const getNextChairId = () => {
    const nums = chairs
      .map((c) => parseInt(c.id.replace("c", ""), 10))
      .filter((n) => !isNaN(n));
    const max = nums.length ? Math.max(...nums) : 0;
    return `c${max + 1}`;
  };

  const handleAddTable = () => {
    setTables([...tables, { id: getNextTableId(), x: 100, y: 100 }]);
  };

  const handleAddChair = () => {
    setChairs([...chairs, { id: getNextChairId(), x: 150, y: 100 }]);
  };

  const handleTableDrag = (idx, e) => {
    const newTables = tables.slice();
    newTables[idx] = {
      ...newTables[idx],
      x: e.target.x(),
      y: e.target.y(),
    };
    setTables(newTables);
  };

  const handleChairDrag = (idx, e) => {
    const newChairs = chairs.slice();
    newChairs[idx] = {
      ...newChairs[idx],
      x: e.target.x(),
      y: e.target.y(),
    };
    setChairs(newChairs);
  };

  const handleShapeClick = (id) => {
    alert(id);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <button
          onClick={handleAddTable}
          style={{ marginRight: 8, padding: "8px 16px" }}
        >
          Add Table
        </button>
        <button onClick={handleAddChair} style={{ padding: "8px 16px" }}>
          Add Chair
        </button>
      </div>
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: "1px solid #ccc" }}
      >
        <Layer>
          {mapImage && (
            <KonvaImage
              image={mapImage}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
            />
          )}
          {/* Tables */}
          {tables.map((table, idx) => (
            <React.Fragment key={table.id}>
              <Circle
                x={table.x}
                y={table.y}
                radius={TABLE_RADIUS}
                fill="green"
                stroke={hoveredId === table.id ? "yellow" : "black"}
                strokeWidth={hoveredId === table.id ? 4 : 2}
                draggable
                onDragEnd={(e) => handleTableDrag(idx, e)}
                onClick={() => handleShapeClick(table.id)}
                onTap={() => handleShapeClick(table.id)}
                onMouseEnter={() => setHoveredId(table.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(table.id)}
                onTouchEnd={() => setHoveredId(null)}
              />
              <Text
                x={table.x - TABLE_RADIUS}
                y={table.y - 12}
                width={TABLE_RADIUS * 2}
                height={24}
                text={table.id}
                fontSize={18}
                fontStyle="bold"
                fill="#fff"
                align="center"
                verticalAlign="middle"
                listening={false}
              />
            </React.Fragment>
          ))}
          {/* Chairs */}
          {chairs.map((chair, idx) => (
            <React.Fragment key={chair.id}>
              <Rect
                x={chair.x}
                y={chair.y}
                width={CHAIR_SIZE}
                height={CHAIR_SIZE}
                fill="#8B4513"
                stroke={hoveredId === chair.id ? "yellow" : "black"}
                strokeWidth={hoveredId === chair.id ? 4 : 2}
                offsetX={CHAIR_SIZE / 2}
                offsetY={CHAIR_SIZE / 2}
                draggable
                onDragEnd={(e) => handleChairDrag(idx, e)}
                onClick={() => handleShapeClick(chair.id)}
                onTap={() => handleShapeClick(chair.id)}
                onMouseEnter={() => setHoveredId(chair.id)}
                onMouseLeave={() => setHoveredId(null)}
                onTouchStart={() => setHoveredId(chair.id)}
                onTouchEnd={() => setHoveredId(null)}
              />
              <Text
                x={chair.x - CHAIR_SIZE / 2}
                y={chair.y - 10}
                width={CHAIR_SIZE}
                height={20}
                text={chair.id}
                fontSize={12}
                fontStyle="bold"
                fill="#fff"
                align="center"
                verticalAlign="middle"
                listening={false}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
};

export default BarMapEditor;
