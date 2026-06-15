import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

type FilterSidebarProps = {
    selectedPlatform: string;
    setSelectedPlatform: (value: string) => void;
    selectedPhase: string;
    setSelectedPhase: (value: string) => void;
};

function FilterSidebar({
    selectedPlatform,
    setSelectedPlatform,
    selectedPhase,
    setSelectedPhase
}: FilterSidebarProps)
{
    function handlePlatformClick(platform: string)
    {
        //clear platform if it is already selected
        if (selectedPlatform === platform)
            setSelectedPlatform("");
        else
            //set selected platform
            setSelectedPlatform(platform);
    }

    function handlePhaseClick(phase: string)
    {
        //clear phase if it is already selected
        if (selectedPhase === phase)
            setSelectedPhase("");
        else
            //set selected phase
            setSelectedPhase(phase);
    }

    //show filter sidebar
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

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPlatform === "Windows"}
                        onChange={() => handlePlatformClick("Windows")}
                    />
                }
                label="Windows"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPlatform === "Linux"}
                        onChange={() => handlePlatformClick("Linux")}
                    />
                }
                label="Linux"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPlatform === "macOS"}
                        onChange={() => handlePlatformClick("macOS")}
                    />
                }
                label="macOS"
            />

            <Divider sx={{ marginY: 2 }} />

            <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                Phases
            </Typography>

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPhase === "execution"}
                        onChange={() => handlePhaseClick("execution")}
                    />
                }
                label="Execution"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPhase === "persistence"}
                        onChange={() => handlePhaseClick("persistence")}
                    />
                }
                label="Persistence"
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedPhase === "discovery"}
                        onChange={() => handlePhaseClick("discovery")}
                    />
                }
                label="Discovery"
            />

            <Divider sx={{ marginY: 2 }} />

            <Button
                fullWidth
                variant="outlined"
                sx={{ textTransform: "none" }}
                onClick={() => {
                    setSelectedPlatform("");
                    setSelectedPhase("");
                }}
            >
                Clear Filters
            </Button>
        </Box>
    );
}

export default FilterSidebar;
