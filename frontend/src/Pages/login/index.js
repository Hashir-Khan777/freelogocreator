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
  FormHelperText,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../store/actions/auth.action";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "universal-cookie";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});

  const { data } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const userlogin = () => {
    dispatch(login(form));
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (data != null) {
      navigate("/", { replace: true });
    }
  }, [data]);

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
                <FormHelperText textAlign="right">
                  <Box as={Link} to="/forgetpassword">
                    forgot password?
                  </Box>
                </FormHelperText>
              </FormControl>
              <Button
                onClick={userlogin}
                borderRadius={0}
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{" "}
        <Box as={Link} color="teal.500" to="/signup">
          Sign Up
        </Box>
      </Box>
    </Flex>
  );
};

export default Login;
