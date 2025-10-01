import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Box,
  Text,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleQRCodeModal } from "../../store/reducers/modals.reducer";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", scans: 400 },
  { name: "Feb", scans: 300 },
  { name: "Mar", scans: 200 },
  { name: "Apr", scans: 278 },
  { name: "May", scans: 189 },
  { name: "Jun", scans: 239 },
];

const QRCodeModal = () => {
  const { isQRCodeModalOpen, qrCodeModalData } = useSelector(
    (store) => store.ModalsReducer
  );
  const [windowHeight, setWindowHeight] = useState(0);

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

  useEffect(() => {
    if (window && window.innerHeight) {
      setWindowHeight(window.innerHeight);
    }
  }, [window]);

  console.log("qrCodeModalData", qrCodeModalData);

  return (
    <Modal isOpen={isQRCodeModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent mt={windowHeight / 2 - 200}>
        <ModalHeader>Download QR Code</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Image src={`data:image/png;base64,${qrCodeModalData?.image}`} />
          <Button
            mt={4}
            float="right"
            colorScheme="blue"
            onClick={() => {
              onClose();
              downloadBase64File(
                `data:image/png;base64,${qrCodeModalData?.image}`,
                `${qrCodeModalData?.note}.png`
              );
            }}
          >
            Download
          </Button>
          {/* <Box my={10}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="scans"
                  stroke="#8884d8"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box> */}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default QRCodeModal;
