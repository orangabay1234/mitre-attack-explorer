import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";

type SearchBarProps = {
    search: string;
    setSearch: (value: string) => void;
};

function SearchBar({ search, setSearch }: SearchBarProps)
{
    //show search input and update search text
    return (
        <Box sx={{ width: "70%", maxWidth: "1100px", margin: "24px auto 12px auto" }}>
            <TextField
                fullWidth
                placeholder="Search attack, platform, phase, risk..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                variant="outlined"
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    backgroundColor: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
                    "& .MuiOutlinedInput-root": {
                        borderRadius: "10px",
                    }
                }}
            />
        </Box>
    );
}

export default SearchBar;
