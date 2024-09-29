const express = require('express');
const { gemini } = require('./gemini');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(bodyParser.json());
// let courses=[
//     {id:1,name:"dbms"},
//     {id:2,name:"cn"},
//     {id:3,name:"os"},
//     {id:4,name:"software"},
// ]

app.get('/', (req, res) => {
    res.send('Hello');
})
// app.get('/home/:id:roll:i',(req,res)=>{
//     res.send(req.params)
// })
// app.get('/courses/:id',(req,res)=>{
//     let need=courses.find(function(n){
//         return n.id===parseInt(req.params.id)
//     })
//     if(!need)res.status(404).send("404 not found")
//     res.send(need)
// })



app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }
        const chatbotResponse = await gemini(userMessage);
        res.json({ reply: chatbotResponse });
    } catch (error) {
        console.error('Error during chat:', error);
        res.status(500).json({ error: 'Something went wrong while processing the chat' });
    }
});


// app.get('/courses',(req,res)=>{
//     res.send(courses);
// })
// app.post('/courses',(req,res)=>{
//     const x=
//     {
//         id:courses.length + 1,
//         name:req.body.name
//     }
//     courses.push(x);
//     res.send(x);
// })
const port=process.env.PORT||8080

app.listen(port, ()=>{
    console.log(`port is running on ${port}`);
})