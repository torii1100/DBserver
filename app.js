//expressモジュールのロード
var express = require("express");
var app = express();
app.use(express.json());
app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE, OPTION"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
})
//サーバーの起動
var server = app.listen(4000, function(){ console.log("run server") })
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./word.db");



app.get("/getWord", function(req, res){
    db.all("select * from word where learned = 0 order by random() limit 1", (err,rows)=>{
        console.log("getWord:"+JSON.stringify(rows));
        if(rows.length == 0){
            console.log("単語がありません");
            res.send([{japanese:'単語がありません',
            english:'単語がありません',
            id:0,
            learned:1
        }]);
        }else{
            res.send(JSON.stringify(rows));
        }
    })
});

app.get("/getAllWords",function(req,res){
    db.all("select * from word", (err, rows)=>{
        console.log("getAllWords");
        console.log(rows);
        if(rows.length == 0){
            res.send([{japanese:'単語がありません',
            english:'単語がありません',
            id:0,
            learned:1
        }]);
        }
        res.send(JSON.stringify(rows));
    })
});


app.post("/addWord/",(req, res)=>{
    console.log("receive post");
    console.log(req.body);
    db.run("insert into word(japanese, english, learned) values(?,?,?)",req.body.sendJapanese, req.body.sendEnglish,0);
});

app.post("/changeLearned/",(req, res)=>{
    console.log("change");
    console.log(req.body);
    db.run("update word set learned = ? where id == ?", req.body.learned, req.body.id);

});

app.post("/deleteWord/",(req, res)=>{
    console.log("delete");
    console.log(req.body.rowId);
    db.run("delete from word where id == ?",req.body.rowId);
});