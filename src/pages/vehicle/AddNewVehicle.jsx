import { Button, Checkbox, Label, Modal, TextInput, useThemeMode } from "flowbite-react";
import { Form, Formik } from "formik";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { LuRectangleHorizontal, LuSave } from "react-icons/lu";
import { MdOutlineColorLens } from "react-icons/md";
import { PiCarThin } from "react-icons/pi";
import { TbUser } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import ImageUpload from "./components/ImageUpload";
import { FaChevronDown } from "react-icons/fa";

function AddNewVehicle() {
  const navigator = useNavigate();
  const { mode } = useThemeMode();

  const validationSchema = Yup.object().shape({
    plateNameKh: Yup.string()
      .matches(/^[\u1780-\u17FF\s]+$/, "Only Khmer characters are allowed")
      .required("License Plate Kh Name is required"),
    plateNameEng: Yup.string()
      .matches(/^[A-Za-z\s]+$/, "Only English characters are allowed")
      .required("License Plate Eng Name is required"),
    plateNumber: Yup.string()
      .min(2, "Plate Number must be at least 2 characters")
      .max(20, "Plate Number cannot exceed 20 characters")
      .required("License Plate Number is required"),
    make: Yup.string()
      .min(2, "Vehicle Make be at least 2 characters")
      .max(40, "Vehicle Make cannot exceed 40 characters")
      .required("Vehicle Make is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {};

  const handleBtnBackClicked = () => {
    navigator("/dash/vehicles");
  };
  const content = (
    <>
      <h2 className="text-2xl font-medium  dark:text-gray-100 p-5">
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
              <div className="grid lg:grid-cols-1 gap-5 gap-x-10 px-5">
                <div className="grid gap-5">
                  <section className="grid grid-cols-2 gap-x-10 gap-y-5 lg:grid-cols-1">
                    <div className="flex flex-col gap-5">
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <LuRectangleHorizontal />
                          License Plate Number
                          <span className="text-red-600">*</span>
                        </Label>
                        <TextInput
                          placeholder="Enter Plate Number"
                          style={{
                            backgroundColor: mode === "dark" ? "#1f2937" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                          id="plateNumber"
                          name="plateNumber"
                          type="text"
                          autoComplete="off"
                          value={values.plateNumber}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={
                            errors.plateNumber && touched.plateNumber
                              ? "failure"
                              : "default"
                          }
                        />
                        {errors.plateNumber && touched.plateNumber && (
                          <small className="text-red-600">
                            {errors.plateNumber}
                          </small>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <Label className="flex gap-2 mb-2">
                            <LuRectangleHorizontal className="" />
                            License Plate Kh Name
                            <span className="text-red-600">*</span>
                          </Label>
                          <TextInput
                            placeholder="Enter Plate Kh Name"
                            style={{
                              backgroundColor: mode === "dark" ? "#1f2937" : "",
                              color: mode === "dark" ? "white" : "",
                            }}
                            id="plateNameKh"
                            name="plateNameKh"
                            type="text"
                            autoComplete="off"
                            value={values.plateNameKh}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            color={
                              errors.plateNameKh && touched.plateNameKh
                                ? "failure"
                                : "default"
                            }
                          />
                          {errors.plateNameKh && touched.plateNameKh && (
                            <small className="text-red-600">
                              {errors.plateNameKh}
                            </small>
                          )}
                        </div>
                        <div>
                          <Label className="flex gap-2 mb-2">
                            <LuRectangleHorizontal className="" />
                            License Plate Eng Name
                            <span className="text-red-600">*</span>
                          </Label>
                          <TextInput
                            placeholder="Enter Plate Eng Name"
                            style={{
                              backgroundColor: mode === "dark" ? "#1f2937" : "",
                              color: mode === "dark" ? "white" : "",
                            }}
                            id="plateNameEng"
                            name="plateNameEng"
                            type="text"
                            autoComplete="off"
                            value={values.plateNameEng}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            color={
                              errors.plateNameEng && touched.plateNameEng
                                ? "failure"
                                : "default"
                            }
                          />
                          {errors.plateNameEng && touched.plateNameEng && (
                            <small className="text-red-600">
                              {errors.plateNameEng}
                            </small>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col w-[325px] h-[150px] mb-5">
                      <Label className="mb-2">Preview</Label>
                      <div className="p-2 h-full shrink-0 bg-gradient-to-b from-blue-700 via-blue-600 to-blue-500 rounded-lg shadow-lg ">
                        <div className="h-full grid grid-rows-12 grid-cols-1 justify-center items-center text-center py-2 rounded-md bg-gray-50 shadow-inner">
                          <p className="text-blue-600 text-lg row-span-3">
                            {values.plateNameKh || "xxxxx"}
                          </p>
                          <span className="text-blue-600 text-3xl row-span-6">
                            {values.plateNumber || "xx-xxxx"}
                          </span>
                          <div className="h-[2px] rounded-full bg-blue-600 row-span-1 mx-3"></div>
                          <p className="text-red-600 text-sm row-span-2">
                            {values.plateNameEng || "xxxxx"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="grid grid-cols-2 gap-x-10 gap-y-5 lg:grid-cols-1">
                    <div className="grid gap-y-5">
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Make (Toyota, Ford)
                          <span className="text-red-600">*</span>
                        </Label>
                        <TextInput
                          placeholder="Enter Vehicle Make"
                          style={{
                            backgroundColor: mode === "dark" ? "#1f2937" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                          id="make"
                          name="make"
                          type="text"
                          autoComplete="off"
                          value={values.make}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={
                            errors.make && touched.make ? "failure" : "default"
                          }
                        />
                        {errors.make && touched.make && (
                          <small className="text-red-600">{errors.make}</small>
                        )}
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Model (Camry, Mustang)
                          <span className="text-red-600">*</span>
                        </Label>
                        <TextInput
                          placeholder="Enter Vehicle Model"
                          style={{
                            backgroundColor: mode === "dark" ? "#1f2937" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                          id="model"
                          name="model"
                          type="text"
                          autoComplete="off"
                          value={values.make}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={
                            errors.make && touched.make ? "failure" : "default"
                          }
                        />
                        {errors.make && touched.make && (
                          <small className="text-red-600">{errors.make}</small>
                        )}
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <PiCarThin />
                          Vehicle Type
                          <span className="text-red-600">*</span>
                        </Label>
                        <TextInput
                          placeholder="Enter Vehicle Model"
                          style={{
                            backgroundColor: mode === "dark" ? "#1f2937" : "",
                            color: mode === "dark" ? "white" : "",
                          }}
                          id="model"
                          name="model"
                          type="text"
                          autoComplete="off"
                          value={values.make}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          color={
                            errors.make && touched.make ? "failure" : "default"
                          }
                        />
                        {errors.make && touched.make && (
                          <small className="text-red-600">{errors.make}</small>
                        )}
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <MdOutlineColorLens className="" />
                          Vehicle Color
                        </Label>
                        <div className="relative w-full">
                          <TextInput
                            type="text"
                            id="color"
                            name="color"
                            placeholder="Select Color"
                            className="w-full"
                            value={values.color}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            style={{
                              backgroundColor: mode === "dark" ? "#1f2937" : "",
                              color: values.color,
                              borderColor: values.color,
                            }}
                            color={"default"}
                          />

                          <input
                            type="color"
                            id="colorCodeSelection"
                            className="absolute top-2 right-2 "
                            value={values.color}
                            onChange={(e) => {
                              setFieldValue("color", e.target.value);
                            }}
                            onBlur={handleBlur}
                          />
                        </div>
                        {errors.make && touched.make && (
                          <small className="text-red-600">{errors.make}</small>
                        )}
                      </div>
                      <div>
                        <Label className="flex gap-2 mb-2">
                          <TbUser />
                          Owner
                          <span className="text-red-600">*</span>
                        </Label>
                        <div className="relative">
                          <TextInput
                            style={{
                              backgroundColor: mode === "dark" ? "#1f2937" : "",
                            }}
                            color={"default"}
                          />
                          <span>
                            <FaChevronDown className="absolute top-3 right-3" />
                          </span>

                          <div className="absolute top-0 left-0 bg-red-600 w-full rounded-lg">
                            <div className="px-3 flex justify-start items-center py-2 gap-3">
                              <Checkbox id="user" name="user"/>
                              <Label htmlFor="user">Ei Chanudom</Label>
                            </div>
                          </div>
                       
                        </div>
                      </div>
                    </div>
                    <div>
                      <ImageUpload />
                    </div>
                  </section>
                </div>
              </div>

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
