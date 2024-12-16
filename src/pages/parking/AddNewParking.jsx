import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  InputBase,
  Snackbar,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { PiXThin } from "react-icons/pi";
import { useAddNewParkingMutation } from "../../redux/feature/parking/parkingApiSlice";
import { toast } from "react-toastify";

export default function AddNewParking() {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const theme = useTheme();

  const ListItem = styled("li")(({ theme }) => ({
    margin: theme.spacing(0.5),
  }));

  const [addNewParking, { isSuccess: isAddNewParkingSuccess }] =
    useAddNewParkingMutation();

  const validationSchema = Yup.object().shape({
    parkingName: Yup.string()
      .required("Parking name is required") // Required field
      .min(3, "Parking name must be at least 3 characters long"), // Minimum length
    parkingSlotsName: Yup.array().of(
      Yup.object().shape({
        label: Yup.string().required("Slot label is required"), // Required label for each slot
      })
    ),
  });

  const handleSubmit = async (values,{ resetForm }) => {
    const updatedValues = {
      ...values,
      parkingSlotsName: values.parkingSlotsName.map((slot) => slot.label),
    };
    console.log(updatedValues);
    await addNewParking(updatedValues);
    resetForm();
  };

  useEffect(() => {
    if (isAddNewParkingSuccess) {
      toast.success("Create Parking Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  }, [isAddNewParkingSuccess]);

  let content;
  content = (
    <>
      <Box
        component="div"
        sx={{
          paddingX: "2rem",
          bgcolor: "background.default",
          color: "text.primary",
          height: "100%",
        }}
      >
        <Formik
          initialValues={{ parkingName: "", parkingSlotsName: [] }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => {          

            const handleDelete = (slotToDelete) => () => {
              setFieldValue(
                "parkingSlotsName",
                values.parkingSlotsName.filter(
                  (slot) => slot.label !== slotToDelete.label
                )
              );
            };

            const handleKeyDown = (event) => {
              // New function to handle key down events
              if (event.key === "Enter" && inputValue.trim()) {
                // Update to use setFieldValue for parkingSlotsName
                setFieldValue("parkingSlotsName", [
                  ...values.parkingSlotsName,
                  { label: inputValue },
                ]);

                setInputValue(""); // Clear input after adding slot
                event.preventDefault(); // Prevent form submission
              }
            };
            return (
              <Form>
                <h1 className="text-2xl font-medium dark:text-gray-100 py-4 ">
                  Create Parking
                </h1>

                <TextField
                  id="outlined-basic"
                  sx={{
                    "& .MuiInputBase-input": {
                      boxShadow: "none",
                    },
                  }}
                  autoComplete="off"
                  fullWidth
                  variant="outlined"
                  placeholder="Enter Parking Name"
                  name="parkingName"
                  value={values.parkingName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.parkingName && touched.parkingName && (
                  <div style={{ color: "red", marginBottom: "8px" }}>
                    {errors.parkingName}
                  </div>
                )}

                <Card
                  variant="outlined"
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    flexWrap: "wrap",
                    listStyle: "none",
                    px: 0.5,
                    py: 1.5,
                    m: 0,
                    mt: 2,
                    outline: isFocused
                      ? theme.palette.mode === "dark"
                        ? "2px solid white"
                        : "2px solid black"
                      : "none",
                    position: "relative",
                  }}
                  component="ul"
                >
                  {values.parkingSlotsName.length > 0 && (
                    <IconButton
                      variant="outlined"
                      onClick={() => setFieldValue("parkingSlotsName", [])} // Clear the chip data
                      sx={{
                        position: "absolute", // Position the button absolutely
                        top: 8, // Adjust top position
                        right: 8,
                        zIndex: 1,
                      }}
                    >
                      <PiXThin />
                    </IconButton>
                  )}

                  {values.parkingSlotsName.map((data, index) => (
                    <ListItem key={index}>
                      <Chip label={data.label} onDelete={handleDelete(data)} />
                    </ListItem>
                  ))}

                  <InputBase
                    sx={{
                      ml: 1,
                      flex: 1,
                      "& .MuiInputBase-input": {
                        boxShadow: "none",
                      },
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={
                      values.parkingSlotsName.length === 0
                        ? "Add Parking Slot"
                        : ""
                    }
                    inputProps={{ "aria-label": "search google maps" }}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </Card>
                {errors.parkingSlotsName && touched.parkingSlotsName && (
                  <div style={{ color: "red", marginBottom: "8px" }}>
                    {errors.parkingSlotsName}
                  </div>
                )}

                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                  }}
                  type="submit"
                >
                  Create
                </Button>
              </Form>
            );
          }}
        </Formik>
      </Box>
    </>
  );

  return content;
}
