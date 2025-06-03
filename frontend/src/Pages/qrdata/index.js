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
        if (
          qrcode?.text.startsWith("http://") ||
          qrcode?.text.startsWith("https://")
        ) {
          redirectIfURL(qrcode?.text);
        }
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
            ) : (
              <main className="main bg-purple">
                <div className="stars">
                  <div className="central-body">
                    <h1 className="text-center text-white display-1">404</h1>
                    <h5 className="text-white">Look like you're lost</h5>
                    <p className="text-white">
                      the page you are looking for not avaible!
                    </p>
                    <a href="#" className="btn-go-home">
                      GO BACK HOME
                    </a>
                  </div>
                  <div className="objects">
                    <img
                      className="object_rocket"
                      src="http://salehriaz.com/404Page/img/rocket.svg"
                      width="40px"
                    />
                    <div className="earth-moon">
                      <img
                        className="object_earth"
                        src="http://salehriaz.com/404Page/img/earth.svg"
                        width="100px"
                      />
                      <img
                        className="object_moon"
                        src="http://salehriaz.com/404Page/img/moon.svg"
                        width="80px"
                      />
                    </div>
                    <div className="box_astronaut">
                      <img
                        className="object_astronaut"
                        src="http://salehriaz.com/404Page/img/astronaut.svg"
                        width="140px"
                      />
                    </div>
                  </div>
                  <div className="glowing_stars">
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                    <div className="star" />
                  </div>
                </div>
              </main>
            )
          ) : (
            <main className="main bg-purple">
              <div className="stars">
                <div className="central-body">
                  <h1 className="text-center text-white display-1">404</h1>
                  <h5 className="text-white">Look like you're lost</h5>
                  <p className="text-white">
                    the page you are looking for not avaible!
                  </p>
                  <a href="#" className="btn-go-home">
                    GO BACK HOME
                  </a>
                </div>
                <div className="objects">
                  <img
                    className="object_rocket"
                    src="http://salehriaz.com/404Page/img/rocket.svg"
                    width="40px"
                  />
                  <div className="earth-moon">
                    <img
                      className="object_earth"
                      src="http://salehriaz.com/404Page/img/earth.svg"
                      width="100px"
                    />
                    <img
                      className="object_moon"
                      src="http://salehriaz.com/404Page/img/moon.svg"
                      width="80px"
                    />
                  </div>
                  <div className="box_astronaut">
                    <img
                      className="object_astronaut"
                      src="http://salehriaz.com/404Page/img/astronaut.svg"
                      width="140px"
                    />
                  </div>
                </div>
                <div className="glowing_stars">
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                  <div className="star" />
                </div>
              </div>
            </main>
          )}
        </Container>
      </section>
    </main>
  );
};

export default QRData;
