import express from "express";
import imageModel from "./Models/User.js"; // Adjust the path based on your directory structure
import bcrypt from "bcrypt";
import crypto from "crypto"; // Import the 'crypto' module
import jwt from "jsonwebtoken"; // Import the jsonwebtoken library
import nodemailer from "nodemailer";
const app = express();
const port = process.env.PORT || 8000; // Use process.env.PORT for flexibility
import cors from "cors";
const SECRET = process.env.SECRET || "topsecret";
import cookieParser from "cookie-parser";
import multer from "multer";
import bucket from "./Bucket/Firebase.js";
import fs from "fs";
import path from "path";
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(cors({origin: true, credentials: true}));

const storage = multer.diskStorage({
  destination: "/tmp",
  filename: function (req, file, cb) {
    console.log("mul-file: ", file);
    cb(null, `${new Date().getTime()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Ahemd Raza ");
});


app.post("/addimagetest", upload.array('images', 6), (req, res) => {
  try {
    const body = req.body;


    console.log("req.body: ", req.body);
    console.log("req.files: ", req.files);

    // Iterate over the uploaded files
    const uploadedFiles = req.files.map(file => {
      console.log("uploaded file name: ", file.originalname);
      console.log("file type: ", file.mimetype);
      console.log("file name in server folders: ", file.filename);
      console.log("file path in server folders: ", file.path);

      return new Promise((resolve, reject) => {
        bucket.upload(
          file.path,
          {
            destination: `tweetPictures/${file.filename}`, 
          },
          function (err, cloudFile) {
            if (!err) {
              cloudFile
                .getSignedUrl({
                  action: "read",
                  expires: "03-09-2999",
                })
                .then((urlData) => {
                  console.log("public downloadable url: ", urlData[0]);
                  // Remove the file from the server after uploading to the cloud
                  fs.unlinkSync(file.path);
                  resolve(urlData[0]);
                })
                .catch(reject);
            } else {
              console.log("err: ", err);
              reject(err);
            }
          }
        );
      });
    });

    Promise.all(uploadedFiles)
      .then(imageUrls => {
        let addProduct = new imageModel({

          service: body.service,
          project: body.project,
   
         
          imageUrl: imageUrls[0], // Save the first image URL


          // ... Other fields
        });

        addProduct.save().then(() => {
          res.send({
            message: "Product added successfully",
            data: addProduct,
          });
        });
      })
      .catch((error) => {
        console.error("Error uploading files:", error);
        res.status(500).send({
          message: "Server error",
        });
      });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.get("/Allimage", async (req, res) => {
  try {
    const result = await imageModel.find().exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/interiorimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "Interior Design"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/exteriorimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "Exterior Design"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/Archiimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "Architecture & Construction"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/furniimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "Custom Made Furniture"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/landscapeimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "Landscaping & Gardening"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/studioimage", async (req, res) => {
  try {
    const result = await imageModel.find({service: "3D Studio"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

//projects display

app.get("/residentialimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Residential"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/commercialimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Commercial"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/corporateimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Corporate"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/shopsimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Shops"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/studiosimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Studios"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/roomsimage", async (req, res) => {
  try {
    const result = await imageModel.find({project: "Rooms"}).exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all images successfully",
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});



app.delete("/imagereq/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedData = await imageModel.deleteOne({ _id: id });

    if (deletedData.deletedCount !== 0) {
      res.send({
        message: "image has been deleted successfully",
      });
    } else {
      res.status(404).send({
        message: "No image found with this id: " + id,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
