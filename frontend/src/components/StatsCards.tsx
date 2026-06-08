import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import WindowIcon from "@mui/icons-material/Window";
import BugReportIcon from "@mui/icons-material/BugReport";
import WarningIcon from "@mui/icons-material/Warning";
import SecurityIcon from "@mui/icons-material/Security";

function StatsCards()
{
    return (
        <Box
            sx={{
                display: "flex",
                gap: 1.5,
                width: "70%",
                maxWidth: "1100px",
                margin: "0 auto 24px auto"
            }}
        >
            <Paper
                sx={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    minHeight: "85px"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WindowIcon sx={{ color: "#2563eb", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        Windows
                    </Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px" }}>
                    128
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    Windows related attacks
                </Typography>
            </Paper>

            <Paper
                sx={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    minHeight: "85px"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BugReportIcon sx={{ color: "#7c3aed", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        Total CVEs
                    </Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px" }}>
                    342
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    Known vulnerabilities
                </Typography>
            </Paper>

            <Paper
                sx={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    minHeight: "85px"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningIcon sx={{ color: "#dc2626", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        Critical
                    </Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px" }}>
                    27
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    Critical risk findings
                </Typography>
            </Paper>

            <Paper
                sx={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: "12px",
                    border: "1px solid #d1d5db",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                    minHeight: "85px"
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SecurityIcon sx={{ color: "#f97316", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>
                        High Risk
                    </Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px" }}>
                    64
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    High severity attacks
                </Typography>
            </Paper>
        </Box>
    );
} 

export default StatsCards;