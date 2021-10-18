const fetch = require("node-fetch");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const PORT = 8000;
var url = "https://www.dictionary.com/browse/";
var words = ""; 

app.use(express.urlencoded({ extended: false}));

app.use(express.static('public'));

app.set('view-engine', 'ejs');

app.get("/", function(req, res){
    res.render('index.ejs');
});

app.post("/", function(req, res){

    url = "https://www.dictionary.com/browse/"
    words = req.body.word;
    url = url + words;

    // promise based function to render to ejs
    const printJSON = async (url) => {

        var data = await getData(url);
        res.render('result.ejs', {word : data.word, pronunciation: data.pronunciation, meaning: data.meaning});
    };

    data = printJSON(url);
});

// function to get the raw data
const getRawData = (URL) => {
    
    return fetch(URL)
        .then((response) => response.text())
        .then((data) => {
            return data;
        });
};

const getData = async (url) => {
   
    // collecting raw data
    const rawData = await getRawData(url);

    // parsing the data
    const parsedData = cheerio.load(rawData);

    var word = parsedData("h1.css-1sprl0b");
    word = (word[0].children[0].data);

    var pronunciation = parsedData("span.pron-spell-content");
    pronunciation = (pronunciation[0].children[0].data);

    var meaning = parsedData("span.one-click-content");
    meaning = (meaning[0].children[0].data);

    // JSON for word info
    var data = {

        "word" : word,
        "pronunciation" : pronunciation,
        "meaning" : meaning
    }

    return data;
};

app.listen(PORT, function(){
    console.log("Server running on PORT", PORT);
});