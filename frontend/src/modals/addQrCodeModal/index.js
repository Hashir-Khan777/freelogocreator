import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Image,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAddQRCodeModal } from "../../store/reducers/modals.reducer";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQRCodes } from "../../store/actions/qrcode.action";

const AddQRCode = () => {
  const { isAddQRCodeModalOpen } = useSelector((store) => store.ModalsReducer);
  const { qrcodes } = useSelector((state) => state.QrcodeReducer);
  const { data } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onClose = useCallback(
    (obj) => dispatch(toggleAddQRCodeModal({ open: false, data: obj })),
    [dispatch]
  );

  useEffect(() => {
    if (data?.id) {
      dispatch(getAllQRCodes({ user: data?.id }));
    }
  }, [dispatch, data]);

  return (
    <Modal isOpen={isAddQRCodeModalOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add QR Codes</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="row">
            {qrcodes
              ?.filter((x) => !x?.deleted)
              ?.map((code) => (
                <Box
                  as="div"
                  className="col-lg-2 col-md-6"
                  cursor="pointer"
                  onClick={() =>
                    onClose(`data:image/png;base64,${code?.image}`)
                  }
                >
                  <Image src={`data:image/png;base64,${code?.image}`} />
                  <Text textAlign="center" fontSize="20px" fontWeight={500}>
                    {code?.note}
                  </Text>
                </Box>
              ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AddQRCode;
