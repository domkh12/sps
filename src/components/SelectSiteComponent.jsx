import { useState } from "react";
import { selectMenuStyle } from "../assets/style";
import {
  FormControl,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";

function SelectSiteComponent({
  label,
  options,
  onChange,
  className,
  fullWidth,
  error,
  touched,
  optionLabelKey = "label",
  selectFistValue,
}) {
  const [valueSelect, setValueSelect] = useState("");
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    sx: {
      ...selectMenuStyle,
    },
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  console.log("options", options);
  const hasError = error && touched;

  const handleChange = (event) => {
    setValueSelect(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl
      className={className}
      fullWidth={fullWidth}
      error={hasError}
      sx={{ border: "transparent", outline: "none" }}
    >
      <Select
        labelId={`${label}_label`}
        id={label}
        label={label}
        MenuProps={MenuProps}
        value={selectFistValue ? selectFistValue : valueSelect}
        onChange={handleChange}
        sx={{
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "transparent",
          },
          "&.MuiOutlinedInput-root": {
            borderColor: "transparent",
            bgcolor: "transparent",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&:hover": {
              borderColor: "transparent",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "transparent",
            },
            "&.Mui-focused": {
              borderColor: "transparent",
            },
          },
          "& .MuiSelect-select": {
            padding: "0",
          },
        }}
      >
        {options?.length
          ? options.map((option) => (
              <MenuItem
                key={option.uuid}
                sx={{
                  borderRadius: "5px",
                }}
                value={option.uuid}
              >
                <div className="flex items-center gap-3">
                  <div className="w-[30px] h-[30px] overflow-hidden rounded-full">
                    <img
                      src={option?.image || "/images/logoPlaceholder.jpg"}
                      alt={option?.uuid}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  {option[optionLabelKey]}
                </div>
              </MenuItem>
            ))
          : null}
      </Select>
      <FormHelperText error={hasError}>
        {hasError ? error : null}
      </FormHelperText>
    </FormControl>
  );
}

export default SelectSiteComponent;
