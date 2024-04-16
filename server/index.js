const express = require('express');
const path = require('path');
const app = express();
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require("./db/data");
const dotenv = require('dotenv');
dotenv.config();

const Register = require("./models/register");
const Special = require("./models/special");
const Case = require("./models/cases");
const { Script } = require('vm');
const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require(path.join(__dirname, 'routes/project.js')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login/login.html'));
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/new_case", (req, res) => {
  res.render("new_case");
});


app.get("/registrar", (req, res) => {
  res.sendFile(path.join(__dirname, 'public/registrar/main.html'));
});

app.get('/registrar/schedule', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/registrar/schedule.html'));
});





const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
    accessToken: process.env.ACCESS_TOKEN
  }
});


app.get('/api/registeredUsers', async (req, res) => {
  try {
      const users = await Register.find();
      res.json(users);
  } catch (error) {
      res.status(500).json({ message: 'Error fetching registered users' });
  }
});

function validatePassword(password) {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/;
  return regex.test(password);
}


app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    if (!validatePassword(password)) {
      return res.send("<script>alert('Invalid password format. Password must be 6 characters long, contain at least 1 number, and 1 special character.'); window.location.href='/';</script>");
    }
    const hashedPassword = await bcrypt.hash(password, 5);

    const email = req.body.email;
    const name = req.body.name;
    const loginType = "registrar";
    const userEmail = await Register.findOne({ email: email });
    if (userEmail) {
      res.send("<script>alert('Email already exists'); window.location.href='/';</script>");
    }
    else {
      if (password === cpassword) {
        const registerUser = new Register({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          cpassword: cpassword,
          loginType: loginType
        });
        const registered = await registerUser.save();
        // sendRegistrationEmail(name, email);
        res.status(201).redirect("/registrar");
      }
      else {
        res.send("Passwords do not match");
      }
    }
  }
  catch (error) {
    res.status(400).send(error);
  }
});



app.post("/api/increment-count", async (req, res) => {
  try {
    const email = req.app.locals.varl;
    
    const user = await Register.findOneAndUpdate(
      { email: email, loginType: 'lawyer' },
      { $inc: { count: 1 } },
      { new: true }
    );

    if (user) {
      res.json({ success: true, message: "Count incremented successfully", count: user.count });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Error incrementing count", error: error.message });
  }
});

global.varl="";

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    
    const password = req.body.password;
    const loginType = req.body.loginType;

    const findUser = await Register.findOne({ email: email, loginType: loginType });
    // console.log("Found user:", findUser);

    if (findUser) {
      const isMatch = await bcrypt.compare(password, findUser.password);
      if (isMatch) {
        if (loginType === "registrar") {
          res.send("<script>alert('Login Successful'); window.location.href='/registrar';</script>");
        }
        else if (loginType === "judge" || loginType === "lawyer") {
          app.locals.varl = email; 
          console.log(app.locals.varl);
          res.send("<script>alert('Login Successful'); window.location.href='/registrar/main2.html';</script>");
        }
      } else {
        res.send("<script>alert('Invalid Login Details'); window.location.href='/';</script>");
      }
    } else {
      res.send("<script>alert('Invalid Login Details'); window.location.href='/';</script>");
    }
  }
  catch (error) {
    res.status(400).send("<script>alert('Invalid Login Details'); window.location.href='/';</script>");
  }
});


