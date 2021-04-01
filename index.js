const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = 5000
app.use(cors());
app.use(bodyParser.json());



const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://aziz123:aziz123@cluster0.rf1wp.mongodb.net/emaJohn?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("emaJohn").collection("products");
    const orderCollection = client.db("emaJohn").collection("orders");
    // perform actions on the collection object
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(products)
        collection.insertOne(product)
            .then(result => {
                res.send(result.insertedCount)
            })

    })


    app.get('/products', (req,res)=>{
        collection.find({}).limit(20)
        .toArray((err, documents)=>{
            res.send(documents)
        })
    })

    app.post('/productsByKeys',(req,res)=>{
        const productKeys = req.body;
        collection.find({key: {$in:productKeys}})
        .toArray((err,documents)=>{
            res.send(documents)
        })
    })

    app.get('/product/:key', (req,res)=>{
        collection.find({key:req.params.key})
        .toArray((err, documents)=>{
            res.send(documents[0])
        })
    })


    app.post('/addOrder', (req, res) => {
        const order = req.body;
        // console.log(products)
        orderCollection.insertOne(order)
            .then(result => {
                res.send(result.insertedCount>0)
            })

    })
   
});



app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)


