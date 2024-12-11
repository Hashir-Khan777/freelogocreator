import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleGeneratePostModal } from "../../store/reducers/modals.reducer";
import { useCallback, useRef } from "react";
import { toPng } from "html-to-image";
import { showToast } from "../../store/reducers/toast.reducer";

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

  const saveImage = () => {
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
          <Button
            width={{ base: "100%", md: "32.33333%" }}
            mt="10px"
            float="right"
            variant="solid"
            colorScheme="blue"
            backgroundColor="blue"
            borderRadius={0}
            onClick={saveImage}
          >
            Save
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default GeneratePostModal;
