import React from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Icon from "@/components/ui/Icon";
import Button from "@/components/ui/Button";
import { useForm, useFieldArray } from "react-hook-form";
const FormRepeater = () => {
  const { register, control, handleSubmit, reset, trigger, setError } = useForm(
    {
      defaultValues: {
        addDept: [{ firstName: "", lastName: "", phone: "" }],
      },
    }
  );
  const { fields, append, remove } = useFieldArray({
    control,
    name: "addDept",
  });
  const index = 1;

  let onSubmit = async (data) => {
    console.log(data);
    let result = await fetch("http://127.0.0.1:2228/CRM/addDept", {
      method: "post",
      body: JSON.stringify({ data: data }),
      headers: {
        "Content-Type": "application/json",
        authorization: JSON.parse(localStorage.getItem("jwt_Token")),
      },
    });
  };

  return (
    <div>
      <Card
        title="Add Department"
        headerslot={
          <Button
            text="Add new"
            icon="heroicons-outline:plus"
            className="btn-dark"
            onClick={() => append()}
          />
        }
      >
        <form>
          {fields.map((item, index) => (
            <div
              className="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 grid gap-5 mb-5 last:mb-0"
              key={index}
            >
              <Textinput
                label="Department Name"
                type="text"
                id={`name${index}`}
                placeholder="First Name"
                register={register}
                name={`test[${index}].firstName`}
              />

              <Textinput
                label="Department Location"
                type="text"
                id={`name2${index}`}
                placeholder="Last Name"
                register={register}
                name={`test[${index}].lastName`}
              />
              <div className="flex justify-between items-end space-x-5">
                <div className="flex-1">
                  <Textinput
                    label="HOD Name"
                    type="text"
                    id={`name2${index}`}
                    placeholder="Enter Head of Department"
                    register={register}   
                    name={`test[${index}].lastName`}
                  />
                </div>
                <div className="flex-none relative">
                  <button
                    onClick={() => remove(index)}
                    type="button"
                    className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                  >
                    <Icon icon="heroicons-outline:trash" />
                  </button>
                </div>
              </div>
              <Textinput
                label="HOD's Email"
                type="text"
                id={`name2${index}`}
                placeholder="Enter Head of Department"
                register={register}
                name={`test[${index}].lastName`}
              />
              <Textinput
                label="Department Email"
                type="text"
                id={`name2${index}`}
                placeholder="Enter Head of Department"
                register={register}
                name={`test[${index}].lastName`}
              />

              <div className="flex justify-between items-end space-x-5">
                <div className="flex-1">
                  <Textinput
                    label="Phone"
                    type="text"
                    id={`name3${index}`}
                    placeholder="Phone"
                    register={register}
                    name={`test[${index}].phone`}
                  />
                </div>
                <div className="flex-none relative">
                  <button
                    type="button"
                    className="inline-flex items-center justify-center h-10 w-10 bg-success-500 text-lg border rounded border-success-500 text-white"
                    style={{
                      height: "20px",
                      width: "20px",
                    }}
                  >
                    <Icon icon="fluent-mdl2:calculator-addition" />
                  </button>
                  {"\u00A0"}
                  <button
                    // onClick={() => remove(index)}
                    type="button"
                    className="inline-flex items-center justify-center h-10 w-10 bg-danger-500 text-lg border rounded border-danger-500 text-white"
                    style={{
                      height: "20px",
                      width: "20px",
                    }}
                  >
                    <Icon icon="subway:subtraction-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="ltr:text-right rtl:text-left">
            <Button
              text="Submit"
              className="btn-dark"
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default FormRepeater;
