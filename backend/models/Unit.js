import mongoose from "mongoose";


const unitSchema = new mongoose.Schema({

    name: {
        type: String , 
        required: true
    },

    loyalty: {
        type: String ,
        enum: ["ally" , "enemy"] ,
        required: true
    },

    class: {
        type: String ,
        enum: ["infantry" , "cavalry" , "flyer"] ,
        required: true
    },

    stats: {
        hp: Number ,
        atk: Number ,
        def: Number ,
        spd: Number ,
        mov: Number
    },

    position: {
        x: Number ,
        y: Number
    },

    isUnlocked: {
        type: Boolean ,
        default: false
    }
});



//Indexes

unitSchema.index({type: 1});



export default mongoose.model("Unit" , UnitSchema)