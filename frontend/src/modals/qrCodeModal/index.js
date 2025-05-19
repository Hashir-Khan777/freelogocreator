import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleQRCodeModal } from "../../store/reducers/modals.reducer";

const QRCodeModal = () => {
  const { isQRCodeModalOpen, qrCodeModalData } = useSelector(
    (store) => store.ModalsReducer
  );

  const dispatch = useDispatch();

  const onClose = useCallback(
    (obj) => dispatch(toggleQRCodeModal({ open: false, data: obj })),
    [dispatch]
  );

  const downloadBase64File = (base64Data, fileName) => {
    const link = document.createElement("a");
    link.href = base64Data;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal isOpen={isQRCodeModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Download QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image
            src={`data:image/png;base64,${
              qrCodeModalData?.data || qrCodeModalData?.image
            }`}
          />
          <Button
            mt={4}
            float="right"
            colorScheme="blue"
            onClick={() => {
              onClose();
              downloadBase64File(
                `data:image/png;base64,${
                  qrCodeModalData?.data || qrCodeModalData?.image
                }`,
                "qrcode.png"
              );
            }}
          >
            Download
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QRCodeModal;
