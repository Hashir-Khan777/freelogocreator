import {
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleCreateQRCodeModal,
  toggleQRCodeModal,
} from "../../store/reducers/modals.reducer";
import { deleteQRCode, getAllQRCodes } from "../../store/actions/qrcode.action";
import { FaRegEye } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDelete } from "react-icons/md";
import { AiOutlineCloseCircle } from "react-icons/ai";

const QRCode = () => {
  const [deleteShow, setDeleteShow] = useState(false);
  const [id, setId] = useState(null);

  const { qrcodes } = useSelector((state) => state.QrcodeReducer);
  const { data } = useSelector((x) => x.AuthReducer);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));

  const deleteQR = () => {
    dispatch(deleteQRCode({ id }));
    setId(null);
    setDeleteShow(false);
  };

  useEffect(() => {
    if (data?.id) {
      dispatch(getAllQRCodes({ user: data?.id }));
    } else {
      navigate("/login");
    }
  }, [dispatch, data]);

  return (
    <main className="main">
      <section className="section-box mt-30 mb-30">
        <Container maxWidth="1600px" mx="auto">
          <Flex justifyContent="space-between" alignItems="center" mb="50px">
            <Heading>QR Codes</Heading>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (!user?.id) {
                  navigate("/login", { replace: true });
                } else {
                  dispatch(toggleCreateQRCodeModal({ open: true }));
                }
              }}
            >
              Create
            </Button>
          </Flex>
          {qrcodes?.filter((x) => !x.deleted)?.length > 0 ? (
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Id</Th>
                    <Th>QR code</Th>
                    <Th>value</Th>
                    <Th>Note</Th>
                    <Th>scans</Th>
                    <Th>actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {qrcodes
                    ?.filter((x) => !x.deleted)
                    ?.map((code) => (
                      <Tr>
                        <Td verticalAlign="middle">{code?.id}</Td>
                        <Td>
                          <Image
                            width="50px"
                            src={`data:image/png;base64,${code?.image}`}
                          />
                        </Td>
                        <Td verticalAlign="middle">{code?.text}</Td>
                        <Td verticalAlign="middle">{code?.note}</Td>
                        <Td verticalAlign="middle">{code?.scans}</Td>
                        <Td verticalAlign="middle">
                          <Icon
                            as={FaRegEye}
                            fontSize="20px"
                            cursor="pointer"
                            onClick={() =>
                              dispatch(
                                toggleQRCodeModal({
                                  open: true,
                                  data: { data: code?.image },
                                })
                              )
                            }
                          />
                          <Icon
                            mx="10px"
                            as={HiOutlinePencilSquare}
                            fontSize="20px"
                            cursor="pointer"
                            onClick={() =>
                              dispatch(
                                toggleCreateQRCodeModal({
                                  open: true,
                                  data: code,
                                })
                              )
                            }
                          />
                          <Icon
                            as={MdDelete}
                            fontSize="20px"
                            cursor="pointer"
                            onClick={() => {
                              setDeleteShow(true);
                              setId(code?.id);
                            }}
                          />
                        </Td>
                      </Tr>
                    ))}
                </Tbody>
              </Table>
            </TableContainer>
          ) : null}
        </Container>
      </section>
      <Modal isOpen={deleteShow} onClose={() => setDeleteShow(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Center flexDirection="column">
              <Icon as={AiOutlineCloseCircle} fontSize={80} color="red.300" />
              <Text fontSize={30} fontWeight="semibold">
                Are you sure?
              </Text>
              <Text mt={5} fontSize={16}>
                Do you want to delete this?
              </Text>
              <Flex width="100%" mt={4}>
                <Button
                  variant="solid"
                  colorScheme="blue.primary"
                  backgroundColor="gray"
                  borderRadius={0}
                  mr={2}
                  width={{ base: "100%", sm: "50%" }}
                  fontSize={14}
                  onClick={() => setDeleteShow(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="solid"
                  colorScheme="red"
                  width={{ base: "100%", sm: "50%" }}
                  borderRadius={0}
                  fontSize={14}
                  onClick={deleteQR}
                >
                  Delete
                </Button>
              </Flex>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    </main>
  );
};

export default QRCode;
