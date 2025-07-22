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

    spawnPoints: [spawnPointSchema] ,

    worldMapPos: {
        x: Number ,
        y: Number
    }

}); 



//Indexes

mapSchema.index({chapter: 1});



export default mongoose.model("Map" , mapSchema);