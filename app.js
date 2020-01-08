var express = require('express');
var app = express();


app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs'); 


app.get('/', function(req, res) {
    res.render("calendar.html");
  });
  

app.listen(3000, ()=>{
    console.log('server listening on port 3000')
    console.log('http://localhost:3000')
})  