import { useState } from "react";
import Box from "@mui/material/Box";

import TopBar from "./components/TopBar";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import StatsCards from "./components/StatsCards";
import AttacksTable from "./components/AttacksTable";
import ChatModal from "./components/ChatModal";

type VirusTotalStats = 
{
    hash: string;
    fileName: string;
    fileType: string;
    verdict: string;
    malicious: number;
    suspicious: number;
    harmless: number;
    undetected: number;
};

function App()
{
    //controls if the filters sidebar is open or closed
    const [sidebarOpen, setSidebarOpen] = useState(false);

    //stores the text from the big search bar
    const [search, setSearch] = useState("");

    //stores the selected platform filter, for example: windows / linux / macos
    const [selectedPlatform, setSelectedPlatform] = useState("");

    //stores the selected phase filter, for example: execution / persistence / discovery
    const [selectedPhase, setSelectedPhase] = useState("");

    //stores if dark mode is currently on or off
    const [darkMode, setDarkMode] = useState(false);

    //used only to force attackstable to fetch the api again when pressing refresh
    const [refreshKey, setRefreshKey] = useState(0);

    //stores if the chat modal is open or closed
    const [chatOpen, setChatOpen] = useState(false);

    //stores the last virustotal result from the chat
    const [virusTotalStats, setVirusTotalStats] = useState<VirusTotalStats | null>(null);

    function handleChat()
    {
        setChatOpen(!chatOpen);
    }

    function handleRefresh()
    {
        //changing refreshKey makes attackstable useEffect run again
        setRefreshKey(refreshKey + 1);
    }

    function handleToggleDarkMode()
    {
        //switches dark mode from false to true, or from true to false
        setDarkMode(!darkMode);
    }

    function buildApiUrl()
    {
        //urlsearchparams helps build query params like ?search=test&platform=windows
        const params = new URLSearchParams();

        //add search to the api url only if the search is not empty
        if (search.trim() !== "")
            params.append("search", search);

        //add platform filter only if the user selected a platform
        if (selectedPlatform !== "")
            params.append("platform", selectedPlatform);

        //add phase filter only if the user selected a phase
        if (selectedPhase !== "")
            params.append("phase", selectedPhase);

        //converts all params to a string, for example: search=test&platform=windows
        const queryString = params.toString();

        //if there are no filters or search, use the normal api endpoint
        if (queryString === "")
            return "http://localhost:3000/api/attacks";

        //if there are filters or search, add them to the api url
        return `http://localhost:3000/api/attacks?${queryString}`;
    }

    async function handleExport()
    {
        //fetch the same attacks that are currently shown by search and filters
        const response = await fetch(buildApiUrl());

        //if the api failed, stop the export
        if (!response.ok)
            return;

        type ExportAttack = {
            Id: string;
            Name: string;
            Description: string;
            x_mitre_platforms: string;
            x_mitre_detection: string;
            phase_name: string;
        };

        //convert the api response json into an array of attacks
        const attacks: ExportAttack[] = await response.json();

        //create the csv rows, first row is the headers
        const csvRows = [
            ["ID", "Name", "Description", "Platforms", "Detection", "Phase"],
            ...attacks.map((attack) => [
                attack.Id,
                attack.Name,
                attack.Description,
                attack.x_mitre_platforms,
                attack.x_mitre_detection,
                attack.phase_name
            ])
        ];

        //convert the rows array into real csv text
        const csvContent = csvRows
            .map((row) =>
                row
                    //Escape quotes inside cells
                    .map((value) => `"${String(value ?? "").replaceAll('"', '""')}"`)
                    .join(",")
            )
            .join("\n");

        //blob creates a downloadable file in the browser
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

        //creates a temporary local url for the file
        const url = URL.createObjectURL(blob);

        //creates a temporary link element only for downloading the file
        const link = document.createElement("a");

        link.href = url;
        link.download = "attacks_export.csv";

        //starts the download
        link.click();

        //cleans the temporary url from memory
        URL.revokeObjectURL(url);
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundColor: darkMode ? "#111827" : "#ffffff",
                transition: "0.2s"
            }}
        >
            <TopBar
                onMenuClick={() => setSidebarOpen(!sidebarOpen)}
                onRefresh={handleRefresh}
                onExport={handleExport}
                darkMode={darkMode}
                onToggleDarkMode={handleToggleDarkMode}
                onChat={handleChat}
            />

            <ChatModal
                open={chatOpen}
                onClose={() => setChatOpen(false)}
                setSearch={setSearch}
                setSelectedPlatform={setSelectedPlatform}
                setSelectedPhase={setSelectedPhase}
                onRefresh={handleRefresh}
                onExport={handleExport}
                setVirusTotalStats={setVirusTotalStats}
            />
            
            <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
                {sidebarOpen && (
                    <FilterSidebar
                        selectedPlatform={selectedPlatform}
                        setSelectedPlatform={setSelectedPlatform}
                        selectedPhase={selectedPhase}
                        setSelectedPhase={setSelectedPhase}
                    />
                )}

                <Box sx={{ flexGrow: 1 }}>
                    <SearchBar search={search} setSearch={setSearch} />
                    <StatsCards virusTotalStats={virusTotalStats} />

                    <AttacksTable
                        search={search}
                        selectedPlatform={selectedPlatform}
                        selectedPhase={selectedPhase}
                        refreshKey={refreshKey}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default App;
