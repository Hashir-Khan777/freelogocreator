import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleGeneratePostModal } from "../../store/reducers/modals.reducer";
import { useCallback, useRef } from "react";
import { toJpeg, toPng } from "html-to-image";
import { showToast } from "../../store/reducers/toast.reducer";
import { Link } from "react-router-dom";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const GeneratePostModal = () => {
  const { isGeneratePostModalOpen, generatePostModalData } = useSelector(
    (store) => store.ModalsReducer
  );

  const dispatch = useDispatch();
  const imageRef = useRef(null);

  const onClose = useCallback(
    () => dispatch(toggleGeneratePostModal({ open: false })),
    [dispatch]
  );

  const savePngImage = () => {
    if (imageRef.current) {
      toPng(imageRef.current, { quality: 1, pixelRatio: 6 })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `logo.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          dispatch(
            showToast({
              type: "error",
              message: error,
            })
          );
        });
    }
  };

  const saveJpegImage = () => {
    if (imageRef.current) {
      toJpeg(imageRef.current, { quality: 1, pixelRatio: 6 })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = `logo.jpeg`;
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          dispatch(
            showToast({
              type: "error",
              message: error,
            })
          );
        });
    }
  };

  const savePdfImage = async () => {
    if (imageRef.current) {
      const element = imageRef.current;
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("logo.pdf");
    }
  };

  return (
    <Modal isOpen={isGeneratePostModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download Or Customize Logo</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box
            ref={imageRef}
            dangerouslySetInnerHTML={{ __html: generatePostModalData?.logo }}
          />
          <Menu>
            <MenuButton
              as={Button}
              width={{ base: "100%", md: "32.33333%" }}
              mt="10px"
              float="right"
              variant="solid"
              colorScheme="blue"
              borderRadius={0}
            >
              Save
            </MenuButton>
            <MenuList>
              <MenuItem onClick={savePngImage}>Save As Png</MenuItem>
              <MenuItem onClick={saveJpegImage}>Save As Jpeg</MenuItem>
              <MenuItem onClick={savePdfImage}>Save As PDF</MenuItem>
            </MenuList>
          </Menu>
          <Button
            to="/edit"
            onClick={() => {
              localStorage.setItem("svg", generatePostModalData?.logo);
              onClose();
            }}
            as={Link}
            width={{ base: "100%", md: "32.33333%" }}
            mt="10px"
            mr="10px"
            float="right"
            variant="solid"
            colorScheme="blue"
            borderRadius={0}
          >
            Customize
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GeneratePostModal;
