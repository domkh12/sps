import { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  MenuItem,
  FormHelperText,
  ListSubheader,
  TextField,
  InputAdornment,
} from "@mui/material";
import { selectStyle } from "../assets/style";
import { useSelector } from "react-redux";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import useTranslate from "../hook/useTranslate.jsx";
import DataNotFound from "./DataNotFound";

const SelectComponent = ({
                           label,
                           options,
                           onChange,
                           fullWuuidth,
                           error,
                           touched,
                           optionLabelKey = "name",
                           groupLabelKey = "",
                           itemsLabelKey = "rooms",
                           floorLabel = "",
                           buildingLabel = "",
                           value,
                           width60,
                           selectFistValue,
                         }) => {
  const [valueSelect, setValueSelect] = useState([]);
  const [selectedUuids, setSelectedUuids] = useState([]);
  const [searchText, setSearchText] = useState("");
  // const mode = useSelector((state) => state.theme.mode);
  const { t } = useTranslate();

  useEffect(() => {
    if (selectFistValue) {
      if (options) {
        let initialValues = [];
        let initialUuids = [];
        if (groupLabelKey) {
          options.forEach((group) => {
            const items = group[itemsLabelKey] || [];
            items.forEach((item) => {
              if (selectFistValue.includes(item.uuid)) {
                initialValues.push(item[optionLabelKey]);
                initialUuids.push(item.uuid);
              }
            });
          });
        } else {
          initialValues = options
              .filter((option) => selectFistValue.includes(option.uuid))
              .map((option) => option[optionLabelKey]);
          initialUuids = selectFistValue;
        }
        setValueSelect(initialValues);
        setSelectedUuids(initialUuids);
      }
    } else if (value && options) {
      let initialValues = [];
      let initialUuids = [];

      if (groupLabelKey) {
        options.forEach((group) => {
          const items = group[itemsLabelKey] || [];
          items.forEach((item) => {
            if (value.includes(item.uuid)) {
              initialValues.push(item[optionLabelKey]);
              initialUuids.push(item.uuid);
            }
          });
        });
      } else {
        initialValues = options
            .filter((option) => value.includes(option.uuid))
            .map((option) => option[optionLabelKey]);
        initialUuids = value;
      }
      setValueSelect(initialValues);
      setSelectedUuids(initialUuids);
    }
  }, [
    value,
    options,
    optionLabelKey,
    groupLabelKey,
    itemsLabelKey,
    selectFistValue,
  ]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const filterOptions = (options, searchText) => {
    if (!searchText) return options;

    const searchLower = searchText.toLowerCase();

    if (!groupLabelKey) {
      return options?.filter(option => {
        const labelMatch = option[optionLabelKey]?.toLowerCase().includes(searchLower);
        const floorMatch = floorLabel && option[floorLabel]?.name?.toLowerCase().includes(searchLower);
        const buildingMatch = buildingLabel && option[floorLabel]?.building?.name?.toLowerCase().includes(searchLower);
        return labelMatch || floorMatch || buildingMatch;
      });
    } else {
      return options?.map(group => ({
        ...group,
        [itemsLabelKey]: group[itemsLabelKey]?.filter(item => {
          const labelMatch = item[optionLabelKey]?.toLowerCase().includes(searchLower);
          const floorMatch = floorLabel && item[floorLabel]?.name?.toLowerCase().includes(searchLower);
          const buildingMatch = buildingLabel && item[floorLabel]?.building?.name?.toLowerCase().includes(searchLower);
          return labelMatch || floorMatch || buildingMatch;
        })
      })).filter(group => {
        const groupLabelMatch = group[groupLabelKey]?.toLowerCase().includes(searchLower);
        const buildingMatch = buildingLabel && group[buildingLabel]?.name?.toLowerCase().includes(searchLower);
        return groupLabelMatch || buildingMatch || group[itemsLabelKey]?.length > 0;
      });
    }
  };

  const getOptionDisplayText = (option) => {
    let displayText = option[optionLabelKey] || "";
    const labels = [];
    // if (floorLabel && option[floorLabel]?.name) labels.push(option[floorLabel].name);
    // if (buildingLabel && option[floorLabel]?.building?.name) labels.push(option[floorLabel].building.name);
    if (labels.length > 0) {
      displayText += ` (${labels.join(", ")})`;
    }
    return displayText;
  };

  const getGroupDisplayText = (group) => {
    let displayText = group[groupLabelKey] || "";
    if (buildingLabel && group[buildingLabel]?.name) {
      displayText += ` (${group[buildingLabel].name})`;
    }
    return displayText;
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    sx: {
      "& .MuiPaper-root": {
        // background: mode === "dark" ? "#141A21" : "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
        background: "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
        borderRadius: "10px",
        padding: "6px",
        boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
        marginTop: "0.5rem",
      },
      "& .MuiList-root": {
        padding: "0",
        display: "gruuid",
        gap: "6px",
      },
    },
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        wuuidth: "auto",
      },
    },
  };

  const hasError = Boolean(error && touched);

  const renderMenuItems = () => {
    if (!options || options?.length === 0) return <DataNotFound />;

    const filteredOptions = filterOptions(options, searchText);
    let menuItems = [];

    if (!groupLabelKey) {
      menuItems = filteredOptions?.map((option) => (
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
            <ListItemText primary={getOptionDisplayText(option)} />
          </MenuItem>
      ));
    } else {
      filteredOptions?.forEach((group) => {
        const showGroup = searchText.toLowerCase() === '' ||
            group[groupLabelKey]?.toLowerCase().includes(searchText.toLowerCase()) ||
            (buildingLabel && group[buildingLabel]?.name?.toLowerCase().includes(searchText.toLowerCase())) ||
            group[itemsLabelKey]?.length > 0;

        if (showGroup) {
          menuItems.push(
              <ListSubheader
                  variant="cus1"
                  key={group[groupLabelKey]}
              >
                {getGroupDisplayText(group)}
              </ListSubheader>
          );

          const items = group[itemsLabelKey] || [];
          items?.forEach((option) => {
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
                  <ListItemText primary={getOptionDisplayText(option)} />
                </MenuItem>
            );
          });
        }
      });
    }

    return menuItems.length > 0 ? menuItems : <DataNotFound />;
  };

  const handleChange = (event) => {
    const selectedValues = event.target.value;
    let selectedUuidsArray = [];

    if (groupLabelKey) {
      options.forEach((group) => {
        const items = group[itemsLabelKey] || [];
        items.forEach((item) => {
          if (selectedValues.includes(item[optionLabelKey])) {
            selectedUuidsArray.push(item.uuid);
          }
        });
      });
    } else {
      selectedUuidsArray = options
          .filter((option) => selectedValues.includes(option[optionLabelKey]))
          .map((option) => option.uuid);
    }

    setValueSelect(selectedValues);
    setSelectedUuids(selectedUuidsArray);
    onChange(selectedUuidsArray);
  };

  return (
      <FormControl
          className={`flex-none ${width60 && "lg:w-60"} w-full`}
          error={hasError}
          fullWidth={false}
      >
        <InputLabel uuid={label + "_label"} error={hasError}>
          {label}
        </InputLabel>
        <Select
            labelId={label + "_label"}
            uuid={label}
            label={label}
            multiple
            value={valueSelect}
            onChange={handleChange}
            renderValue={(selected) => {
              if (groupLabelKey) {
                const selectedItems = options.flatMap(group => group[itemsLabelKey] || [])
                    .filter(item => selected.includes(item[optionLabelKey]));
                return selectedItems.map(item => getOptionDisplayText(item)).join(", ");
              } else {
                const selectedItems = options.filter(option => selected.includes(option[optionLabelKey]));
                return selectedItems.map(item => getOptionDisplayText(item)).join(", ");
              }
            }}
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
          <div>
            <TextField
                size="small"
                variant="outlined"
                placeholder={t('search')}
                value={searchText}
                onChange={handleSearchChange}
                autoFocus
                onClick={(event) => {
                  event.stopPropagation();
                }}
                onKeyDown={(event) => {
                  event.stopPropagation();
                }}
                InputProps={{
                  startAdornment: (
                      <InputAdornment position="start">
                        <SearchTwoToneIcon />
                      </InputAdornment>
                  ),
                }}
                sx={{
                  margin: "8px",
                  width: "calc(100% - 16px)",
                }}
            />
          </div>
          {renderMenuItems()}
        </Select>
        <FormHelperText error={hasError}>
          {hasError ? error : null}
        </FormHelperText>
      </FormControl>
  );
};

export default SelectComponent;