import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

export async function login(req,res){
    try{
        await client.connect()
        const db = client.db("Chat");

        try{
            await db.createCollection('Users')
        }catch{
           
        }
   

        const collection = db.collection('Users');
        
       
        if (await collection.findOne({ name: req.body.text, online: true })) {

                console.log("user online");
            
            let sendRes = {
                name: req.body.text,
                message: `${req.body.text} is already logged.Enter another name!`,
                online: true
            }
            res.json(sendRes)
            // clientName = req.body.text
            
            
        }else if(await collection.findOne({ name: req.body.text, online: false })){
            let sendRes = {
                name: req.body.text,
                message: "User name is olredy exist, do you want enter with this name?",
                online: false
            }
            res.json(sendRes)
            await collection.findOneAndUpdate({ "name": req.body.text }, {$set : { "online": true}})
        }else{
            let sendRes = {
                name: req.body.text,
                message: "User created, welcome to chat)) Click ok!",
                online: false
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

export async function ofline(nameUser){
    try{
        await client.connect()
        const db = client.db("Chat");
        
        const collection = db.collection('Users');
        console.log("disconect - ",nameUser);
        await collection.findOneAndUpdate({ "name": nameUser }, {$set : { "online": false}})

    }catch (error){
        console.error(error);
    }
}
