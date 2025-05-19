import { Container, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getQRCodeById, updateQRCode } from "../../store/actions/qrcode.action";
import { useParams } from "react-router-dom";

const QRData = () => {
  const { qrcode } = useSelector((state) => state.QrcodeReducer);

  const dispatch = useDispatch();

  const { id } = useParams();

  const redirectIfURL = (value) => {
    const url = new URL(value);
    window.location.href = url.href;
  };

  useEffect(() => {
    dispatch(getQRCodeById({ id }));
  }, [dispatch]);

  useEffect(() => {
    if (!sessionStorage?.getItem("scanned")) {
      if (qrcode?.text) {
        dispatch(
          updateQRCode({
            data: { ...qrcode, scans: qrcode?.scans + 1 },
            message: false,
          })
        );
        sessionStorage.setItem("scanned", true);
        redirectIfURL(qrcode?.text);
      }
    }
  }, [dispatch, qrcode]);

  return (
    <main className="main">
      <section className="section-box mt-100 mb-100">
        <Container maxWidth="1600px" mx="auto">
          {qrcode ? (
            !qrcode?.deleted ? (
              <Text fontSize="25px">{qrcode?.text}</Text>
            ) : null
          ) : null}
        </Container>
      </section>
    </main>
  );
};

export default QRData;
