const fs = require('fs/promises');
const { v5: uuidv5 } = require("uuid");
const openDB = require("./database");

const MY_NAMESPACE = "12ab21ba-abba-4aab-abab-21ba12ab21ba";//for UUID
async function DirectoryFilesScan(directoryPath)
{
    try
    {
        const files = await fs.readdir(directoryPath);//getting all files name by reading the directory

        for(const fileName of files)//scan each file name
        {
            const fullFilePath = directoryPath + '\\' + fileName;//getting the full file path by adding to the folder path / and the file name

            const content = await fs.readFile(fullFilePath, 'utf8');//getting the file content by reading it

            //console.log(`content of file: ${fileName}: `, content);

            const jsonFile = JSON.parse(content);//convert the content into json

            if(jsonFile.spec_version !== "2.0" || jsonFile.type !== "bundle" || jsonFile.objects[0].type !== "attack-pattern")//check if version is not 2.0 + type is not bundle + object type is not attack-pattern(ERROR)
                throw new Error("Not dealing with this data sorry :(");

            //console.log(jsonFile.objects[1]); 1 not exists only 0
            
            const object = jsonFile.objects[0];//getting only the object

            const primary_id = object.id !== undefined ? stringToUUID(object.id) : "NA";//id - with uuid
            const name = object.name ?? "NA";//attack name
            const description = object.description ?? "NA";//attack description;
            const x_mitre_platforms = Array.isArray(object.x_mitre_platforms) ? object.x_mitre_platforms.join(",") : "NA";//platforms(array)
            const x_mitre_detection = object.x_mitre_detection ?? "NA";//detection
            
            //console.log({primary_id, name, description, x_mitre_platforms, x_mitre_detection});
            insertToAttackTable(primary_id, name, description, x_mitre_platforms, x_mitre_detection);

            const phases = object.kill_chain_phases ?? [];//if not exist put empty array
            for(let i = 0; i < phases.length; i++)//attack phases
            {
                const phase_name = phases[i].phase_name ?? "NA";
                //console.log(phase_name);
                insertToPhasesTable(primary_id, phase_name);
            }


        }
    } catch (err)
    {
        console.error("Error: ", err);
    }
}

function stringToUUID(str)
{
    return uuidv5(str, MY_NAMESPACE);
}


function insertToAttackTable(primary_id, name, description, x_mitre_platforms, x_mitre_detection)
{
    //added REPLACE for preventing errors when runing second time
    db.prepare(`
        INSERT OR REPLACE INTO attacks
        (Id, Name, Description, x_mitre_platforms, x_mitre_detection)
        VALUES (?, ?, ?, ?, ?)`).run(primary_id, name, description, x_mitre_platforms, x_mitre_detection);
}

function insertToPhasesTable(attack_id, phase_name)
{
    //added IGNORE for preventing add of same parameters
    db.prepare(`
    INSERT OR IGNORE INTO attack_pattern_phases 
    (attack_id, phase_name)
    VALUES (?, ?)`).run(attack_id, phase_name);
}

const db = openDB();

//Import data only
DirectoryFilesScan("C:\\Rafael-Project\\backend\\mitre cti master enterprise-attack-attack-pattern")
    .then(() => {
        console.log("MITRE data import finished.");
    });
