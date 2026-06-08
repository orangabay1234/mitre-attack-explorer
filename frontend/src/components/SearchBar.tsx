import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";

function SearchBar()
{
    const [search, setSearch] = useState("");

    return (
        <Box sx={{ width: "55%", margin: "110px auto 15px auto" }}>
            <TextField
                fullWidth
                placeholder="Search CVE, technique, platform..."
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