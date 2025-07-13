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
    Button,
} from "@mui/material";
import DataNotFound from "./DataNotFound";
import { useSelector } from "react-redux";
import { FaPen } from "react-icons/fa6";
import useTranslate from "../hook/useTranslate.jsx";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import MoreActionComponent from "./MoreActionComponent.jsx";

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
                                   onClickQuickEdit,
                                   isCreate=false,
                                   onClickCreate,
                                   menuActions
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
                background: mode === "dark" ? "#141A21" : "#fff",
                borderRadius: "10px",
                padding: "6px",
                boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.2)",
                marginTop: "0.5rem",            
            },
            "& .MuiList-root": {
                padding: "0",
                display: "grid",
                gap: "6px"
            },
        },
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
                width: "auto"
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
                     ...MenuProps
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
                <div className="h-14 sticky top-0 z-10 bg-white dark:bg-[#141A21] rounded-lg">
                    <div className="flex justify-between items-center">
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
                                width: "calc(100% - 16px)"
                            }}
                        />
                        {menuActions && (
                            <div 
                                onClick={(event) => {
                                    event.stopPropagation();
                                }}
                                onMouseDown={(event) => {
                                    event.stopPropagation();
                                }}
                            >
                                <MoreActionComponent menuItems={menuActions} />
                            </div>
                        )}
                    </div>
                </div>
                    {renderMenuItems()}
                {
                    isCreate && (
                        <div className="h-14 flex items-center justify-end px-2 sticky bottom-0 z-10 bg-white dark:bg-[#141A21] rounded-lg">
                            <Button variant="contained" 
                              onClick={(event) => {
                                event.stopPropagation();
                                onClickCreate();
                                }}
                            >
                                {t('create')}
                            </Button>
                        </div>        
                    )
                }
                
            </Select>
            <FormHelperText error={hasError}>
                {hasError ? error : null}
            </FormHelperText>
        </FormControl>
    );
}

export default SelectSingleComponent;