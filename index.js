const express = require('express');
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()

const port = process.env.PORT || 5000

app.use(cors());
app.use(express.json())


//============================================
//    *****************************************
//    mongoDB operation start 
//    *****************************************
//=============================================

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.27ma61s.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


        //  ----------------------
        //  0. create a database name and collection name
        const ProductCollection = client.db('Revelation').collection('product');


        // post 1 iteam
        // product
        app.post('/products', async (req, res) => {
            const info = req.body;
            console.log(info)
            const result = await ProductCollection.insertOne(info);
            res.send(result)

        })

        // 2. get / read
        // ---------------------
        // 2.1. get all data
        app.get('/products', async (req, res) => {
            const result = await ProductCollection.find().toArray();
            res.send(result)
        })

        //products
        // 2.2 get by id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await ProductCollection.findOne(query);
            res.send(result);
        });


        // products
        // 2.3 sord by email
        app.get('/products', async (req, res) => {
            const email = req.query?.email;
            console.log(email);
            let query = {};
            if (req.query?.email) {
                query = { Email: req.query?.email };
            }
            const result = await ProductCollection.find(query).toArray();
            console.log(result);
            res.send(result)
        })

        // update 
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const query = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const product = {
                $set: {
                    Name: updateProduct.Name,
                    Catagory: updateProduct.Catagory,
                    Photo_url: updateProduct.Photo_url,
                    Price: updateProduct.Price,
                }
            }
            const result = await ProductCollection.updateOne(query, product, options)
            res.send(result)
            // console.log(ProductCollection)
        })


        // products
        // delete
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await ProductCollection.deleteOne(query);
            res.send(result)
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

//============================================
//    *****************************************
//    mongoDB operation end 
//    *****************************************
//=============================================


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})