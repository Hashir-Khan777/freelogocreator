import {
  Flex,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  FormControl,
  Icon,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { forgetPassword } from "../../store/actions/auth.action";

const ForgetPassword = () => {
  const [form, setForm] = useState({});

  const { forgetpasswordsuccess, data } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = () => {
    dispatch(forgetPassword(form));
  };

  useEffect(() => {
    if (forgetpasswordsuccess) {
      navigate("/resetpassword", { replace: true });
    }
  }, [forgetpasswordsuccess]);

  useEffect(() => {
    if (data?.id) {
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      pt="120px"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<Icon as={FaEnvelope} color="gray.300" />}
                  />
                  <Input
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    type="email"
                    placeholder="email address"
                  />
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                onClick={submit}
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Forget Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ForgetPassword;
