const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./Models/listing");
const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';
const methodOverride = require("method-override");
let path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const asyncWrap = require("./utils/asyncWrap.js");
const Review = require("./Models/review");
const {listingSchema} = require("./schema.js");
const User = require("./Models/user");


// --- MIDDLEWARE & CONFIG ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

// --- DATABASE CONNECTION ---
main().then(() => { console.log("connected to DB"); }).catch(err => console.log(err));
async function main() { await mongoose.connect(MONGO_URL) };

// --- ROUTES (In the correct order) ---

// root route
app.get("/", (req, res) => {
    res.render("home.ejs");
});

const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

// route to destination
app.get("/destination" , (req,res)=>{
    res.render("destination.ejs");
});

// route to about us
app.get("/aboutus", (req,res)=>{
    res.render("aboutus.ejs");
});

// route to about us
app.get("/contact", (req,res)=>{
    res.render("contact.ejs");
});


// Route to render the SIGNUP form
app.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

app.post("/signup", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        
        // Create new user
        const newUser = new User({
            username: username,
            email: email,
            password: password // In production, hash this password!
        });
        await newUser.save();
        
        // Render signupuser page with username
        res.render("signupuser.ejs", { username: username });
        
    } catch (err) {
        console.log("Error saving user:", err);
        res.status(500).send("Error creating account");
    }
});


// Route to render the LOGIN form
app.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

app.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        
        // Find user by username
        const user = await User.findOne({ username: username });
        
        // Authentication check
        if (!user) {
            return res.render("users/login.ejs", { 
                error: "Invalid username or password" 
            });
        }
        
        // Check password (in production, use bcrypt for hashing)
        if (user.password !== password) {
            return res.render("users/login.ejs", { 
                error: "Invalid username or password" 
            });
        }
        
        // Login successful - render loginuser page with user data
        res.render("loginuser.ejs", { 
            username: user.username,
            email: user.email 
        });
        
    } catch (err) {
        console.log("Login error:", err);
        res.status(500).render("users/login.ejs", { 
            error: "Server error during login" 
        });
    }
});

// 1. INDEX ROUTE - Show all listings
app.get("/listings", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("mainpage.ejs", { allListings });
}));

// 2. NEW ROUTE - Form to create new listing
app.get("/listings/new", (req, res) => {
    res.render("newList.ejs");
});

// 3. CREATE ROUTE - Create new listing (handles the form submit from NEW)
app.post("/listings",
    validateListing,
    asyncWrap( async (req, res) => {
    const addNewList = new Listing(req.body.Listing);
    await addNewList.save();
    res.redirect("/listings");
}));

// 4. SHOW ROUTE - Show one specific listing
app.get("/listings/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const singleList = await Listing.findById(id).populate("reviews");
    res.render("show.ejs", { singleList });
}));

// 6. UPDATE ROUTE - Update a listing (handles the form submit from EDIT)
app.put("/listings/:id",
    validateListing,
    asyncWrap( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.List });
    res.redirect("/listings");
}));

// 7. DELETE ROUTE
app.delete("/listings/:id",asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// 5. EDIT ROUTE - Form to edit a listing
app.get("/listings/:id/edit",asyncWrap( async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    res.render("updateList.ejs", { List });
}));



// review route in post 
app.post("/listings/:id/reviews", async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
});




// --- ERROR HANDLING ---
// 8. Catch-all 404 route for requests to unknown paths
// MUST BE PLACED AFTER ALL OTHER ROUTES

// app.all("*",(req, res, next) => {
//     next(new ExpressError(404, "Page not found!"));
// });

// 9. Global Error Handler Middleware


app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});

// --- SERVER ---
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});