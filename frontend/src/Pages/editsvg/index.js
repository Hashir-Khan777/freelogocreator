import React, { useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import {
  Box,
  Button,
  Container,
  Flex,
  Icon,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Select,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleReplaceModal,
  toggleShapeModal,
  toggleShieldModal,
} from "../../store/reducers/modals.reducer";
import {
  MdOutlineAlignHorizontalCenter,
  MdOutlineAlignHorizontalLeft,
  MdOutlineAlignHorizontalRight,
  MdOutlineAlignVerticalBottom,
  MdOutlineAlignVerticalCenter,
  MdOutlineAlignVerticalTop,
} from "react-icons/md";
import {
  FiAlignCenter,
  FiAlignJustify,
  FiAlignLeft,
  FiAlignRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const canvasHeight = 2000;
const canvasWidth = 2000;

const fontSizes = [
  8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
];

const fonts = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];

let centerGuideLines = {
  vertical: null,
  horizontal: null,
};

const gridSize = 40.72;

const SVGCanvasEditor = () => {
  const [canvas, setCanvas] = useState(null);
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedFontSize, setSelectedFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [colors, setColors] = useState([]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [opacity, setOpacity] = useState(1);
  const [textAlignment, setTextAlignment] = useState("center");
  const [isBackDesigned, setIsBackDesigned] = useState(false);
  const [zoom, setZoom] = useState(0.5);

  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const svgString = localStorage.getItem("svg");
  const backSvgString = localStorage.getItem("backsvg");
  const user = JSON.parse(localStorage.getItem("user"));
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
    setSelectedFontSize(e);
    if (selectedObject) {
      selectedObject.map((obj) => {
        obj.set("fontSize", e);
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

        // activeSelection.center();
        // activeSelection.setCoords();

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
        textAlign: textAlignment,
        originX: "center",
        originY: "center",
        top: canvasHeight / 2,
        left: canvasWidth / 2,
      });
      canvas.add(text);

      canvas.setActiveObject(text);

      canvas.renderAll();
    }
  };

  const handleFontChange = (e) => {
    setFontFamily(e);
    if (selectedObject) {
      selectedObject.map((obj) => {
        obj.set("fontFamily", e);
      });
      canvas.renderAll();
    }
  };

  const saveImage = (type) => {
    if (canvas) {
      gridLinesRef.current.forEach((line) => (line.visible = false));
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.setZoom(1);
      const dataURL = canvas.toDataURL({
        format: type,
        quality: 1,
      });
      canvas.setZoom(zoom);

      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `logo.${type}`;
      link.click();
    }
    drawGrid(canvas);
  };

  const setCanvasZoom = (canvaszoom) => {
    setZoom(canvaszoom);
    if (canvas) {
      canvas.setZoom(canvaszoom);
      canvas.renderAll();
    }
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
          // group.center();
          // group.setCoords();
          // canvas.renderAll();

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
          // group.center();
          // group.setCoords();
          // canvas.renderAll();

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

  const draw = () => {
    canvas.isDrawingMode = !canvas.isDrawingMode;

    canvas.renderAll();
  };

  const updateCenterGuides = (canvas, target) => {
    const canvasCenterX = canvas.getWidth() / 2;
    const canvasCenterY = canvas.getHeight() / 2;
    const objectCenter = target.getCenterPoint();

    const tolerance = 5;

    const isCenteredX = Math.abs(objectCenter.x - canvasCenterX) < tolerance;
    const isCenteredY = Math.abs(objectCenter.y - canvasCenterY) < tolerance;

    if (isCenteredX) {
      if (!centerGuideLines.vertical) {
        centerGuideLines.vertical = new fabric.Line(
          [canvasCenterX, 0, canvasCenterX, canvas.getHeight()],
          {
            stroke: "red",
            selectable: false,
            evented: false,
            excludeFromExport: true,
          }
        );
        canvas.add(centerGuideLines.vertical);
      }
    } else if (centerGuideLines.vertical) {
      canvas.remove(centerGuideLines.vertical);
      centerGuideLines.vertical = null;
    }

    if (isCenteredY) {
      if (!centerGuideLines.horizontal) {
        centerGuideLines.horizontal = new fabric.Line(
          [0, canvasCenterY, canvas.getWidth(), canvasCenterY],
          {
            stroke: "red",
            selectable: false,
            evented: false,
            excludeFromExport: true,
          }
        );
        canvas.add(centerGuideLines.horizontal);
      }
    } else if (centerGuideLines.horizontal) {
      canvas.remove(centerGuideLines.horizontal);
      centerGuideLines.horizontal = null;
    }

    canvas.renderAll();
  };

  const clearCenterGuides = (canvas) => {
    if (centerGuideLines.vertical) {
      canvas.remove(centerGuideLines.vertical);
      centerGuideLines.vertical = null;
    }
    if (centerGuideLines.horizontal) {
      canvas.remove(centerGuideLines.horizontal);
      centerGuideLines.horizontal = null;
    }
    canvas.renderAll();
  };

  const canvasInitialization = (svg) => {
    if (canvas) {
      canvas.dispose();
    }
    if (canvasRef.current) {
      const initCanvas = new fabric.Canvas(canvasRef.current, {
        width: canvasWidth,
        height: canvasHeight,
        selection: true,
        preserveObjectStacking: true,
        backgroundColor: bgColor,
      });
      initCanvas.preserveObjectStacking = true;

      initCanvas.setZoom(zoom);

      initCanvas.renderAll();

      // initCanvas.sendToBack();

      drawGrid(initCanvas);

      // fabric.loadSVGFromString(svgString, (objects, options) => {
      //   if (objects && objects.length > 0) {
      //     objects.forEach((obj) => {
      //       initCanvas.add(obj);
      //     });
      //     initCanvas.renderAll();
      //   }
      // });

      fabric.loadSVGFromString(svg, (objects, options) => {
        if (objects && objects.length > 0) {
          const group = new fabric.Group(objects);

          group.set({
            left: initCanvas.width / 2,
            top: initCanvas.height / 2,
            originX: "center",
            originY: "center",
            scaleX: 4,
            scaleY: 4,
          });

          initCanvas.add(group);
          initCanvas.renderAll();

          setTimeout(() => {
            const items = group.getObjects();
            group._restoreObjectsState();
            initCanvas.remove(group);
            items.forEach((obj) => {
              initCanvas.add(obj);
            });

            initCanvas.renderAll();
          }, 0);
        }
      });

      saveState(initCanvas);

      initCanvas.on("object:added", () => saveState(initCanvas));
      initCanvas.on("object:modified", () => {
        clearCenterGuides(initCanvas);
        saveState(initCanvas);
      });
      initCanvas.on("object:removed", () => saveState(initCanvas));

      let svgColors = [];
      initCanvas.on("selection:created", (event) => {
        const objects = initCanvas.getObjects().filter((x) => x.selectable);
        setColors([]);
        svgColors = [];
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
          objects.forEach((obj) => {
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
        const objects = initCanvas.getObjects().filter((x) => x.selectable);
        if (event.selected.length > 0) {
          setSelectedObject(event.selected);
          objects.forEach((obj) => {
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

      initCanvas.on("object:moving", (e) => {
        const obj = e.target;
        const canvasCenterX = initCanvas.getWidth() / 2;
        const canvasCenterY = initCanvas.getHeight() / 2;

        const tolerance = 20;

        updateCenterGuides(initCanvas, obj);

        const objCenter = obj.getCenterPoint();

        if (Math.abs(objCenter.x - canvasCenterX) < tolerance) {
          obj.left = canvasCenterX - obj.getScaledWidth() / 2;
        }

        if (Math.abs(objCenter.y - canvasCenterY) < tolerance) {
          obj.top = canvasCenterY - obj.getScaledHeight() / 2;
        }
      });

      initCanvas.on("mouse:up", () => {
        clearCenterGuides(initCanvas);
      });

      document.addEventListener("keydown", (e) => handleKeyDown(e, initCanvas));

      setCanvas(() => initCanvas);
    }
  };

  const handleOpacityChange = (event) => {
    const newOpacity = event.target.value;
    setOpacity(newOpacity);

    if (canvas) {
      selectedObject.map((obj) => {
        obj.set({ opacity: newOpacity });
      });
      canvas.renderAll();
    }
  };

  function alignToObject(alignType) {
    if (canvas) {
      if (selectedObject?.length > 0) {
        if (selectedObject.length === 1) {
          selectedObject.map((target) => {
            if (alignType === "left") target.set({ left: 0 });
            if (alignType === "right")
              target.set({ left: canvas.width - target.width * target.scaleX });
            if (alignType === "center") target.centerH();
            if (alignType === "top") target.set({ top: 0 });
            if (alignType === "bottom")
              target.set({
                top: canvas.height - target.height * target.scaleY,
              });
            if (alignType === "middle") target.centerV();
            target.setCoords();
          });
          canvas.renderAll();
        } else if (selectedObject.length > 1) {
          let activeObject = canvas.getActiveObject();

          let objects = activeObject._objects;

          if (activeObject && activeObject.type === "activeSelection") {
            let minX = Math.min(...objects.map((obj) => obj.left));
            let maxX = Math.max(...objects.map((obj) => obj.left + obj.width));
            let minY = Math.min(...objects.map((obj) => obj.top));
            let maxY = Math.max(...objects.map((obj) => obj.top + obj.height));
            let centerX = (minX + maxX) / 2;
            let centerY = (minY + maxY) / 2;

            objects.forEach((obj) => {
              switch (alignType) {
                case "left":
                  obj.left = minX;
                  break;
                case "right":
                  obj.left = maxX - obj.width;
                  break;
                case "top":
                  obj.top = minY;
                  break;
                case "bottom":
                  obj.top = maxY - obj.height;
                  break;
                case "center":
                  obj.left = centerX - obj.width / 2;
                  break;
                case "middle":
                  obj.top = centerY - obj.height / 2;
                  break;
              }
              obj.setCoords();
            });

            canvas.renderAll();
          }
        }
      }
    }
  }

  const alignText = (alignment) => {
    if (selectedObject.length === 1) {
      const isText =
        selectedObject[0] instanceof fabric.Text ||
        selectedObject[0] instanceof fabric.IText ||
        selectedObject[0] instanceof fabric.Textbox;

      if (isText) {
        setTextAlignment(alignment);
        selectedObject[0].set({ textAlign: alignment });
        canvas.renderAll();
      }
    }
  };

  const group = () => {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const group = new fabric.Group([]);

      activeObjects.forEach((obj) => {
        obj.clone((cloned) => {
          group.addWithUpdate(cloned);
        });
      });

      group.set({
        left: canvas.width / 2,
        top: canvas.height / 2,
        originX: "center",
        originY: "center",
      });

      canvas.remove(...activeObjects);
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
    }
  };

  const ungroup = () => {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === "group") {
      const items = activeObject._objects;
      activeObject._restoreObjectsState();
      canvas.remove(activeObject);

      items.forEach((obj) => {
        canvas.add(obj);
      });

      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  useEffect(() => {
    canvasInitialization(svgString);
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
          // group.center();
          // group.setCoords();
          // canvas.renderAll();

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <main class="main">
      <div class="mb-70 mb-lg-50 mb-md-40 mb-sm-30"></div>
      <div class="post-loop-grid">
        <div class="container-fluid">
          <div class="row">
            <div class="col-lg-2 col-md-12 col-sm-12 col-12 pr-10 pr-lg-15 mt-lg-30">
              <div class="sidebar-shadow p-10">
                <h6 class="sidebar-title">Customize Option</h6>
                <div class="block-tags">
                  <button
                    onClick={toggleGrid}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Grid
                  </button>
                  {/* <a href="#" class="btn btn-tags-sm mb-10 mr-5">
                    Alignment
                  </a> */}
                  <button onClick={addText} class="btn btn-tags-sm mb-10 mr-5">
                    Add Text
                  </button>
                  <button onClick={draw} class="btn btn-tags-sm mb-10 mr-5">
                    Draw
                  </button>
                  <Menu>
                    <MenuButton as="div" className="btn btn-tags-sm mb-10 mr-5">
                      Font Family
                    </MenuButton>
                    <MenuList>
                      {fonts.map((size) => (
                        <MenuItem
                          as="option"
                          value={size}
                          onClick={() => handleFontChange(size)}
                        >
                          {size}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <Menu>
                    <MenuButton as="div" className="btn btn-tags-sm mb-10 mr-5">
                      Font Size
                    </MenuButton>
                    <MenuList>
                      {fontSizes.map((size) => (
                        <MenuItem
                          as="option"
                          value={size}
                          onClick={() => changeFontSize(size)}
                        >
                          {size}
                        </MenuItem>
                      ))}
                    </MenuList>
                  </Menu>
                  <button
                    onClick={() => undo(canvas)}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Undo
                  </button>
                  <button
                    onClick={() => redo(canvas)}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Redo
                  </button>
                  <button
                    onClick={() => canvasInitialization(svgString)}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Reset
                  </button>
                  <Popover>
                    <PopoverTrigger>
                      <div className="btn btn-tags-sm mb-10 mr-5">Opacity</div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={opacity}
                          onChange={handleOpacityChange}
                          style={{ padding: 0 }}
                        />
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger>
                      <div className="btn btn-tags-sm mb-10 mr-5">Align</div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Box>
                          <Box width="max-content" mx="auto">
                            <Icon
                              as={MdOutlineAlignHorizontalLeft}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("left")}
                            />
                            <Icon
                              as={MdOutlineAlignHorizontalCenter}
                              mx="20px"
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("center")}
                            />
                            <Icon
                              as={MdOutlineAlignHorizontalRight}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("right")}
                            />
                          </Box>
                          <Box mt="25px" width="max-content" mx="auto">
                            <Icon
                              as={MdOutlineAlignVerticalTop}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("top")}
                            />
                            <Icon
                              as={MdOutlineAlignVerticalCenter}
                              mx="20px"
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("middle")}
                            />
                            <Icon
                              as={MdOutlineAlignVerticalBottom}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignToObject("bottom")}
                            />
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger>
                      <div className="btn btn-tags-sm mb-10 mr-5">
                        Text Align
                      </div>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverBody>
                        <Box>
                          <Box width="max-content" mx="auto">
                            <Icon
                              as={FiAlignLeft}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignText("left")}
                            />
                            <Icon
                              as={FiAlignCenter}
                              mx="20px"
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignText("center")}
                            />
                            <Icon
                              as={FiAlignRight}
                              fontSize="30px"
                              cursor="pointer"
                              onClick={() => alignText("right")}
                            />
                            <Icon
                              as={FiAlignJustify}
                              fontSize="30px"
                              cursor="pointer"
                              ml="20px"
                              onClick={() => alignText("justify")}
                            />
                          </Box>
                        </Box>
                      </PopoverBody>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div class="col-lg-8">
              <div class="row">
                <div class="col-lg-12 mb-30">
                  <div
                    class="card-blog-1 wow animate__animated animate__fadeIn"
                    data-wow-delay=".0s"
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
                    <div
                      class="post-thumb mt-15"
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        overflow: "hidden",
                        width: "900px",
                        height: "900px",
                        margin: "0 auto",
                        borderRadius: 0,
                      }}
                    >
                      <Box
                        as="canvas"
                        ref={canvasRef}
                        position="relative"
                        margin="0 auto"
                      />
                    </div>
                    <div class="card-block-info">
                      <div class="card-2-bottom mt-30">
                        <div class="d-flex align-items-center justify-content-between">
                          <div>
                            {backSvgString ? (
                              <button
                                class="btn btn-border btn-brand-hover"
                                onClick={() => {
                                  if (isBackDesigned) {
                                    canvasInitialization(svgString);
                                  } else {
                                    canvasInitialization(backSvgString);
                                  }
                                  setIsBackDesigned(!isBackDesigned);
                                }}
                              >
                                Design {isBackDesigned ? "Front" : "Back"}
                              </button>
                            ) : null}
                          </div>
                          <div
                            className="d-flex align-items-center"
                            style={{ gap: "20px" }}
                          >
                            <input
                              type="range"
                              style={{ padding: 0, width: "200px" }}
                              min="0.10"
                              max="1"
                              step="0.10"
                              value={zoom}
                              onChange={(e) => setCanvasZoom(e.target.value)}
                            />
                            <p>({zoom * 100}%)</p>
                          </div>
                          <div class="keep-reading">
                            <Menu>
                              <MenuButton
                                mt="10px"
                                float="right"
                                variant="solid"
                                colorScheme="blue"
                              >
                                <button class="btn btn-border btn-brand-hover">
                                  Save Editing
                                </button>
                              </MenuButton>
                              <MenuList>
                                <MenuItem
                                  onClick={() => {
                                    if (user?.email) {
                                      saveImage("png");
                                    } else {
                                      navigate("/login");
                                    }
                                  }}
                                >
                                  Save As Png
                                </MenuItem>
                                <MenuItem
                                  onClick={() => {
                                    if (user?.email) {
                                      saveImage("jpeg");
                                    } else {
                                      navigate("/login");
                                    }
                                  }}
                                >
                                  Save As Jpeg
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-2 col-md-12 col-sm-12 col-12 pl-10 pl-lg-15 mt-lg-30">
              <div class="sidebar-shadow p-10">
                <h6 class="sidebar-title">Advanced Option</h6>
                <div class="block-tags">
                  <button
                    onClick={sendToBack}
                    href="#"
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Send to Back
                  </button>
                  <button
                    onClick={bringToFront}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Bring to Front
                  </button>
                  <button
                    onClick={() => dispatch(toggleShapeModal({ open: true }))}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Add Shapes & Icons
                  </button>
                  <button
                    onClick={() => dispatch(toggleReplaceModal({ open: true }))}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Replace symbol
                  </button>
                  <button
                    onClick={() => dispatch(toggleShieldModal({ open: true }))}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Apply shield
                  </button>
                  <button
                    onClick={() => group()}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Group
                  </button>
                  <button
                    onClick={() => ungroup()}
                    class="btn btn-tags-sm mb-10 mr-5"
                  >
                    Un Group
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    // <Container flex={1} maxWidth="1216px" my="20px">
    //   <Flex justifyContent="center" alignItems="center" height="100vh">
    //     <Box>
    //       <Flex
    //         mb="10px"
    //         justifyContent="space-between"
    //         alignItems="center"
    //         gap="10px"
    //       >
    //         {colors.length > 0 ? (
    //           colors?.map((color, index) => (
    //             <Input
    //               key={index}
    //               width="80px"
    //               value={color}
    //               type="color"
    //               onChange={(e) => changeColor(e, index)}
    //             />
    //           ))
    //         ) : (
    //           <Input
    //             width="80px"
    //             value={bgColor}
    //             type="color"
    //             onChange={(e) => {
    //               setBgColor(e.target.value);
    //               canvas.setBackgroundColor(e.target.value);
    //               canvas.renderAll();
    //             }}
    //           />
    //         )}
    //         <Button
    //           onClick={addText}
    //           width="200px"
    //           variant="solid"
    //           colorScheme="blue"
    //         >
    //           Add Text
    //         </Button>
    //         <Select
    //           width="200px"
    //           value={selectedFontSize}
    //           onChange={changeFontSize}
    //         >
    //           {fontSizes.map((size) => (
    //             <Box as="option" value={size}>
    //               {size}
    //             </Box>
    //           ))}
    //         </Select>
    //         <Select
    //           width="200px"
    //           value={fontFamily}
    //           onChange={handleFontChange}
    //         >
    //           {fonts.map((font) => (
    //             <Box as="option" value={font}>
    //               {font}
    //             </Box>
    //           ))}
    //         </Select>
    //         <Button
    //           onClick={canvasInitialization}
    //           width="200px"
    //           variant="solid"
    //           colorScheme="blue"
    //         >
    //           Reset
    //         </Button>
    //       </Flex>
    //       <Flex gap="10px">
    //         <Box>
    //           <Box as="canvas" ref={canvasRef} position="relative" />
    //         </Box>
    //         <Flex flexDirection="column" justifyContent="space-between">
    //           <Flex flexDirection="column" gap={3}>
    //             <Button
    //               onClick={sendToBack}
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //             >
    //               Send To Back
    //             </Button>
    //             <Button
    //               onClick={bringToFront}
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //             >
    //               Bring To Front
    //             </Button>
    //             <Button
    //               onClick={toggleGrid}
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //             >
    //               Grid
    //             </Button>
    //             <Button
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //               onClick={() => dispatch(toggleShapeModal({ open: true }))}
    //             >
    //               Add Shapes & Icons
    //             </Button>
    //             <Button
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //               onClick={() => dispatch(toggleReplaceModal({ open: true }))}
    //             >
    //               Replace Symbol
    //             </Button>
    //             <Button
    //               width="200px"
    //               variant="solid"
    //               colorScheme="blue"
    //               onClick={() => dispatch(toggleShieldModal({ open: true }))}
    //             >
    //               Apply Shield
    //             </Button>
    //           </Flex>
    //           <Menu>
    //             <MenuButton
    //               as={Button}
    //               mt="10px"
    //               float="right"
    //               variant="solid"
    //               colorScheme="blue"
    //             >
    //               Save
    //             </MenuButton>
    //             <MenuList>
    //               <MenuItem onClick={() => saveImage("png")}>
    //                 Save As Png
    //               </MenuItem>
    //               <MenuItem onClick={() => saveImage("jpeg")}>
    //                 Save As Jpeg
    //               </MenuItem>
    //             </MenuList>
    //           </Menu>
    //         </Flex>
    //       </Flex>
    //     </Box>
    //   </Flex>
    // </Container>
  );
};

export default SVGCanvasEditor;
