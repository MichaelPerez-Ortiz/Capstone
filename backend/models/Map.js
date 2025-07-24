import mongoose from "mongoose";



const spawnPointSchema = new mongoose.Schema({
    x: Number ,
    y: Number ,
    maxSpawns: {
        type: Number ,
        default: 3
    },

    frequency: {
        type: Number ,
        default: 2
    },

    unitName: String ,
    unitClass: {
        type: String ,
        enum: ["infantry" , "cavalry" , "flyer"] 
    },

    unitStats: {
        hp: Number ,
        atk: Number ,
        def: Number ,
        spd: Number ,
        mov: Number
    }
});



/////////////////////////////////////////////////


const initialEnemySchema = new mongoose.Schema({
    unitId: {
        type: mongoose.Schema.Types.ObjectId ,
        ref: "Unit"
    },

    position: {
        x: Number ,
        y: Number
    },

    customStats: {
        hp: Number ,
        atk: Number ,
        def: Number ,
        spd: Number ,
        mov: Number
    },

    customName: String
});


////////////////////////////////////////////////////////////

const mapSchema = new mongoose.Schema({

    name: {
        type: String ,
        required: true ,
        unique: true
    },

    description: {
        type: String
    },

    grid: {
        type: [[Number]] ,
        required: true
    },

    chapter: {
        type: Number ,
        required: true ,
        unique: true
    },

    enemyUnits: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:  "Unit"
        
    }],

    allyUnits: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref:  "Unit"
        
    }],
    image: {
        type: String ,
        default: ""
    },

    initialEnemies: [initialEnemySchema] ,

    spawnPoints: [spawnPointSchema] ,

    worldMapPos: {
        x: Number ,
        y: Number
    }

}); 




export default mongoose.model("Map" , mapSchema);