import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import {
  generateQRCode,
  updateQRCode,
} from "../../store/actions/qrcode.action";
import { toggleCreateQRCodeModal } from "../../store/reducers/modals.reducer";
import { useCallback, useEffect, useState } from "react";

const CreateQRCode = () => {
  const [inputValue, setInputValue] = useState("");

  const { isCraeteQRCodeModalOpen, createQRCodeModalData } = useSelector(
    (store) => store.ModalsReducer
  );

  const dispatch = useDispatch();

  const onClose = useCallback(
    (obj) => dispatch(toggleCreateQRCodeModal({ open: false })),
    [dispatch]
  );

  const generate = () => {
    if (createQRCodeModalData) {
      dispatch(
        updateQRCode({
          data: { ...createQRCodeModalData, text: inputValue },
          message: true,
        })
      );
    } else {
      if (inputValue) {
        dispatch(generateQRCode({ text: inputValue }));
        setInputValue("");
      }
    }
  };

  useEffect(() => {
    if (createQRCodeModalData) {
      setInputValue(() => createQRCodeModalData?.text);
    }
  }, [createQRCodeModalData]);

  return (
    <Modal isOpen={isCraeteQRCodeModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {createQRCodeModalData ? "Update" : "Generate"} QR Code
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isRequired>
            <FormLabel>Value</FormLabel>
            <Input
              placeholder="Enter Value..."
              value={inputValue}
              defaultValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </FormControl>
          <Button mt={4} float="right" colorScheme="blue" onClick={generate}>
            {createQRCodeModalData ? "Update" : "Generate"}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateQRCode;
