import mongoose from "mongoose";


const worldMapSchema = new mongoose.Schema({
    name: {
        type: String ,
        default: "World Map"
    },

    imageUrl: {
        type: String ,
        default: ""
    },

    regions: [{
        name: String ,
        description: String ,
        x: Number ,
        y: Number
    }],

    battleMaps: [{
        type: mongoose.Schema.Types.ObjectId ,
        ref: "Map"
    }],

    isActive: {
        type: Boolean ,
        default: true
    }
});

//Indexes

worldMapSchema.index({isActive: 1 , name: 1});

export default mongoose.model("WorldMap" , worldMapSchema);