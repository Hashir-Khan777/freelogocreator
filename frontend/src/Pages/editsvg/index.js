import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { Box, Button, Flex, Input, Select } from "@chakra-ui/react";

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

const fonts = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];

const SVGCanvasEditor = () => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedFontSize, setSelectedFontSize] = useState(12);
  const [fontFamily, setFontFamily] = useState("Arial");

  const canvasRef = useRef(null);
  const svgString = localStorage.getItem("svg");

  const drawGrid = (canvas, gridSize) => {
    const width = canvas.width;
    const height = canvas.height;

    for (let i = 0; i <= width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: "#ccc",
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }

    for (let i = 0; i <= height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: "#ccc",
        selectable: false,
        evented: false,
      });
      canvas.add(line);
    }
  };

  const changeColor = (e) => {
    if (selectedObject) {
      selectedObject.map((obj) => {
        obj.set("fill", e.target.value);
      });
      canvas.renderAll();
    }
  };

  const changeFontSize = (e) => {
    setSelectedFontSize(e.target.value);
    if (selectedObject) {
      selectedObject.map((obj) => {
        obj.set("fontSize", e.target.value);
      });
      canvas.renderAll();
    }
  };

  const handleKeyDown = (event, canvas) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "a") {
      event.preventDefault();
      selectAllObjects(canvas);
    }

    if (event.key === "Delete") {
      const objects = canvas.getActiveObjects();
      if (objects?.length > 0) {
        objects.map((obj) => {
          canvas.remove(obj);
        });
        canvas.renderAll();
      }
    }

    if (event.key === "Enter") {
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  const selectAllObjects = (canvas) => {
    if (canvas) {
      const objects = canvas.getObjects().filter((x) => x.selectable);

      if (objects.length > 0) {
        const activeSelection = new fabric.ActiveSelection(objects, {
          canvas: canvas,
        });
        canvas.setActiveObject(activeSelection);
        canvas.renderAll();
      }
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Text", { fontSize: selectedFontSize });
      canvas.add(text);
    }
  };

  const handleFontChange = (e) => {
    setFontFamily(e.target.value);
    if (selectedObject) {
      selectedObject.map((obj) => {
        obj.set("fontFamily", e.target.value);
      });
      canvas.renderAll();
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 850,
        height: 600,
        preserveObjectStacking: true,
      });
      setCanvas(() => initCanvas);

      initCanvas.renderAll();

      initCanvas.sendToBack();

      const gridSize = 20;
      drawGrid(initCanvas, gridSize);

      fabric.loadSVGFromString(svgString, (objects) => {
        if (objects && objects.length > 0) {
          objects.forEach((obj) => initCanvas.add(obj));
        } else {
          console.error("SVG loading failed or returned no objects.");
        }
      });

      initCanvas.on("selection:created", (event) => {
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
        }
      });

      initCanvas.on("selection:updated", (event) => {
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
        }
      });

      document.addEventListener("keydown", (e) => handleKeyDown(e, initCanvas));

      return () => {
        document.removeEventListener("keydown", (e) =>
          handleKeyDown(e, initCanvas)
        );

        initCanvas.dispose();
      };
    }
  }, []);

  return (
    <Flex justifyContent="center" alignItems="center" height="100vh">
      <Box>
        <Flex
          mb="10px"
          justifyContent="space-between"
          alignItems="center"
          gap="10px"
        >
          <Input width="200px" type="color" onChange={changeColor} />
          <Button
            onClick={addText}
            width="200px"
            variant="solid"
            colorScheme="blue"
            backgroundColor="blue"
          >
            Add Text
          </Button>
          <Select
            width="200px"
            value={selectedFontSize}
            onChange={changeFontSize}
          >
            {fontSizes.map((size) => (
              <Box as="option" value={size}>
                {size}
              </Box>
            ))}
          </Select>
          <Select width="200px" value={fontFamily} onChange={handleFontChange}>
            {fonts.map((font) => (
              <Box as="option" value={font}>
                {font}
              </Box>
            ))}
          </Select>
        </Flex>
        <Box as="canvas" ref={canvasRef} style={{ border: "1px solid #ccc" }} />
      </Box>
    </Flex>
  );
};

export default SVGCanvasEditor;
