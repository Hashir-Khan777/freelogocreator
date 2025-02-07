import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShieldModal } from "../../store/reducers/modals.reducer";
import { useCallback } from "react";

const symbols = [
  `<svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="512.000000pt" height="512.000000pt" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
<g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
<path d="M2462 4885 c-399 -276 -832 -465 -1282 -559 -181 -39 -352 -56 -552 -56 l-176 0 -6 -27 c-18 -90 -28 -307 -22 -483 53 -1490 591 -2646 1521 -3264 190 -127 451 -261 567 -292 55 -14 26 -24 333 121 1036 489 1694 1603 1829 3095 30 331 30 672 0 821 l-5 27 -232 5 c-241 5 -338 17 -545 63 -409 91 -819 271 -1196 524 -75 49 -137 90 -138 90 -2 -1 -45 -30 -96 -65z m224 -526 c361 -215 788 -379 1203 -464 112 -23 328 -55 367 -55 13 0 15 -17 9 -127 -37 -771 -171 -1335 -444 -1868 -227 -445 -571 -818 -973 -1056 -64 -39 -156 -88 -203 -110 l-85 -40 -113 57 c-251 127 -436 262 -642 468 -205 206 -330 372 -473 632 -223 404 -382 939 -446 1494 -13 114 -35 434 -36 522 0 25 3 26 63 33 515 55 1107 258 1552 534 44 27 85 50 91 50 7 1 65 -31 130 -70z"/>
<path d="M2528 4030 c-53 -41 -198 -126 -318 -186 -281 -140 -559 -219 -814 -231 l-119 -6 6 -226 c12 -509 112 -956 302 -1348 172 -357 390 -614 680 -806 89 -58 274 -157 296 -157 17 0 201 95 275 143 407 261 705 696 870 1270 86 298 134 645 134 968 l0 156 -122 6 c-323 17 -711 152 -1051 368 -60 38 -110 69 -111 69 -2 0 -15 -9 -28 -20z"/>
</g>
</svg>`,
];

const ShieldModal = () => {
  const { isShieldModalOpen } = useSelector((store) => store.ModalsReducer);

  const dispatch = useDispatch();

  const onClose = useCallback(
    (obj) => dispatch(toggleShieldModal({ open: false, data: obj })),
    [dispatch]
  );

  return (
    <Modal isOpen={isShieldModalOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Shields</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="row">
            {symbols?.map((obj) => (
              <Box
                as="div"
                sx={{
                  "& > svg": {
                    height: "100px",
                  },
                }}
                className="col-lg-2 col-md-6"
                onClick={() => {
                  onClose(obj);
                }}
                dangerouslySetInnerHTML={{ __html: obj }}
              />
            ))}
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ShieldModal;
