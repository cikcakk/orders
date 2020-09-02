var request = require("request");

var express=require("express");
var app=express();
var bodyParser= require("body-parser");
var mongoose=require("mongoose");
const path = require('path');
var passport= require("passport"),
	localStrategy= require("passport-local"),
	passportLocalMongoose=require("passport-local-mongoose"),
	User= require("./models/user")
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'js')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static(path.join(__dirname, 'img')));
methodOverride=require("method-override")
app.use(methodOverride("_method"))
var weather;

	
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://Cikcakk:<password>@cluster0.3fwj0.mongodb.net/<dbname>?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});




app.use(require("express-session")({secret:"Petra is the best!",
resave:false,
 saveUninitialized:false}));
app.use(passport.initialize()); 
app.use(passport.session()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(bodyParser.urlencoded({extended:true}));
 passport.use(new localStrategy(User.authenticate()));

mongoose.connect("mongodb+srv://sanyika:3956121@cluster0.hg5xp.mongodb.net/orders?retryWrites=true&w=majority")
var orderSchema=new mongoose.Schema({
	name: String,
	email: String,
	address: String,
	comment: String,
	extra: String,
	sauce: String,
	quantity: String,
    price: String,
});var Order=mongoose.model("Order",orderSchema);
request('https://api.openweathermap.org/data/2.5/onecall?lat=48.13&lon=22.32&%20exclude=current,minutely,hourlyl&appid=d2b2eab54bef4bcb5c106c971a67f044', (error, response, body)=> {
  var body=JSON.parse(body);
   weather=((body.daily[0].temp.min+body.daily[0].temp.max)/2- 273.15).toFixed(2);
   
  

});
	
app.get("/",isLoggedIn, (req,res)=>{
	
res.render("index.ejs",{
weather:weather,currentUser:req.user});}
);
	
	
app.post("/",isLoggedIn, (req,res)=>{
		
Order.create({
name: req.body.name,
email: req.body.Email,
	address: req.body.address,
	comment: req.body.comment,
	extra: req.body.extras,
	sauce: req.body.sauces,
	quantity: req.body.quantity,
    price: req.body.prices,
}
,function(err,order){
	if(err){ console.log(err)}
	else{
		
		
		
res.redirect("/");}} 
	
	
	
)});
	
	app.get("/orders", isLoggedIn,(req,res)=>{
	
Order.find({},function(err,orders){
	if(err){console.log("something went wrong");}
	else{
	res.render("order.ejs",{orders:orders,
	weather:weather,currentUser:req.user});}})});
	
	
	app.delete("/orders/:id", (req,res)=>{
	Order.findByIdAndRemove(req.params.id,(err)=>{
		if(err){console.log("Went wrong")}
		else{
			
			res.redirect("/orders");
		}
		
	})
}
);
	
	



app.get("/register",(req,res)=>{
	res.render("register.ejs",{
weather:weather,currentUser:req.user});
	
	
});

app.post("/register",(req,res)=>{
	req.body.username
	req.body.password
	User.register (new User({username:req.body.username}),req.body.password,function(error,user){
		if(error){console.log(error)}else{
			
			passport.authenticate("local")(req,res,function(){
			res.redirect("/login");});	
		}
	});
			
		
		
		
	
	
	
});
app.get("/login",(req,res)=>{
	res.render("login.ejs",{
weather:weather,currentUser:req.user});
	
	
});

app.post("/login",passport.authenticate("local",{successRedirect:"/",
failureRedirect: "/login"}),(req,res)=>{
	
	
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
	
	
});
	
	function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){return next();}
	else{res.redirect("/login")}
	
	
}
	
	
	app.listen(process.env.PORT);
