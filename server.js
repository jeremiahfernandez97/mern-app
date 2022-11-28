const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .catch((err) => console.log(err));

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, './client/public/uploads')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({storage: storage})

const noteSchema = mongoose.Schema({
    title: String,
    description: String,
    file: {
        data: Buffer,
        contentType: String
    }
})


const Note = mongoose.model('Note', noteSchema)

// app.get("/", (req,res) => {
//     res.send('go to /app to begin');
// })

app.get("/app", (req,res) => {
    Note
    .find().then((note) => {
        res.send(note)
    })
    .catch((err) => console.log(err))
})


app.post("/app", upload.single("fileUpload"), (req,res) => {    
    // console.log(req.body);

    // const saveNote = new Note({
    //     title: req.body.title,
    //     description: req.body.description,
    //     file: {
    //         data: fs.readFileSync('client/public/uploads/', req.body.fileUpload),
    //         contentType: "image/png"
    //     }
    // })

    // saveNote
    //     .save()
    //     .then((res) => {
    //         console.log(res)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
    
    Note.create({
        title: req.body.title,
        description: req.body.description,
    })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err))
})

app.delete("/app/:id", (req,res) => {
    console.log(req.params.id);
    Note
    .findByIdAndDelete({_id: req.params.id})
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err))
})

app.put("/app/:id", (req,res) => {
    // console.log(req.params.id);
    Note
    .findByIdAndUpdate({_id: req.params.id},{
        title: req.body.title,
        description: req.body.description,
        file: req.body.file
    })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err))
})

// app.delete("/app/:id", (req,res) => {
//     console.log("deleting :", req.params.id);
// })

// app.post("/create", (req,res) => {
//     Post.create({
//         title: req.body.title,
//         description: req.body.description
//     })
// })

// app.get("/posts", (req,res) => {
//     Post.find().then((post) => {
//         res.send(post)
//     })
// })

if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req,res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

app.listen(process.env.PORT || 3001, () => {
    console.log("Server running")
})