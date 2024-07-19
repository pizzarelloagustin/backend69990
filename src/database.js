
import mongoose from "mongoose"; 

mongoose.connect("mongodb+srv://titipizzarello:PASS@mongodb.yi1yag7.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=mongodb")
    .then( () => console.log("db: successful connection")) 
    .catch( (error) => console.log("db error", error))