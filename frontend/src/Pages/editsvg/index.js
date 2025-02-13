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
import { useDispatch, useSelector } from "react-redux";
import {
  toggleReplaceModal,
  toggleShapeModal,
  toggleShieldModal,
} from "../../store/reducers/modals.reducer";

const canvasHeight = 581;
const canvasWidth = 781;

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

const fonts = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];

const gridSize = 20;

const SVGCanvasEditor = () => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [colors, setColors] = useState([]);
  const [bgColor, setBgColor] = useState("#ffffff");

  const canvasRef = useRef(null);
  const svgString = localStorage.getItem("svg");
  const gridLinesRef = useRef([]);
  const dispatch = useDispatch();
  const undoStack = useRef([]);
  const redoStack = useRef([]);
  const [gridVisible, setGridVisible] = useState(true);

  const { shapesModalData, replaceModalData, shieldModalData } = useSelector(
    (store) => store.ModalsReducer
  );

  const drawGrid = (canvas) => {
    const width = canvas.width;
    const height = canvas.height;

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

  const toggleGrid = () => {
    if (canvas) {
      if (gridVisible) {
        gridLinesRef.current.forEach((line) => canvas.remove(line));
      } else {
        gridLinesRef.current.forEach((line) => {
          canvas.add(line);
          canvas.sendToBack(line);
        });
      }
      setGridVisible(!gridVisible);
      canvas.renderAll();
    }
  };

  const changeColor = (e, index) => {
    // if (selectedObject) {
    //   selectedObject.map((obj) => {
    //     obj.set("fill", e.target.value);
    //   });
    //   canvas.renderAll();
    // } else {
    const colorClone = [...colors];
    const objects = canvas
      .getObjects()
      ?.filter((x) => x.selectable !== false && x.evented !== false);
    objects
      ?.filter((x) => x?.fill === colors[index] || x?.xtroke === colors[index])
      .map((obj) => {
        obj.set("fill", e.target.value);
      });
    colorClone[index] = e.target.value;
    setColors(colorClone);
    canvas.renderAll();
    // }
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
      const filteredObjects = canvas
        .getObjects()
        ?.filter((x) => x.selectable !== false && x.evented !== false);

      const topXPos = filteredObjects?.reduce(
        (max, obj) => (Math.abs(obj.top) > Math.abs(max.top) ? obj : max),
        filteredObjects[0]
      );

      const text = new fabric.Textbox("Text", {
        fontSize: selectedFontSize,
        fontFamily: fontFamily,
        textAlign: "center",
        top: canvasHeight / 2 + Math.abs(topXPos?.top) + 20,
        left: canvasWidth / 2,
      });
      canvas.add(text);

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
    drawGrid(canvas);
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

      drawGrid(canvas);

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

      drawGrid(canvas);

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
      gridLinesRef.current.map((line) => {
        canvas.sendToBack(line);
        canvas.renderAll();
      });
    }
  };

  const sendToBack = () => {
    if (selectedObject) {
      selectedObject.map((obj) => {
        canvas.sendToBack(obj);
        canvas.renderAll();
      });
      gridLinesRef.current.map((line) => {
        canvas.sendToBack(line);
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
        width: canvasWidth,
        height: canvasHeight,
        preserveObjectStacking: true,
        backgroundColor: bgColor,
      });

      initCanvas.renderAll();

      initCanvas.sendToBack();

      drawGrid(initCanvas);

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

      let svgColors = [];
      initCanvas.on("selection:created", (event) => {
        setColors([]);
        svgColors = [];
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
          event.selected.forEach((obj) => {
            if (obj?.fill && !svgColors.includes(obj?.fill)) {
              svgColors.push(obj?.fill);
            }
            if (obj?.stroke && !svgColors.includes(obj?.stroke)) {
              svgColors.push(obj?.stroke);
            }
          });
          setColors([...colors, ...svgColors]);
        } else {
          setColors([]);
        }
      });

      initCanvas.on("selection:updated", (event) => {
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
          event.selected.forEach((obj) => {
            if (obj?.fill && !svgColors.includes(obj?.fill)) {
              svgColors.push(obj?.fill);
            }
            if (obj?.stroke && !svgColors.includes(obj?.stroke)) {
              svgColors.push(obj?.stroke);
            }
          });
          setColors([...colors, ...svgColors]);
        } else {
          setColors([]);
        }
      });

      initCanvas.on("selection:cleared", () => {
        setColors([]);
      });

      document.addEventListener("keydown", (e) => handleKeyDown(e, initCanvas));

      setCanvas(() => initCanvas);
    }
  };

  useEffect(() => {
    canvasInitialization();
  }, []);

  useEffect(() => {
    if (shapesModalData) {
      fabric.loadSVGFromString(shapesModalData, (objects, options) => {
        if (objects && objects.length > 0) {
          objects.forEach((obj) => {
            canvas.add(obj);
          });
          canvas.renderAll();
        }
      });
    }
  }, [shapesModalData]);

  useEffect(() => {
    if (replaceModalData) {
      canvas.getObjects("path").forEach((path) => {
        canvas.remove(path);
      });

      fabric.loadSVGFromString(replaceModalData, (objects, options) => {
        if (objects && objects.length > 0) {
          const group = new fabric.Group(objects, options);
          canvas.add(group);
          group.center();
          group.setCoords();
          canvas.renderAll();

          canvas.remove(group);
          group._objects.forEach((obj) => {
            canvas.add(obj);
          });
          canvas.renderAll();
        }
      });
    }
  }, [replaceModalData]);

  useEffect(() => {
    if (shieldModalData) {
      canvas.getObjects("path").forEach((path) => {
        canvas.remove(path);
      });

      fabric.loadSVGFromString(shieldModalData, (objects, options) => {
        const shield = fabric.util.groupSVGElements(objects, options);

        shield.set({
          left: 100,
          top: 100,
          scaleX: 1,
          scaleY: 1,
          selectable: false,
          evented: false,
        });

        const shieldWidth = shield.width;
        const shieldHeight = shield.height;

        fabric.loadSVGFromString(svgString, (iconObjects, iconOptions) => {
          const icon = fabric.util.groupSVGElements(iconObjects, iconOptions);

          icon.set({
            scaleX: 1,
            scaleY: 1,
            left: shieldWidth / 2,
            top: shieldHeight / 2,
            clipPath: shield,
          });

          const group = new fabric.Group([shield, icon], {
            selectable: true,
            evented: true,
          });

          canvas.add(group);
          canvas.renderAll();
        });
      });
    }
  }, [shieldModalData]);

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
            {colors.length > 0 ? (
              colors?.map((color, index) => (
                <Input
                  key={index}
                  width="80px"
                  value={color}
                  type="color"
                  onChange={(e) => changeColor(e, index)}
                />
              ))
            ) : (
              <Input
                width="80px"
                value={bgColor}
                type="color"
                onChange={(e) => {
                  setBgColor(e.target.value);
                  canvas.setBackgroundColor(e.target.value);
                  canvas.renderAll();
                }}
              />
            )}
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
          <Flex gap="10px">
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
                <Button
                  onClick={toggleGrid}
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                >
                  Grid
                </Button>
                <Button
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => dispatch(toggleShapeModal({ open: true }))}
                >
                  Add Shapes & Icons
                </Button>
                <Button
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => dispatch(toggleReplaceModal({ open: true }))}
                >
                  Replace Symbol
                </Button>
                <Button
                  width="200px"
                  variant="solid"
                  colorScheme="blue"
                  onClick={() => dispatch(toggleShieldModal({ open: true }))}
                >
                  Apply Shield
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
