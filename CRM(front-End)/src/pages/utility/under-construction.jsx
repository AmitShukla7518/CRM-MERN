import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Fileinput from "@/components/ui/Fileinput";
import { tableData } from "@/constant/table-data";
import { toast } from "react-toastify";
import * as XLSX from "xlsx"; // import xlsx library
import Button from "@/components/ui/Button";

const columns = [
  {
    label: "Employee ID",
    field: "EmployeeID",
  },
  {
    label: "LOB Name",
    field: "LOBName",
  },
  {
    label: "Name",
    field: "Name",
  },
  {
    label: "Phone",
    field: "Phone",
  },
  {
    label: "Email",
    field: "Email",
  },
];
const columns1 = [
  {
    label: "Sr.No",
    field: "Sr.No",
  },
  {
    label: "LOB Name",
    field: "LOBName",
  },
  {
    label: "Name",
    field: "Name",
  },
  {
    label: "Phone",
    field: "Phone",
  },
  {
    label: "Email",
    field: "Email",
  },
];
// slice(0, 10) is used to limit the number of rows to 10
const rows = tableData.slice(0, 7);
const UnderConstructionPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uniqueData, setUniqueData] = useState([]);
  const [duplicateData, setDuplicateData] = useState([]);
  const handleFileChange = async (e) => {
    setSelectedFile(e.target.files[0]);
    const Body = new FormData();
    Body.append("excelFile", e.target.files[0]);
    let result = await fetch("http://127.0.0.1:2228/CRM/bulkUpload", {
      method: "post",
      body: Body,
      headers: {
        authorization: JSON.parse(localStorage.getItem("jwt_Token")),
      },
    });

    if (result.status == 200) {
      result = await result.json();
      setUniqueData(result.uniqueData);
      setDuplicateData(result.duplicateData);
      console.log(result.uniqueData);
      toast.success(`${result.msg}`, {
        position: "top-right",
      });
      toast.warning(
        `After Successfull Stored Entry can  use "PassWord only One time"`,
        {
          position: "top-right",
        }
      );
      toast.error(`${result.err}`, {
        position: "top-right",
      });
    } else {
      result = await result.json();
      toast.error(`${result.msg}`, {
        position: "top-right",
      });
    }
  };

  let sizeHeading = { fontSize: "14px" };

  let count = 1;

  // Excel All Duplicate Data
  const handleExportExcel = () => {
    // convert duplicateData array to sheet object
    const sheet = XLSX.utils.json_to_sheet(duplicateData);
    // convert sheet object to workbook object
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Duplicate Data");
    // generate and download the excel file
    XLSX.writeFile(workbook, "DuplicateData.xlsx");
  };

  return (
    <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
      <div className="xl:col-span-2 col-span-1">
        <Card title="Import Excel file ">
          <Fileinput
            name="basic"
            badge
            selectedFile={selectedFile}
            onChange={handleFileChange}
          />
        </Card>
        <br></br>
        <div className="grid xl:grid-cols-2 grid-cols-1 gap-5">
          <Card title="Imported Unique Data " noborder>
            <div className="overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                    <thead className="bg-slate-200 dark:bg-slate-700">
                      <tr>
                        {columns.map((column, i) => (
                          <th
                            key={i}
                            scope="col"
                            className=" table-th "
                            style={sizeHeading}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      {uniqueData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns.length}
                            className="text-center py-4"
                          >
                            No Data Found
                          </td>
                        </tr>
                      ) : (
                        uniqueData.map((row, i) => (
                          <tr key={i}>
                            <td className="table-td">{row.userID}</td>
                            <td className="table-td">{row.lob_Name}</td>
                            <td className="table-td">{row.fullname}</td>
                            <td className="table-td">{row.phone}</td>
                            <td className="table-td ">{row.Email}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Imported Duplicated Data"  noborder>
            {/* <button onClick={handleExportExcel}>Export Data</button> */}
            
            {duplicateData.length != 0 ? (
            <Button
              text="Export"
              className="btn-dark"
              onClick={handleExportExcel}
            style={{}}
            />
            ):""}
            

            <div className="overflow-x-auto -mx-6">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden ">
                  <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                    <thead className="bg-slate-200 dark:bg-slate-700">
                      <tr>
                        {columns1.map((column, i) => (
                          <th
                            key={i}
                            scope="col"
                            className=" table-th "
                            style={sizeHeading}
                          >
                            {column.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700">
                      {duplicateData.length === 0 ? (
                        <tr>
                          <td
                            colSpan={columns1.length}
                            className="text-center py-4"
                          >
                            No Data Found
                          </td>
                        </tr>
                      ) : (
                        duplicateData.map((row, i) => (
                           <tr key={i}>
                            <td className="table-td">{count++}</td>
                            <td className="table-td">{row.LOB_Name}</td>
                            <td className="table-td">{row.Name}</td>
                            <td className="table-td">{row.Phone}</td>
                            <td className="table-td ">{row.Email}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
