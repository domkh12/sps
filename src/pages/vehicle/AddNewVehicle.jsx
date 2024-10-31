import { Button, Spinner } from "flowbite-react";
import { Form, Formik } from "formik";
import React from "react";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { LuSave } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

function AddNewVehicle() {
  const navigator = useNavigate();

  const validationSchema = Yup.object().shape({});

  const handleSubmit = async (values, { setSubmitting }) => {};

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };

  const content = (
    <>
      <h2 className="text-2xl font-medium dark:text-gray-100 p-5">
        Create Vehicle
      </h2>
      <Formik
        initialValues={{
          plateNumber: "",
          plateNameKh: "",
          plateNameEng: "",
          color: "",
          make: "",
          model: "",
          type: "",
          owner: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          touched,
          errors,
          handleChange,
          handleBlur,
          setFieldValue,
        }) => {
          return (
            <Form className="flex flex-col gap-5 pb-8">
              <div className="flex justify-center items-center gap-1">
                <div className="w-4 h-[1px] bg-gray-600"></div>
                <p className="whitespace-nowrap dark:text-gray-200">
                  Vehicle Information
                </p>
                <div className="w-full h-[1px] bg-gray-600"></div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-5 gap-x-10 px-5"></div>
              <div className="flex gap-4 px-5">
                <Button
                  className="bg-transparent focus:ring-0 border border-primary text-primary dark:text-gray-50"
                  onClick={handleBtnBackClicked}
                >
                  <IoReturnDownBackOutline className="mr-2" /> Back
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover focus:ring-0 w-24"
                  title="Save"
                  // disabled={isLoading}
                >
                  {/* {isLoading ? (
                    <Spinner color="purple" aria-label="loading" size="xs" />
                  ) : (
                    <>
                      <LuSave className="mr-2" />
                      Save
                    </>
                  )} */}
                  <LuSave className="mr-2" />
                  Save
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </>
  );

  return content;
}

export default AddNewVehicle;
