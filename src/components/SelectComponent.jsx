import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  FormHelperText,
  ListSubheader,
} from "@mui/material";
import { selectMenuStyle, selectStyle } from "../assets/style";

const SelectComponent = ({
  label,
  options,
  onChange,
  fullWidth,
  error,
  touched,
  optionLabelKey = "",
  groupLabelKey = "",
  itemsLabelKey = "items",
  value,
  width60,
  selectFistValue,
}) => {
  const [valueSelect, setValueSelect] = useState([]);
  const [selectedUUIDs, setSelectedUUIDs] = useState([]);

  useEffect(() => {
    if (selectFistValue) {
      if (options) {
        let initialValues = [];
        let initialUUIDs = [];
        if (groupLabelKey) {
          options.forEach((group) => {
            const items = group[itemsLabelKey] || [];
            items.forEach((item) => {
              if (selectFistValue.includes(item.uuid)) {
                initialValues.push(item[optionLabelKey]);
                initialUUIDs.push(item.uuid);
              }
            });
          });
        } else {
          initialValues = options
            .filter((option) => selectFistValue.includes(option.uuid))
            .map((option) => option[optionLabelKey]);
          initialUUIDs = selectFistValue;
        }
        setValueSelect(initialValues);
        setSelectedUUIDs(initialUUIDs);
      }
    } else if (value && options) {
      let initialValues = [];
      let initialUUIDs = [];

      if (groupLabelKey) {
        options.forEach((group) => {
          const items = group[itemsLabelKey] || [];
          items.forEach((item) => {
            if (value.includes(item.uuid)) {
              initialValues.push(item[optionLabelKey]);
              initialUUIDs.push(item.uuid);
            }
          });
        });
      } else {
        initialValues = options
          .filter((option) => value.includes(option.uuid))
          .map((option) => option[optionLabelKey]);
        initialUUIDs = value;
      }
      setValueSelect(initialValues);
      setSelectedUUIDs(initialUUIDs);
    }
  }, [
    value,
    options,
    optionLabelKey,
    groupLabelKey,
    itemsLabelKey,
    selectFistValue,
  ]);

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    let selectedUUIDsArray = [];

    if (groupLabelKey) {
      options.forEach((group) => {
        const items = group[itemsLabelKey] || [];
        items.forEach((item) => {
          if (selectedValues.includes(item[optionLabelKey])) {
            selectedUUIDsArray.push(item.uuid);
          }
        });
      });
    } else {
      selectedUUIDsArray = options
        .filter((option) => selectedValues.includes(option[optionLabelKey]))
        .map((option) => option.uuid);
    }

    setValueSelect(selectedValues);
    setSelectedUUIDs(selectedUUIDsArray);
    onChange(selectedUUIDsArray);
  };

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

  const hasError = Boolean(error && touched);

  const renderMenuItems = () => {
    if (!options || options.length === 0) return null;

    let menuItems = [];

    if (!groupLabelKey) {
      menuItems = options.map((option) => (
        <MenuItem
          key={option.uuid}
          value={option[optionLabelKey]}
          sx={{
            borderRadius: "5px",
            height: "40px",
            padding: "0",
            "& .MuiTypography-root": {
              fontSize: "15px",
            },
            paddingRight: "10px",
          }}
        >
          <Checkbox
            disableRipple
            checked={valueSelect.includes(option[optionLabelKey])}
          />
          <ListItemText primary={option[optionLabelKey]} />
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
              value={option[optionLabelKey]}
              sx={{
                borderRadius: "5px",
                height: "40px",
                padding: "0",
                "& .MuiTypography-root": {
                  fontSize: "15px",
                },
                paddingRight: "10px",
              }}
            >
              <Checkbox
                disableRipple
                checked={valueSelect.includes(option[optionLabelKey])}
              />
              <ListItemText primary={option[optionLabelKey]} />
            </MenuItem>
          );
        });
      });
    }
    return menuItems;
  };

  return (
    <FormControl
      className={`shrink-0 sm:w-full  ${width60 ? width60 : "xl:w-60"}`}
      error={hasError}
      fullWidth={fullWidth}
    >
      <InputLabel id={label + "_label"} error={hasError}>
        {label}
      </InputLabel>
      <Select
        labelId={label + "_label"}
        id={label}
        label={label}
        multiple
        value={valueSelect}
        onChange={handleChange}
        renderValue={(selected) => selected.join(", ")}
        MenuProps={MenuProps}
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
};

export default SelectComponent;
