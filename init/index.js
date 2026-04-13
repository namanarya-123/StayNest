// yahan pr data initilization ka logic likho

const mongoose = require("mongoose");
const initData = require("./data.js");
// database data wla require kar lo

const Listing = require("../models/listing.js");
// schema require karo

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() =>{
    console.log("Connected to db");
})
.catch((err) =>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async() =>{
    await Listing.deleteMany({});

    // yahan pr humlog ko data mae owner ko addd karna hai uska code likho
    // ye function ek new array banata hain ussme ye sab karta hain
    initData.data = initData.data.map((obj) =>({
        ...obj,
        owner: "695badf7c6bfd54ffa095778",
    }));
     

    // phele jitna bhi data tha uss data base mae usko delete kar do
    await Listing.insertMany(initData.data);
    // ab saara data insert kar do .data kyu ki initdata ka object data hai .. direct usko point karega
    console.log("data was initialized");
};

initDB();