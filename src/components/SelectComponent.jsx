import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
  Typography,
} from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { selectMenuStyle, selectStyle } from "../assets/style";

const SelectComponent = ({
  label,
  labelId,
  id,
  options,
  onChange,
  nameKey = "name",
  idKey = "id",
  styleProps,
  menuStyleProps,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCheckboxChange = (option) => {
    onChange(option);
    console.log(option);
  };

  return (
    <FormControl className="shrink-0 sm:w-full xl:w-60">
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        id={id}
        label={label}
        open={isOpen}
        onOpen={handleOpen}
        onClose={handleClose}
        sx={{
          ...selectStyle,
          ...styleProps,
        }}
        IconComponent={() => (
          <IconButton
            disableRipple
            onClick={() => {
              isOpen ? handleClose() : handleOpen();
            }}
          >
            {isOpen ? (
              <IoIosArrowUp className="w-5 h-5 mr-[5px]" />
            ) : (
              <IoIosArrowDown className="w-5 h-5 mr-[5px]" />
            )}
          </IconButton>
        )}
        MenuProps={{
          sx: {
            ...selectMenuStyle,
            ...menuStyleProps,
          },
        }}
      >
        <List dense={true}>
          {options?.length
            ? options.map((option) => (
                <ListItemButton
                  key={option[idKey]}
                  sx={{
                    borderRadius: "6px",
                    fontSize: "12px",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      "& .MuiListItemIcon-root": {
                        color: "#2C3092",
                      },
                    }}
                  >
                    <Checkbox
                      edge="start"
                      tabIndex={-1}
                      disableRipple
                      onChange={() => handleCheckboxChange(option)}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={option[idKey]}
                    primary={
                      <Typography variant="body2">{option[nameKey]}</Typography>
                    }
                  />
                </ListItemButton>
              ))
            : null}
        </List>
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
