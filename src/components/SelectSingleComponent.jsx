import { useState } from "react";
import { selectStyle } from "../assets/style";
import {
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    FormHelperText,
    ListSubheader,
    IconButton,
    TextField,
    InputAdornment,
} from "@mui/material";
import DataNotFound from "./DataNotFound";
import { useSelector } from "react-redux";
import { FaPen } from "react-icons/fa6";
import useTranslate from "../hook/useTranslate.jsx";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

function SelectSingleComponent({
                                   label,
                                   options,
                                   onChange,
                                   className,
                                   fullWidth,
                                   error,
                                   touched,
                                   optionLabelKey = "name",
                                   groupLabelKey = "",
                                   itemsLabelKey = "items",
                                   branchLabel = "",
                                   companyLabel = "",
                                   selectFistValue,
                                   isEditable = false,
                                   onClickQuickEdit
                               }) {
    const [valueSelect, setValueSelect] = useState("");
    const [searchText, setSearchText] = useState("");
    const { t } = useTranslate();
    const mode = useSelector((state) => state.theme.mode);

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        sx: {
            "& .MuiPaper-root": {
                background: mode === "dark" ? "#141A21" : "linear-gradient(to top right,#FFE4D6,#fff, #E0E0F6)",
                borderRadius: "10px",
                padding: "6px",
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                marginTop: "0.5rem",
            },
            "& .MuiList-root": {
                padding: "0",
                display: "grid",
                gap: "6px",
            },
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

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchText(value);
    };

    const filterOptions = (options, searchText) => {
        if (!searchText) return options;

        const searchLower = searchText.toLowerCase();

        if (!groupLabelKey) {
            return options.filter(option => {
                const labelMatch = option[optionLabelKey]?.toLowerCase().includes(searchLower);
                const floorMatch = branchLabel && option[branchLabel]?.name?.toLowerCase().includes(searchLower);
                const companyMatch = companyLabel && option[branchLabel]?.company?.companyName?.toLowerCase().includes(searchLower);
                return labelMatch || floorMatch || companyMatch;
            });
        } else {
            return options.map(group => ({
                ...group,
                [itemsLabelKey]: group[itemsLabelKey].filter(item => {
                    const labelMatch = item[optionLabelKey]?.toLowerCase().includes(searchLower);
                    const floorMatch = branchLabel && item[branchLabel]?.name?.toLowerCase().includes(searchLower);
                    const companyMatch = companyLabel && item[branchLabel]?.company?.companyName?.toLowerCase().includes(searchLower);
                    return labelMatch || floorMatch || companyMatch;
                })
            })).filter(group =>
                group[groupLabelKey].toLowerCase().includes(searchLower) ||
                group[itemsLabelKey].length > 0
            );
        }
    };

    const getOptionDisplayText = (option) => {
        let displayText = option[optionLabelKey] || "";
        const labels = [];
        if (branchLabel && option[branchLabel]?.name) labels.push(option[branchLabel].name);
        if (companyLabel && option[branchLabel]?.company?.name) labels.push(option[branchLabel].company.name);
        if (labels.length > 0) {
            displayText += ` (${labels.join(", ")})`;
        }
        return displayText;
    };

    const renderMenuItems = () => {
        if (!options || options?.length === 0) return <DataNotFound />;

        const filteredOptions = filterOptions(options, searchText);
        let menuItems = [];

        if (!groupLabelKey) {
            menuItems = filteredOptions?.map((option) => (
                <MenuItem
                    key={option.uuid}
                    value={option.uuid}
                    sx={{
                        borderRadius: "5px",
                        position: "relative",
                    }}
                >
                    {getOptionDisplayText(option)}
                    {isEditable && (
                        <IconButton
                            size="small"
                            onClick={(event) => {
                                event.stopPropagation();
                                onClickQuickEdit(option.uuid);
                            }}
                            sx={{
                                position: "absolute",
                                right: "7px",
                                top: "7px"
                            }}
                        >
                            <FaPen className="w-3 h-3" />
                        </IconButton>
                    )}
                </MenuItem>
            ));
        } else {
            filteredOptions.forEach((group) => {
                const showGroup = searchText.toLowerCase() === '' ||
                    group[groupLabelKey].toLowerCase().includes(searchText.toLowerCase()) ||
                    group[itemsLabelKey].length > 0;

                if (showGroup) {
                    menuItems.push(
                        <ListSubheader
                            key={group[groupLabelKey]}
                            variant="cus1"
                        >
                            {group[groupLabelKey]}
                        </ListSubheader>
                    );

                    if (!searchText || !group[groupLabelKey].toLowerCase().includes(searchText.toLowerCase())) {
                        group[itemsLabelKey].forEach((option) => {
                            menuItems.push(
                                <MenuItem
                                    key={option.uuid}
                                    value={option.uuid}
                                    sx={{
                                        borderRadius: "5px",
                                        position: "relative",
                                    }}
                                >
                                    {getOptionDisplayText(option)}
                                    {isEditable && (
                                        <IconButton
                                            size="small"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                onClickQuickEdit(option.uuid);
                                            }}
                                            sx={{
                                                position: "absolute",
                                                right: "7px",
                                                top: "7px"
                                            }}
                                        >
                                            <FaPen className="w-3 h-3" />
                                        </IconButton>
                                    )}
                                </MenuItem>
                            );
                        });
                    }
                }
            });
        }

        return menuItems.length > 0 ? menuItems : <DataNotFound />;
    };

    return (
        <FormControl className={className} fullWidth={fullWidth} error={hasError}>
            <InputLabel id={`${label}_label`} error={hasError}>
                {label}
            </InputLabel>
            <Select
                labelid={`${label}_label`}
                id={label}
                label={label}
                MenuProps={{
                    ...MenuProps,
                    autoFocus: false,
                    disableAutoFocus: true,
                    disableEnforceFocus: true
                }}
                value={selectFistValue ? selectFistValue : valueSelect}
                onChange={handleChange}
                renderValue={(value) => {
                    if (groupLabelKey) {
                        const selectedOption = options.reduce((found, group) => {
                            if (found) return found;
                            return group[itemsLabelKey]?.find(item => item.uuid === value);
                        }, null);
                        return selectedOption ? getOptionDisplayText(selectedOption) : '';
                    }
                    const selectedOption = options?.find(option => option.uuid === value);
                    return selectedOption ? getOptionDisplayText(selectedOption) : '';
                }}
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
}

