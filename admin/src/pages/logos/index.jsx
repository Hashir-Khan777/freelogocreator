import HomeBredCurbs from "pages/dashboard/HomeBredCurbs";
import React, { useEffect, useMemo, useState } from "react";
import { advancedTable } from "../../constant/table-data";
import Card from "components/ui/Card";
import Icon from "components/ui/Icon";
import Dropdown from "components/ui/Dropdown";
import { Menu } from "@headlessui/react";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { useDispatch } from "react-redux";
import { Category, Logo } from "store/actions";
import { useSelector } from "react-redux";
import Button from "components/ui/Button";
import Modal from "components/ui/Modal";
import Textinput from "components/ui/Textinput";
import Fileinput from "components/ui/Fileinput";
import Select from "react-select";
import Creatable from "react-select/creatable";
import Loading from "components/Loading";
import Icons from "components/ui/Icon";

const actions = [
  {
    name: "edit",
    icon: "heroicons:pencil-square",
  },
  {
    name: "delete",
    icon: "heroicons-outline:trash",
  },
];

const sides = [
  { label: "One Sided", value: 0 },
  { label: "Two Sided", value: 1 },
];

let logoPage = 1;
const Logos = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [edit, setEdit] = useState(false);
  const [side, setSide] = useState(0);
  const [form, setForm] = useState({
    title: "",
    description: "",
    graphic: "",
    backGraphic: "",
    category_id: "",
    tags: "",
  });

  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" &&
        (Object.keys(value).length === 0 ||
          Object.keys(value).every((key) => isEmpty(value[key])))) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  };

  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.row.index + 1}</span>;
      },
    },
    {
      Header: "Logo",
      accessor: "graphic",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none svg-container">
                <div
                  dangerouslySetInnerHTML={{ __html: row?.cell?.value }}
                  className="object-cover w-7 h-7 rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Back Side",
      accessor: "backGraphic",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none">
                <div
                  dangerouslySetInnerHTML={{ __html: row?.cell?.value }}
                  className="object-cover w-full h-full rounded-full"
                />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Category",
      accessor: "category_id",
      Cell: (row) => {
        return (
          <span>{categories.find((x) => x.id === row?.cell?.value)?.name}</span>
        );
      },
    },
    {
      Header: "Title",
      accessor: "title",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Tags",
      accessor: "tags",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "action",
      accessor: "actions",
      Cell: (row) => {
        return (
          <div>
            <Dropdown
              classMenuItems="right-0 w-[140px] top-[-110%] "
              label={
                <span className="text-xl text-center block w-full">
                  <Icon icon="heroicons-outline:dots-vertical" />
                </span>
              }
            >
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {actions.map((item, i) => (
                  <Menu.Item key={i}>
                    <div
                      onClick={
                        item.name === "edit"
                          ? () => {
                              setForm(row.cell.row.values);
                              console.log(
                                row.cell.row.values,
                                "row.cell.row.values"
                              );
                              setShow(true);
                              setEdit(true);
                              if (row.cell.row.values?.backGraphic) {
                                setSide(1);
                              } else {
                                setSide(0);
                              }
                            }
                          : () => {
                              setDeleteShow(true);
                              setDeleteData(row.cell.row.values?.id);
                            }
                      }
                      className={`
                    
                      ${
                        item.name === "delete"
                          ? "bg-danger-500 text-danger-500 bg-opacity-30   hover:bg-opacity-100 hover:text-white"
                          : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 dark:hover:bg-opacity-50"
                      }
                       w-full border-b border-b-gray-500 border-opacity-10 px-4 py-2 text-sm  last:mb-0 cursor-pointer 
                       first:rounded-t last:rounded-b flex  space-x-2 items-center rtl:space-x-reverse `}
                    >
                      <span className="text-base">
                        <Icon icon={item.icon} />
                      </span>
                      <span>{item.name}</span>
                    </div>
                  </Menu.Item>
                ))}
              </div>
            </Dropdown>
          </div>
        );
      },
    },
  ];

  const { loading, graphics } = useSelector((x) => x.logos);
  const { categories } = useSelector((x) => x.categories);

  const columns = useMemo(() => COLUMNS, [categories]);
  const dispatch = useDispatch();

  const styles = {
    option: (provided, state) => ({
      ...provided,
      fontSize: "14px",
    }),
  };

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    footerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    gotoPage,
    pageCount,
    setPageSize,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  useEffect(() => {
    dispatch(Logo.getGraphics({ page: logoPage }));
    dispatch(Category.getCategories());
    setPageSize(9999999999);
  }, [dispatch]);

  useEffect(() => {
    setData(graphics);
  }, [graphics]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <HomeBredCurbs title="Logos" />
          <Card noborder>
            <div className="md:flex justify-between items-center mb-6">
              <div>
                <Button
                  icon="heroicons-outline:plus"
                  text="Add"
                  className="btn-dark w-full block"
                  onClick={() => setShow(true)}
                />
              </div>
              <div>
                <GlobalFilter
                  filter={globalFilter}
                  setFilter={setGlobalFilter}
                />
              </div>
            </div>
            <div className="overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  <table
                    className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                    {...getTableProps}
                  >
                    <thead className=" border-t border-slate-100 dark:border-slate-800">
                      {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                              scope="col"
                              className=" table-th "
                            >
                              {column.render("Header")}
                              <span>
                                {column.isSorted
                                  ? column.isSortedDesc
                                    ? " 🔽"
                                    : " 🔼"
                                  : ""}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody
                      className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"
                      {...getTableBodyProps}
                    >
                      {page.map((row) => {
                        prepareRow(row);
                        return (
                          <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => {
                              return (
                                <td
                                  {...cell.getCellProps()}
                                  className="table-td"
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="md:flex md:space-y-0 space-y-5 justify-center mt-6 items-center">
              <Button
                text="Load More"
                className="btn-dark"
                onClick={() => {
                  logoPage += 1;
                  dispatch(Logo.getGraphics({ page: logoPage }));
                }}
              />
            </div>
          </Card>
          <Modal
            title={`${edit ? "Update" : "Add"} Logo`}
            centered
            activeModal={show}
            onClose={() => {
              setShow(false);
              setEdit(false);
              setForm({
                title: "",
                description: "",
                graphic: "",
                category_id: "",
              });
            }}
          >
            <Card>
              <div className="flex items-center gap-2 svg-container2">
                <div
                  dangerouslySetInnerHTML={{ __html: form.graphic }}
                  className="block mx-auto w-[100px] mb-2 object-cover rounded-full"
                />
                {form.backGraphic ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: form.backGraphic }}
                    className="block mx-auto w-[100px] mb-2 object-cover rounded-full"
                  />
                ) : null}
              </div>
              <label htmlFor=" hh" className="form-label ">
                Select Sides *
              </label>
              <Select
                className="react-select"
                classNamePrefix="select"
                value={sides[side]}
                options={sides}
                styles={styles}
                onChange={(e) => setSide(e.value)}
                id="hh"
              />
              <div className="space-y-4 mt-4">
                <span className="text-sm text-gray-500">
                  Add 200 X 200 size logo
                </span>
                <Fileinput
                  name="basic"
                  placeholder="Upload Front Side"
                  accept="image/svg+xml"
                  onChange={(e) => {
                    const reader = new FileReader();

                    reader.onload = function (f) {
                      setForm({ ...form, graphic: f.target.result });
                    };

                    reader.readAsText(e.target.files[0]);
                  }}
                />
                {side === 1 ? (
                  <Fileinput
                    name="basic"
                    placeholder="Upload Back Side"
                    accept="image/svg+xml"
                    onChange={(e) => {
                      const reader = new FileReader();

                      reader.onload = function (f) {
                        setForm({ ...form, backGraphic: f.target.result });
                      };

                      reader.readAsText(e.target.files[0]);
                    }}
                  />
                ) : null}
                <Textinput
                  label="Title *"
                  value={form.title}
                  defaultValue={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Title"
                />
                <label htmlFor=" hh" className="form-label ">
                  Category *
                </label>
                <Select
                  className="react-select"
                  classNamePrefix="select"
                  value={{
                    value: categories.find((x) => x.id === form.category_id)
                      ?.id,
                    label: categories.find((x) => x.id === form.category_id)
                      ?.name,
                  }}
                  options={categories.map((x) => ({
                    label: x.name,
                    value: x.id,
                  }))}
                  styles={styles}
                  onChange={(e) => setForm({ ...form, category_id: e.value })}
                  id="hh"
                />
                <Textinput
                  label="Description *"
                  value={form.description}
                  defaultValue={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Description"
                />
                <label htmlFor=" hh" className="form-label ">
                  Tags *
                </label>
                <Creatable
                  isMulti
                  name="colors"
                  defaultValue={form?.tags
                    ?.split(", ")
                    ?.map((e) => ({ label: e, value: e }))}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      tags: e.map((f) => f?.value).join(", "),
                    })
                  }
                />
                <div className="flex justify-end">
                  <Button
                    text="Submit"
                    className="btn-dark"
                    onClick={() => {
                      if (!isEmpty(form)) {
                        if (edit) {
                          dispatch(Logo.editGraphics(form));
                          setShow(false);
                          setEdit(false);
                        } else {
                          dispatch(Logo.addGraphics(form));
                          setShow(false);
                        }
                      }
                      setForm({
                        title: "",
                        description: "",
                        graphic: "",
                        category_id: "",
                      });
                    }}
                  />
                </div>
              </div>
            </Card>
          </Modal>
          <Modal
            title=""
            centered
            activeModal={deleteShow}
            onClose={() => {
              setDeleteShow(false);
            }}
          >
            <Icons
              className="mx-auto text-red-600"
              width="100px"
              icon="heroicons-outline:x-circle"
            />
            <p className="mb-6 mt-2 text-center text-xl text-black-500">
              Do you really want to delete this?
            </p>
            <div className="flex justify-between space-x-3 rtl:space-x-reverse">
              <Button
                className="flex-1 btn-secondary"
                text="Cancel"
                onClick={() => setDeleteShow(false)}
              />
              <Button
                className="flex-1 btn-danger"
                text="Delete"
                onClick={() => {
                  dispatch(
                    Logo.deleteGraphics({
                      id: deleteData,
                    })
                  );
                  setDeleteShow(false);
                }}
              />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Logos;
