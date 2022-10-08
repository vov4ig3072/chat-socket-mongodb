import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
let clientName;

export async function login(req,res){
    try{
        await client.connect()
        const db = client.db("Chat");

        try{
            await db.createCollection('Users')
        }catch{
            console.log("data base is created");
        }

        const collection = db.collection('Users');
        
        if(await collection.findOne({ name: req.body.text })){
            let sendRes = {
                name: req.body.text,
                message: "User name is olredy exist",
                exist: true
            }
            res.json(sendRes)
            clientName = req.body.text
            
        }else{
            let sendRes = {
                name: req.body.text,
                message: "User created",
                exist: false
            }
            collection.insertOne({ name: req.body.text, online: req.body.online})
            res.json(sendRes)
        }
       
    }catch (error){
        console.error(error);
    }
}

export async function online(req,res){
    try{
        await client.connect()
        const db = client.db("Chat");
        
        const collection = db.collection('Users');

        let users = await collection.find({ online: {$in:[true]} }).toArray()
       
        // console.log("user online - ",users);
        res.json(users)
        
    }catch (error){
        console.error(error);
    }
}

export async function disabled(req,res){
    try{
        await client.connect()
        const db = client.db("Chat");
        
        const collection = db.collection('Users');
        console.log("disconect - ",req.body.name);
        await collection.findOneAndUpdate({ name: req.body.name }, {$inc : { online: false}})

        res.json({message: `${req.body.name} left chat`})


    }catch (error){
        console.error(error);
    }
}
