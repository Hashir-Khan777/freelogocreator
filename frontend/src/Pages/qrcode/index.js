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
        <main className="main">
          <section className="section-box">
            <div className="container">
              <div className="row flex-row-reverse">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
                  <div className="content-page">
                    <div class="box-filters-job mt-15 mb-10">
                      <div class="row">
                        <div class="col-lg-7">
                          <Heading>QR Codes</Heading>
                        </div>
                        <div class="col-lg-5 text-lg-end mt-sm-15">
                          <Button
                            colorScheme="blue"
                            onClick={() => {
                              if (!user?.id) {
                                navigate("/login", { replace: true });
                              } else {
                                dispatch(
                                  toggleCreateQRCodeModal({ open: true })
                                );
                              }
                            }}
                          >
                            Create
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="job-list-list mb-15">
                      <div className="list-recent-jobs">
                        {qrcodes
                          ?.filter((x) => !x.deleted)
                          ?.map((code) => (
                            <div className="card-job hover-up wow animate__animated animate__fadeIn">
                              <div className="card-job-top">
                                <div className="card-job-top--image">
                                  <figure>
                                    <img
                                      alt="logomaker"
                                      src={`data:image/png;base64,${code?.image}`}
                                    />
                                  </figure>
                                </div>
                                <div className="card-job-top--info">
                                  <h6 className="card-job-top--info-heading">
                                    {code?.note}
                                  </h6>
                                </div>
                                <div className="row">
                                  <div className="col-lg-7">
                                    <span className="card-job-top--post-time text-sm">
                                      <i className="fi-rr-clock" />{" "}
                                      {code?.scans} Scans
                                    </span>
                                  </div>
                                  <div class="col-lg-3 col-sm-4 col-12 text-lg-end d-lg-block d-none">
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
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-with-bg">
                    <h5 className="font-semibold mb-10">Set job reminder</h5>
                    <p className="text-body-999">
                      Enter you email address and get job notification.
                    </p>
                    <div className="box-email-reminder">
                      <form>
                        <div className="form-group mt-15">
                          <input
                            type="text"
                            className="form-control input-bg-white form-icons"
                            placeholder="Enter email address"
                          />
                          <i className="fi-rr-envelope" />
                        </div>
                        <div className="form-group mt-25 mb-5">
                          <button className="btn btn-default btn-md">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="sidebar-with-bg background-primary bg-sidebar pb-80">
                    <h5 className="medium-heading text-white mb-20 mt-20">
                      Recruiting?
                    </h5>
                    <p className="text-body-999 text-white mb-30">
                      Advertise your jobs to millions of monthly users and
                      search 16.8 million CVs in our database.
                    </p>
                    <a
                      href="job-grid-2.html"
                      className="btn btn-border icon-chevron-right btn-white-sm"
                    >
                      Create a QrCode
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="section-box">
            <div className="container">
              <ul className="list-partners">
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay="0s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/samsung.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".1s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/google.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".2s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/facebook.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".3s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/pinterest.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".4s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/avaya.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".5s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/forbes.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".1s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/avis.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".2s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/nielsen.svg"
                      />
                    </figure>
                  </a>
                </li>
                <li
                  className="wow animate__animated animate__fadeInUp hover-up"
                  data-wow-delay=".3s"
                >
                  <a href="#">
                    <figure>
                      <img
                        alt="logomaker"
                        src="assets/imgs/jobs/logos/doordash.svg"
                      />
                    </figure>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <section className="section-box mt-50 mb-60">
            <div className="container">
              <div className="box-newsletter">
                <h5 className="text-md-newsletter">Sign up to get</h5>
                <h6 className="text-lg-newsletter">the latest jobs</h6>
                <div className="box-form-newsletter mt-30">
                  <form className="form-newsletter">
                    <input
                      type="text"
                      className="input-newsletter"
                      defaultValue=""
                      placeholder="contact.logomaker@gmail.com"
                    />
                    <button className="btn btn-default font-heading icon-send-letter">
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
              <div className="box-newsletter-bottom">
                <div className="newsletter-bottom" />
              </div>
            </div>
          </section>
        </main>
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
