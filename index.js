import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;
const db = new pg.Client({
    user: "postgres" ,
    host: "localhost",
    database: "Education",
    password: "vishwas",
    port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("client"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/client/index.html");
});

app.get("/login", (req, res) => {
    res.sendFile(__dirname + "/client/login.html");
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/client/signup.html");
});

app.get("/donate", (req, res) => {
    res.sendFile(__dirname + "/client/donate.html");
});

app.post("/signup", async (req, res) => {
    const fname = req.body.fname;
    const lname = req.body.lname;
    const password = req.body.password;
    const email = req.body.email;

    try{
        const check = await db.query("SELECT * FROM signup WHERE email = $1" ,[
           email, 
        ]);
        if(check.rows.length > 0)
        {
            res.send("Email already exist.Try using a different email");
        } else {
            const result = await db.query(
                "INSERT INTO signup(first_name,last_name,email,password) VALUES ($1,$2,$3,$4)" ,
                [fname , lname , email , password]
            );
            res.send("Signup Sucessful");
            console.log(result);
        }
    } catch(err)
    {
        console.log(err);
    }

    console.log(fname, lname, password, email);
    
});

app.post("/login", async (req, res) => {
    const Email = req.body.email;
    const Password = req.body.password;

    try {
        const result = await db.query(
          "SELECT password FROM signup WHERE email = $1",
          [Email] 
        );
        if (result.rows.length > 0) {
          const getPassword = result.rows[0].password;
          if (getPassword == Password) {
            res.send("User Exist Login succesfull");
            res.sendFile(__dirname + "/client/index.html");
          } else {
            res.send("Incorrect Password");
          }
        } else {
            res.sendFile(__dirname + "/client/signup.html");
        }
      } catch (err) {
        console.log(err);
      }
      console.log(Password, Email);
    });

    app.post("/donate" , async (req , res)=>{
        const fname = req.body.Fname;
        const email = req.body.email;
        const phone = req.body.phone_number;
        const title = req.body.title_book;
        const author = req.body.book_author;
        const quantity = req.body.quantity_book;
        const genre = req.body.categories;
        const description = req.body.product_description;
        const result = await db.query(
            "INSERT INTO donate (full_name , email , phone , title , author , quantity , genre , description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)" , 
            [fname , email , phone , title , author , quantity , genre , description]
        );
        console.log(result);
        console.log(fname , email , phone , title , author , quantity , genre , description);
        res.send("Data saved successfully");
    
    })


app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