app.post('/api/increment-count', async (req, res) => {
  try {
      const user = await Register.findOneAndUpdate(
          { email: varl, loginType: 'lawyer' },
          { $inc: { count: 1 } },
          { new: true } 
      );

      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, count: user.count });
  } catch (error) {
      console.error('Error incrementing count:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.post("/add_login", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.cpassword;
    const specialId = await req.body.name;
    const role = req.body.role;
    if (!validatePassword(password)) {
      return res.send("<script>alert('Invalid password format. Password must be 6 characters long, contain at least 1 number, and 1 special character.'); window.location.href='/';</script>");
    }
    if(specialId.length!==10){
      return res.send("<script>alert('Invalid special ID'); window.location.href='/';</script>");
    }
    else{
      const SpecialId = await Special.findOne({ id_: specialId, user: role });
      if (!SpecialId) {
        res.send("<script>alert('Special ID does not exist'); window.location.href='/';</script>");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const email = req.body.email;
    const name = req.body.name;
    const loginType = req.body.loginType;
    const userEmail = await Register.findOne({ email: email });
    if (userEmail) {
      res.send("<script>alert('Email already exists'); window.location.href='/';</script>");
    }
    else {
      if (password === cpassword) {
        const registerUser = new Register({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          cpassword: cpassword,
          loginType: loginType,
          count: 0
        });
        const registered = await registerUser.save();
        // sendRegistrationEmail(name, email);
        res.status(201).redirect("/registrar/solved.html");
      }
      else {
        res.send("Passwords do not match");
      }
    }
  }
  catch (error) {
    res.status(400).send(error);
  }
}
);


app.put('/api/resetCount', async (req, res) => {
  try {
      const { email } = req.body;

      const updatedUser = await Register.findOneAndUpdate(
          { email: email, loginType: 'lawyer' },
          { count: 0 },
          { new: true }
      );

      if (!updatedUser) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }

      return res.json({ success: true, message: 'Count reset successfully' });
  } catch (error) {
      console.error('Error resetting count:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


app.post('/generate-id', async (req, res) => {
  const { userType } = req.body;

  try {
      let specialId;

      if (userType === 'judge') {
          specialId = uuidv4().specialId = uuidv4().substring(0, 10);;
          const special = new Special({ id_: specialId, user: 'judge' });
          const existingSpecial = await Special.findOne({ user: 'judge' });
          if (existingSpecial) {
              await Special.findOneAndDelete({ user: 'judge' });
          }
          await special.save();
      } else if (userType === 'lawyer') {
          specialId = uuidv4().specialId = uuidv4().substring(0, 10);;
          const special = new Special({ id_: specialId, user: 'lawyer' });
          const existingSpecial = await Special.findOne({ user: 'lawyer' });
          if (existingSpecial) {
              await Special.findOneAndDelete({ user: 'lawyer' });
          }
          await special.save();
      } else if (userType === 'registrar') {
          specialId = uuidv4().specialId = uuidv4().substring(0, 10);;
          const special = new Special({ id_: specialId, user: 'registrar' });
          const existingSpecial = await Special.findOne({ user: 'registrar' });
          if (existingSpecial) {
              await Special.findOneAndDelete({ user: 'registrar' });
          }
          await special.save();
      } else {
          return res.status(400).json({ message: 'Invalid user type' });
      }

      res.json({ id: specialId });
  } catch (error) {
      console.error('Error generating ID:', error);
      res.status(500).json({ message: 'Error generating ID' });
  }
});




app.get("/add_case", async (req, res) => {
  try {
    const lastCase = await Case.findOne().sort({ createdAt: -1 });
    let nextSeq = 1;
    if (lastCase && lastCase.cin) {
      const lastSeq = parseInt(lastCase.cin.substring(3));
      nextSeq = lastSeq + 1;
    }
    const cin = `CIN${nextSeq.toString().padStart(6, '0')}`;
    res.redirect(`/case.html?cin=${cin}`);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/add_case", async (req, res) => {
  try {
    const newCase = new Case({
      defendantName: req.body.defendantName,
      defendantAddress: req.body.defendantAddress,
      crimeType: req.body.crimeType,
      dateCommitted: req.body.dateCommitted,
      locationCommitted: req.body.locationCommitted,
      arrestingOfficer: req.body.arrestingOfficer,
      caseStatus: req.body.caseStatus,
      judgeAssigned: req.body.judgeAssigned,
      lawyer: req.body.lawyer,
      publicProsecutor: req.body.publicProsecutor,
      dateOfArrest: req.body.dateOfArrest
    });

    const savedCase = await newCase.save();
    res.send(`<script>alert('Case added successfully and CIN number is ${savedCase.cin}'); window.location.href='/registrar';</script>`);
  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyPattern.cin) {
      res.send(`<script>alert('A case with this CIN already exists. Please try again.'); window.location.href='/registrar';</script>`);
    } else {
      res.status(400).send(error);
    }
  }
});

app.get("/registrar", async (req, res) => {
  try {
    const cases = await Case.find({});
    res.sendFile(path.join(__dirname, 'public/registrar/main.html'));
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/cases', async (req, res) => {
  try {
    const cases = await Case.find({});
    res.json(cases);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching cases', error: error.message });
  }
});

function sendRegistrationEmail(name, email) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to Our Website',
    text: `Hello ${name},\n\nThank you for registering on our JISS website!`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}


app.get('/api/getCount', async (req, res) => {
  try {
      const email = req.app.locals.varl; 
      const user = await Register.findOne({ email });
      
      if (user) {
          res.json({ success: true, email:user.email, count: user.count });
      } else {
          res.json({ success: false, message: 'User not found' });
      }
  } catch (error) {
      console.error('Error fetching count:', error);
      res.json({ success: false, message: 'Internal server error' });
  }
});



app.get('/api/upcomingHearings', async (req, res) => {
  try {
      const today = new Date();
      const cases = await Case.find({
          "hearings": {
              $elemMatch: {
                  hearingDate: { $gte: today }
              }
          }
      });

      res.json(cases);
  } catch (error) {
      console.error('Error fetching upcoming hearings:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.get('/api/scheduledHearings', async (req, res) => {
  const { hearingDate } = req.query;
  try {
    const hearings = await Case.find({ 'hearings.hearingDate': new Date(hearingDate) }, { 'hearings.hearingSlot': 1, _id: 0 });
    const scheduledSlots = hearings.flatMap(h => h.hearings.map(s => s.hearingSlot));
    res.json(scheduledSlots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching scheduled hearings" });
  }
});



app.put('/api/cases/:id', async (req, res) => {
  try {
    const caseId = req.params.id;
    const updates = req.body;

    const updatedCase = await Case.findByIdAndUpdate(caseId, updates, { new: true });

    if (!updatedCase) {
      return res.status(404).json({ message: 'Case not found' });
    }
    res.json(updatedCase);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});



app.post('/api/scheduleHearing', async (req, res) => {
  try {
    const { caseId, hearingDate, hearingSlot, adjornedReason, summary } = req.body;

    const updatedCase = await Case.findOneAndUpdate(
      { cin: caseId },
      {
        $push: {
          hearings: {
            hearingDate,
            hearingSlot,
            adjornedReason,
            summary
          }
        }
      },
      { new: true }
    );

    if (updatedCase) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Failed to schedule hearing' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});






app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
