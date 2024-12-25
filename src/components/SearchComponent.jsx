import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { textFieldStyle } from "../assets/style";
import useTranslate from "../hook/useTranslate";
import { useState } from "react";

function SearchComponent({ onSearchChange }) {
  const { t } = useTranslate();
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchValue(value);
    onSearchChange(value);
  };

  return (
    <FormControl fullWidth>
      <OutlinedInput
        value={searchValue}
        onChange={handleInputChange}
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        placeholder={`${t("search")}...`}
        sx={{ ...textFieldStyle }}
      />
    </FormControl>
  );
}

export default SearchComponent;
