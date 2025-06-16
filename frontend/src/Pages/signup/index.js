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
import { FaEnvelope, FaUserAlt, FaLock } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/actions/auth.action";
import Cookies from "universal-cookie";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({});

  const { data } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cookies = new Cookies();

  const signup = () => {
    fetch("https://api.ipify.org?format=json")
      .then((res) => res.json())
      .then((data) => {
        dispatch(register({ ...form, ipaddress: data.ip }));
      });
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (data != null) {
      navigate("/", { replace: true });
    }
  }, [data]);

  // useEffect(() => {
  //   if (cookies.get("_user")) {
  //     navigate("/", { replace: true });
  //   }
  // }, []);

  return (
    <main className="container-sm main mt-50">
      <h5 className="heading-36 mb-30 mt-10 wow animate__animated animate__fadeInUp">
        Register
      </h5>
      <div className="form-group">
        <input
          type="text"
          name="name"
          className="form-control"
          placeholder="Name *"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <input
          type="email"
          name="email"
          className="form-control"
          placeholder="Email *"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          name="password"
          className="form-control"
          placeholder="password *"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
      </div>
      <div className="block-signin">
        <button
          onClick={signup}
          className="btn btn-default btn-shadow float-right hover-up"
        >
          Sign up
        </button>
      </div>
      <Box>
        Already have an account?{" "}
        <Box as={Link} color="teal.500" to="/login">
          Sign in
        </Box>
      </Box>
    </main>
  );
};
// <Flex
//   flexDirection="column"
//   width="100wh"
//   height="100vh"
//   backgroundColor="gray.200"
//   justifyContent="center"
//   alignItems="center"
// >
//   <Stack
//     flexDir="column"
//     mb="2"
//     justifyContent="center"
//     alignItems="center"
//   >
//     <Box minW={{ base: "90%", md: "468px" }}>
//       <form>
//         <Stack
//           spacing={4}
//           p="1rem"
//           backgroundColor="whiteAlpha.900"
//           boxShadow="md"
//         >
//           <FormControl>
//             <InputGroup>
//               <InputLeftElement
//                 pointerEvents="none"
//                 children={<Icon as={FaUserAlt} color="gray.300" />}
//               />
//               <Input
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 type="text"
//                 placeholder="name"
//               />
//             </InputGroup>
//           </FormControl>
//           <FormControl>
//             <InputGroup>
//               <InputLeftElement
//                 pointerEvents="none"
//                 children={<Icon as={FaEnvelope} color="gray.300" />}
//               />
//               <Input
//                 onChange={(e) =>
//                   setForm({ ...form, email: e.target.value })
//                 }
//                 type="email"
//                 placeholder="email address"
//               />
//             </InputGroup>
//           </FormControl>
//           <FormControl>
//             <InputGroup>
//               <InputLeftElement
//                 pointerEvents="none"
//                 color="gray.300"
//                 children={<Icon as={FaLock} color="gray.300" />}
//               />
//               <Input
//                 onChange={(e) =>
//                   setForm({ ...form, password: e.target.value })
//                 }
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Password"
//               />
//               <InputRightElement width="4.5rem">
//                 <Button h="1.75rem" size="sm" onClick={handleShowClick}>
//                   {showPassword ? "Hide" : "Show"}
//                 </Button>
//               </InputRightElement>
//             </InputGroup>
//           </FormControl>
//           <Button
//             onClick={signup}
//             borderRadius={0}
//             variant="solid"
//             colorScheme="teal"
//             width="full"
//           >
//             Sign Up
//           </Button>
//         </Stack>
//       </form>
//     </Box>
//   </Stack>
//   <Box>
//     Already a user?{" "}
//     <Box as={Link} color="teal.500" to="/login">
//       Login
//     </Box>
//   </Box>
// </Flex>

export default SignUp;
