import { useState } from "react";
import Box from "@mui/material/Box";

import TopBar from "./components/TopBar";
import SearchBar from "./components/SearchBar";
import FilterSidebar from "./components/FilterSidebar";
import StatsCards from "./components/StatsCards";

function App()
{
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div>
            <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            <Box sx={{ display: "flex", minHeight: "calc(100vh - 64px)" }}>
                {sidebarOpen && <FilterSidebar />}

                <Box sx={{margin: -10, flexGrow: 1 }}>
                    <SearchBar />
                    <StatsCards />
                </Box>
            </Box>
        </div>
    );
}

export default App;