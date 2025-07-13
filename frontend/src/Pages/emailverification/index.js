import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { emailverification, login } from "../../store/actions/auth.action";
import { useDispatch, useSelector } from "react-redux";

const EmailVerification = () => {
  const [form, setForm] = useState({});

  const { data } = useSelector((x) => x.AuthReducer);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  const verifyEmail = () => {
    dispatch(emailverification(form));
  };

  useEffect(() => {
    if (!token) {
      navigate("/", { replace: true });
    }
  }, []);

  useEffect(() => {
    if (data?.id) {
      navigate("/", { replace: true });
    }
  }, [data]);

  return (
    <main className="container-sm main mt-50">
      <h5 className="heading-36 mb-30 mt-10 wow animate__animated animate__fadeInUp">
        Email Verification
      </h5>
      <div className="form-group">
        <input
          type="text"
          name="code"
          className="form-control"
          placeholder="Verification Code *"
          onChange={(e) =>
            setForm({ ...form, [e.target.name]: e.target.value })
          }
        />
      </div>
      <div className="block-signin">
        <button
          onClick={verifyEmail}
          className="btn btn-default btn-shadow float-right hover-up"
        >
          Verify
        </button>
      </div>
    </main>
  );
};

export default EmailVerification;
