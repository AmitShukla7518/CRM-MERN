import React, { useState, Fragment, useMemo, useEffect } from "react";
import { advancedTable } from "../../../constant/table-data";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import Tooltip from "@/components/ui/Tooltip";
import User_default from "@/assets/images/all-img/User_default.jpg";
import Switch from "@/components/ui/Switch";
import Button from "@/components/ui/Button";
// import Modal from "@/components/ui/Modal1";
import { Dialog, Transition } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Select, { components } from "react-select";
import { toast } from "react-toastify";
import {
  useTable,
  useRowSelect,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import GlobalFilter from "./GlobalFilter";

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

//Update Model
const FormValadtionSchema = yup
  .object({
    fullname: yup.string().required("Name is Required"),
    Email: yup.string().email("Invalid email").required("Email is Required"),
    // location: yup.number().nullable().required("Please select location"),
  })
  .required();

const ExampleTwo = ({
  activeModal,
  onClose,
  noFade,
  disableBackdrop,
  // className = "max-w-xl",
  children,
  footerContent,
  centered,
  scrollContent,
  // themeClass = "bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700",
  title = "Basic Modal",
  uncontrol,
  label = "Basic Modal",
  labelClass,
  ref,
}) => {
  const [clientList, SetclientList] = useState([]);
  const [userStatus, setUserStatus] = useState(true);
  // For Update Model
  const [EmployeeID, setEmployeeID] = useState("");
  const [name, setName] = useState(" ");
  const [location, setLocation] = useState(" ");
  const [lobName, setlobName] = useState([]);
  const [email, setEmail] = useState(" ");
  const [emailErr, setEmailErr] = useState(" ");
  let [lobNameList, setLobNameList] = useState([]);
  let [locationList, setlocationList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectLocation, setSelectLocation] = useState(" ");
  const [setectLOB, setsetectLOB] = useState([]);

  const closeModal = () => {
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(!showModal);
  };
  const returnNull = () => {
    return null;
  };

  useEffect(() => {
    getLobList();
    getLocationList();
  }, []);

  async function getLobList() {
    let result = await fetch("http://127.0.0.1:2228/CRM/getLOB");
    result = await result.json();
    setLobNameList(result);
  }
  async function getLocationList() {
    let result = await fetch("http://127.0.0.1:2228/CRM/getLocation");
    result = await result.json();
    setlocationList(result);
  }

  let userStatushandler = (e) => {
    let data = e.target.value;
    if (data == "on") {
      setUserStatus(!userStatus);
    } else {
      setUserStatus(userStatus);
    }
  };
  //
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    resolver: yupResolver(FormValadtionSchema),
  });

  const onSubmit = async (data) => {
    let Location = { Location: location };
    let LOb = [];
    lobName.map((item) => {
      LOb.push(item.value);
    });
    let LOBName = LOb.toString();
    LOBName = { lob_Name: LOBName };
    console.log(LOBName);
    let All = Object.assign(data, Location, LOBName);
    let result = await fetch(
      `http://127.0.0.1:2228/CRM/updateEmp/${data.EmployeeID}`,
      {
        method: "PUT",
        body: JSON.stringify(All),
        headers: {
          "Content-Type": "application/json",
          authorization: JSON.parse(localStorage.getItem("jwt_Token")),
        },
      }
    );

    if (result.status == 200) {
      result = await result.json();
      toast.success(`${result.msg}`, {
        position: "top-right",
      });
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
      getAllClient();
      closeModal();
    } else {
      result = await result.json();
      console.log(result);
      toast.error(`${result.msg}`, {
        position: "top-right",
      });
      closeModal();
    }
  };
  //

  const GetEmpDetails = async (EmployeeID) => {
    let result = await fetch(
      `http://127.0.0.1:2228/CRM/getDataByID/${EmployeeID}`,
      {
        headers: {
          authorization: JSON.parse(localStorage.getItem("jwt_Token")),
        },
      }
    );
    result = await result.json();
    setEmployeeID(EmployeeID);
    setName(result.data[0].fullname);
    setLocation(result.data[0].Location);
    setlobName(result.data[0].lob_Name);
    setEmail(result.data[0].Email);
    setShowModal(true);
  };

  const DeleteEMP = async (EmpCode) => {
    // console.warn(EmpCode)
    if (confirm(`Are you sure you want to delete ${EmpCode} ?`)) {
      let result = await fetch(
        `http://127.0.0.1:2228/CRM/deleteDataByID/${EmpCode}`,
        {
          method: "Delete",
          headers: {
            authorization: JSON.parse(localStorage.getItem("jwt_Token")),
          },
        }
      );
      if (result) {
      }

      if (result.status == 200) {
        result = await result.json();
        toast.success(`${result.msg}`, {
          position: "top-right",
        });
        getAllClient();
      } else {
        result = await result.json();
        toast.error(`${result.msg}`, {
          position: "top-right",
        });
      }
    }
  };

  // console.log("name", name);
  const COLUMNS = [
    {
      Header: "Employee ID",
      accessor: "userID",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "LOB Name",
      accessor: "lob_Name",
      Cell: (row) => {
        return <span>#{row?.cell?.value}</span>;
      },
    },
    {
      Header: "Avtar",
      accessor: "imgPath",
      Cell: (row) => {
        //console.log("Row Data is ",row.cell.value);;
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                {row.cell.value != "NULL" ? (
                  <img
                    src=""
                    alt="logo"
                    className="object-cover w-full h-full rounded-full"
                  />
                ) : (
                  <img
                    src={User_default}
                    alt="logo_user"
                    className="object-cover w-full h-full rounded-full"
                  />
                )}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "Name",
      accessor: "fullname",
      Cell: (row) => {
        //console.log("Row Data is ",row.cell.value);;
        return (
          <div>
            <span className="inline-flex items-center">
              {/* <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600"> */}
              {/* // src={row?.cell?.value.image} */}
              {/* { <img src=""alt="logo" className="object-cover w-full h-full rounded-full" /> } */}
              {/* </span> */}
              <span className="text-sm text-slate-600 dark:text-slate-300 capitalize">
                {row.cell.value}
              </span>
            </span>
          </div>
        );
      },
    },
    {
      Header: "designation",
      accessor: "designation",
      Cell: (row) => {
        return <span>{row.cell.value}</span>;
      },
    },
    {
      Header: "Email",
      accessor: "Email",
      Cell: (row) => {
        return <span>{row.cell.value}</span>;
      },
    },
    {
      Header: "userType",
      accessor: "userType",
      Cell: (row) => {
        return <span>{row?.cell?.value}</span>;
      },
    },
    {
      Header: "status",
      accessor: "ActiveStatus",
      Cell: (row) => {
        return (
          <span className="block w-full" onChange={userStatushandler}>
            <Switch
              label={row?.cell?.value}
              activeClass="bg-success-500"
              value={row?.cell?.value}
              prevIcon="heroicons-outline:check"
              nextIcon="heroicons-outline:x"
            />
          </span>
        );
      },
    },
    {
      Header: "action",
      accessor: "ID",
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse">
            <Tooltip
              content="Edit"
              placement="top"
              arrow
              animation="shift-away"
              theme="success"
            >
              <button
                onClick={() => {
                  GetEmpDetails(row?.cell?.value);
                }}
                className="action-btn"
                type="button"
              >
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip
              content="Delete"
              placement="top"
              arrow
              animation="shift-away"
              theme="danger"
            >
              <button
                className="action-btn"
                type="button"
                onClick={() => DeleteEMP(row.value)}
              >
                <Icon icon="heroicons:trash" />
              </button>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const IndeterminateCheckbox = React.forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = React.useRef();
      const resolvedRef = ref || defaultRef;

      React.useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate;
      }, [resolvedRef, indeterminate]);

      return (
        <>
          <input
            type="checkbox"
            ref={resolvedRef}
            {...rest}
            className="table-checkbox"
          />
        </>
      );
    }
  );

  //

  useEffect(() => {
    getAllClient();
  }, []);

  const getAllClient = async () => {
    let result = await fetch("http://127.0.0.1:2228/CRM/getData", {
      headers: {
        authorization: JSON.parse(localStorage.getItem("jwt_Token")),
      },
    });
    result = await result.json();
    SetclientList(result.data);
  };

  const columns = useMemo(() => COLUMNS, []);
  const data = useMemo(() => clientList);

  const tableInstance = useTable(
    {
      columns,
      data,
    },

    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect,

    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
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

  return (
    <>
      <Card>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{title}</h4>
          <div>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          </div>
        </div>
        <div className="overflow-x-auto -mx-6">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden ">
              <table
                className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700"
                {...getTableProps}
              >
                <thead className="bg-slate-200 dark:bg-slate-700">
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
                            <td {...cell.getCellProps()} className="table-td">
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
            <select
              className="form-control py-2 w-max"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
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
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canPreviousPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                Prev
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
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className={` ${
                  !canNextPage ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
        {/*end*/}
      </Card>

      {/* Modal Start  */}
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[99999]"
          onClose={!disableBackdrop ? closeModal : returnNull}
        >
          {!disableBackdrop && (
            <Transition.Child
              as={Fragment}
              enter={noFade ? "" : "duration-300 ease-out"}
              enterFrom={noFade ? "" : "opacity-0"}
              enterTo={noFade ? "" : "opacity-100"}
              leave={noFade ? "" : "duration-200 ease-in"}
              leaveFrom={noFade ? "" : "opacity-100"}
              leaveTo={noFade ? "" : "opacity-0"}
            >
              <div className="fixed inset-0 bg-slate-900/50 backdrop-filter backdrop-blur-sm" />
            </Transition.Child>
          )}

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`flex min-h-full justify-center text-center p-6 ${
                centered ? "items-center" : "items-start "
              }`}
            >
              <Transition.Child
                as={Fragment}
                enter={noFade ? "" : "duration-300  ease-out"}
                enterFrom={noFade ? "" : "opacity-0 scale-95"}
                enterTo={noFade ? "" : "opacity-100 scale-100"}
                leave={noFade ? "" : "duration-200 ease-in"}
                leaveFrom={noFade ? "" : "opacity-100 scale-100"}
                leaveTo={noFade ? "" : "opacity-0 scale-95"}
              >
                <Dialog.Panel
                  className={`w-full transform overflow-hidden rounded-md
                 bg-white dark:bg-slate-800 text-left align-middle shadow-xl transition-alll max-w-xl`}
                >
                  <div
                    className={`relative overflow-hidden py-4 px-5 text-white flex justify-between bg-slate-900 dark:bg-slate-800 dark:border-b dark:border-slate-700  `}
                  >
                    <h2 className="capitalize leading-6 tracking-wider font-medium text-base text-white">
                      {title}
                    </h2>
                    <button onClick={closeModal} className="text-[22px]">
                      <Icon icon="heroicons-outline:x" />
                    </button>
                  </div>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 "
                  >
                    <div
                      className={`px-6 py-8 ${
                        scrollContent ? "overflow-y-auto max-h-[400px]" : ""
                      }`}
                    >
                      <Textinput
                        name="EmployeeID"
                        label="EmployeeID"
                        defaultValue={EmployeeID}
                        type="text"
                        placeholder="Enter Your Name"
                        readonly
                        register={register}
                      />
                      <label className="form-label" htmlFor="mul_1">
                        LOB Name
                      </label>
                      <Select
                        label="LOB Name "
                        isClearable={false}
                        styles={styles}
                        isMulti
                        name="lob_Name"
                        options={lobNameList}
                        className="react-select"
                        classNamePrefix="select"
                        id="mul_1"
                        onChange={(e) => {
                          setlobName(e);
                        }}
                      />
                      <label className="form-label" htmlFor="mul_1">
                        Location
                      </label>
                      <Select
                        isClearable={false}
                        styles={styles}
                        name="location"
                        value={
                          location
                            ? locationList.find((x) => x.value === location)
                            : locationList
                        }
                        options={locationList}
                        className="react-select"
                        classNamePrefix="select"
                        id="mul_1"
                        register={register}
                        onChange={(e) => {
                          setLocation(e.value);
                        }}
                      />
                      {/* {errors.language && <p>{errors.language.message}</p>} */}
                      <Textinput
                        name="fullname"
                        label="Name"
                        type="text"
                        defaultValue={name}
                        register={register}
                        error={errors.fullname}
                        msgTooltip
                      />
                      <Textinput
                        name="Email"
                        label="email"
                        type="email"
                        defaultValue={email}
                        register={register}
                        error={errors.email}
                        msgTooltip
                      />
                    </div>

                    <div className="px-4 py-3 flex justify-end space-x-3 border-t border-slate-100 dark:border-slate-700">
                      <button className="btn btn-dark  text-center">
                        Submit
                      </button>
                    </div>
                  </form>
                  {/* )} */}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ExampleTwo;
