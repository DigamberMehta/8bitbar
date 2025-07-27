import React, { useEffect } from "react";
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
  actualDeviceType, // New prop for actual device being used
}) => {
  // Apply mobile scale based on actual device being used, not layout type being edited
  const MOBILE_SCALE = 0.7;
  const isOnMobileDevice = actualDeviceType === "mobile";
  const responsiveScale = isOnMobileDevice ? scale * MOBILE_SCALE : scale;

  // Fix mobile scrolling by preventing touch events from bubbling to parent
  useEffect(() => {
    const container = stageContainerRef.current;
    if (!container || !isOnMobileDevice) return;

    let isScrolling = false;

    let startY = 0;
    let startX = 0;

    const handleTouchStart = (e) => {
      isScrolling = true;
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;

      // Lock body scroll when interacting with stage
      document.body.classList.add("stage-scrolling");
      e.stopPropagation();
    };

    const handleTouchMove = (e) => {
      if (!isScrolling) return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const deltaY = startY - currentY;
      const deltaX = startX - currentX;

      // Check container boundaries
      const {
        scrollTop,
        scrollHeight,
        clientHeight,
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = container;
      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
      const atLeft = scrollLeft <= 0;
      const atRight = scrollLeft + clientWidth >= scrollWidth - 1;

      // Determine scroll direction
      const scrollingUp = deltaY < 0;
      const scrollingDown = deltaY > 0;
      const scrollingLeft = deltaX < 0;
      const scrollingRight = deltaX > 0;

      // Prevent default if we can scroll within the container
      const canScrollVertically =
        (!atTop && scrollingUp) || (!atBottom && scrollingDown);
      const canScrollHorizontally =
        (!atLeft && scrollingLeft) || (!atRight && scrollingRight);

      if (canScrollVertically || canScrollHorizontally) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const handleTouchEnd = () => {
      isScrolling = false;
      // Unlock body scroll
      document.body.classList.remove("stage-scrolling");
    };

    const handleTouchCancel = () => {
      isScrolling = false;
      document.body.classList.remove("stage-scrolling");
    };

    container.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("touchcancel", handleTouchCancel, {
      passive: true,
    });

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("touchcancel", handleTouchCancel);
      // Clean up body class in case component unmounts during touch
      document.body.classList.remove("stage-scrolling");
    };
  }, [isOnMobileDevice, stageContainerRef]);

  return (
    <div
      ref={stageContainerRef}
      className="bar-map-editor-stage-container border border-gray-600 rounded overflow-auto"
      style={{
        maxHeight: "600px",
        maxWidth: "100%",
        width: "100%",
        // Mobile-specific scrolling improvements
        WebkitOverflowScrolling: "touch", // Smooth scrolling on iOS
        overscrollBehavior: "contain", // Prevent scroll chaining
        touchAction: "pan-x pan-y", // Allow panning in both directions
        position: "relative", // Ensure proper stacking context
        zIndex: 1, // Ensure it's above other elements
      }}
    >
      <div
        style={{
          width: CANVAS_WIDTH * responsiveScale,
          height: CANVAS_HEIGHT * responsiveScale,
          minWidth: "100%",
          minHeight: "400px",
        }}
      >
        <Stage
          width={CANVAS_WIDTH * responsiveScale}
          height={CANVAS_HEIGHT * responsiveScale}
          scaleX={responsiveScale}
          scaleY={responsiveScale}
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
};

export default StageArea;
