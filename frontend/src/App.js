import { ChakraProvider, useToast } from "@chakra-ui/react";
import AppRouter from "./Router";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "./store/reducers/toast.reducer";
import { useEffect } from "react";

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
      <AppRouter />
    </ChakraProvider>
  );
};

export default App;
