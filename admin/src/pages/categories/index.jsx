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

const Categories = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [deleteShow, setDeleteShow] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const [form, setForm] = useState({
    name: "",
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
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => {
        return <div>{row?.cell?.value}</div>;
      },
    },
    {
      Header: "action",
      accessor: "action",
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
                              setShow(true);
                              setEdit(true);
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

  const columns = useMemo(() => COLUMNS, []);

  const { loading, categories } = useSelector((x) => x.categories);

  const dispatch = useDispatch();

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

  const { globalFilter, pageIndex } = state;

  useEffect(() => {
    dispatch(Category.getCategories());
  }, [dispatch]);

  useEffect(() => {
    setData(categories);
  }, [categories]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <HomeBredCurbs title="Categories" />
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
            <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
              <div className=" flex items-center space-x-3 rtl:space-x-reverse">
                <span className=" flex space-x-2  rtl:space-x-reverse items-center">
                  <span className=" text-sm font-medium text-slate-600 dark:text-slate-300">
                    Go
                  </span>
                  <span>
                    <input
                      type="number"
                      className=" form-control py-2"
                      defaultValue={pageIndex + 1}
                      onChange={(e) => {
                        const pageNumber = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        gotoPage(pageNumber);
                      }}
                      style={{ width: "50px" }}
                    />
                  </span>
                </span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  Page{" "}
                  <span>
                    {pageIndex + 1} of {pageOptions.length}
                  </span>
                </span>
              </div>
              <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
                <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    className={` ${
                      !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    <Icon icon="heroicons-outline:chevron-left" />
                  </button>
                </li>
                {pageOptions.map((page, pageIdx) => (
                  <li key={pageIdx}>
                    <button
                      href="#"
                      aria-current="page"
                      className={` ${
                        pageIdx === pageIndex
                          ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
                          : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
                      }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
                      onClick={() => gotoPage(pageIdx)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
                  <button
                    className={` ${
                      !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                  >
                    <Icon icon="heroicons-outline:chevron-right" />
                  </button>
                </li>
              </ul>
            </div>
          </Card>
          <Modal
            title={`${edit ? "Update" : "Add"} Category`}
            centered
            activeModal={show}
            onClose={() => {
              setShow(false);
              setEdit(false);
              setForm({
                name: "",
              });
            }}
          >
            <Card>
              <div className="space-y-4">
                <Textinput
                  label="Category Name"
                  value={form.name}
                  defaultValue={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Name"
                />
                <div className="flex justify-end">
                  <Button
                    text="Submit"
                    className="btn-dark"
                    onClick={() => {
                      if (!isEmpty(form)) {
                        if (edit) {
                          dispatch(Category.editCategories(form));
                          setShow(false);
                          setEdit(false);
                        } else {
                          dispatch(Category.addCategories(form));
                          setShow(false);
                        }
                      }
                      setForm({
                        name: "",
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
                    Category.deleteCategories({
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

export default Categories;
