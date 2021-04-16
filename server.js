const { response } = require('express');
const express = require('express');
const path = require('path')
const app = express();
const port = 5000;
const Api = require('./api');
app.use(express.static(__dirname + '/static'));
app.set('view engine','pug')
app.use(express.json())
const api = new Api;
// Tüm Listeleri Getir
app.get('/',async(req,res) => {
    let lists;
    let todos;
    
    // get All Lists
    await api.getAllLists().then(responselist => {
        lists = responselist;
    }).catch(err => {
        console.log(err)
    })
    // get All Todos
    await api.getAllTodos().then(responsetodo => {
        todos = responsetodo;
    }).catch(err => {
        console.log(err)
    })
    res.render('main',{
        'lists':lists,
        'todos':todos,
        'listsSize':lists.length,
        'todosSize':todos.length,
    })

})

// Listedeki Tüm Todoları Getir
app.get('/list/:id',async (req,res) => {

    let todos = [];
    context = {
        'todos':todos,
        'listid':req.params.id
    }
    await api.getAllTodos().then(response => {
        response.forEach(todo => {
            if(todo.listId === parseInt(req.params.id)){
                todos.push(todo)
            }
        })
    })

    await api.getAllLists().then(response => {
        response.forEach(list => {
            if(list.id == req.params.id){
                context.listName = list.listName
            }
        })
    })
    res.render('todoInfo',context)
})

// Yeni Todo Oluştur
app.post('/addTodo',(req,res) => {
    api.WriteTodos(req.body.todo,req.body.ListId,req.body.isStar)
    .then(resp => {
        res.send(resp)
    }).catch(er => {
        console.log(er)
    })
})


// Todo Güncelle(Yıldız Güncellemesi) 
app.put('/updateTodo/:id',(req,res)=>{
    const id = req.params.id;
    api.UpdateTodos(id,req.body.isStar,req.body.title,req.body.listId).then(response => {
        res.send(response)
    }).catch(err=> console.log(err))
})



app.delete('/deleteList/:id',(req,res,next) => {
    const id = req.params.id;
    api.DeleteList(id).then(response => {
        res.send(response)
    }).catch(err => console.log(err));

})


app.post('/CreateList',function(req,res){
    const listName = req.body.name;
    api.CreateList(listName).then(response => {
        console.log(response)
        res.send(response)
    }).catch(err => console.log(err));
})

app.delete('/todoDelete/:id',function(req,res){
    const id = req.params.id;

    api.DeleteTodo(id).then(response => {
        res.send(response)
    }).catch(err => console.log(err));

})

app.listen(port,function(req,res){
    console.log('Sunucu Başlatıldı...'+`http://localhost:${port}`);
})