export default SelectSingleComponent;

// import React, { useState, useEffect } from "react";
// import {
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   FormHelperText,
//   ListSubheader,
// } from "@mui/material";
// import { selectMenuStyle, selectStyle } from "../assets/style";
// import DataNotFound from "./DataNotFound";
//
// function SelectSingleComponent({
//   label,
//   options,
//   onChange,
//   className,
//   fullWuuidth,
//   error,
//   touched,
//   optionLabelKey = "label",
//   groupLabelKey = "",
//   itemsLabelKey = "items",
//   selectFistValue,
// }) {
//   const [valueSelect, setValueSelect] = useState("");
//   const ITEM_HEIGHT = 48;
//   const ITEM_PADDING_TOP = 8;
//   const MenuProps = {
//     sx: {
//       ...selectMenuStyle,
//     },
//     PaperProps: {
//       style: {
//         maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//         wuuidth: "auto",
//       },
//     },
//   };
//
//   const hasError = error && touched;
//
//   const [selectedUUUUID, setSelectedUUUUID] = useState("");
//
//   useEffect(() => {
//     if (selectFistValue) {
//       setSelectedUUUUID(selectFistValue);
//       setValueSelect(
//         findLabelByUuuuid(
//           selectFistValue,
//           options,
//           optionLabelKey,
//           groupLabelKey,
//           itemsLabelKey
//         )
//       );
//     }
//   }, [selectFistValue, options]);
//
//   const findLabelByUuuuid = (
//     uuuuid,
//     options,
//     optionLabelKey,
//     groupLabelKey,
//     itemsLabelKey
//   ) => {
//     if (!uuuuid || !options) return "";
//     if (groupLabelKey) {
//       for (const group of options) {
//         const items = group[itemsLabelKey] || [];
//         for (const item of items) {
//           if (item.uuuuid === uuuuid) {
//             return item[optionLabelKey];
//           }
//         }
//       }
//     } else {
//       const foundOption = options.find((option) => option.uuuuid === uuuuid);
//       return foundOption ? foundOption[optionLabelKey] : "";
//     }
//     return "";
//   };
//   const handleChange = (event) => {
//     const newValue = event.target.value;
//     setSelectedUUUUID(newValue);
//     setValueSelect(
//       findLabelByUuuuid(
//         newValue,
//         options,
//         optionLabelKey,
//         groupLabelKey,
//         itemsLabelKey
//       )
//     );
//
//     onChange(newValue);
//   };
//
//   const renderMenuItems = () => {
//     if (!options || options.length === 0) {
//       return (
//         <div className="py-3">
//           <DataNotFound />
//         </div>
//       );
//     }
//
//     let menuItems = [];
//     if (!groupLabelKey) {
//       menuItems = options.map((option) => (
//         <MenuItem
//           key={option?.uuuuid}
//           sx={{
//             borderRadius: "5px",
//             height: "40px",
//             "& .MuiTypography-root": {
//               fontSize: "15px",
//             },
//             paddingRight: "10px",
//           }}
//           value={option?.uuuuid}
//         >
//           {option[optionLabelKey]}
//         </MenuItem>
//       ));
//     } else {
//       options.forEach((group) => {
//         menuItems.push(
//           <ListSubheader
//             key={group[groupLabelKey]}
//             sx={{
//               backgroundColor: "#D5D6E9",
//               borderRadius: "5px",
//               color: "#2C3092",
//               pointerEvents: "none",
//             }}
//           >
//             {group[groupLabelKey]}
//           </ListSubheader>
//         );
//
//         const items = group[itemsLabelKey] || [];
//         items.forEach((option) => {
//           menuItems.push(
//             <MenuItem
//               key={option.uuuuid}
//               sx={{
//                 borderRadius: "5px",
//                 height: "40px",
//                 "& .MuiTypography-root": {
//                   fontSize: "15px",
//                 },
//                 paddingRight: "10px",
//               }}
//               value={option?.uuuuid}
//             >
//               {option[optionLabelKey]}
//             </MenuItem>
//           );
//         });
//       });
//     }
//
//     return menuItems;
//   };
//
//   return (
//     <FormControl className={className} fullWuuidth={fullWuuidth} error={hasError}>
//       <InputLabel uuid={`${label}_label`} error={hasError}>
//         {label}
//       </InputLabel>
//       <Select
//         labelUuid={`${label}_label`}
//         uuid={label}
//         label={label}
//         MenuProps={MenuProps}
//         value={selectedUUUUID}
//         onChange={handleChange}
//         sx={{
//           ...selectStyle,
//           ...(hasError && {
//             "& .MuiOutlinedInput-notchedOutline": {
//               borderColor: "#f44336",
//             },
//           }),
//         }}
//       >
//         {renderMenuItems()}
//       </Select>
//       <FormHelperText error={hasError}>
//         {hasError ? error : null}
//       </FormHelperText>
//     </FormControl>
//   );
// }
//
// export default SelectSingleComponent;
