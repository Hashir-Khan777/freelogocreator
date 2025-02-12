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
import {
  Category,
  Logo,
  Package,
  Query,
  Subscription,
  User,
} from "store/actions";
import { useSelector } from "react-redux";
import Button from "components/ui/Button";
import Modal from "components/ui/Modal";
import Textinput from "components/ui/Textinput";
import Fileinput from "components/ui/Fileinput";
import Select from "react-select";
import Loading from "components/Loading";

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

const Queries = () => {
  const [data, setData] = useState([]);
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({
    name: "",
    logolimit: "",
    amount: "",
  });

  const COLUMNS = [
    {
      Header: "Id",
      accessor: "id",
      Cell: (row) => {
        return <span>{row?.cell?.row.index + 1}</span>;
      },
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Number",
      accessor: "number",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Message",
      accessor: "message",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "User",
      accessor: "user_id",
      Cell: (row) => {
        return <span>{users.find((x) => x.id === row?.cell?.value)?.id}</span>;
      },
    },
  ];

  const { loading, queries } = useSelector((x) => x.queries);
  const { users } = useSelector((x) => x.users);

  const columns = useMemo(() => COLUMNS, [users]);
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

  const { globalFilter, pageIndex } = state;

  useEffect(() => {
    dispatch(Query.getQueries());
    dispatch(User.getUsers());
  }, [dispatch]);

  useEffect(() => {
    setData(queries);
  }, [queries]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <HomeBredCurbs title="Queries" />
          <Card noborder>
            <div className="md:flex justify-between items-center mb-6">
              <div>
                {/* <Button
                  icon="heroicons-outline:plus"
                  text="Add"
                  className="btn-dark w-full block"
                  onClick={() => setShow(true)}
                /> */}
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
            title={`${edit ? "Update" : "Add"} Logo`}
            centered
            activeModal={show}
            onClose={() => setShow(false)}
          >
            <Card>
              <div className="space-y-4">
                <Textinput
                  label="Name"
                  value={form.name}
                  defaultValue={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Name"
                />
                <Textinput
                  label="Logo Limit"
                  value={form.logolimit}
                  defaultValue={form.logolimit}
                  onChange={(e) =>
                    setForm({ ...form, logolimit: e.target.value })
                  }
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Logo Limit"
                />
                <Textinput
                  label="Amount"
                  value={form.amount}
                  defaultValue={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  id="h_Fullname2"
                  type="text"
                  placeholder="Enter Amount"
                />
                <div className="flex justify-end">
                  <Button
                    text="Submit"
                    className="btn-dark"
                    onClick={() => {
                      if (edit) {
                        dispatch(Package.editPackages(form));
                        setShow(false);
                        setEdit(false);
                      } else {
                        dispatch(Package.addPackages(form));
                        setShow(false);
                      }
                      setForm({
                        name: "",
                        logolimit: "",
                        amount: "",
                      });
                    }}
                  />
                </div>
              </div>
            </Card>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Queries;
