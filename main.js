const fetch = require("node-fetch");
const cheerio = require("cheerio");
const bodyParser = require("body-parser");
const express = require("express");
const { request } = require("http");
const app = express();
const PORT = 8000;
var url = "https://www.dictionary.com/browse/";
var words = ""; 

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended : true
}));

app.get("/", function(req, res){
    res.sendFile(__dirname + '/' + 'index.html');
});

app.post("/", function(req, res){
    words = req.body.word;
    url = url + words;
    getData(url);
});

// function to get the raw data
const getRawData = (URL) => {
    
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

// start of the program
const getData = async (url) => {
   
    const rawData = await getRawData(url);
    // console.log(rawData);

    // parsing the data
    const parsedData = cheerio.load(rawData);
    // console.log(parsedData);

    const word = parsedData("h1.css-1sprl0b");
    // console.log(word[0].children[0].data);

    const pronunciation = parsedData("span.pron-spell-content");
    // console.log(pronunciation[0].children[0].data);

    const meaning = parsedData("span.one-click-content");
    // console.log(meaning[0].children[0].data);
};

app.listen(PORT, function(){
    console.log("Server running on PORT", PORT);
});