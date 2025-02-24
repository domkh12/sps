import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  FormHelperText,
  ListSubheader,
} from "@mui/material";
import { selectMenuStyle, selectStyle } from "../assets/style";
import DataNotFound from "./DataNotFound";

function SelectSingleComponent({
  label,
  options,
  onChange,
  className,
  fullWidth,
  error,
  touched,
  optionLabelKey = "label",
  groupLabelKey = "",
  itemsLabelKey = "items",
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

  const [selectedUUID, setSelectedUUID] = useState("");

  useEffect(() => {
    if (selectFistValue) {
      setSelectedUUID(selectFistValue);
      setValueSelect(
        findLabelByUuid(
          selectFistValue,
          options,
          optionLabelKey,
          groupLabelKey,
          itemsLabelKey
        )
      );
    }
  }, [selectFistValue, options]);

  const findLabelByUuid = (
    uuid,
    options,
    optionLabelKey,
    groupLabelKey,
    itemsLabelKey
  ) => {
    if (!uuid || !options) return "";
    if (groupLabelKey) {
      for (const group of options) {
        const items = group[itemsLabelKey] || [];
        for (const item of items) {
          if (item.uuid === uuid) {
            return item[optionLabelKey];
          }
        }
      }
    } else {
      const foundOption = options.find((option) => option.uuid === uuid);
      return foundOption ? foundOption[optionLabelKey] : "";
    }
    return "";
  };
  const handleChange = (event) => {
    const newValue = event.target.value;
    setSelectedUUID(newValue);
    setValueSelect(
      findLabelByUuid(
        newValue,
        options,
        optionLabelKey,
        groupLabelKey,
        itemsLabelKey
      )
    );

    onChange(newValue);
  };

  const renderMenuItems = () => {
    if (!options || options.length === 0) {
      return (
        <div className="py-3">
          <DataNotFound />
        </div>
      );
    }

    let menuItems = [];
    if (!groupLabelKey) {
      menuItems = options.map((option) => (
        <MenuItem
          key={option?.uuid}
          sx={{
            borderRadius: "5px",
            height: "40px",
            "& .MuiTypography-root": {
              fontSize: "15px",
            },
            paddingRight: "10px",
          }}
          value={option?.uuid}
        >
          {option[optionLabelKey]}
        </MenuItem>
      ));
    } else {
      options.forEach((group) => {
        menuItems.push(
          <ListSubheader
            key={group[groupLabelKey]}
            sx={{
              backgroundColor: "#D5D6E9",
              borderRadius: "5px",
              color: "#2C3092",
              pointerEvents: "none",
            }}
          >
            {group[groupLabelKey]}
          </ListSubheader>
        );

        const items = group[itemsLabelKey] || [];
        items.forEach((option) => {
          menuItems.push(
            <MenuItem
              key={option.uuid}
              sx={{
                borderRadius: "5px",
                height: "40px",
                "& .MuiTypography-root": {
                  fontSize: "15px",
                },
                paddingRight: "10px",
              }}
              value={option?.uuid}
            >
              {option[optionLabelKey]}
            </MenuItem>
          );
        });
      });
    }

    return menuItems;
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
        value={selectedUUID}
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
        {renderMenuItems()}
      </Select>
      <FormHelperText error={hasError}>
        {hasError ? error : null}
      </FormHelperText>
    </FormControl>
  );
}

export default SelectSingleComponent;
