import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "components/ui/Icon";
import Card from "components/ui/Card";
import BasicArea from "../chart/appex-chart/BasicArea";

// import images
import ProfileImage from "assets/images/users/user-1.jpg";
import Textinput from "components/ui/Textinput";
import Fileinput from "components/ui/Fileinput";
import { useDispatch } from "react-redux";
import { User } from "store/actions";
import { useSelector } from "react-redux";
import Button from "components/ui/Button";

const profile = () => {
  const [form, setForm] = useState({
    id: "",
    name: "",
    email: "",
    password: "",
    image: "",
  });

  const { user } = useSelector((state) => state.users);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(User.getUserProfile({ id: localStorage.getItem("_user") }));
  }, [dispatch]);

  useEffect(() => {
    if (user?.id) {
      setForm({
        profile: true,
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        image: user.image,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    }
  }, [user]);

  return (
    <div>
      <Card title="Edit Profile">
        <div className="space-y-3">
          <Fileinput
            name="basic"
            selectedFile={form.image}
            onChange={() => {
              const file = event.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setForm({ ...form, image: reader.result });
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <Textinput
            label="Name"
            id="pn"
            type="text"
            defaultValue={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter name"
          />
          <Textinput
            label="Email"
            id="pn2"
            type="text"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            defaultValue={form.email}
            placeholder="Enter email"
          />
          <Textinput
            label="Password"
            id="pn3"
            type="text"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Enter password"
          />
        </div>
        <div className="flex justify-end">
          <Button
            text="Update"
            className="btn-dark mt-4 block"
            onClick={() => {
              dispatch(User.editUser(form));
              navigate("/dashboard");
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default profile;
