const mysql = require('mysql')
const cors = require('cors')
require('dotenv').config()
const express = require('express')
const { add } = require('nodemon/lib/rules')
const app = express()
const port = process.env.PORT || 3003

app.use(express.json())
app.use(cors("*"))

const con = mysql.createConnection({
    host: "localhost",
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to SQL database !");
})

function findOne(table,id) {
    return new Promise((resolve, reject) => {
        con.query(`SELECT * FROM ${table} WHERE id = ${id}`, function (err, result, fields) {
            if (err) reject(err)
            resolve(result)
        })
    })
}

app.get('/recipes', (req, res) => {
    // envoyer la liste des recettes SELECT
    const sql = "SELECT * FROM recipe";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    });
})

app.get('/recipes/:id', async (req, res) => {
    const result = await findOne('recipe',req.params.id)
    res.send(result)
})

app.post('/recipes', (req, res) => {
    // créer une recette
    const recipe = req.body;
    console.log(recipe);
    const sql = "INSERT INTO recipe (title, category) VALUES (?, ?)";
    con.query(sql, [recipe.title, recipe.category] , async (err, result) => {
        if (err) throw err;
        
        const recipe = await findOne('recipe', result.insertId)
        res.send(recipe)
    });
})

app.put('/recipes/:id', (req, res) => {
    const id = req.params.id;
    let {title, category} = req.body

    con.query(`SELECT * FROM recipe WHERE id = ?`, [id], function (err, result, fields) {
        if (err) throw err;
        if(!title) {title = result[0].title};

        if(!category) {category = result[0].category};
        
        const sql = `UPDATE recipe SET title = ?, category = ? WHERE id = ?`;
        con.query(sql, [title, category, id], function (err, result, fields) {
            if (err) throw err;
            res.send(result);
        })
    })
})

app.delete('/recipes/:id', (req, res) => {
    // supprimer une recette
    const sql = "DELETE FROM recipe WHERE id = ?";
    con.query(sql, [req.params.id] ,function (err, result) {
        if (err) throw err;
        res.sendStatus(200);
    })
})

app.get('/categories', (req, res) => {
    const sql = "SELECT * FROM category";
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send(result);
    })
})
app.get('/category/:id', (req, res) => {
    const {id} = req.params;
    const sql = `SELECT * FROM category WHERE id = ${id}`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.send(result);
    })
})
app.post('/category', (req, res) => {
    const {name} = req.body;
    const sql = 'INSERT INTO category (name) VALUES (?)';
    con.query(sql, [name], async (err,result) => {
        if(err) throw err;
        const category = await findOne('category', result.insertId)
        res.send(category)
    })
})
app.delete('/category/:id', (req, res) => {
    const {id} = req.params
    const sql = 'DELETE FROM category WHERE id = ?';
    con.query(sql, [id], (err, result) => {
        if(err) throw err;
        res.send(result);
    })
})
app.put('/category/:id', (req, res) => {
    const {id} = req.params
    const {name} = req.body
    const sql = 'UPDATE category SET name = ? WHERE id = ?'
    con.query(sql, [name, id], async (err, result) => {
        if(err) throw err;
        const category = await findOne('category', id)
        res.send(category);
    })
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})