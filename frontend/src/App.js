import { ChakraProvider, Flex, useToast } from "@chakra-ui/react";
import AppRouter from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "./store/reducers/toast.reducer";
import { useEffect } from "react";
import {
  AddShapesIconsModal,
  CreateQRCode,
  GeneratePostModal,
  QRCodeModal,
  ReplaceSymbolModal,
  ShieldModal,
} from "./modals";
import { Footer, Header } from "./components";

const App = () => {
  const { type, message } = useSelector((store) => store.ToastReducer);

  const toast = useToast();
  const dispatch = useDispatch();

  useEffect(() => {
    if (type && message) {
      toast({
        description: message,
        status: type,
        position: "top-right",
        duration: 9000,
        isClosable: true,
      });
      dispatch(
        showToast({
          type: null,
          message: null,
        })
      );
    }
  }, [type, message, dispatch, toast]);

  return (
    <ChakraProvider>
      <Flex flexDirection="column" height="100vh">
        <Header />
        <AppRouter />
        <Footer />
      </Flex>
      <GeneratePostModal />
      <AddShapesIconsModal />
      <ReplaceSymbolModal />
      <QRCodeModal />
      <ShieldModal />
      <CreateQRCode />
    </ChakraProvider>
  );
};

export default App;
