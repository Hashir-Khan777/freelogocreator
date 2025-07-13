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

  const userlogin = () => {
    dispatch(login(form));
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (data?.id != null) {
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <main className="container-sm main mt-50">
      <h5 className="heading-36 mb-30 mt-10 wow animate__animated animate__fadeInUp">
        Login
      </h5>
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
      <Flex justifyContent="space-between">
        <Box>
          New to us?{" "}
          <Box as={Link} color="teal.500" to="/signup">
            Sign Up
          </Box>
        </Box>
        <Box as={Link} to="/forgetpassword">
          Forgot Password?
        </Box>
      </Flex>
      <Flex justifyContent="space-between" mt={4}>
        <div />
        <div className="block-signin">
          <button
            onClick={userlogin}
            className="btn btn-default btn-shadow hover-up"
          >
            Sign in
          </button>
        </div>
      </Flex>
    </main>
    // {/* <div className="container register">
    //   <div className="row">
    //     <div className="col-md-3 register-left">
    //       <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />
    //       <h3>Welcome</h3>
    //       <p>You are 30 seconds away from earning your own money!</p>
    //       <div className="col">
    //         <a href="#" className="btn btn-default btn-twitter mb-3">
    //           {" "}
    //           <i className="fab fa-twitter" /> &nbsp; Login via Twitter
    //         </a>
    //         <a href="#" className="btn btn-default btn-facebook mb-3">
    //           {" "}
    //           <i className="fab fa-facebook-f" /> &nbsp; Login via facebook
    //         </a>
    //       </div>
    //     </div>
    //     <div className="col-md-9 register-right">
    //       <ul
    //         className="nav nav-tabs nav-justified"
    //         id="myTab"
    //         role="tablist"
    //       >
    //         <li className="nav-item">
    //           <a
    //             className="nav-link active"
    //             id="home-tab"
    //             data-toggle="tab"
    //             href="#home"
    //             role="tab"
    //             aria-controls="home"
    //             aria-selected="true"
    //           >
    //             Employee
    //           </a>
    //         </li>
    //         <li className="nav-item">
    //           <a
    //             className="nav-link"
    //             id="profile-tab"
    //             data-toggle="tab"
    //             href="#profile"
    //             role="tab"
    //             aria-controls="profile"
    //             aria-selected="false"
    //           >
    //             Hirer
    //           </a>
    //         </li>
    //       </ul>
    //       <div className="tab-content" id="myTabContent">
    //         <div
    //           className="tab-pane fade show active"
    //           id="home"
    //           role="tabpanel"
    //           aria-labelledby="home-tab"
    //         >
    //           <h3 className="register-heading">Apply as a Employee</h3>
    //           <div className="row register-form">
    //             <div className="col-md-6">
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="First Name *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="Last Name *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="password"
    //                   className="form-control"
    //                   placeholder="Password *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="password"
    //                   className="form-control"
    //                   placeholder="Confirm Password *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <div className="maxl">
    //                   <label className="radio inline">
    //                     <input
    //                       type="radio"
    //                       name="gender"
    //                       defaultValue="male"
    //                       defaultChecked=""
    //                     />
    //                     <span> Male </span>
    //                   </label>
    //                   <label className="radio inline">
    //                     <input
    //                       type="radio"
    //                       name="gender"
    //                       defaultValue="female"
    //                     />
    //                     <span>Female </span>
    //                   </label>
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="col-md-6">
    //               <div className="form-group">
    //                 <input
    //                   type="email"
    //                   className="form-control"
    //                   placeholder="Your Email *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   minLength={10}
    //                   maxLength={10}
    //                   name="txtEmpPhone"
    //                   className="form-control"
    //                   placeholder="Your Phone *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <select className="form-control">
    //                   <option className="hidden" selected="" disabled="">
    //                     Please select your Sequrity Question
    //                   </option>
    //                   <option>What is your Birthdate?</option>
    //                   <option>What is Your old Phone Number</option>
    //                   <option>What is your Pet Name?</option>
    //                 </select>
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="Enter Your Answer *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <input
    //                 type="submit"
    //                 className="btnRegister"
    //                 defaultValue="Register"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //         <div
    //           className="tab-pane fade show"
    //           id="profile"
    //           role="tabpanel"
    //           aria-labelledby="profile-tab"
    //         >
    //           <h3 className="register-heading">Apply as a Hirer</h3>
    //           <div className="row register-form">
    //             <div className="col-md-6">
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="First Name *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="Last Name *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="email"
    //                   className="form-control"
    //                   placeholder="Email *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   maxLength={10}
    //                   minLength={10}
    //                   className="form-control"
    //                   placeholder="Phone *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //             </div>
    //             <div className="col-md-6">
    //               <div className="form-group">
    //                 <input
    //                   type="password"
    //                   className="form-control"
    //                   placeholder="Password *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="password"
    //                   className="form-control"
    //                   placeholder="Confirm Password *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <div className="form-group">
    //                 <select className="form-control">
    //                   <option className="hidden" selected="" disabled="">
    //                     Please select your Sequrity Question
    //                   </option>
    //                   <option>What is your Birthdate?</option>
    //                   <option>What is Your old Phone Number</option>
    //                   <option>What is your Pet Name?</option>
    //                 </select>
    //               </div>
    //               <div className="form-group">
    //                 <input
    //                   type="text"
    //                   className="form-control"
    //                   placeholder="`Answer *"
    //                   defaultValue=""
    //                 />
    //               </div>
    //               <input
    //                 type="submit"
    //                 className="btnRegister"
    //                 defaultValue="Register"
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div> */}
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
    //             <FormHelperText textAlign="right">
    //               <Box as={Link} to="/forgetpassword">
    //                 forgot password?
    //               </Box>
    //             </FormHelperText>
    //           </FormControl>
    //           <Button
    //             onClick={userlogin}
    //             borderRadius={0}
    //             variant="solid"
    //             colorScheme="teal"
    //             width="full"
    //           >
    //             Login
    //           </Button>
    //         </Stack>
    //       </form>
    //     </Box>
    //   </Stack>
    //   <Box>
    //     New to us?{" "}
    //     <Box as={Link} color="teal.500" to="/signup">
    //       Sign Up
    //     </Box>
    //   </Box>
    // </Flex>
  );
};

export default Login;
