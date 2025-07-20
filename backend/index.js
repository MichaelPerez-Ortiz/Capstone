import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDb from "./db.js"
import Unit from "./models/Unit.js"
import Map from "./models/Map.js"
import Dialogue from "./models/Dialogue.js"
import cloudinary from "./config/cloudinary.js"
import WorldMap from "./models/WorldMap.js"


const app = express()
const PORT = process.env.PORT

connectDb()

app.use(express.json())
app.use(cors())


//Routes



//Unit Routes//

//GET

app.get("/api/units" , async(req , res) => {
try {

    const units = await Unit.find();
    res.json(units);

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

app.get("/api/units/:id" , async(req , res) => {
try {

    const unit = await Unit.findById(req.params.id);

    if(!unit) {
        return res.status(404).json({message: "Unit Not Found"});

    }
        res.json(unit);

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

//POST

app.post("/api/units" , async(req , res) => {

    const unit = new Unit({
        name: req.body.name ,
        loyalty: req.body.loyalty ,
        class: req.body.class ,
        stats: req.body.stats ,
        position: req.body.position ,
        isUnlocked: req.body.isUnlocked ,
        portrait: req.body.portrait ,
        description: req.body.description 
    });

try {

    const newUnit = await unit.save();
    res.status(201).json(newUnit)

    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

//PUT

app.put("/api/units/:id" , async(req , res) => {
try {

    const updateUnit = await Unit.findByIdAndUpdate(req.params.id , req.body , {new: true});
    res.json(updateUnit);

    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

//DELETE

app.delete("/api/units/:id" , async(req , res) => {
try {

    await Unit.findByIdAndDelete(req.params.id);
    res.json({message: "Unit Deleted"});

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});



//Map Routes//

//GET
app.get("/api/maps" , async(req ,res) => {
try {

    const maps = await Map.find().sort({chapter: 1})
    res.json(maps)
} catch(error) {
    res.status(500).json({message: error.message})
}

});


app.get("/api/maps/:chapter" , async(req ,res) => {
try {

    const map = await Map.findOne({chapter: req.params.chapter})
    .populate("enemyUnits")
    .populate("allyUnits")
    
    if(!map) {
        return res.status(404).json({message: "Map Not Found"})
    }

    res.json(map);
} catch(error) {
    res.status(500).json({message: error.message})
}

});

//POST

app.post("/api/maps" , async(req , res) => {

    const map = new Map({
         name: req.body.name ,
         description: req.body.description ,
         grid: req.body.grid ,
         chapter: req.body.chapter ,
         enemyUnits: req.body.enemyUnits ,
         allyUnits: req.body.allyUnits ,
         image: req.body.image
    });
try {

    const newMap = await map.save();
    res.status(201).json(newMap);
} catch(error) {
    res.status(400).json({message: error.message})
}

});

//UPDATE

app.put("/api/maps/:id" , async(req ,res) => {

try {

    const updateMap = await Map.findByIdAndUpdate(req.params.id , req.body , {new:true});
    res.json(updateMap);


    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

//DELETE

app.delete("/api/maps/:id" , async(req , res) => {
try {

    await Map.findByIdAndDelete(req.params.id);
    res.json({message: "Map Deleted"});

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});


//Dialogue Routes//


//GET

app.get("/api/dialogue/:stageId/:category" , async(req , res) => {
try {

    const dialogue = await Dialogue.findOne({
        stageId: req.params.stageId ,
        category: req.params.category
    });

    if(!dialogue) {
        return res.status(404).json({message: "Dialogue Not Found"});

    }
        res.json(dialogue);


    } catch(error) {
        res.status(500).json({message: error.message});
    }
});

//POST

app.post("/api/dialogue" , async(req , res) => {
    
    const dialogue = new Dialogue({
        stageId: req.body.stageId ,
        scene: req.body.scene ,
        category: req.body.category ,
        backgroundImage: req.body.backgroundImage 
    });

try{
    const newDialogue = await dialogue.save();
    res.status(201).json(newDialogue);

    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

//PUT

app.put("/api/dialogue/:id" , async(req , res) => {
try {

    const updatedDialogue = await Dialogue.findByIdAndUpdate(req.params.id , req.body , {new: true});
    res.json(updatedDialogue);

    } catch(error) {
        res.status(400).json({message: error.message});
    }
});





app.listen(PORT , () => {
    console.log("Server running on port" , PORT)
})


//World Map Routes


//GET
app.get("/api/worldMap" , async(req , res) => {
try{

    let worldMap = await WorldMap.findOne({isActive: true});

    if(!worldMap) {
        worldMap = new WorldMap({
            name: "World Map" ,
            isActive: true});
            await worldMap.save();
    }

    if(worldMap.battleMaps && worldMap.battleMaps.length > 0) {
        await worldMap.populate("battleMaps");
    } else {

        const allMaps = await Map.find().sort({chapter: 1});
        worldMap.battleMaps = allMaps.map(map => map._id);
        await worldMap.save();
        await worldMap.populate("battleMaps");
    }
    res.json(worldMap);

    } catch(error) {
        console.error("Error Getting World Map" , error);
        res.status(500).json({message: error.message});
    }
});

//POST

app.post("/api/worldMap" , async(req , res) => {
try{

    const {name , imageUrl , regions , battleMaps , isActive} = req.body;

    let worldMap = await WorldMap.findOne({isActive: true});

    if(!worldMap) {
        worldMap = new WorldMap({isActive: true});
    }

    if(name) worldMap.name = name;
    if(imageUrl) worldMap.imageUrl = imageUrl;
    if(regions) worldMap.regions = regions;
    if(battleMaps) worldMap.battleMaps = battleMaps;
    if(isActive !== undefined) worldMap.isActive = isActive;

    await worldMap.save();
    res.json(worldMap);

    } catch(error) {
        res.status(500).json({message: error.message});
    }
});


