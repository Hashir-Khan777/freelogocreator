import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import Modal from "components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleAddModal,
  pushProject,
  toggleTopicAddModal,
} from "../projects/store.js";
import Textinput from "components/ui/Textinput";
import Fileinput from "components/ui/Fileinput";
import Textarea from "components/ui/Textarea";
import Flatpickr from "react-flatpickr";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { v4 as uuidv4 } from "uuid";

import avatar1 from "assets/images/avatar/av-1.svg";
import avatar2 from "assets/images/avatar/av-2.svg";
import avatar3 from "assets/images/avatar/av-3.svg";
import avatar4 from "assets/images/avatar/av-4.svg";
import FormGroup from "components/ui/FormGroup";
import { addTopicVideo, createTopic } from "store/actions/topic.js";
import Button from "components/ui/Button.jsx";

const styles = {
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, opacity: "0.5" } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed
      ? { ...base, color: "#626262", paddingRight: 6 }
      : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: "none" } : base;
  },
  option: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
};

const assigneeOptions = [
  { value: "mahedi", label: "Mahedi Amin", image: avatar1 },
  { value: "sovo", label: "Sovo Haldar", image: avatar2 },
  { value: "rakibul", label: "Rakibul Islam", image: avatar3 },
  { value: "pritom", label: "Pritom Miha", image: avatar4 },
];
const options = [
  {
    value: "team",
    label: "team",
  },
  {
    value: "low",
    label: "low",
  },
  {
    value: "medium",
    label: "medium",
  },
  {
    value: "high",
    label: "high",
  },
  {
    value: "update",
    label: "update",
  },
];

const OptionComponent = ({ data, ...props }) => {
  //const Icon = data.icon;

  return (
    <components.Option {...props}>
      <span className="flex items-center space-x-4">
        <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div>
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const AddTopic = () => {
  const { openTopicModal } = useSelector((state) => state.project);
  const { loading, video, topic, videoLoading } = useSelector(
    (state) => state.topic
  );
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is required"),
      description: yup.string().required("Description is required"),
    })
    .required();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValidationSchema),
    mode: "all",
  });

  const onSubmit = (data) => {
    const project = {
      id: uuidv4(),
      name: data.title,
      assignee: data.assign,
      // get only data value from startDate and endDate
      category: null,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      progress: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    };

    dispatch(createTopic({ ...data, video }));
    reset();
  };

  const [file, setFile] = useState("");

  useEffect(() => {
    if (topic?.name) {
      dispatch(toggleTopicAddModal(false));
    }
  }, [topic]);

  return (
    <div>
      <Modal
        title="Create Topic"
        labelclassName="btn-outline-dark"
        activeModal={openTopicModal}
        onClose={() => dispatch(toggleTopicAddModal(false))}
      >
        <form className="space-y-4 ">
          <Fileinput
            selectedFile={videoLoading ? null : file}
            placeholder={
              videoLoading ? "Loading..." : "Choose a file or drop it here..."
            }
            onChange={(e) => {
              const formData = new FormData();
              setFile(e.target.files[0]);
              formData.append("video", e.target.files[0]);
              dispatch(addTopicVideo(formData));
            }}
          />
          <Textinput
            name="name"
            label="Topic Name"
            placeholder="Topic Name"
            register={register}
            error={errors.name}
          />
          {/* <div className="grid lg:grid-cols-2 gap-4 grid-cols-1">
            <FormGroup
              label="Start Date"
              id="default-picker"
              error={errors.startDate}
            >
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker"
                    placeholder="yyyy, dd M"
                    value={startDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label="End Date"
              id="default-picker2"
              error={errors.endDate}
            >
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Flatpickr
                    className="form-control py-2"
                    id="default-picker2"
                    placeholder="yyyy, dd M"
                    value={endDate}
                    onChange={(date) => {
                      field.onChange(date);
                    }}
                    options={{
                      altInput: true,
                      altFormat: "F j, Y",
                      dateFormat: "Y-m-d",
                    }}
                  />
                )}
              />
            </FormGroup>
          </div> */}
          {/* <div className={errors.assign ? "has-error" : ""}>
            <div className="flex justify-between items-center">
              <label className="form-label" htmlFor="icon_s">
                Topics
              </label>
              <p className="btn text-slate-900 text-center p-0 m-0 cursor-pointer">
                + Add Topic
              </p>
            </div>
            <Controller
              name="assign"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={assigneeOptions}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  components={{
                    Option: OptionComponent,
                  }}
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.assign?.message || errors.assign?.label.message}
              </div>
            )}
          </div> */}
          {/* <div className={errors.tags ? "has-error" : ""}>
            <label className="form-label" htmlFor="icon_s">
              Tag
            </label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={options}
                  styles={styles}
                  className="react-select"
                  classNamePrefix="select"
                  isMulti
                  id="icon_s"
                />
              )}
            />
            {errors.assign && (
              <div className=" mt-2  text-danger-500 block text-sm">
                {errors.tags?.message || errors.tags?.label.message}
              </div>
            )}
          </div> */}
          <Textarea
            name="description"
            register={register}
            label="Description"
            error={errors.description}
            placeholder="Description"
          />

          <div className="ltr:text-right rtl:text-left">
            <Button
              className="btn btn-dark  text-center"
              isLoading={loading}
              onClick={handleSubmit(onSubmit)}
            >
              Add
            </Button>
            {/* <button className="btn btn-dark  text-center">Add</button> */}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddTopic;
