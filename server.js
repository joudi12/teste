const express = require('express');
const pg = require('pg');
const superagent = require('superagent');
const cors = require('cors');
const methodoverride = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT;


let app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride('_method'));
app.set('view engine', 'ejs');
//////////////////////////////////////////
app.get('/home', handelfunction);
app.post('/Fav', addtofav);
app.get('/Fav', showsave);
app.get('/Fav/:id',showDetails);
app.put('/Fav/:id',handelupdating);
app.delete('/Fav/:id',handeldeleting);


function handelfunction(req, res) {
    let arr = [];
    let url = `https://cat-fact.herokuapp.com/facts?animal_type=dog`
    console.log(req.body)
    superagent(url).then(data => {
        data.body.all.forEach(element => {
            arr.push(new Fact(element));
        });
        res.render('home-page', { result: arr });
    })
}
function Fact(data) {
    this.text = data.text;
    this.type = data.type;
}


function addtofav(req, res) {
    let query = 'INSERT INTO fact (text,type) VALUES ($1,$2);'
    let value = [req.body.text, req.body.type];
    client.query(query, value).then(() => {
        res.redirect('/Fav')
    })
}

function showsave(req,res){
    let query = 'SELECT * FROM fact;';
    client.query(query).then(data=>{
        console.log(data);
        res.render('favorite',{result:data.rows})
    })
}

function showDetails(req,res){
    let query= 'SELECT * FROM fact WHERE id=$1;'
    let values= [req.params.id];
    client.query(query,values).then(element=>{
        res.render('fac-details',{result:element.rows[0]})
    })
}

function handelupdating(req,res){
    let query ='UPDATE  fact SET type=$1, text=$2 WHERE id=$3;';
    let values=[req.body.type, req.body.text,req.params.id]
    client.query(query,values).then(()=>{
        res.redirect('/Fav');
    })
}

function handeldeleting(req,res){
    let query = 'DELETE FROM fact WHERE id=$1;'
    let value=[req.params.id]
    client.query(query,value).then(()=>{
        res.redirect('/Fav');
    })
}


let client = new pg.Client(process.env.DATABASE_URL);
client.connect().then(() => {

    app.listen(PORT, () => {
        console.log('every thing good', PORT)
    });
});