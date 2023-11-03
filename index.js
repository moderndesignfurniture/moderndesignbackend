import express from "express";
import User from "./Models/User.js"; // Adjust the path based on your directory structure
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
import { imageModel } from "./Models/User.js";
import { signalModel } from "./Models/User.js";
import { managerModel } from "./Models/User.js";
import { mentorModel } from "./Models/User.js";
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["http://localhost:3000", "*"],
    credentials: true,
  })
);
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



app.get("/api/v1/Allimage", async (req, res) => {
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





app.delete("/api/v1/imagereq/:id", async (req, res) => {
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
app.delete("/api/v1/request/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedData = await requestModel.deleteOne({ _id: id });

    if (deletedData.deletedCount !== 0) {
      res.send({
        message: "request has been deleted successfully",
      });
    } else {
      res.status(404).send({
        message: "No request found with this id: " + id,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }
});


app.delete("/api/v1/user/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deletedData = await User.deleteOne({ _id: id });

    if (deletedData.deletedCount !== 0) {
      res.send({
        message: "user has been deleted successfully",
      });
    } else {
      res.status(404).send({
        message: "No User found with this id: " + id,
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.post("/api/v1/Addimage", upload.any(), (req, res) => {
  try {
    const body = req.body;

    console.log("req.body: ", req.body);
    console.log("req.files: ", req.files);

    console.log("uploaded file name: ", req.files[0].originalname);
    console.log("file type: ", req.files[0].mimetype);
    console.log("file name in server folders: ", req.files[0].filename);
    console.log("file path in server folders: ", req.files[0].path);

    bucket.upload(
      req.files[0].path,
      {
        destination: `tweetPictures/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
      },
      function (err, file, apiResponse) {
        if (!err) {
          file
            .getSignedUrl({
              action: "read",
              expires: "03-09-2999",
            })
            .then((urlData, err) => {
              if (!err) {
                console.log("public downloadable url: ", urlData[0]); // this is public downloadable url

                try {
                  fs.unlinkSync(req.files[0].path);
                  //file removed
                } catch (err) {
                  console.error(err);
                }

                let addImage = new imageModel({
                  imageUrl: urlData[0],
                });

                addImage.save().then((res) => {
                  // res.send(res)

                  console.log(res, "image ADD");
                });
              }
            });
        } else {
          console.log("err: ", err);
          res.status(500).send();
        }
      }
    );
  } catch (error) {
    console.log("error: ", error);
  }
});
app.post("/signup", async (req, res) => {
  try {
    const { username, email, phone , country, password } = req.body;

    // Check if user with the given email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      country,
      password,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signalgroup", async (req, res) => {
  try {
    const { groupname, email, whatsapp , experience, totalclients, paymentoption } = req.body;

    // Check if user with the given email already exists
    const existingUser = await signalModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newsignalgroup = new signalModel({
      groupname,
      email,
      whatsapp,
      experience,
      totalclients,
      paymentoption,
    });

    // Save the user to the database
    await newsignalgroup.save();

    res.status(201).json({ message: "Signal group registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/signalgroupdisplay", async (req, res) => {
  try {
    const result1 = await signalModel.find().exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all signal Users successfully",
      data: result1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.get("/api/v1/mentordisplay", async (req, res) => {
  try {
    const result1 = await mentorModel.find().exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all signal Mentors successfully",
      data: result1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});

app.post("/accountmanager", async (req, res) => {
  try {
    const { groupname, email, whatsapp , experience, totalclients, paymentoption } = req.body;

    // Check if user with the given email already exists
    const existingmanager = await managerModel.findOne({ email });

    if (existingmanager) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newmanager = new managerModel({
      groupname,
      email,
      whatsapp,
      experience,
      totalclients,
      paymentoption,
    });

    // Save the user to the database
    await newmanager.save();

    res.status(201).json({ message: "Account Manager registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.post("/addmentors", async (req, res) => {
  try {
    const { mentorname, email, mentorfee , socialmedia } = req.body;

    // Check if user with the given email already exists
    const existingmentor = await mentorModel.findOne({ email });

    if (existingmentor) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Create a new user
    const newmentor = new mentorModel({
      mentorname,
      email,
      mentorfee,
      socialmedia,
    });

    // Save the user to the database
    await newmentor.save();

    res.status(201).json({ message: "Mentor registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/v1/accountmanagerdisplay", async (req, res) => {
  try {
    const result1 = await managerModel.find().exec(); // Using .exec() to execute the query
    // console.log(result);
    res.send({
      message: "Got all signal account managers successfully",
      data: result1,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Server error",
    });
  }
});
app.post("/login", async (req, res) => {
  try {
    let body = req.body;
    body.email = body.email.toLowerCase();

    if (!body.email || !body.password) {
      res.status(400).send(`required fields missing, request example: ...`);
      return;
    }

    // check if user exists
    const data = await User.findOne(
      { email: body.email },
      "username email password"
    );

    if (data && body.password === data.password) {
      // user found
      console.log("User Successfully Logged In !");
      console.log("data: ", data);

      const token = jwt.sign(
        {
          _id: data._id,
          email: data.email,
          iat: Math.floor(Date.now() / 1000) - 30,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
        },
        SECRET
      );

      console.log("token: ", token);

      res.cookie("Token", token, {
        maxAge: 86_400_000,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });

      res.send({
        message: "login successful",
        profile: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          age: data.age,
          _id: data._id,
        },
      });

      return;
    } else {
      // user not found
      console.log("user not found");
      res.status(401).send({ message: "Incorrect email or password" });
    }
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ message: "login failed, please try later" });
  }
});
app.use("/api/v1", (req, res, next) => {
  console.log("req.cookies: ", req.cookies.Token);

  if (!req?.cookies?.Token) {
    res.status(401).send({
      message: "include http-only credentials with every request",
    });
    return;
  }

  jwt.verify(req.cookies.Token, SECRET, function (err, decodedData) {
    if (!err) {
      console.log("decodedData: ", decodedData);

      const nowDate = new Date().getTime() / 1000;

      if (decodedData.exp < nowDate) {
        res.status(401);
        res.cookie("Token", "", {
          maxAge: 1,
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        res.send({ message: "token expired" });
      } else {
        console.log("token approved");

        req.body.token = decodedData;
        next();
      }
    } else {
      res.status(401).send("invalid token");
    }
  });
});
app.get("/api/v1/profile", (req, res) => {
  const _id = req.body.token._id;
  const getData = async () => {
    try {
      const user = await User.findOne(
        { _id: _id },
        "email password username phone country -_id"
      ).exec();
      if (!user) {
        res.status(404).send({});
        return;
      } else {
        res.set({
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "Surrogate-Control": "no-store",
        });
        res.status(200).send(user);
      }
    } catch (error) {
      console.log("error: ", error);
      res.status(500).send({
        message: "something went wrong on server",
      });
    }
  };
  getData();
});
app.post("/logout", (req, res) => {
  try {
    //   res.clearCookie('Token', {
    //     httpOnly: true,
    //     samesite: "none",
    //     secure: true
    // });
    // res.send({ message: "logged out successful" })

    res.cookie("Token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none", // Change to 'strict' if not using HTTPS
      secure: true, // Remove this line if not using HTTPS
      path: "/", // Make sure the path matches the one used when setting the token cookie
      domain: "http://localhost:3000/", // Make sure the domain matches the one used when setting the token cookie
    });
    res.send({ message: "Logged out successful" });
    
  } catch (error) {
    console.error("Error clearing cookie:", error);
    res.status(500).send({ message: "Logout failed, please try later" });
  }
});





// admin product request api




// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
