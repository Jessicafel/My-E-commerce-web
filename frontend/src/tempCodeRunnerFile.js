import express from "express";
import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT||5002;

app.use(express.static(path.join(__dirname + '/public')));
app.use((req, res)=> {
    res.status(404);
    res.send('<h1> Error 404 : website not found <h1>');
})
app.listen(PORT, ()=>{
    console.log("server is running on http://localhost:" + PORT);
});
