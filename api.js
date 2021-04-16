
const fetch = require('node-fetch');
class Api{
    async getAllLists(){
        const req = await fetch('http://localhost:3000/lists');
        return req.json();
    }

    async getAllTodos(id){
        const req = await fetch('http://localhost:3000/todos');
        return req.json();
    }

    async WriteTodos(title,listId,isStar){
        const req = await fetch('http://localhost:3000/todos',{
            method : 'POST',
            body:JSON.stringify({
                todo:title,
                listId:listId,
                isStar:isStar
            }),
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
            
            
        });
        return req.json()
    }

    async UpdateTodos(id,value,title,listId){
        const req = await fetch(`http://localhost:3000/todos/${id}`,{
            method:'PUT',
            body:JSON.stringify({
                isStar:value,
                todo:title,
                listId:listId
            }),
            headers:{
                "Content-type":"application/json; charset=UTF-8"
            }
        })

        return req.json();
    }


    async DeleteList(id){
        const req = await fetch(`http://localhost:3000/lists/${id}`,{
            method:'DELETE'
        })

        req.json().then(response => {
            console.log(response)
        }).catch(err => {console.log(err)})
    }


    async CreateList(name){
        const req = await fetch('http://localhost:3000/lists',{
            method:'POST',
            body:JSON.stringify({
                listName:name,
            }),
            headers:{
                "Content-type":"application/json;charset = utf-8",
            }
        })

        return req.json();
    }

    async DeleteTodo(id){
        const req = await fetch(`http://localhost:3000/todos/${id}`,{
            method:'DELETE'
        })

        return req.json();
    }

}

module.exports = Api;