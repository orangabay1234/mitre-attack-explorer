const express = require("express");
const cors = require("cors");
const { Command } = require("commander");
//Load env variables
require("dotenv").config();

const VT_API_KEY = process.env.VT_API_KEY ?? "";

//starts all api routes
function apiHandle(db)
{
    const mitre_app = express();//creating the server
    mitre_app.use(cors());
    mitre_app.use(express.json());//for geting the query as json

    mitre_app.get("/api/attacks", (req, res) => {//for all get attacks types of api (except individual attack from id)
        //variables declare
        const platforms = req.query.platform;
        const search = req.query.search;
        const phase = req.query.phase;

        //Build sql filters
        const filters = [];
        const params = [];

        if (platforms !== undefined) {
            filters.push("attacks.x_mitre_platforms LIKE ?");
            params.push(`%${platforms}%`);
        }

        if (phase !== undefined) {
            filters.push("attack_pattern_phases.phase_name = ?");
            params.push(phase);
        }

        if (search !== undefined) {
            filters.push("(attacks.Name LIKE ? OR attacks.Description LIKE ?)");
            params.push(`%${search}%`, `%${search}%`);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        //Run one query with all filters
        const attacks = db.prepare(`
            SELECT attacks.*, attack_pattern_phases.phase_name
            FROM attacks
            JOIN attack_pattern_phases ON attacks.Id = attack_pattern_phases.attack_id
            ${whereClause}
        `).all(...params);

        //didnt find attack
        if (attacks.length === 0)
            return res.status(404).json({error: "Attack not found"});

        res.json(attacks);//send the attacks
    });

    mitre_app.get("/api/attacks/:id", (req, res) => {//for get one attack with id
        //variables declare
        const id = req.params.id;

        const attack = db.prepare("SELECT * FROM attacks WHERE Id = ?").get(id);//get attack by id

        if (!attack)//check if attack exists
            return res.status(404).json({error: "Attack not found"});

        const phases = db.prepare("SELECT phase_name FROM attack_pattern_phases WHERE attack_id = ?").all(id);//get attack phases

        const phaseName = formatPhaseNames(phases);

        attack.phase_name = phaseName;//add the phases to the attack json

        res.json(attack);//send the attack
    });

    mitre_app.get("/api/platforms", (req, res) => {//for get all platforms

        const platformsResult = getUniquePlatforms();

        if (platformsResult.length === 0)//check if there is platforms
            return res.status(404).json({error: "Platforms not found"});

        res.json(platformsResult);//send the platforms
    });

    function getUniquePlatforms()
    {
        //variables declare
        const platformsResult = [];
        let platforms_counter = 0;

        const platforms = db.prepare("SELECT DISTINCT x_mitre_platforms FROM attacks").all();//get all type of platforms

        platforms.forEach((row) => {//for each row

            const arrRowPlatforms = row.x_mitre_platforms.split(',')//into array
            let rowPlatformsNum = arrRowPlatforms.length;//get the num of platforms on the row

            for(let i = 0; i < rowPlatformsNum; i++)//for each platform
            {
                const currentPlatform = arrRowPlatforms[i].trim();

                if(!platformsResult.includes(currentPlatform))//check if the platforms already in the array
                {
                    platformsResult[platforms_counter] = currentPlatform;
                    platforms_counter++;
                }
            }
        });

        return platformsResult;
    }

    function formatPhaseNames(phases)
    {
        //Turn phase rows into text
        return phases.length > 0 ? phases.map((phase) => phase.phase_name).join(", ") : "NA";
    }

    mitre_app.get("/api/stats", (req, res) => {//for get stats about attacks

        //variables declare
        const totalAttacks = db.prepare("SELECT COUNT(*) AS count FROM attacks").get().count;//get attacks row count
        const platformsResult = getUniquePlatforms();//get platforms
        const totalPlatforms = platformsResult.length;//get num of platforms

        //stats json
        const stats = 
        {
            totalAttacks: totalAttacks,
            totalPlatforms: totalPlatforms,
            platforms: platformsResult
        };

        res.json(stats);//send the stats
    });

    function buildChatResponse(reply, action)
    {
        //basic answer format for the frontend
        const response = { reply: reply };

        //add action only if there is one
        if (action !== undefined)
            response.action = action;

        return response;
    }

    function splitChatCommand(userMessage)
    {
        //remove / from the start
        const cleanMessage = userMessage.substring(1);

        //split by spaces
        return cleanMessage.split(" ");
    }

    function fixCommanderOption(value)
    {
        //commander can return an array for a few words
        if (Array.isArray(value))
            return value.join(" ");

        if (value === undefined)
            return "";

        return value;
    }

    function parseChatCommand(userMessage)
    {
        //create a new commander parser
        const program = new Command();

        //this will hold the parsed command
        let result = null;

        //stop commander from closing the server on bad command
        program.exitOverride();

        //command for changing table filters
        program
            .command("attacks")
            .option("--search <text...>")
            .option("--platform <platform...>")
            .option("--phase <phase...>")
            .action((options) => {
                result = {
                    command: "attacks",
                    options: {
                        search: fixCommanderOption(options.search),
                        platform: fixCommanderOption(options.platform),
                        phase: fixCommanderOption(options.phase)
                    }
                };
            });

        //command for one attack by id
        program
            .command("attack")
            .option("--id <id>")
            .action((options) => {
                result = {
                    command: "attack",
                    options: {
                        id: fixCommanderOption(options.id)
                    }
                };
            });
        
        //command for checking hash in virustotal
        program
            .command("scanFile <hash>")
            .action((hash) => {
                result = {
                    command: "scanFile",
                    options: {
                        hash: fixCommanderOption(hash)
                    }
                };
            });

        //command for general stats
        program.command("stats").action(() => {
            result = { command: "stats", options: {} };
        });

        //command for platform list
        program.command("platforms").action(() => {
            result = { command: "platforms", options: {} };
        });

        //command for clearing filters
        program.command("clear").action(() => {
            result = { command: "clear", options: {} };
        });

        //command for refreshing the table
        program.command("refresh").action(() => {
            result = { command: "refresh", options: {} };
        });

        //command for exporting csv
        program.command("export").action(() => {
            result = { command: "export", options: {} };
        });

        try
        {
            //parse the chat text like command line arguments
            program.parse(splitChatCommand(userMessage), { from: "user" });
            return result;
        }
        catch
        {
            return null;
        }
    }

    function handleAttacksCommand(options)
    {
        //this object will be sent to react
        const payload = {};

        //add search only if the user wrote it
        if (options.search !== "")
            payload.search = options.search;

        //add platform only if the user wrote it
        if (options.platform !== "")
            payload.platform = options.platform;

        //add phase only if the user wrote it
        if (options.phase !== "")
            payload.phase = options.phase;

        //if there are no values, show how to use the command
        if (Object.keys(payload).length === 0)
            return buildChatResponse("Use: /attacks --search <text> --platform <platform> --phase <phase>");

        //tell react to update the filters
        return buildChatResponse("Attacks table updated.", {
            type: "setFilters",
            payload: payload
        });
    }

    function handleAttackCommand(options)
    {
        //get id from the chat command
        const id = options.id;

        //stop if id is missing
        if (id === "")
            return buildChatResponse("Use: /attack --id <id>");

        //get attack from db
        const attack = db.prepare("SELECT * FROM attacks WHERE Id = ?").get(id);

        if (!attack)
            return buildChatResponse("Attack not found.");

        //get all phases for this attack
        const phases = db.prepare("SELECT phase_name FROM attack_pattern_phases WHERE attack_id = ?").all(id);

        attack.phase_name = formatPhaseNames(phases);

        return buildChatResponse(
            "Attack details:\n" +
            `ID: ${attack.Id}\n` +
            `Name: ${attack.Name}\n` +
            `Platforms: ${attack.x_mitre_platforms}\n` +
            `Phase: ${attack.phase_name}\n` +
            `Detection: ${attack.x_mitre_detection || "No detection information"}`
        );
    }

    function getVirusTotalVerdict(stats)
    {
        //simple final answer from virustotal numbers
        if (stats.malicious > 0)
            return "Malicious";

        if (stats.suspicious > 0)
            return "Suspicious";

        return "Not detected as malicious";
    }

    async function handleScanFileCommand(options)
    {
        //get hash from the chat command
        const hash = options.hash;

        //stop if hash is missing
        if (hash === "")
            return buildChatResponse("Use: /scanFile <hash>");

        //stop if api key was not added
        if (!VT_API_KEY)
            return buildChatResponse("VirusTotal API key is not configured.");

        try
        {
            //ask virustotal for a file report by hash
            const response = await fetch(`https://www.virustotal.com/api/v3/files/${hash}`, {
                method: "GET",
                headers: {
                    "x-apikey": VT_API_KEY
                }
            });

            if (response.status === 400 || response.status === 404)
                return buildChatResponse("VirusTotal did not find a report for this hash.", { type: "clearVirusTotalStats" });

            if (response.status === 401 || response.status === 403)
                return buildChatResponse("VirusTotal API key is missing or not valid.");

            if (!response.ok)
                return buildChatResponse("VirusTotal request failed.");

            const virusTotalData = await response.json();

            //main data from virustotal
            const attributes = virusTotalData.data.attributes;

            //scan numbers from virustotal
            const stats = attributes.last_analysis_stats;

            //data that will be sent to the chat and cards
            const scanStats = 
            {
                hash: hash,
                fileName: attributes.meaningful_name || attributes.names?.[0] || "Unknown",
                fileType: attributes.type_description || "Unknown",
                malicious: stats.malicious ?? 0,
                suspicious: stats.suspicious ?? 0,
                harmless: stats.harmless ?? 0,
                undetected: stats.undetected ?? 0
            };

            //text answer for risk level
            const verdict = getVirusTotalVerdict(scanStats);

            //send chat text and card data to react
            return buildChatResponse(
                "VirusTotal scan result:\n" +
                `Hash: ${hash}\n` +
                `File name: ${scanStats.fileName}\n` +
                `File type: ${scanStats.fileType}\n` +
                `Verdict: ${verdict}\n` +
                `Malicious: ${scanStats.malicious}\n` +
                `Suspicious: ${scanStats.suspicious}\n` +
                `Harmless: ${scanStats.harmless}\n` +
                `Undetected: ${scanStats.undetected}`,
                {
                    type: "setVirusTotalStats",
                    payload: {
                        ...scanStats,
                        verdict: verdict
                    }
                }
            );
        }
        catch
        {
            return buildChatResponse("Failed to connect to VirusTotal.");
        }
    }

    function handleStatsCommand()
    {
        //get attack count from db
        const totalAttacks = db.prepare("SELECT COUNT(*) AS count FROM attacks").get().count;

        //get all platforms from db
        const platformsResult = getUniquePlatforms();

        return buildChatResponse(
            "Stats:\n" +
            `Total attacks: ${totalAttacks}\n` +
            `Total platforms: ${platformsResult.length}\n` +
            `Platforms: ${platformsResult.join(", ")}`
        );
    }

    function handlePlatformsCommand()
    {
        //get platform list from db
        const platformsResult = getUniquePlatforms();

        return buildChatResponse("Platforms:\n" + platformsResult.join(", "));
    }

    function handleClearCommand()
    {
        //tell react to clear filters
        return buildChatResponse("Search and filters cleared.", {
            type: "clearFilters"
        });
    }

    function handleRefreshCommand()
    {
        //tell react to fetch table again
        return buildChatResponse("Attacks refreshed.", {
            type: "refresh"
        });
    }

    function handleExportCommand()
    {
        //tell react to export csv
        return buildChatResponse("Export started.", {
            type: "export"
        });
    }

    function handleHelpCommand()
    {
        //show all chat commands
        return buildChatResponse(
            "Available commands:\n" +
            "/help\n" +
            "/stats\n" +
            "/platforms\n" +
            "/attacks --search <text>\n" +
            "/attacks --platform <platform>\n" +
            "/attacks --phase <phase>\n" +
            "/attacks --search <text> --platform <platform> --phase <phase>\n" +
            "/attack --id <id>\n" +
            "/scanFile <hash>\n" +
            "/clear\n" +
            "/refresh\n" +
            "/export"
        );
    }

    async function routeChatCommand(parsedCommand)
    {
        //send every command to its own function
        if (parsedCommand.command === "attacks")
            return handleAttacksCommand(parsedCommand.options);

        if (parsedCommand.command === "attack")
            return handleAttackCommand(parsedCommand.options);

        if (parsedCommand.command === "scanFile")
            return await handleScanFileCommand(parsedCommand.options);

        if (parsedCommand.command === "stats")
            return handleStatsCommand();

        if (parsedCommand.command === "platforms")
            return handlePlatformsCommand();

        if (parsedCommand.command === "clear")
            return handleClearCommand();

        if (parsedCommand.command === "refresh")
            return handleRefreshCommand();

        if (parsedCommand.command === "export")
            return handleExportCommand();

        return buildChatResponse("Unknown command. Use /help.");
    }

    mitre_app.post("/api/chat", async (req, res) => {
        //get message text from react
        const userMessage = String(req.body.message ?? "").trim();

        //stop if message is empty
        if (userMessage === "")
            return res.status(400).json(buildChatResponse("Message is empty."));

        //all commands must start with /
        if (!userMessage.startsWith("/"))
            return res.json(buildChatResponse("Commands must start with /. Example: /help"));

        //help is handled directly
        if (userMessage === "/help")
            return res.json(handleHelpCommand());

        //parse the command with commander
        const parsedCommand = parseChatCommand(userMessage);

        //stop if commander did not understand the command
        if (parsedCommand === null)
            return res.json(buildChatResponse("Unknown command. Use /help."));

        //send the command to the right function
        const chatResponse = await routeChatCommand(parsedCommand);

        res.json(chatResponse);
    });

    mitre_app.listen(3000, () => {//listen on port 3000
        console.log("Server running on http://localhost:3000");
    });
}

module.exports = apiHandle;
