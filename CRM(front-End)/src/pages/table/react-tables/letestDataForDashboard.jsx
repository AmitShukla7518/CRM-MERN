import React, { useState, useMemo, useEffect } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import User_default from "@/assets/images/all-img/User_default.jpg";

import axios from "axios";

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

const LetestDataForDashboard = ({ title = "Today's Entry" }) => {
  const [clientList, SetclientList] = useState([]);

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
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="w-7 h-7 rounded-full ltr:mr-3 rtl:ml-3 flex-none bg-slate-600">
                {row.cell.value != "NULL" ? (
                  <img
                    src={`http://localhost:2228/public/logo/${row.cell.value}`}
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
  ];

  useEffect(() => {
    getAllClient();
  }, []);

  const getAllClient = async () => {
    let letestEntry = "yes";
    let result = await fetch("http://127.0.0.1:2228/CRM/getData", {
      method: "post",
      body: JSON.stringify({ letestEntry: letestEntry }),
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("jwt_Token")),
      },
    });
    result = await result.json();
    SetclientList(result.data);

    /*
    let hello = await axios({
      method: "GET",
      url: `http://127.0.0.1:2228/CRM/getData`,
      headers: { Authorization: `${localStorage.getItem("jwt_Token")}` },
      body: { letestEntry: "yes" },
    });

    SetclientList(hello.data.data);
    */
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
          Header: ({ getToggleAllRowsSelectedProps }) => <div></div>,
          Cell: ({ row }) => <div></div>,
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
        {clientList.length === 0 ? (
        <p className="text-center mt-4">No data found</p>
      ) : (
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
      )}
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
    </>
  );
};

export default LetestDataForDashboard;
