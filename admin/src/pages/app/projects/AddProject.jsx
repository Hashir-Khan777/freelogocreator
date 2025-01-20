import React, { useEffect, useState } from "react";
import Select, { components } from "react-select";
import Modal from "components/ui/Modal";
import { useSelector, useDispatch } from "react-redux";
import { toggleAddModal, pushProject } from "./store";
import Textinput from "components/ui/Textinput";
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
import { toggleTopicAddModal } from "../projects/store.js";
import { getTopics } from "store/actions/topic";
import { createCourse } from "store/actions/course";
import Button from "components/ui/Button";

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
        {/* <div className="flex-none">
          <div className="h-7 w-7 rounded-full">
            <img
              src={data.image}
              alt=""
              className="w-full h-full rounded-full"
            />
          </div>
        </div> */}
        <span className="flex-1">{data.label}</span>
      </span>
    </components.Option>
  );
};

const AddProject = () => {
  const { openProjectModal } = useSelector((state) => state.project);
  const { topics } = useSelector((state) => state.topic);
  const { course, loading } = useSelector((state) => state.course);
  const dispatch = useDispatch();
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [topicOptions, setTopicOptions] = useState([]);

  const FormValidationSchema = yup
    .object({
      name: yup.string().required("Name is required"),
      topics: yup.mixed().required("Topic is required"),
      description: yup.string().required("Dsscription is required"),
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

  useEffect(() => {
    dispatch(getTopics());
  }, [dispatch]);

  useEffect(() => {
    if (topics.length) {
      const options = topics.reduce((acc, curr) => {
        acc.push({
          label: curr.name,
          value: curr._id,
        });
        return acc;
      }, []);
      setTopicOptions(options);
    }
  }, [topics]);

  const onSubmit = (data) => {
    // const project = {
    //   id: uuidv4(),
    //   name: data.title,
    //   assignee: data.assign,
    //   // get only data value from startDate and endDate
    //   category: null,
    //   startDate: startDate.toISOString().split("T")[0],
    //   endDate: endDate.toISOString().split("T")[0],
    //   des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
    //   progress: Math.floor(Math.random() * (100 - 10 + 1) + 10),
    // };

    dispatch(
      createCourse({ ...data, topics: data.topics.map((x) => x.value) })
    );

    // dispatch(pushProject(project));
    // dispatch(toggleAddModal(false));
    reset();
  };

  useEffect(() => {
    if (course?.name) {
      dispatch(toggleAddModal(false));
    }
  }, [course]);

  return (
    <div>
      <Modal
        title="Create Course"
        labelclassName="btn-outline-dark"
        activeModal={openProjectModal}
        onClose={() => dispatch(toggleAddModal(false))}
      >
        <form className="space-y-4 ">
          <Textinput
            name="name"
            label="Course Name"
            placeholder="Course Name"
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
          <div className={errors.topics ? "has-error" : ""}>
            <div className="flex justify-between items-center">
              <label className="form-label" htmlFor="icon_s">
                Topics
              </label>
              <p
                className="btn dark:text-white text-slate-900 text-center p-0 m-0 cursor-pointer"
                onClick={() => dispatch(toggleTopicAddModal(true))}
              >
                + Add Topic
              </p>
            </div>
            <Controller
              name="topics"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={topicOptions}
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
          </div>
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
            error={errors.description}
            label="Description"
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

export default AddProject;
