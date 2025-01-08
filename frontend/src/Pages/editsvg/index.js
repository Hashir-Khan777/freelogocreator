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
  const undoStack = useRef([]);
  const redoStack = useRef([]);

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

    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      event.preventDefault();
      undo(canvas);
    }

    if ((event.ctrlKey || event.metaKey) && event.key === "y") {
      event.preventDefault();
      redo(canvas);
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
    if (canvas) {
      gridLinesRef.current.forEach((line) => (line.visible = false));
      canvas.discardActiveObject();
      canvas.renderAll();

      const dataURL = canvas.toDataURL({
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

  const saveState = (canvas) => {
    const selectedObjects = canvas
      .getObjects()
      .filter((obj) => obj.selectable != false && obj.evented != false);
    const jsonData = selectedObjects.map((obj) => obj.toJSON());
    undoStack.current.push(jsonData);
  };

  const undo = (canvas) => {
    if (undoStack.current.length > 0) {
      const previousState = undoStack.current.slice(
        undoStack.current.length - 2,
        undoStack.current.length - 1
      )[0];
      redoStack.current.push(
        canvas
          .getObjects()
          .filter((obj) => obj.selectable != false && obj.evented != false)
          .map((obj) => obj.toJSON())
      );
      canvas.clear();

      const gridSize = 20;
      drawGrid(canvas, gridSize);

      if (previousState) {
        fabric.util.enlivenObjects(previousState, (objects) => {
          const group = new fabric.Group(objects);
          canvas.add(group);
          group.center();
          group.setCoords();
          canvas.renderAll();

          canvas.remove(group);
          group._objects.forEach((obj) => {
            canvas.add(obj);
          });
          canvas.renderAll();
        });
      }
    }
  };

  const redo = (canvas) => {
    if (redoStack.current.length > 0) {
      const nextState = redoStack.current.pop();
      undoStack.current.push(
        canvas
          .getObjects()
          .filter((obj) => obj.selectable != false && obj.evented != false)
          .map((obj) => obj.toJSON())
      );
      canvas.clear();

      const gridSize = 20;
      drawGrid(canvas, gridSize);

      if (nextState) {
        fabric.util.enlivenObjects(nextState, (objects) => {
          const group = new fabric.Group(objects);
          canvas.add(group);
          group.center();
          group.setCoords();
          canvas.renderAll();

          canvas.remove(group);
          group._objects.forEach((obj) => {
            canvas.add(obj);
          });
          canvas.renderAll();
        });
      }
    }
  };

  const bringToFront = () => {
    if (selectedObject) {
      selectedObject.map((obj) => {
        canvas.bringToFront(obj);
      });
    }
  };

  const sendToBack = () => {
    if (selectedObject) {
      selectedObject.map((obj) => {
        canvas.sendToBack(obj);
        canvas.renderAll();
      });
    }
  };

  const canvasInitialization = () => {
    if (canvas) {
      canvas.dispose();
    }
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: 850,
        height: 600,
        preserveObjectStacking: true,
      });

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
        }
      });

      saveState(initCanvas);

      initCanvas.on("object:added", () => saveState(initCanvas));
      initCanvas.on("object:modified", () => saveState(initCanvas));
      initCanvas.on("object:removed", () => saveState(initCanvas));

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

      setCanvas(() => initCanvas);
    }
  };

  useEffect(() => {
    canvasInitialization();
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
            <Button
              onClick={canvasInitialization}
              width="200px"
              variant="solid"
              colorScheme="blue"
            >
              Reset
            </Button>
          </Flex>
          <Flex>
            <Box>
              <Box as="canvas" ref={canvasRef} position="relative" />
            </Box>
            <Flex flexDirection="column" justifyContent="space-between">
              <Flex flexDirection="column" gap={3}>
                <Button
                  onClick={sendToBack}
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                >
                  Send To Back
                </Button>
                <Button
                  onClick={bringToFront}
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                >
                  Bring To Front
                </Button>
              </Flex>
              <Menu>
                <MenuButton
                  as={Button}
                  mt="10px"
                  float="right"
                  variant="solid"
                  colorScheme="blue"
                >
                  Save
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => saveImage("png")}>
                    Save As Png
                  </MenuItem>
                  <MenuItem onClick={() => saveImage("jpeg")}>
                    Save As Jpeg
                  </MenuItem>
                </MenuList>
              </Menu>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default SVGCanvasEditor;
