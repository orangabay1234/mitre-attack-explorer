import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import SecurityIcon from "@mui/icons-material/Security";
import BugReportIcon from "@mui/icons-material/BugReport";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

type VirusTotalStats = {
    hash: string;
    fileName: string;
    fileType: string;
    verdict: string;
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
};

type StatsCardsProps = {
    virusTotalStats: VirusTotalStats | null;
};

function StatsCards({ virusTotalStats }: StatsCardsProps)
{
    //checks if there is a virustotal scan result
    const hasScan = virusTotalStats !== null;

    //show the last scan numbers in the cards
    return (
        <Box sx={{ display: "flex", gap: 1.5, width: "70%", maxWidth: "1100px", margin: "0 auto 24px auto" }}>
            
            <Paper sx={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #d1d5db", minHeight: "85px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <SecurityIcon sx={{ color: "#2563eb", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Risk Level</Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "22px", color: "#2563eb" }}>
                    {hasScan ? virusTotalStats.verdict : "No scan"}
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    {hasScan ? virusTotalStats.fileName : "Run /scanFile <hash>"}
                </Typography>
            </Paper>

            <Paper sx={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #d1d5db", minHeight: "85px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <BugReportIcon sx={{ color: "#dc2626", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Malicious</Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px", color: "#dc2626" }}>
                    {hasScan ? virusTotalStats.malicious : 0}
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>VirusTotal detections</Typography>
            </Paper>

            <Paper sx={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #d1d5db", minHeight: "85px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <WarningIcon sx={{ color: "#f97316", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Suspicious</Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px", color: "#f97316" }}>
                    {hasScan ? virusTotalStats.suspicious : 0}
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>Suspicious engines</Typography>
            </Paper>

            <Paper sx={{ flex: 1, padding: "12px", borderRadius: "12px", border: "1px solid #d1d5db", minHeight: "85px" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon sx={{ color: "#16a34a", fontSize: "22px" }} />
                    <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>Harmless</Typography>
                </Box>

                <Typography sx={{ fontWeight: "bold", marginTop: 0.5, fontSize: "24px", color: "#16a34a" }}>
                    {hasScan ? virusTotalStats.harmless : 0}
                </Typography>

                <Typography sx={{ color: "#6b7280", fontSize: "12px" }}>
                    Undetected: {hasScan ? virusTotalStats.undetected : 0}
                </Typography>
            </Paper>
        </Box>
    );
}

export default StatsCards;
