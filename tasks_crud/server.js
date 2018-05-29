const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const path = require('path');
app.use(express.static(path.join(__dirname, '/static')));
const mongoose = require('mongoose');
app.use(express.static(__dirname + '/public/dist'));
mongoose.connect('mongodb://localhost/task_crud_demo');

var TaskSchema = new mongoose.Schema({
    title:{type:String, required:[true, 'Title is a required field']},
    description: {type:String, minlength:[5, 'Description must be at least 5 characters']}
}, {timestamps:true})

var Task = mongoose.model('Task', TaskSchema);


app.get('/tasks', (req, res)=>{
    Task.find({}, (err, myuser)=>{
        res.json(myuser);
        console.log(myuser);
    })
  
});



app.post('/tasks', (req,res)=>{
    console.log(req.body);
    var task = new Task(req.body);
    task.save((err, savedTask) => {
        if (err) {
            console.log(err);
        } else {
            res.json(savedTask);
        }
    })
});

app.get('/tasks/:id', (req,res)=>{
    Task.findOne({_id:req.params.id}, (err, task)=>{
        if(err){
            console.log(err);
        }else{
            res.json(task);
        }
    })
});

app.put('/tasks/:id', (req, res)=>{
    Task.findByIdAndUpdate(req.params.id, req.body, (err, confirmation)=>{
        if(err){
            console.log(err);
        }else{
            res.json({success: 'You succesfully updated this task.'})
        }
    })
});

app.delete('/tasks/:id', (req, res)=>{
    Task.remove({_id:req.params.id}, (err)=>{
        if(err){
            console.log(err)
        }else{
            res.json({success: 'You successfully deleted this task.'})
        }
    })
})

app.listen(8000, () => {
    console.log("Listening on 8000")
})