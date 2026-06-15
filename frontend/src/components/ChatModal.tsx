import { useState } from "react";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

type ChatModalProps = {
    open: boolean;
    onClose: () => void;
    setSearch: (value: string) => void;
    setSelectedPlatform: (value: string) => void;
    setSelectedPhase: (value: string) => void;
    onRefresh: () => void;
    onExport: () => void;
    setVirusTotalStats: (value: VirusTotalStats | null) => void;
};

type ChatMessage = {
    sender: "user" | "bot";
    text: string;
};

type ChatAction =
    | {
        type: "setFilters";
        payload: {
            search?: string;
            platform?: string;
            phase?: string;
        };
    }
    | { type: "clearFilters" }
    | { type: "refresh" }
    | { type: "export" }
    | { type: "setVirusTotalStats"; payload: VirusTotalStats }
    | { type: "clearVirusTotalStats" };

type ChatApiResponse = 
{
    reply: string;
    action?: ChatAction | null;
};

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

function ChatModal({
    open,
    onClose,
    setSearch,
    setSelectedPlatform,
    setSelectedPhase,
    onRefresh,
    onExport,
    setVirusTotalStats
}: ChatModalProps)
{
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            sender: "bot",
            text: "Use /help to see commands."
        }
    ]);

    function addMessage(sender: "user" | "bot", text: string)
    {
        //create a new array because react state should not be changed directly
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                sender,
                text
            }
        ]);
    }

    function addBotMessage(text: string)
    {
        addMessage("bot", text);
    }

    function applyChatAction(action: ChatAction | null | undefined)
    {
        //if the backend sent no action, do nothing
        if (action === undefined || action === null)
            return;

        if (action.type === "setFilters")
        {
            //only update values that the backend sent
            if (action.payload.search !== undefined)
                setSearch(action.payload.search);

            if (action.payload.platform !== undefined)
                setSelectedPlatform(action.payload.platform);

            if (action.payload.phase !== undefined)
                setSelectedPhase(action.payload.phase);

            return;
        }

        if (action.type === "clearFilters")
        {
            setSearch("");
            setSelectedPlatform("");
            setSelectedPhase("");
            return;
        }

        if (action.type === "refresh")
        {
            onRefresh();
            return;
        }

        if (action.type === "export")
        {
            onExport();
            return;
        }

        if (action.type === "setVirusTotalStats")
        {
            //save the last virustotal result for the stats cards
            setVirusTotalStats(action.payload);
            return;
        }

        if (action.type === "clearVirusTotalStats")
        {
            //clear the stats cards when virustotal has no result
            setVirusTotalStats(null);
        }
    }

    async function handleSend()
    {
        if (message.trim() === "")
            return;

        const userMessage = message.trim();

        //add the user message to the chat
        addMessage("user", userMessage);

        //clear the input after sending
        setMessage("");

        try
        {
            //send the full message to the backend parser
            const response = await fetch("http://localhost:3000/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: userMessage
                })
            });

            if (!response.ok)
            {
                addBotMessage("Chat API failed.");
                return;
            }

            const data: ChatApiResponse = await response.json();

            addBotMessage(data.reply);
            applyChatAction(data.action);
        }
        catch
        {
            addBotMessage("Failed to connect to the chat API.");
        }
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "500px",
                    backgroundColor: "#ffffff",
                    borderRadius: "14px",
                    padding: "20px"
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 2
                    }}
                >
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Security Chat
                    </Typography>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        height: "260px",
                        border: "1px solid #d1d5db",
                        borderRadius: "10px",
                        padding: "12px",
                        marginBottom: 2,
                        backgroundColor: "#f9fafb",
                        overflowY: "auto"
                    }}
                >
                    {messages.map((chatMessage, index) => (
                        <Box
                            key={index}
                            sx={{
                                marginBottom: 1.5,
                                textAlign: chatMessage.sender === "user" ? "right" : "left"
                            }}
                        >
                            <Typography
                                sx={{
                                    display: "inline-block",
                                    whiteSpace: "pre-line",
                                    padding: "8px 12px",
                                    borderRadius: "10px",
                                    backgroundColor: chatMessage.sender === "user" ? "#2563eb" : "#e5e7eb",
                                    color: chatMessage.sender === "user" ? "#ffffff" : "#111827",
                                    fontSize: "14px",
                                    maxWidth: "85%"
                                }}
                            >
                                {chatMessage.text}
                            </Typography>
                        </Box>
                    ))}
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Type /help..."
                        value={message}
                        onChange={(event) => setMessage(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter")
                                handleSend();
                        }}
                    />

                    <Button
                        variant="contained"
                        endIcon={<SendIcon />}
                        onClick={handleSend}
                        sx={{
                            textTransform: "none",
                            borderRadius: "8px"
                        }}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ChatModal;
