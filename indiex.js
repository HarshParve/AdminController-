const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");
const { log } = require("console");
const { render } = require("ejs");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/view"));

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "hp_da",
  password: "harsh@915618",
});

app.listen("8080", () => {
  console.log("app is listing");
});

app.get("/", (req, res) => {
  let q = `SELECT COUNT(*) FROM user`;

  try {
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }

      let count = result[0]["COUNT(*)"];
      res.render("home.ejs", { count });
    });
  } catch (error) {
    console.log(err);
    res.send("some error in DB");
  }
});

app.get("/user", (req, res) => {
  try {
    let q = `SELECT * FROM user`;
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      res.render("showuser.ejs", { result });
    });
  } catch (error) {
    console.log("err in DB");
  }
});

app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  try {
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let user = result[0];
      res.render("edit.ejs", { user });
    });
  } catch (err) {
    res.send("err in database");
  }
});

app.patch("/user/:id", (req, res) => {
  let { id } = req.params;
  let { username: newUser, password: currPass } = req.body;

  try {
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      let user = result[0];
      if (currPass != user.password) {
        res.send("Opps! Wrong Password Please Try again");
      } else {
        try {
          let q2 = `UPDATE user SET username = '${newUser}' WHERE id ='${id}'`;
          connection.query(q2, (err, result) => {
            if (err) {
              throw err;
            }
            res.redirect("/user");
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user/new", (req, res) => {
  res.render("NewUser.ejs");
});

app.post("/user/new", (req, res) => {
  let id = uuidv4();
  let { username, email, password, password2 } = req.body;
  try {
    let q = `INSERT INTO user VALUES ("${id}", "${username}","${email}","${password}")`;
    connection.query(q, (err, result) => {
      if (err) {
        throw err;
      }
      if (password != password2) {
        res.send("Password is not match");
      } else {
        res.render("/user");
      }
    });
  } catch (err) {
    console.log(err);
  }
});


app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  res.render("delete.ejs", { id });
});

app.post("/user/:id/delete", (req, res)=>{
  let {id} = req.params;
  let {password , email} = req.body;
  try {
    let q = `SELECT * FROM user WHERE id = '${id}'`
    connection.query(q, (err, result) =>{
      if(err){
        throw err;
      }
      let user = result[0];
      if (user.password == password && user.email == email) {
        let q2 = `DELETE FROM user WHERE id = '${id}'`
        connection.query(q2, (err, result) =>{
          if (err) {
            throw err;
          }
          res.send("User Account is Deleted");
        })
      }else{
        res.send("Something is Wrong");
      }
     })
  } catch (error) {
    console.log(error);
  }
})




// let data = []
// for(let i = 1; i<= 100; i++){
//     data.push(createRandomUser());
//     if (i == 100) {
//         console.log("Done");
//     }
// }

// try {
//   let q = `INSERT INTO user (id, username, email, password) VALUES ?`;
//   connection.query(q, [data] ,(err, result) =>{
//     if (err) {
//       throw err;
//     }
//     console.log("data is push DB");
//   })
// } catch (error) {
//   console.log("error in database");
// }

// let createRandomUser = ()=> {
//   return [
//   faker.string.uuid(),
//   faker.internet.userName(),
//   faker.internet.email(),
//   faker.internet.password(),
//   ];
// }
