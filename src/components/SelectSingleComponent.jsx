import {  useState } from "react";
import { selectMenuStyle, selectStyle } from "../assets/style";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
} from "@mui/material";

function SelectSingleComponent({
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
        width: "auto",
      },
    },
  };

  const hasError = error && touched;

  const handleChange = (event) => {
    setValueSelect(event.target.value);
    onChange(event.target.value);
  };

  return (
    <FormControl className={className} fullWidth={fullWidth} error={hasError}>
      <InputLabel id={`${label}_label`} error={hasError}>
        {label}
      </InputLabel>
      <Select
        labelId={`${label}_label`}
        id={label}
        label={label}
        MenuProps={MenuProps}
        value={selectFistValue ? selectFistValue : valueSelect}
        onChange={handleChange}
        sx={{
          ...selectStyle,
          ...(hasError && {
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#f44336",
            },
          }),
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
                {option[optionLabelKey]}
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

export default SelectSingleComponent;
