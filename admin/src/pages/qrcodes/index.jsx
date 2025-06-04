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
import { Category, Logo, User } from "store/actions";
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
    name: "view",
    icon: "heroicons:eye",
  },
];

const sides = [
  { label: "One Sided", value: 0 },
  { label: "Two Sided", value: 1 },
];

let logoPage = 1;
const QrCodes = () => {
  const [data, setData] = useState([]);
  const [image, setImage] = useState("");
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
      Header: "Qr Code",
      accessor: "image",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7">
                <img src={`data:image/png;base64,${row?.cell?.value}`} />
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Value",
      accessor: "text",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Note",
      accessor: "note",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "User",
      accessor: "user_id",
      Cell: (row) => {
        return (
          <span>{users.find((x) => x.id === row?.cell?.value)?.name}</span>
        );
      },
    },
    {
      Header: "Deleted",
      accessor: "deleted",
      Cell: (row) => {
        return <span>{row?.cell?.value ? "Yes" : "No"}</span>;
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
                      onClick={() => {
                        setShow(true);
                        setImage(row?.cell?.row?.original?.image);
                      }}
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

  const { loading, qrcodes } = useSelector((x) => x.logos);
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

  const { globalFilter, pageIndex, pageSize } = state;

  useEffect(() => {
    dispatch(Logo.getQrCodes());
    dispatch(User.getUsers());
    setPageSize(9999999999);
  }, [dispatch]);

  useEffect(() => {
    setData(qrcodes);
  }, [qrcodes]);

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <>
          <HomeBredCurbs title="Qr Codes" />
          <Card noborder>
            <div className="md:flex justify-between items-center mb-6">
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
            title={`QR Code`}
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
              <div>
                <div>
                  <img src={`data:image/png;base64,${image}`} />
                </div>
              </div>
            </Card>
          </Modal>
        </>
      )}
    </div>
  );
};

export default QrCodes;
