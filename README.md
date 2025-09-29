Vacation Rental Website (Airbnb-like)
A full-stack web application built with Node.js, Express, and MongoDB that allows users to create, view, edit,review , and delete vacation rental listings.

🚀 Features
User Authentication - Sign up and login system

Create Listings - Post new vacation rentals with descriptions, prices, and images , description , price per night also you can update it 

View Listings - Browse all available rental properties

Edit Listings - Modify existing rental posts

Delete Listings - Remove rental posts

Review Listing - a person / customer can review it and also rate it 

clearly

🛠️ Tech Stack
Backend: Node.js, Express.js , ejsMate , ExpressError ( error handlig) ,

Database: MongoDB with Mongoose ODM

Template Engine: EJS (Embedded JavaScript)

Method Override: For RESTful routes (PUT/DELETE)

Frontend: HTML, CSS, JavaScript , Bootstrap 

📦 Dependencies

"dependencies": {
    "ejs": "^3.1.10",
    "ejs-mate": "^4.0.0",
    "express": "^5.1.0",
    "git": "^0.1.5",
    "joi": "^18.0.1",
    "method-override": "^3.0.0",
    "mongodb": "^6.17.0",
    "mongoose": "^8.16.0",
    "nodemon": "^3.1.10"
  },

🏗️ Project Structure

Airbnb/
├── 📁 Models/
│   ├── user.js
│   ├── listing.js
│   └── review.js
├── 📁 Data/
│   ├── data.js
│   └── initData.js
├── 📁 views/
│   ├── 📁 includes/
│   ├── 📁 layouts/
│   ├── 📁 users/
│   ├── error.ejs
│   ├── loginuser.ejs
│   ├── mainpage.ejs
│   ├── newList.ejs
│   ├── show.ejs
│   ├── signupuser.ejs
│   └── updateList.ejs
├── 📁 public/
│   ├── 📁 css/
│   ├── 📁 js/
│   └── 📁 images/
├── 📁 utils/
├── 📁 node_modules/
├── 📄 app.js
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 README.md
└── 📄 schema.js

Installation
git clone <https://github.com/khadijaaahmed/game/new/main>

To Run 
npm init
npm start 