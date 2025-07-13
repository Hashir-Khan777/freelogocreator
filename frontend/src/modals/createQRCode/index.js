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
import { useNavigate } from "react-router-dom";
import { updateUser } from "../../store/actions/auth.action";

const CreateQRCode = () => {
  const [inputValue, setInputValue] = useState("");
  const [color, setColor] = useState("#000000");
  const [image, setImage] = useState("");
  const [note, setNote] = useState("");

  const { isCraeteQRCodeModalOpen, createQRCodeModalData } = useSelector(
    (store) => store.ModalsReducer
  );
  const { data } = useSelector((x) => x.AuthReducer);
  const { subscription } = useSelector((x) => x.SubscriptionReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClose = useCallback(
    () => dispatch(toggleCreateQRCodeModal({ open: false })),
    [dispatch]
  );

  const generate = () => {
    if (createQRCodeModalData) {
      dispatch(
        updateQRCode({
          data: {
            ...createQRCodeModalData,
            text: inputValue,
            color: color,
            logo: image,
            note: note,
            user_id: data.id,
          },
          message: true,
        })
      );
    } else {
      if (
        subscription?.package?.qrlimit > 0 &&
        data?.createdqrcodes < subscription?.package?.qrlimit
      ) {
        if (inputValue) {
          dispatch(
            generateQRCode({
              text: inputValue,
              color: color,
              logo: image,
              note: note,
              user_id: data.id,
            })
          );
          setInputValue("");
          setNote("");
          dispatch(
            updateUser({ ...data, createdqrcodes: data?.createdqrcodes + 1 })
          );
        }
      } else {
        navigate("/#packages");
      }
    }
  };

  useEffect(() => {
    if (createQRCodeModalData) {
      setInputValue(() => createQRCodeModalData?.text);
      setColor(() => createQRCodeModalData?.color);
      setNote(() => createQRCodeModalData?.note);
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
          <FormControl mt="20px">
            <FormLabel>Note</FormLabel>
            <Input
              placeholder="Enter Note..."
              value={note}
              defaultValue={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </FormControl>
          {!createQRCodeModalData ? (
            <>
              <FormControl my="20px">
                <FormLabel>Color</FormLabel>
                <Input
                  placeholder="Select Color..."
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Logo</FormLabel>
                <Input
                  placeholder="Select Logo..."
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImage(reader.result);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </FormControl>
            </>
          ) : null}
          <Button mt={4} float="right" colorScheme="blue" onClick={generate}>
            {createQRCodeModalData ? "Update" : "Generate"}
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CreateQRCode;
