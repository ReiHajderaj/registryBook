const showForm = document.querySelector('.show-form');
const form = document.querySelector('.fill');
const authInp = document.querySelector('#auther');
const titleInp = document.querySelector('#title');
const pageInp = document.querySelector('#page-no');
const readInp = document.querySelector('#read');
const formBtm = document.querySelector('form button');
const dangerMessage = document.querySelector('.danger');



const list = document.querySelector('.books-list');

showForm.addEventListener('click', addForm);


function addForm() {

    form.showModal()

    formBtm.addEventListener('click', addBookToLibrary)
}



class Book{

    constructor(author, title, pageNo, read){
        this.author = author;
        this.title = title;
        this.pageNo = pageNo;
        this.read = read;

    }
}

function addBookToLibrary(){
    if(authInp.value == '' || titleInp.value == '' || readInp.value == 0){

        dangerMessage.textContent = 'One of the field not entered'
    } else{
        let newBook = new Book(authInp.value, titleInp.value, pageInp.value, readInp.value);
        dangerMessage.textContent = '';
        let id = new Date().getTime().toString();
        addToLocalStorage(id, newBook.author, newBook.title, newBook.pageNo, newBook.read)

        location.reload()
    }
}

function listBook(id, auther, title, pageNo, read){

    let listItem = document.createElement('li');
    listItem.id =id;

    listItem.innerHTML +=
        `<div class="header-part">

            <h3>${title}</h3>
            <div class="btn-container">
                <button class="remove">
                    <svg width="20px"  viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#716f6f" d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></g></svg>
                </button>                            
                <button class="expands">
                    <svg width="20px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#716f6f"></path></g></svg>
                </button>
            </div>
        </div>
        <div class="hidden">
            <p>Book auther: ${auther}</p>
            <p>Pages: ${pageNo}</p>
            <div class='reading'>
                <p class='${read}-read'></p>
                <button class='change'>Change Status</button>
            </div>
        </div>`;
    list.appendChild(listItem);

    let remove = listItem.querySelector('.remove');
    remove.addEventListener('click', removeItem);


    let expand = listItem.querySelector('.expands');
    expand.addEventListener('click', showContent);

    let changeStatusButton = listItem.querySelector('.change')

    changeStatusButton.addEventListener('click', (e)=>{
        changeStatus(e);
    });


}

function changeStatus(e) {
    let element = e.currentTarget.previousSibling.previousSibling;

    element.classList.toggle('true-read');
    element.classList.toggle('false-read');

    if ('true-read' === element.classList.value){
        changeLocalStorage(element.parentNode.parentNode.parentNode.id, true);
    } else{
        changeLocalStorage(element.parentNode.parentNode.parentNode.id, false)
    }

}

function showContent(e){
    let elm = e.currentTarget;

    elm.removeEventListener('click', showContent);
    let expand = elm.parentNode.parentNode.parentNode.lastChild;
    expand.classList.remove('hidden');

    elm.innerHTML = `<svg fill="#716f6f" width="20px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M505.752,358.248L271.085,123.582c-8.331-8.331-21.839-8.331-30.17,0L6.248,358.248c-8.331,8.331-8.331,21.839,0,30.17 s21.839,8.331,30.17,0L256,168.837l219.582,219.582c8.331,8.331,21.839,8.331,30.17,0S514.083,366.58,505.752,358.248z"></path> </g> </g> </g></svg>`
    elm.addEventListener('click', hideContent);
}

function hideContent(e){
    let elm = e.target.parentNode;
    elm.removeEventListener('click', hideContent);
    let expand = elm.parentNode.parentNode.parentNode.lastChild;
    expand.classList.add('hidden');

    elm.innerHTML = `<svg width="20px" viewBox="0 0 1024 1024" class="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M903.232 256l56.768 50.432L512 768 64 306.432 120.768 256 512 659.072z" fill="#716f6f"></path></g></svg>`
    elm.addEventListener('click', showContent);
}

function removeItem (e){
    id = e.target.parentNode.parentNode.parentNode.parentNode.id;
    removeFromLocalStorage(id);
    location.reload();
}

function getLocalStorage(){
    return localStorage.getItem('books')?
    JSON.parse(localStorage.getItem('books')):
    [];
}

function addToLocalStorage(id, auther, title, pageNo, read){
    const item = {id, auther, title, pageNo, read};

    let items = getLocalStorage();

    items.push(item);
    localStorage.setItem('books', JSON.stringify(items));


}

function removeFromLocalStorage(id){
    let items = getLocalStorage();
    items = items.filter((item)=>{
        if(item.id !== id){
            return item;
        } 
    })

    localStorage.setItem('books', JSON.stringify(items));
}

function changeLocalStorage(id, read){
    let items = getLocalStorage();
    items.map((item)=>{
        if(item.id === id){
            item.read = read;
        }
    })

    localStorage.setItem('books', JSON.stringify(items));
}

function setUpList(){

    let items = getLocalStorage();

    if(items.length > 0){
        items.forEach((element)=>{
            listBook(element.id, element.auther, element.title, element.pageNo, element.read)
        })
    } 
}

window.addEventListener('DOMContentLoaded', setUpList)