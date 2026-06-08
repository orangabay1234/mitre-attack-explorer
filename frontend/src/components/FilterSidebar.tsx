import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

function FilterSidebar()
{
    return (
        <Box
            sx={{
                width: "280px",
                borderRight: "1px solid #d1d5db",
                padding: "20px",
                backgroundColor: "#8983831b"
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: "bold", marginBottom: 2 }}>
                Filters
            </Typography>

            <Divider sx={{ marginBottom: 2 }} />

            <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Platforms
            </Typography>

            <FormControlLabel control={<Checkbox />} label="Windows" />
            <FormControlLabel control={<Checkbox />} label="Linux" />
            <FormControlLabel control={<Checkbox />} label="macOS" />

            <Divider sx={{ marginY: 2 }} />

            <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Phases
            </Typography>

            <FormControlLabel control={<Checkbox />} label="Execution" />
            <FormControlLabel control={<Checkbox />} label="Persistence" />
            <FormControlLabel control={<Checkbox />} label="Discovery" />
        </Box>
    );
}

export default FilterSidebar;