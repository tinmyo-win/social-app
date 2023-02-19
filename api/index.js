const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient("mongodb://localhost");
const db = mongo.db("twitter");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

const bcrypt =require("bcrypt");

const secret = "some secret"

function auth(req, res, next) {
  const authHeader = req.header("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if(!token) return res.status(401).json({msg: "token missing" })

  jwt.verify(token, secret, (err, user) => {
    if(err) {
      return res.status(403).json({msg: "invalid token" })
    }
    res.locals.user = user;

    next();
  })
} 

app.post('/users/login', async (req, res) => {
  const { handle, password } = req.body;

  if(!handle || !password) {
    return res.status(400).json({ msg: "Handle or password missing" });
  }

  const user = await db.collection('users').findOne({ handle })
  if(user) {
    const valid = await bcrypt.compare(password, user.password);
    if(valid) {
      const token = jwt.sign(user, secret);
      return res.send(token);
    }

  }

  res.status(401).json({err: "handle or password incorrect"})
})

app.get('/users/verify',auth , (req, res) => {
  res.json(res.locals.user);
})

app.post('/users/register', async (req, res) => {
  const { name, handle, password, profile } = req.body;

  if(!name || !handle || !password) {
    return res.status(400).json({ msg: "name, handle, password: all required" });
  }

  const hash = await bcrypt.hash(password, 10);
  const result = await db.collection("users").insertOne({
    name, handle, password: hash, profile
  })
  
  if(result.insertedId) {
    const user = await db.collection("users").findOne({
      _id: ObjectId(result.insertedId)
    });
    return res.json(user);
  }

  res.status(500).json({ msg: "something wrong. please try again" });
})


app.get('/users', auth, async(req, res) => {
  const users = await db.collection("users").find().toArray();
  res.json(users);
})

app.put('/users/:id', auth, async(req, res) => {
  const id = req.params;
  const { name, profile, password } = req.body;

  if(!name) {
    return res.status(400).json({ msg: "name required" });

  }

  const data = {};
  if(password) {
    data.password = await bcrypt.hash( password, 10);
  }

  data.name = name;
  data.profile = profile;

  const result = await db.collection("users").updateOne(
    {_id: ObjectId(id) },
    {$set: data }
  );

  if(result.acknowledged) {
    const user = await db.collection("users").findOne({ _id: ObjectId(id) })
    return res.json(user);
  }

  return res.sendStatus(500);
})

app.get('/tweets', async (req, res) => {
  const tweets = await db.collection('tweets').aggregate([
    {
      $sort: { "created": 1}
    },
    {
      $limit: 20,
    },
    {
      $lookup: {
        foreignField: "_id",
        localField: "owner",
        from: "users",
        as: "owner_user"
      }
    },
    {
      $lookup: {
        from: "tweets",
        foreignField: "origin",
        localField: "_id",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner_user",
            }
          },
          {
            $lookup: {
              from: "tweets",
              localField: "_id",
              foreignField: "origin",
              as: "comments",
            }
          }

        ]
      }
    }
  ]).toArray();

  res.json(tweets);
})

app.get("/tweets/:id", async (req, res) => {
	const { id } = req.params;

	try {
		const tweet = await db
			.collection("tweets")
			.aggregate([
				{
					$match: { _id: ObjectId(id) },
				},
				{
					$lookup: {
						from: "users",
						localField: "owner",
						foreignField: "_id",
						as: "owner_user",
					},
				},
				{
					$lookup: {
						from: "tweets",
						localField: "_id",
						foreignField: "origin",
						as: "comments",
						pipeline: [
							{
								$lookup: {
									from: "users",
									localField: "owner",
									foreignField: "_id",
									as: "owner_user",
								},
							},
							{
								$lookup: {
									from: "tweets",
									localField: "_id",
									foreignField: "origin",
									as: "comments",
								},
							},
						],
					},
				},
			])
			.toArray();

		res.json(tweet[0]);
	} catch (e) {
		res.sendStatus(500);
	}
});

app.post('/tweet', auth, async(req, res) => {
  const user = res.locals.user;
  const { body } = req.body;
  
  if(!body) return res.status(400).json({ "msg": "Body required" });

  const result = await db.collection('tweets').insertOne({
    type: "post",
    body,
    owner: ObjectId(user._id),
    created: new Date(),
    likes: [],
  });

  if(result.insertedId) {
    const tweet = await db.collection('tweets').aggregate([
      {
        $match: { _id: ObjectId(result.insertedId)},
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner_user",
        },
      },
    ]).toArray();
    let data = tweet[0];
    data.comments = [];

    res.json(data);
  }

})



const port = 8484;
app.listen(port, () => {
  console.log(`app is listening at port ${port}`)
})