import mongoose from "mongoose";


const dialogueSchema = new mongoose.Schema({

    stageId: {
        type: Number ,
        required: true
    },

    scene: [{
        speaker: String ,
        portrait: String ,
        text: String
    }],

    category: {
        type: String ,
        enum: ["intro" , "outro"] ,
        required: true
    }, 

    backgroundImage: {
        type: String ,
        default: ""
    }
});



//Indexes

dialogueSchema.index({stageId: 1 , category: 1 });



export default mongoose.model("Dialogue" , dialogueSchema);