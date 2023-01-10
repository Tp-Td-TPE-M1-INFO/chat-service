const mongoose = require('mongoose');
mongoose.set("debug", true);
mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://'+process.env.DB_USER_PASS+'@wachat.4yhgf3f.mongodb.net/chatDB',
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
)
.then(() => console.log("connected to MongoDB"))
.catch((err) => console.log("Failed to connect to MongoDB", err));
