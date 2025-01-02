import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Select,
} from "@chakra-ui/react";

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

const fonts = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];

const SVGCanvasEditor = () => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");

  const canvasRef = useRef(null);
  const svgString = localStorage.getItem("svg");
  const gridLinesRef = useRef([]);

  const drawGrid = (canvas, gridSize) => {
    const width = canvas.width - 8;
    const height = canvas.height - 18;

    for (let i = 0; i < width; i += gridSize) {
      const line = new fabric.Line([i, 0, i, height], {
        stroke: "#ccc",
        selectable: false,
        evented: false,
      });
      gridLinesRef.current.push(line);
      canvas.add(line);
      canvas.sendToBack(line);
    }

    for (let i = 0; i < height; i += gridSize) {
      const line = new fabric.Line([0, i, width, i], {
        stroke: "#ccc",
        selectable: false,
        evented: false,
      });
      gridLinesRef.current.push(line);
      canvas.add(line);
      canvas.sendToBack(line);
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

        activeSelection.center();
        activeSelection.setCoords();

        canvas.setActiveObject(activeSelection);
        canvas.renderAll();
      }
    }
  };

  const addText = () => {
    if (canvas) {
      const text = new fabric.Textbox("Text", {
        fontSize: selectedFontSize,
        fontFamily: fontFamily,
        textAlign: "center",
      });
      canvas.add(text);

      text.center();
      text.setCoords();

      canvas.setActiveObject(text);

      canvas.renderAll();
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

  const saveImage = (type) => {
    if (canvasRef.current) {
      gridLinesRef.current.forEach((line) => (line.visible = false));
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataURL = canvasRef.current.toDataURL({
        format: type,
        quality: 1,
      });

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `logo.${type}`;
      link.click();
    }
    const gridSize = 20;
    drawGrid(canvas, gridSize);
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

      fabric.loadSVGFromString(svgString, (objects, options) => {
        if (objects && objects.length > 0) {
          const group = new fabric.Group(objects, options);
          initCanvas.add(group);
          group.center();
          group.setCoords();
          initCanvas.renderAll();

          initCanvas.remove(group);
          group._objects.forEach((obj) => {
            initCanvas.add(obj);
          });
          initCanvas.renderAll();
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
    <Container flex={1} maxWidth="1216px" my="20px">
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
            <Select
              width="200px"
              value={fontFamily}
              onChange={handleFontChange}
            >
              {fonts.map((font) => (
                <Box as="option" value={font}>
                  {font}
                </Box>
              ))}
            </Select>
          </Flex>
          <Box
            as="canvas"
            ref={canvasRef}
            // style={{ border: "1px solid #ccc" }}
          />
          <Menu>
            <MenuButton
              as={Button}
              width={{ base: "100%", md: "32.33333%" }}
              mt="10px"
              float="right"
              variant="solid"
              colorScheme="blue"
              backgroundColor="blue"
              borderRadius={0}
            >
              Save
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => saveImage("png")}>Save As Png</MenuItem>
              <MenuItem onClick={() => saveImage("jpeg")}>
                Save As Jpeg
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>
    </Container>
  );
};

export default SVGCanvasEditor;
