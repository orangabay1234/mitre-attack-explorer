import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

import WindowIcon from "@mui/icons-material/Window";
import AppleIcon from "@mui/icons-material/Apple";
import TerminalIcon from "@mui/icons-material/Terminal";
import ComputerIcon from "@mui/icons-material/Computer";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

type Attack = {
    Id: string;
    Name: string;
    Description: string;
    x_mitre_platforms: string;
    x_mitre_detection: string;
    phase_name: string;
};

type AttacksTableProps = {
    search: string;
    selectedPlatform: string;
    selectedPhase: string;
    refreshKey: number;
};

function getPlatformIcon(platform: string)
{
    //pick icon by platform name
    const lowerPlatform = platform.toLowerCase();

    if (lowerPlatform.includes("windows"))
        return <WindowIcon sx={{ fontSize: "17px" }} />;

    if (lowerPlatform.includes("linux"))
        return <TerminalIcon sx={{ fontSize: "17px" }} />;

    if (lowerPlatform.includes("macos"))
        return <AppleIcon sx={{ fontSize: "17px" }} />;

    return <ComputerIcon sx={{ fontSize: "17px" }} />;
}
function AttacksTable({ search, selectedPlatform, selectedPhase, refreshKey }: AttacksTableProps)
{
    //stores the attacks from the api
    const [attacks, setAttacks] = useState<Attack[]>([]);

    //stores the current table page
    const [pageState, setPageState] = useState({ key: "", value: 0 });

    //stores the attack opened in the side drawer
    const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null);

    //stores if the table is loading
    const [loading, setLoading] = useState(true);

    //stores api error text
    const [error, setError] = useState("");

    //how many attacks to show on one page
    const attacksPerPage = 5;

    const pageResetKey = `${search}|${selectedPlatform}|${selectedPhase}`;
    const page = pageState.key === pageResetKey ? pageState.value : 0;

    function setPage(value: number)
    {
        //Save page for current filters
        setPageState({
            key: pageResetKey,
            value: value
        });
    }

    useEffect(() => {
        //build query params for the api
        const params = new URLSearchParams();

        if (search.trim() !== "")
            params.append("search", search);

        if (selectedPlatform !== "")
            params.append("platform", selectedPlatform);

        if (selectedPhase !== "")
            params.append("phase", selectedPhase);

        const queryString = params.toString();

        //choose normal url or filtered url
        const url = queryString === ""
            ? "http://localhost:3000/api/attacks"
            : `http://localhost:3000/api/attacks?${queryString}`;

        Promise.resolve()
            .then(() => {
                //Start loading before fetch
                setLoading(true);
                setError("");
                return fetch(url);
            })
            .then((response) => {
                //empty list is ok when no attacks found
                if (response.status === 404)
                    return [];

                if (!response.ok)
                    throw new Error("Failed to fetch attacks");

                return response.json();
            })
            .then((data) => {
                //save attacks and stop loading
                setAttacks(data);
                setLoading(false);
            })
            .catch((err) => {
                //save error and stop loading
                setError(err.message);
                setLoading(false);
            });
    }, [search, selectedPlatform, selectedPhase, refreshKey]);


    //table data after api filter
    const filteredAttacks = attacks;
  
    //start row for current page
    const startIndex = page * attacksPerPage;

    //end row for current page
    const endIndex = startIndex + attacksPerPage;

    //attacks shown in the current page
    const attacksToShow = filteredAttacks.slice(startIndex, endIndex);

    //last page number
    const maxPage = Math.max(Math.ceil(filteredAttacks.length / attacksPerPage) - 1, 0);

    if (loading)
    {
        return (
            <Box sx={{ width: "70%", maxWidth: "1100px", margin: "-10px auto 30px auto" }}>
                <Paper sx={{ padding: "20px", borderRadius: "14px" }}>
                    Loading attacks...
                </Paper>
            </Box>
        );
    }

    if (error !== "")
    {
        return (
            <Box sx={{ width: "70%", maxWidth: "1100px", margin: "-10px auto 30px auto" }}>
                <Paper sx={{ padding: "20px", borderRadius: "14px", color: "red" }}>
                    {error}
                </Paper>
            </Box>
        );
    }

    return (
        <>
            <Box
                sx={{
                    width: "70%",
                    maxWidth: "1100px",
                    margin: "-10px auto 30px auto"
                }}
            >
                <Paper
                    sx={{
                        borderRadius: "14px",
                        border: "1px solid #d1d5db",
                        boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
                        overflow: "hidden"
                    }}
                >
                    <Box sx={{ padding: "16px" }}>
                        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            Attacks List
                        </Typography>

                        <Typography sx={{ color: "#6b7280", fontSize: "13px" }}>
                            Showing MITRE ATT&CK techniques from your API
                        </Typography>
                    </Box>

                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                                <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Attack Name</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Platform</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Phase</TableCell>
                                <TableCell sx={{ fontWeight: "bold" }}>Action</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {attacksToShow.map((attack) => (
                                <TableRow key={attack.Id + attack.phase_name}>
                                    <TableCell>{attack.Id}</TableCell>

                                    <TableCell sx={{ fontWeight: "bold" }}>
                                        {attack.Name}
                                    </TableCell>

                                    <TableCell>
                                        <Chip
                                            icon={getPlatformIcon(attack.x_mitre_platforms)}
                                            label={attack.x_mitre_platforms}
                                            size="small"
                                            color="primary"
                                            variant="outlined"
                                        />
                                    </TableCell>

                                    <TableCell>{attack.phase_name}</TableCell>

                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<VisibilityIcon />}
                                            onClick={() => setSelectedAttack(attack)}
                                            sx={{
                                                textTransform: "none",
                                                borderRadius: "8px"
                                            }}
                                        >
                                            View
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}

                            {attacksToShow.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ padding: "30px" }}>
                                        No attacks found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <Box
                        sx={{
                            padding: "12px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderTop: "1px solid #e5e7eb"
                        }}
                    >
                        <Typography sx={{ fontSize: "13px", color: "#6b7280" }}>
                            Showing {attacksToShow.length} of {filteredAttacks.length} attacks
                        </Typography>

                        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Button
                                variant="outlined"
                                size="small"
                                disabled={page === 0}
                                onClick={() => setPage(page - 1)}
                                sx={{ textTransform: "none" }}
                            >
                                Previous
                            </Button>

                            <Typography sx={{ fontSize: "13px" }}>
                                Page {page + 1} of {maxPage + 1}
                            </Typography>

                            <Button
                                variant="outlined"
                                size="small"
                                disabled={page >= maxPage}
                                onClick={() => setPage(page + 1)}
                                sx={{ textTransform: "none" }}
                            >
                                Next
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            <Drawer
                anchor="right"
                open={selectedAttack !== null}
                onClose={() => setSelectedAttack(null)}
            >
                <Box sx={{ width: "440px", padding: "22px" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center"
                        }}
                    >
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                                {selectedAttack?.Name}
                            </Typography>

                            <Typography sx={{ color: "#6b7280", fontSize: "13px" }}>
                                Technique ID: {selectedAttack?.Id}
                            </Typography>
                        </Box>

                        <IconButton onClick={() => setSelectedAttack(null)}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        Overview
                    </Typography>

                    <Typography sx={{ color: "#374151", fontSize: "14px", lineHeight: 1.7 }}>
                        {selectedAttack?.Description || "No description available."}
                    </Typography>

                    <Divider sx={{ marginY: 2 }} />

                    <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        Details
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Box>
                            <Typography sx={{ color: "#6b7280", fontSize: "13px" }}>
                                Platforms
                            </Typography>

                            <Chip
                                icon={selectedAttack ? getPlatformIcon(selectedAttack.x_mitre_platforms) : undefined}
                                label={selectedAttack?.x_mitre_platforms}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>

                        <Box>
                            <Typography sx={{ color: "#6b7280", fontSize: "13px" }}>
                                Phase
                            </Typography>

                            <Typography sx={{ fontWeight: "bold" }}>
                                {selectedAttack?.phase_name}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ marginY: 2 }} />

                    <Typography sx={{ fontWeight: "bold", marginBottom: 1 }}>
                        Detection
                    </Typography>

                    <Typography sx={{ color: "#374151", fontSize: "14px", lineHeight: 1.7 }}>
                        {selectedAttack?.x_mitre_detection || "No detection information available."}
                    </Typography>
                </Box>
            </Drawer>
        </>
    );
}

export default AttacksTable;
