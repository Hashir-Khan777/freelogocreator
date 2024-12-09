import { useEffect, useState } from "react";
import {
  Flex,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  Box,
  FormControl,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { FaLock } from "react-icons/fa";
import { resetPassword } from "../../store/actions/auth.action";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { showToast } from "../../store/reducers/toast.reducer";

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({});

  const { resetpasswordsuccess } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const handleShowClick = () => setShowPassword(!showPassword);
  const handleConfirmShowClick = () =>
    setShowConfirmPassword(!showConfirmPassword);

  const submit = () => {
    if (form.password === form.confirmpassword) {
      dispatch(resetPassword({ ...form, email: cookies.get("_email") }));
    } else {
      dispatch(
        showToast({
          type: "error",
          message: "Password does not match",
        })
      );
    }
  };

  useEffect(() => {
    if (resetpasswordsuccess) {
      navigate("/login", { replace: true });
    }
  }, [resetpasswordsuccess]);

  useEffect(() => {
    if (cookies.get("_user")) {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
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
                    color="gray.300"
                    children={<Icon as={FaLock} color="gray.300" />}
                  />
                  <Input
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<Icon as={FaLock} color="gray.300" />}
                  />
                  <Input
                    onChange={(e) =>
                      setForm({ ...form, confirmpassword: e.target.value })
                    }
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleConfirmShowClick}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                onClick={submit}
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Reset Password
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default ResetPassword;
