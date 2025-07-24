import React from "react";

const Toolbar = ({
  onAddShape,
  onZoom,
  onDeleteSelected,
  selectedId,
  tableColor,
  chairColor,
  onColorChange,
}) => (
  <div className="bar-map-editor-toolbar">
    <button
      className="bar-map-editor-button"
      onClick={() => onAddShape("corner-table")}
    >
      Add Corner Table ➕
    </button>
    <button
      className="bar-map-editor-button"
      onClick={() => onAddShape("round-table")}
    >
      Add Round Table ➕
    </button>
    <button
      className="bar-map-editor-button"
      onClick={() => onAddShape("chair")}
    >
      Add Chair ➕
    </button>
    <button className="bar-map-editor-button" onClick={() => onZoom("in")}>
      Zoom In 🔍
    </button>
    <button className="bar-map-editor-button" onClick={() => onZoom("out")}>
      Zoom Out 🔍
    </button>
    <button
      className="bar-map-editor-button"
      onClick={onDeleteSelected}
      disabled={!selectedId}
    >
      Delete Selected Item 🗑️
    </button>
    <div className="bar-map-editor-color-picker-container">
      <label className="bar-map-editor-label">Table Color:</label>
      <input
        type="color"
        value={tableColor}
        onChange={(e) =>
          onColorChange(e.target.value, ["round-table", "corner-table"])
        }
        className="bar-map-editor-color-input"
      />
    </div>
    <div className="bar-map-editor-color-picker-container">
      <label className="bar-map-editor-label">Chair Color:</label>
      <input
        type="color"
        value={chairColor}
        onChange={(e) => onColorChange(e.target.value, ["chair"])}
        className="bar-map-editor-color-input"
      />
    </div>
  </div>
);

export default Toolbar;
