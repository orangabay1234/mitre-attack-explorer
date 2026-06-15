import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/NightsStay";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import RefreshIcon from "@mui/icons-material/Refresh";
import SecurityIcon from "@mui/icons-material/Security";
import ChatIcon from '@mui/icons-material/Chat';

type TopBarProps = {
    onMenuClick: () => void;
    onRefresh: () => void;
    onExport: () => void;
    darkMode: boolean;
    onToggleDarkMode: () => void;
    onChat: () => void;
};

function TopBar({
    onMenuClick,
    onRefresh,
    onExport,
    darkMode,
    onToggleDarkMode,
    onChat
}: TopBarProps)
{
    //show the top buttons and app title
    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: darkMode ? "#1f2937" : "#ffffff",
                color: darkMode ? "#ffffff" : "#111827",
                borderBottom: "1px solid #b6c0c8"
            }}
        >
            <Toolbar>
                <IconButton edge="start" color="inherit" sx={{ marginRight: 2 }} onClick={onMenuClick}>
                    <MenuIcon />
                </IconButton>

                <SecurityIcon sx={{ color: "#2563eb" }} />

                <Typography
                    variant="h6"
                    sx={{ flexGrow: 1, fontWeight: "bold", marginLeft: 1 }}
                >
                    MITRE Attack Explorer
                </Typography>

                                <Button
                    onClick={onChat}
                    sx={{
                        marginLeft: 1,
                        color: darkMode ? "#ffffff" : "#000000",
                        textTransform: "none",
                        border: "1px solid #b5bcc6",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        height: "36px"
                    }}
                    startIcon={<ChatIcon sx={{ color: "#2563eb" }} />}
                >
                    Chat
                </Button>

                <Button
                    onClick={onRefresh}
                    sx={{
                        marginLeft: 1,
                        color: darkMode ? "#ffffff" : "#000000",
                        textTransform: "none",
                        border: "1px solid #b5bcc6",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        height: "36px"
                    }}
                    startIcon={<RefreshIcon sx={{ color: "#2563eb" }} />}
                >
                    Refresh
                </Button>

                <Button
                    onClick={onExport}
                    sx={{
                        marginLeft: 1,
                        color: darkMode ? "#ffffff" : "#000000",
                        textTransform: "none",
                        border: "1px solid #b5bcc6",
                        borderRadius: "8px",
                        padding: "6px 12px",
                        height: "36px"
                    }}
                    startIcon={<FileDownloadIcon sx={{ color: "#2563eb" }} />}
                >
                    Export
                </Button>

                <IconButton
                    onClick={onToggleDarkMode}
                    sx={{
                        marginLeft: 1,
                        border: "1px solid #b5bcc6",
                        borderRadius: "8px",
                        height: "36px",
                        width: "36px"
                    }}
                >
                    <DarkModeIcon sx={{ color: darkMode ? "#ffffff" : "#000000" }} />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default TopBar;
