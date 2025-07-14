import express from "express"
import cors from "cors"
import "dotenv/config"
import connectDb from "./db.js"



const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors())





app.listen(PORT , () => {
    console.log("Server running on port" , PORT)
})