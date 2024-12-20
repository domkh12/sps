import { FormControl, InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { textFieldStyle } from "../assets/style";

function SearchComponent() {
  return (
    <FormControl fullWidth>
      <OutlinedInput
        startAdornment={
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        }
        placeholder="Search..."
        sx={{ ...textFieldStyle }}
      />
    </FormControl>
  );
}

export default SearchComponent;
