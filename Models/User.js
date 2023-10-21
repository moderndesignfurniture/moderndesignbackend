import mongoose from 'mongoose';
const mongodbURI = process.env.mongodbURI || "mongodb+srv://shaikhahsanali0303:brandsteps1234@cluster0.fh825iv.mongodb.net/?retryWrites=true&w=majority";
/////////////////////////////////////////////////////////////////////////////////////////////////

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  phone: String,
  country: String,
  password: String,
  createdOn: { type: Date, default: Date.now },
});




const User = mongoose.model('User', userSchema);
mongoose.connect(mongodbURI);
////////////////mongodb connected disconnected events///////////////////////////////////////////////
mongoose.connection.on('connected', function () {//connected
    console.log("Mongoose is connected");
});

mongoose.connection.on('disconnected', function () {//disconnected
    console.log("Mongoose is disconnected");
    process.exit(1);
});

mongoose.connection.on('error', function (err) {//any error
    console.log('Mongoose connection error: ', err);
    process.exit(1);
});

process.on('SIGINT', function () {/////this function will run jst before app is closing
    console.log("app is terminating");
    mongoose.connection.close(function () {
        console.log('Mongoose default connection closed');
        process.exit(0);
    });
});
////////////////mongodb connected disconnected events///////////////////////////////////////////////

export default User;
