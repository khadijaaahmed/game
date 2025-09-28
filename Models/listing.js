const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema ({
    title :{ 
        type:String,
        required: true,
    },
    
    description : String,
    image : {
            filename: {
                    type:String,
                    default : "Listingimage"
            },
        url :{
            type : String,
            default: "https://unsplash.com/photos/3d-render-of-luxury-hotel-lobby-and-reception-FNAURWZ6Mqc",
       set: (v) => v === "" ? "https://unsplash.com/photos/3d-render-of-luxury-hotel-lobby-and-reception-FNAURWZ6Mqc":v,
     },
    },
    price: Number,
    location : String,
    country : String,
    reviews :[{
        type:Schema.Types.ObjectId,
    }]
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;