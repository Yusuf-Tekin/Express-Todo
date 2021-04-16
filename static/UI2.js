const list = document.getElementsByClassName('lists')[0];
const AddButton = document.getElementsByClassName('addButton')[0];
const newList = document.getElementsByClassName('newList')[0];

list.addEventListener('click',async function(e){
    if(e.target.className == "deleteIcon" || e.target.className == "bi bi-trash2-fill"){
        fetch(`/deleteList/${e.target.id}`,{
            method:'DELETE'
        }).then(val => {
            if(val.status == 200){
                if(e.target.className == "deleteIcon"){
                    RemoveAni(e.target.parentElement);
                    alertify.success('Liste Silindi');
                }
                else if(e.target.className == "bi bi-trash2-fill"){
                    RemoveAni(e.target.parentElement.parentElement);
                    alertify.success('Liste Silindi.');
                }
            }
            else{
                alertify.error("Liste Silinemedi")
            }
        }).catch(err => {
            alertify.error('Liste Silinemedi.');
        })
    }
})

function RemoveAni(element){
    element.style = "transition:0.4s; opacity:0;";
    setTimeout(function(){
        element.style = "display:none;"
    },400)
}  



AddButton.addEventListener('click',() => {
    swal({
        text: 'Oluşturulacak Liste Adı',
        content: "input",
        button: {
          text: "Oluştur",
          closeModal: true,
        },
      }).then(val => {
          if(val == null || val.length == 0 || val == ""){
            alertify.error("Liste adı boş bırakılamaz.")
          }
          else if(val.length > 15){
            alertify.error("10 veya daha az karakter girin.")

          }
          else{
            fetch('/CreateList',{
                method:'POST',
                body:JSON.stringify({
                    name:val,
                }),
                headers:{
                    "Content-Type":"application/json;charset=utf-8",
                }
            }).then(response => {
                if(response.status ==200){
                  response.json().then(value => {
                      CreateListUI(value)
                  }).catch(err => {
                      console.log(err)
                      alertify.error('Liste Oluşturulamadı.')
                  })
              }
            })
          }
      }).catch(err => {
        alertify.error("Liste Oluşturulamadı.")
    })
})

function CreateListUI(Val){
    const card = document.createElement('div');
    card.className = "card"

    const DeleteIcon = document.createElement('span');
    DeleteIcon.className = "deleteIcon"
    DeleteIcon.title = "Sil"
    DeleteIcon.id = Val.id;
    
    const Icon = document.createElement('i')
    Icon.className = "bi bi-trash2-fill"
    Icon.id = Val.id;

    DeleteIcon.appendChild(Icon)


    const Elements = document.createElement('div');
    Elements.className =  "elements"

    const listIcon = document.createElement('div');
    listIcon.className = "icon"
    listIcon.innerHTML = '<i class="bi bi-image"></i>'

    const listName = document.createElement('div')
    listName.className = "list-name"
    listName.innerHTML = `<span>${Val.listName}</span>`


    Elements.appendChild(listIcon)
    Elements.appendChild(listName)


    const GO = document.createElement('div');
    GO.className = "go"

    const link = document.createElement('a')
    link.href = `/list/${Val.id}`

    const icon = document.createElement('i')
    icon.className = "bi bi-arrow-right-square-fill"
    icon.title = "İncele"

    link.appendChild(icon)
    GO.appendChild(link)
    card.appendChild(GO)
    card.appendChild(Elements)
    card.appendChild(DeleteIcon)

    newList.appendChild(card)
}