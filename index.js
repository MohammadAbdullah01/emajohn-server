const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId, ObjectID } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000


// middleware 
app.use(cors())
app.use(express.json())


//body
app.get('/', (req, res) => {
    res.send('ema john is ready!!!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4dmp5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect()
        const productCollection = client.db("emaJohn").collection("product");
        console.log("db connected")
        //get all products
        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page)
            const size = parseInt(req.query.size)
            const query = {}
            const cursor = productCollection.find(query)
            let result;
            if (page || size) {
                result = await cursor.skip(page * size).limit(size).toArray()
            } else {
                result = await cursor.toArray()
            }
            res.send(result)
        })
        //get products quantity
        app.get('/productquantity', async (req, res) => {
            const count = await productCollection.countDocuments()
            res.send({ count })
        })

        //get products which is matched with my ids
        app.post('/productsByKeys', async (req, res) => {
            const keys = req.body;
            const ids = keys.map(id => ObjectId(id))
            console.log('from ids', ids)
            // console.log(keys)
            const query = { _id: { $in: ids } }
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })

    }
    finally {

    }
}





//conclusion
run().catch(console.dir)
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})