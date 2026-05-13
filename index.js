const express = require('express');
const cors = require('cors');
const app = express();

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PSS}@cluster0.mndvni1.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db('wonder-lust');
        const destinationColl = database.collection('destinations');
        const bookingColl = database.collection('bookings');







        // get
        app.get('/destinations', async (req, res) => {
            const cursor = await destinationColl.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // get one destination
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await destinationColl.findOne(query);
            res.send(result)

        })
        // post
        app.post('/destinations', async (req, res) => {
            const data = req.body;
            const result = await destinationColl.insertOne(data);
            res.send(result)
        })

        // patch
        app.patch('/destination/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body
            const updatedDoc = {
                $set: data
            }

            const query = {
                _id: new ObjectId(id)
            }

            const result = await destinationColl.updateOne(query, updatedDoc);
            res.send(result);

        })



        // delete
        app.delete('/destination/:id', async (req, res) => {
            const id = req.params.id;
            const query = {
                _id: new ObjectId(id)
            }
            const result = await destinationColl.deleteOne(query);
            res.send(result);
        })

        // post bookings
        app.post('/book-destination', async (req, res) => {
            const data = req.body
            const result = await bookingColl.insertOne(data);
            res.send(result);
        })
        // get booking
        app.get('/book-destination/:id',async(req,res)=>{
            const id=req.params.id;
            const query={
                userId:id
            }
            const result = await bookingColl.find(query).toArray();
            res.send(result)
        })
        app.delete('/book-destination/:id',async(req,res)=>{
            const id = req.params.id
           
            
            const query={
                _id:new ObjectId(id)
            }
            console.log(query);
            
            const result=await bookingColl.deleteOne(query)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('server is getting hot')
})

app.listen(port, () => {
    console.log(`server is running is port ${port}`);

})
