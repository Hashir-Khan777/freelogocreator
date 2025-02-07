import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { toggleShapeModal } from "../../store/reducers/modals.reducer";
import { useCallback } from "react";

const shapesAndIcons = [
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 47 44"><path fill="url(&quot;#SvgjsLinearGradient1002&quot;)" d="M40.1 14.6c-1-.1-2.3-2.2-1.2-3.9.7-1.1 1.4-2.1.3-3.9-.8-1.4-1.7-1.2-2.7-.9-1.6.5-2.2-1.8-2.2-3.7 0-1-.5-1.9-2.3-1.9-1 0-1.5.8-2 1.7-.8 1.3-3.6 1.7-4.1.3-.5-1.4-3-1.5-4.7-.4-1.6 1.1-3.5.7-3.6.4-.2-.2-.3-.4-.4-.4-.1 0-.5-.9-1.5-1.2-.5-.2-1.1-.1-1.9.2-3 1.2-1.7 4-2.7 6.1-1.4 2.7-2.9-.3-5.5.4-1.9.5-3.3 2.8-3.3 5.2.1 2.2 3 4.7 2.7 6.3-.3 1.3-3.4-.6-4.6 3.2-.4 1.2-.2 2.3.1 3.7.6 2.9 2.1 1.7 3.3 2.9 1.4 1.5 1.6 3.1.2 4.9-2.8 3.9.5 6.7 4.3 6.1 2.1-.3 5.5-1.1 4.9.4-.3 1-1.1 2-.6 2.7 2.7 3 4.8-2 7.5-1.8h.3c.1 0 .4.2.7.4.2.2.5.3.6.4.1.1.4 1.1 1.3 1.6.5.3 1.1.5 1.8.5 1.4 0 3.5-.6 4.4-2 .3-.4.3-1.1.3-1.7.1-1 2.1-.2 4.2.1 2.9.4 5.6-1.4 4.3-5.6-.1-.3-.2-.5-.4-.7-.3-.4-.4-1 0-1.4.2-.2.5-.3.9-.2 3.9.8 6.7-.5 5.5-4-.6-1.8-4.5-2.6-1.5-3.6 1.1-.4 2.3-.8 3-2.3 1.7-3.4.5-8.6-3.8-8-.3.1-.9.2-1.6.1Z"></path><defs><linearGradient id="SvgjsLinearGradient1002"><stop stop-color="#f7f7f7" offset="0"></stop><stop stop-color="#83c3ff" offset="1"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 57 41"><path fill="url(&quot;#SvgjsLinearGradient1020&quot;)" d="M49.7 27.5c7.1 11.8-.9 16.6-10.8 8.6-5.4 4.2-14.9 4.2-20.3 0-9.9 8-17.8 3.2-10.8-8.6-9.6-3.8-9.6-10.5 0-14.3C.7 1.4 8.7-3.4 18.6 4.6 24 .4 33.5.4 38.9 4.6c9.9-8 17.8-3.2 10.8 8.6 9.6 3.8 9.6 10.5 0 14.3Z"></path><defs><linearGradient id="SvgjsLinearGradient1020"><stop stop-color="#c9ffbf" offset="0"></stop><stop stop-color="#fffccc" offset="1"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 55 58"><path fill="url(&quot;#SvgjsLinearGradient1004&quot;)" d="M19.9 20.1C21.1 18.9 16.4.7 16.4.7l5.3 11.7c3.5 7.1 5.9 6 7.7.9l3.7-9.7-.8 9.8c-.3 3.9.8 6.3 5.6 1.1L46.7 6l-7 10.6c-1.6 2.9-4.5 7.5 5 5.6l10.1-1.3-9 4.3c-5.5 1.6-7.1 4.1-1.8 6.1l9.5 4.9-10.7-1.4c-5.1-.9-2.1 1.7 3.8 8l7.3 7.9-10.3-7.6c-7.5-6.3-11.1-6.7-6.9 3.1l3 10.6-5.3-9c-2.8-4.7-5.2-10.4-7.3-1.2L24 58l1-15.3c.4-3.9-1.8-3.8-4.4-1l-8.9 8 5.9-9c4.3-6.5-.3-5.8-7-4.8L.3 37.1 9 33.8c7.6-2.5 7.8-3.8 4.2-5.8L2.9 23.9l7.7.7c3.9.3 8.5 1 1.7-5.8L1.1 7.7S18 22 19.9 20.1Z"></path><defs><linearGradient id="SvgjsLinearGradient1004"><stop stop-color="#f8f9d2" offset="0"></stop><stop stop-color="#e8dbfc" offset="1"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 59 62"><path fill="url(&quot;#SvgjsLinearGradient1016&quot;)" d="M18.6 40.1c-5 1-14.6.5-18.6-4 4.3 2.9 12.8.1 16.8-1.9C10.9 32.4 2.9 28.9 1 20.7c2.9 4.4 10.2 8.4 15.3 6.4-6.4-6-9.4-11.4-8.6-19 1 6 7.9 12.1 12.9 14.1-2-10.1-1.1-16.1 4.4-21.8-4.7 7.8-.9 15.2 2.1 19.3C30 12.3 34 7.6 41.8 3.6c-5.9 5-9.1 10.7-7.9 16.3 6.7-5.2 13.2-10.6 22.5-8.1-5.4-1.5-14.9 7.1-16.3 11.9 5.8-1.5 14.5-.9 18.4 4.1-4.5-1.7-12.4-1-16.4 2 6.7 1.3 9.7 4.2 15.1 12.2-4.7-5.8-14.8-8-18.3-6.3C42 38.8 50.6 44.6 49.4 55 47.9 46 39.1 42.7 36 40.9c1.2 6.2 2.2 13.9-3.1 21.2 3.1-6.3.6-13.7-2.7-18.7-1.7 7.2-5 13.1-12 16.1 4-4 4.8-9.6 5.8-15.6-7 4-13.1 7.7-21.6 5.9 7.1-.2 12.1-4.7 16.2-9.7Z"></path><defs><linearGradient id="SvgjsLinearGradient1016"><stop stop-color="#f5f7fa" offset="0"></stop><stop stop-color="#c3cfe2" offset="1"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 61 53"><path fill="url(&quot;#SvgjsLinearGradient1027&quot;)" d="M60.3 26.8 49.2 37.6l-3.8 15.1-15-4.3-15 4.3-3.8-15.1L.5 26.8l11.1-10.9 3.8-15 15 4.2 15-4.2 3.8 15 11.1 10.9Z"></path><defs><linearGradient id="SvgjsLinearGradient1027"><stop stop-color="#f6d365" offset="0"></stop><stop stop-color="#fda085" offset="1"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 200 200"><path fill="url(#paint0_linear_104_207)" fill-rule="evenodd" d="M100 100s12.5-33.474 12.5-57.143C112.5 19.187 106.904 0 100 0S87.5 19.188 87.5 42.857C87.5 66.527 100 100 100 100Zm0 0s33.474-12.5 57.143-12.5C180.812 87.5 200 93.096 200 100s-19.188 12.5-42.857 12.5c-23.648 0-57.081-12.477-57.143-12.5Zm0 0s-12.5 33.474-12.5 57.143C87.5 180.812 93.096 200 100 200s12.5-19.188 12.5-42.857c0-23.648-12.477-57.081-12.5-57.143Zm0 0s-33.474 12.5-57.143 12.5C19.187 112.5 0 106.904 0 100s19.188-12.5 42.857-12.5C66.527 87.5 100 100 100 100Z" clip-rule="evenodd"></path><defs><linearGradient id="paint0_linear_104_207" x1="100" x2="100" y1="0" y2="200" gradientUnits="userSpaceOnUse"><stop stop-color="#A7B5FF"></stop><stop offset="1" stop-color="#F3ACFF"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" fill="none" viewBox="0 0 200 200"><path fill="url(#paint0_linear_118_204)" d="M100 0c.014 36.893 44.613 55.367 70.711 29.29C144.633 55.386 163.107 99.985 200 100c-36.893.014-55.367 44.613-29.289 70.711C144.613 144.633 100.014 163.107 100 200c-.014-36.893-44.613-55.367-70.71-29.289C55.366 144.613 36.892 100.014 0 100c36.893-.014 55.367-44.613 29.29-70.71C55.386 55.366 99.985 36.892 100 0Z"></path><defs><linearGradient id="paint0_linear_118_204" x1="20.5" x2="100" y1="16" y2="200" gradientUnits="userSpaceOnUse"><stop stop-color="#ACAAFF"></stop><stop offset="1" stop-color="#C0E8FF"></stop></linearGradient></defs></svg>`,
  `<svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" width="200" height="200" x="0" y="0" version="1.1" viewBox="0 0 44.729 44.729"><path d="M1.732 30.985c1.218-9.961 6.295-13.156 10.841-15.987 4.642-2.892 8.657-5.425 8.174-14.942a22.223 22.223 0 0 0-6.191 1.348c.202 7.553-3.376 9.793-6.848 11.956C4.041 15.644.577 17.802.36 26.318c.29 1.621.751 3.186 1.372 4.667z" fill="url(&quot;#SvgjsLinearGradient1056&quot;)"></path><path d="M6.65 11.662c3.236-2.017 5.853-3.667 5.912-9.399C6.672 5.15 2.232 10.551.643 17.059c1.631-2.669 3.898-4.084 6.007-5.397zm.591 27.161c.788-10.616 5.446-14.321 9.963-17.908 4.907-3.896 9.544-7.588 9.283-20.54A22.41 22.41 0 0 0 22.743 0c.518 10.661-4.367 13.739-9.113 16.695-4.808 2.995-9.77 6.104-10.152 17.621a22.516 22.516 0 0 0 3.763 4.507zm23.951-11.672c4.482-3.597 8.71-7.021 8.484-18.957A22.541 22.541 0 0 0 35.54 4.29c-.063 13.04-5.132 17.116-10.045 21.058-4.624 3.711-8.989 7.222-9.309 18.515 1.844.53 3.783.831 5.787.867.527-10.573 4.938-14.142 9.219-17.579zm7.512 4.665c-3.21 1.956-5.994 3.671-6.318 10.549 6.155-3.093 10.692-8.941 11.984-15.92-1.442 2.794-3.629 4.13-5.666 5.371z" fill="url(&quot;#SvgjsLinearGradient1056&quot;)"></path><path d="M37.664 30.109c3.438-2.096 6.687-4.074 6.291-13.271l.103-.004a22.2 22.2 0 0 0-2.416-5.829c-.473 10.67-4.895 14.254-9.196 17.706-4.093 3.282-7.954 6.409-8.465 15.963a22.256 22.256 0 0 0 6.372-1.41c.122-8.774 3.94-11.101 7.311-13.155zm-13.419-6.321c4.915-3.943 9.559-7.678 9.287-20.806A22.273 22.273 0 0 0 28.499.848c.143 13.54-5.037 17.652-10.051 21.633-4.566 3.625-8.875 7.069-9.286 17.922a22.332 22.332 0 0 0 5.059 2.789c.494-11.725 5.332-15.639 10.024-19.404z" fill="url(&quot;#SvgjsLinearGradient1056&quot;)"></path><defs><linearGradient id="SvgjsLinearGradient1056"><stop stop-color="#d5dee7" offset="0"></stop><stop stop-color="#ffffff" offset="1"></stop></linearGradient></defs></svg>`,
];

const AddShapesIconsModal = () => {
  const { isShapesModalOpen } = useSelector((store) => store.ModalsReducer);

  const dispatch = useDispatch();

  const onClose = useCallback(
    (obj) => dispatch(toggleShapeModal({ open: false, data: obj })),
    [dispatch]
  );

  return (
    <Modal isOpen={isShapesModalOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Shapes & Icons</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="row">
            {shapesAndIcons?.map((obj) => (
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

export default AddShapesIconsModal;
