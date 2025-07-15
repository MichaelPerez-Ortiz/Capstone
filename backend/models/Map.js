import mongoose from "mongoose";



const mapSchema = new mongoose.Schema({

    name: {
        type: String ,
        required: true ,
        unique: true
    },

    description: {
        type: String ,
        grid: {
            type: [[Number]] ,
            required: true
        }
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
}); 



//Indexes

mapSchema.index({stage: 1});



export default mongoose.model("Map" , mapSchema);