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
import { toggleReplaceModal } from "../../store/reducers/modals.reducer";
import { useCallback } from "react";

const symbols = [
  `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 80.3 80.3" style="enable-background:new 0 0 80.3 80.3" xml:space="preserve"><style>.st2{fill:#55ab99}.st4{fill:#fff}.st5{fill:#ed6b5a}.st6{fill:#0c2c48}.st7{fill:#f1cc4b}.st21{fill:#f6a09c}</style><circle class="st21" cx="40.2" cy="40.2" r="40.2"/><path class="st4" d="M67.7 56.2c0 .7-.5 1.2-1.2 1.2H13.8c-.7 0-1.2-.5-1.2-1.2V17.4c0-.7.5-1.2 1.2-1.2h52.8c.7 0 1.2.5 1.2 1.2v38.8z"/><path style="fill:#bababa" d="M29.8 56.3h20.7v7H29.8z"/><path class="st6" d="M15.5 18.6h49.3v30.5H15.5z"/><path class="st4" d="M12.6 48.1v8.1c0 .7.5 1.2 1.2 1.2h52.8c.7 0 1.2-.5 1.2-1.2v-8.1H12.6zM55.7 68.1v-2.2c0-1.7-1.3-3-3-3h-25c-1.7 0-3 1.3-3 3v2.2h31z"/><circle class="st6" cx="40.2" cy="52.5" r="1.5"/><g><path class="st7" d="M55.1 32.1H43.6V20.6h7.7l3.8 3.5z"/><path style="fill:#fff3c9" d="M55.1 24.1h-3.8v-3.5z"/><path class="st2" d="M45.3 23.2h5.5v1h-5.5zM45.3 25.9h8.1v1h-8.1zM45.3 28.6h8.1v1h-8.1z"/><g><path class="st5" d="M38.4 46.5H26.9V35.1h7.7l3.8 3.5z"/><path class="st21" d="M38.4 38.6h-3.8v-3.5zM28.6 37.7h5.5v1h-5.5zM28.6 40.4h8.1v1h-8.1zM28.6 43h8.1v1h-8.1z"/></g><g><path class="st5" d="M29.3 33.9h-1v-9c0-1.4 1.1-2.5 2.5-2.5h9.1v1h-9.1c-.8 0-1.5.7-1.5 1.5v9z"/><path class="st5" d="m39.6 25.2 2.4-2.3-2.4-2.3z"/></g><g><path class="st7" d="M52.5 33.4h1v8.8c0 1.4-1.1 2.5-2.5 2.5h-9.1v-1H51c.8 0 1.5-.7 1.5-1.5v-8.8z"/><path class="st7" d="m42.3 41.9-2.5 2.3 2.5 2.3z"/></g></g></svg>`,
  `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 80.3 80.3" style="enable-background:new 0 0 80.3 80.3" xml:space="preserve"><style>.st2{fill:#55ab99}.st4{fill:#fff}.st5{fill:#ed6b5a}.st6{fill:#0c2c48}.st7{fill:#f1cc4b}.st21{fill:#f6a09c}</style><circle class="st21" cx="40.2" cy="40.2" r="40.2"/><path class="st4" d="M67.7 56.2c0 .7-.5 1.2-1.2 1.2H13.8c-.7 0-1.2-.5-1.2-1.2V17.4c0-.7.5-1.2 1.2-1.2h52.8c.7 0 1.2.5 1.2 1.2v38.8z"/><path style="fill:#bababa" d="M29.8 56.3h20.7v7H29.8z"/><path class="st6" d="M15.5 18.6h49.3v30.5H15.5z"/><path class="st4" d="M12.6 48.1v8.1c0 .7.5 1.2 1.2 1.2h52.8c.7 0 1.2-.5 1.2-1.2v-8.1H12.6zM55.7 68.1v-2.2c0-1.7-1.3-3-3-3h-25c-1.7 0-3 1.3-3 3v2.2h31z"/><circle class="st6" cx="40.2" cy="52.5" r="1.5"/><g><path class="st7" d="M55.1 32.1H43.6V20.6h7.7l3.8 3.5z"/><path style="fill:#fff3c9" d="M55.1 24.1h-3.8v-3.5z"/><path class="st2" d="M45.3 23.2h5.5v1h-5.5zM45.3 25.9h8.1v1h-8.1zM45.3 28.6h8.1v1h-8.1z"/><g><path class="st5" d="M38.4 46.5H26.9V35.1h7.7l3.8 3.5z"/><path class="st21" d="M38.4 38.6h-3.8v-3.5zM28.6 37.7h5.5v1h-5.5zM28.6 40.4h8.1v1h-8.1zM28.6 43h8.1v1h-8.1z"/></g><g><path class="st5" d="M29.3 33.9h-1v-9c0-1.4 1.1-2.5 2.5-2.5h9.1v1h-9.1c-.8 0-1.5.7-1.5 1.5v9z"/><path class="st5" d="m39.6 25.2 2.4-2.3-2.4-2.3z"/></g><g><path class="st7" d="M52.5 33.4h1v8.8c0 1.4-1.1 2.5-2.5 2.5h-9.1v-1H51c.8 0 1.5-.7 1.5-1.5v-8.8z"/><path class="st7" d="m42.3 41.9-2.5 2.3 2.5 2.3z"/></g></g></svg>`,
  `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 80.3 80.3" style="enable-background:new 0 0 80.3 80.3" xml:space="preserve"><style>.st4{fill:#fff}.st7{fill:#f1cc4b}.st10{fill:#50646f}</style><circle class="st10" cx="40.2" cy="40.2" r="40.2"/><path d="M63.5 45c0 .6-.5 1-1 1H17.8c-.6 0-1-.5-1-1V10c0-.6.5-1 1-1h44.6c.6 0 1 .5 1 1v35z" style="fill:#55ab99"/><path class="st4" d="M19.1 13.7h42.1V40H19.1z"/><path class="st10" d="M36.8 11.2h6.8v1.2h-6.8z"/><g><circle cx="40.2" cy="27.2" r="12.5" style="fill:#0c2c48"/><path class="st4" d="M39.5 14.5h1.3V40h-1.3z"/><path d="M38.8 32h-1.4l-1.1-2.9h-4l-1 2.9H30l3.6-9.5h1.3l3.9 9.5zm-2.9-3.9-1.7-4.4-1.6 4.4h3.3z" style="fill:#ed6b5a"/><g><path class="st7" d="M49.1 29.2c0 .9-.3 1.6-.9 2.1-.6.5-1.5.7-2.7.7H42v-9.5h3.4c.5 0 1 .1 1.4.2.4.1.7.3 1 .5.3.2.5.5.6.8.1.3.2.6.2 1 0 .9-.5 1.6-1.4 2 .3.1.6.2.8.3.2.2.4.3.6.5.1.2.3.4.3.7.2.2.2.5.2.7zm-5.8-2.8h2.1c.7 0 1.2-.1 1.5-.3.3-.2.5-.6.5-1.1 0-.2 0-.4-.1-.6-.1-.2-.2-.3-.4-.4-.2-.1-.4-.2-.7-.3-.3-.1-.6-.1-1-.1h-2v2.8zm0 4.4h2.3c1.5 0 2.3-.5 2.3-1.6 0-.3 0-.5-.1-.7-.1-.2-.2-.4-.4-.5-.2-.1-.4-.2-.7-.3-.3-.1-.7-.1-1.1-.1h-2.1v3.2z"/></g></g><g><path class="st10" d="M54.8 74.7v-6.8c0-5.6-4.1-10.2-9.4-11.1 1.2-1.3 1.9-3 1.9-4.9v-3.4c0-4-3.2-7.2-7.2-7.2s-7.2 3.2-7.2 7.2v3.4c0 1.9.7 3.6 1.9 4.9-5.3.9-9.4 5.5-9.4 11.1v6.8h29.4z"/><path d="M46.1 51.9c0 3.3-2.7 5.9-5.9 5.9-3.3 0-5.9-2.7-5.9-5.9v-3.4c0-3.3 2.7-5.9 5.9-5.9 3.3 0 5.9 2.7 5.9 5.9v3.4z" style="fill:#fca886"/><path class="st7" d="M31.8 73.5v-6.6H33v6.6h14.9v-6.6h1.2v6.6h4.4v-5.6c0-5.5-4.5-10-10-10h-6.7c-5.5 0-10 4.5-10 10v5.6h5z"/></g></svg>`,
  `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 80.3 80.3" style="enable-background:new 0 0 80.3 80.3" xml:space="preserve"><style>.st6{fill:#0c2c48}.st28{fill:#a3b9c4}</style><circle cx="40.2" cy="40.2" r="40.2" style="fill:#f6a09c"/><path style="fill:#fff" d="M13.7 16.6h52.9v47.3H13.7z"/><path style="fill:#f8a06d" d="M14.2 16.4h51.9v6.8H14.2z"/><path class="st6" d="M67.2 23.8H13v-8.2h54.2v8.2zm-52.7-1.5h51.2v-5.2H14.5v5.2zM27.7 59.7H16V25.8h11.7v33.9zm-10.2-1.5h8.7V27.3h-8.7v30.9zM29.9 26h34.3v8.3H29.9z"/><path class="st28" d="M31.4 27.5h31.3v5.3H31.4z"/><path class="st6" d="M29.9 35.7h9.2v21.7h-9.2z"/><path style="fill:#55ab99" d="M31.4 37.2h6.2v18.7h-6.2z"/><path class="st6" d="M42.5 35.7h9.2v21.7h-9.2z"/><path style="fill:#ed6b5a" d="M44 37.2h6.2v18.7H44z"/><path class="st6" d="M55.2 35.7h9.2v21.7h-9.2z"/><path class="st28" d="M56.7 37.2h6.2v18.7h-6.2z"/><path class="st6" d="M16.6 19.8c0-.4.3-.8.7-.8.4 0 .7.3.7.8 0 .4-.3.8-.7.8-.4-.1-.7-.4-.7-.8zM19 19.8c0-.4.3-.8.7-.8.4 0 .7.3.7.8 0 .4-.3.8-.7.8-.4-.1-.7-.4-.7-.8zM21.5 19.8c0-.4.3-.8.7-.8.4 0 .7.3.7.8 0 .4-.3.8-.7.8-.4-.1-.7-.4-.7-.8z"/><g><path class="st6" d="M34.1 30c0-.4.3-.8.7-.8.4 0 .7.3.7.8 0 .4-.3.8-.7.8-.4 0-.7-.4-.7-.8zM36.6 30c0-.4.3-.8.7-.8.4 0 .7.3.7.8 0 .4-.3.8-.7.8-.5 0-.7-.4-.7-.8zM39 30c0-.4.3-.8.7-.8s.7.3.7.8c0 .4-.3.8-.7.8-.4 0-.7-.4-.7-.8z"/></g></svg>`,
  `<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" x="0" y="0" viewBox="0 0 80.3 80.3" style="enable-background:new 0 0 80.3 80.3" xml:space="preserve"><style>.st4{fill:#fff}.st7{fill:#f1cc4b}.st10{fill:#50646f}</style><circle class="st10" cx="40.2" cy="40.2" r="40.2"/><path d="M63.5 45c0 .6-.5 1-1 1H17.8c-.6 0-1-.5-1-1V10c0-.6.5-1 1-1h44.6c.6 0 1 .5 1 1v35z" style="fill:#55ab99"/><path class="st4" d="M19.1 13.7h42.1V40H19.1z"/><path class="st10" d="M36.8 11.2h6.8v1.2h-6.8z"/><g><circle cx="40.2" cy="27.2" r="12.5" style="fill:#0c2c48"/><path class="st4" d="M39.5 14.5h1.3V40h-1.3z"/><path d="M38.8 32h-1.4l-1.1-2.9h-4l-1 2.9H30l3.6-9.5h1.3l3.9 9.5zm-2.9-3.9-1.7-4.4-1.6 4.4h3.3z" style="fill:#ed6b5a"/><g><path class="st7" d="M49.1 29.2c0 .9-.3 1.6-.9 2.1-.6.5-1.5.7-2.7.7H42v-9.5h3.4c.5 0 1 .1 1.4.2.4.1.7.3 1 .5.3.2.5.5.6.8.1.3.2.6.2 1 0 .9-.5 1.6-1.4 2 .3.1.6.2.8.3.2.2.4.3.6.5.1.2.3.4.3.7.2.2.2.5.2.7zm-5.8-2.8h2.1c.7 0 1.2-.1 1.5-.3.3-.2.5-.6.5-1.1 0-.2 0-.4-.1-.6-.1-.2-.2-.3-.4-.4-.2-.1-.4-.2-.7-.3-.3-.1-.6-.1-1-.1h-2v2.8zm0 4.4h2.3c1.5 0 2.3-.5 2.3-1.6 0-.3 0-.5-.1-.7-.1-.2-.2-.4-.4-.5-.2-.1-.4-.2-.7-.3-.3-.1-.7-.1-1.1-.1h-2.1v3.2z"/></g></g><g><path class="st10" d="M54.8 74.7v-6.8c0-5.6-4.1-10.2-9.4-11.1 1.2-1.3 1.9-3 1.9-4.9v-3.4c0-4-3.2-7.2-7.2-7.2s-7.2 3.2-7.2 7.2v3.4c0 1.9.7 3.6 1.9 4.9-5.3.9-9.4 5.5-9.4 11.1v6.8h29.4z"/><path d="M46.1 51.9c0 3.3-2.7 5.9-5.9 5.9-3.3 0-5.9-2.7-5.9-5.9v-3.4c0-3.3 2.7-5.9 5.9-5.9 3.3 0 5.9 2.7 5.9 5.9v3.4z" style="fill:#fca886"/><path class="st7" d="M31.8 73.5v-6.6H33v6.6h14.9v-6.6h1.2v6.6h4.4v-5.6c0-5.5-4.5-10-10-10h-6.7c-5.5 0-10 4.5-10 10v5.6h5z"/></g></svg>`,
];

const ReplaceSymbolModal = () => {
  const { isReplaceModalOpen } = useSelector((store) => store.ModalsReducer);

  const dispatch = useDispatch();

  const onClose = useCallback(
    (obj) => dispatch(toggleReplaceModal({ open: false, data: obj })),
    [dispatch]
  );

  return (
    <Modal isOpen={isReplaceModalOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Replace Symbol</ModalHeader>
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

export default ReplaceSymbolModal;
