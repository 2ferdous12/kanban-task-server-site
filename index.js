const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 9000;
require('dotenv').config();

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster000.74jenv3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster000`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const Colection = client.db('usersDB').collection('users');
    const taskCollections = client.db('usertaskDB').collection('usertask');

    app.get('/users', async(req, res)=>{
        const cursor = Colection.find();
        const result = await cursor.toArray();
        res.send(result);
        })
    app.get('/use', async(req, res)=>{
        const items = taskCollections.find();
        const result = await items.toArray();
        res.send(result);
        })

        app.delete('/users/:id', async(req, res) =>{
          const id = req.params.id;
          const query = { _id: new ObjectId(id)}
          const result = await Colection.deleteOne(query);
          res.send(result);
        })

    app.post('/users', async(req, res)=>{
        const newboard = req.body;
        console.log(newboard)
        const result = await Colection.insertOne(newboard);
        res.send(result);
      })
    app.post('/use', async(req, res)=>{
        const newboar = req.body;
        console.log(newboar)
        const result = await taskCollections.insertOne(newboar);
        res.send(result);
      })

  //  app.get("/users/:colum1", async(req, res)=>{
  //     const item = req.params.colum1;
  //     const query = {colum1: new ObjectId(item)}
  //     const result = await Colection.findOne(query)
  //     res.send(result)
  //   })


    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
    res.send('server is running')

})

app.listen(port, () =>{
    console.log(`server is running on port ${port}`)
})