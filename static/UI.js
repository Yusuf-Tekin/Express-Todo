// Yeni Todo Oluşturma

const todosubmit = document.getElementsByClassName('todosubmit')[0];
const TodoInput = document.getElementById('NewTodoNameInput');
const newTodos = document.getElementsByClassName('newTodos')[0];
const size = document.getElementById('size');
const todosDiv = document.getElementsByClassName('todos')[0];
const deleteTodo= document.getElementsByClassName('deleteTodo')[0];

todosubmit.addEventListener('click',async function (e) {
    e.preventDefault();
    if(TodoInput.value != ""){
        await fetch('/addTodo',{
            method: 'POST',
            body:JSON.stringify({
                todo:TodoInput.value,
                isStar:false,
                ListId:parseInt(todosubmit.id),
            }),
            headers:{
                "Content-Type":"application/json; charset = utf-8"
            }
        }).then(response => {
            response.json().then(val => {
                let parseSize = parseInt(size.textContent);
                size.innerHTML = parseSize+=1;
                CreateTodoUI(val);                
            }).catch(err=>{console.log(err)});
            
            TodoInput.value = ""
        }).catch(Err => {console.log(Err)})
    }
    else{
        alert('Boş Bırakılamaz')
    }
})

function CreateTodoUI(data){
    const card= document.createElement('div')
    card.className = "todosCard"

    const cardTitle = document.createElement('div');
    cardTitle.className = "todosCard-title"
    cardTitle.innerHTML = data.todo;

    const cardİcon = document.createElement('div');
    cardİcon.className = "todosCard-icon";
    cardİcon.innerHTML = '<i class="bi bi-star" title = "Yıldız"></i> '


    const deleteIcon = document.createElement('span');
    deleteIcon.className = "deleteTodo"
    deleteIcon.id = data.id


    const Icon = document.createElement('i')
    Icon.className = "bi bi-trash-fill delete"
    Icon.title = "Sil"
    Icon.id = data.id

    deleteIcon.appendChild(Icon)

    cardİcon.appendChild(deleteIcon)

    card.appendChild(cardTitle)
    card.appendChild(cardİcon)

    newTodos.appendChild(card);

}


class Todos{
    Stared(id,title,listId,element){
        fetch(`/updateTodo/${id}`,{
            method:'PUT',
            body:JSON.stringify({
                isStar:true,
                title:title,
                listId:parseInt(listId)
            }),
            headers:{
                "Content-Type":"application/json; charset = utf-8"
            }
        }).then(response => {
            if(response.status == 200){
                element.className ="bi bi-star-fill"
                element.title = "Yıldızlama"
            }
        }).catch(err => {console.log(err)})
    }
    NoStared(id,title,listId,element){
        fetch(`/updateTodo/${id}`,{
            method:'PUT',
            body:JSON.stringify({
                isStar:false,
                title:title,
                listId:parseInt(listId)
            }),
            headers:{
                "Content-Type":"application/json; charset = utf-8"
            }
        }).then(response => {
            if(response.status == 200){
                element.className ="bi bi-star"
                element.title = "Yıldızla"
            }
        }).catch(err => {console.log(err)})
    }

    Deleted(id,element){
        fetch(`/deletetodo/${id}`,{
            method : 'DELETE',
        }).then(response => {
            if(response.status == 200){
                element.parentElement.style ="transition:0.5s;opacity:0;display:none;";
                let parseNumber = parseInt(size.textContent);
                if(!parseNumber == 0){
                    size.innerHTML = parseNumber-=1;
                }
            }
        }).catch(err => {
            console.log(err);
            alertify.error("Görev Silinemedi")
        })
    }
}

const todo = new Todos;

todosDiv.addEventListener('click',function(e){

    if(e.target.className == "bi bi-star"){
        const id = e.target.id;
        const listId = e.target.parentElement.previousElementSibling.id;
        const title = e.target.parentElement.previousElementSibling.textContent;
        todo.Stared(id,title,listId,e.target);
        alertify.warning('Görev Yıldızlandı.');
    }
    else if(e.target.className === "bi bi-trash-fill delete" || e.target.className === "deleteTodo"){
        const id = e.target.id
        if(e.target.className ==="bi bi-trash-fill delete"){
            todo.Deleted(id,e.target.parentElement.parentElement);
        }
        if(e.target.className === "deleteTodo"){
            todo.Deleted(id,e.target.parentElement);
        }
    }
    else if(e.target.className == "bi bi-star-fill"){
        const id = e.target.id;
        const listId = e.target.parentElement.previousElementSibling.id;
        const title = e.target.parentElement.previousElementSibling.textContent;
        todo.NoStared(id,title,listId,e.target);
    }
})