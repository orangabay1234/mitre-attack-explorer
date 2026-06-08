const express = require("express");


function apiHandle(db)
{
    const mitre_app = express();//creating the server
    mitre_app.use(express.json());//for geting the query as json

    mitre_app.get("/api/attacks", (req, res) => {//for all get attacks types of api (except individual attack from id)
        // variables declare
        const platforms = req.query.platform;
        const search = req.query.search;
        const phase = req.query.phase;
        let attacks;
        const joinString = "SELECT attacks.*, attack_pattern_phases.phase_name FROM attacks JOIN attack_pattern_phases ON attacks.Id = attack_pattern_phases.attack_id ";
        
        if (platforms === undefined && search === undefined && phase === undefined)
        {
            //get all attacks without any filters
            attacks = db.prepare(joinString).all();
        }
        
        else if (platforms !== undefined && search === undefined && phase === undefined)
        {
            //get attacks that match a specific platform
            attacks = db.prepare(joinString + "WHERE attacks.x_mitre_platforms LIKE ?").all(`%${platforms}%`);
        }

        else if (search !== undefined && platforms === undefined && phase === undefined)
        {
            //get attacks where the search text appears in the attack name or description
            attacks = db.prepare(joinString + "WHERE attacks.name LIKE ? OR attacks.description LIKE ?").all(`%${search}%`, `%${search}%`);
        }

        else if (phase !== undefined && search === undefined && platforms === undefined)
        {
            //get attacks that belong to a specific phase
            attacks = db.prepare(joinString + "WHERE attack_pattern_phases.phase_name = ?").all(phase);
        }

        else if (platforms !== undefined && search !== undefined && phase === undefined)
        {
            //get attacks that match a specific platform and also contain the search text in name or description
            attacks = db.prepare(joinString + "WHERE attacks.x_mitre_platforms LIKE ? AND (attacks.name LIKE ? OR attacks.description LIKE ?)").all(`%${platforms}%`, `%${search}%`, `%${search}%`);
        }

        else if (platforms !== undefined && phase !== undefined && search === undefined)
        {
            //get attacks that match a specific platform and belong to a specific phase
            attacks = db.prepare(joinString + "WHERE attacks.x_mitre_platforms LIKE ? AND attack_pattern_phases.phase_name = ?").all(`%${platforms}%`, phase);
        }

        else if (search !== undefined && phase !== undefined && platforms === undefined)
        {
            //get attacks that belong to a specific phase and also contain the search text in name or description
            attacks = db.prepare(joinString + "WHERE attack_pattern_phases.phase_name = ? AND (attacks.name LIKE ? OR attacks.description LIKE ?)").all(phase, `%${search}%`, `%${search}%`);
        }

        else if (platforms !== undefined && search !== undefined && phase !== undefined)
        {
            //get attacks that match platform, search text, and phase (together)
            attacks = db.prepare(joinString + "WHERE attacks.x_mitre_platforms LIKE ? AND attack_pattern_phases.phase_name = ? AND (attacks.name LIKE ? OR attacks.description LIKE ?)").all(`%${platforms}%`, phase, `%${search}%`, `%${search}%`);
        }

        //didnt find attack
        if (attacks.length === 0)
            return res.status(404).json({error: "Attack not found"});

        res.json(attacks);//send the attacks
    });

    mitre_app.get("/api/attacks/:id", (req, res) => {//for get one attack with id
        //variables declare
        const id = req.params.id;

        const attack = db.prepare("SELECT * FROM attacks WHERE Id = ?").get(id);

        if (!attack)
            return res.status(404).json({error: "Attack not found"});

        res.json(attack);//send the attacks
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

    mitre_app.listen(3000, () => {//listen on port 3000
        console.log("Server running on http://localhost:5173");
    });
}

module.exports = apiHandle;