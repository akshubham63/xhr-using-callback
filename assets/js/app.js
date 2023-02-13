const cl = console.log;

const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const postCardContainer = document.getElementById("postCardContainer");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");

const templating = (arr) => {
    let result = ``;
    arr.forEach(post => {
        result += `
                <div class="card mb-4 text-capitalize" data-id="${post.id}">
                    <div class="card-header">
                        <h3>${post.title}</h3>
                    </div>
                    <div class="card-body">${post.body}</div>
                    <div class="card-footer text-right">
                        <button class="btn btn-primary text-capitalize" onclick=onEditHandler(this)>edit</button>
                        <button class="btn btn-danger text-capitalize" onclick=onDeleteHandler(this)>delete</button>
                    </div>
                </div>
        `;
    });
    postCardContainer.innerHTML = result;
};

const createCard = (givenObj) => {
    let cardDiv = document.createElement("div");
    cardDiv.className = `card mb-4 text-capitalize`;
    cardDiv.setAttribute("data-id", givenObj.id);
    cardDiv.innerHTML = `
        <div class="card-header">
            <h3>${givenObj.title}</h3>
        </div>
        <div class="card-body">${givenObj.body}</div>
        <div class="card-footer text-right">
            <button class="btn btn-primary text-capitalize" onclick=onEditHandler(this)>edit</button>
            <button class="btn btn-danger text-capitalize" onclick=onDeleteHandler(this)>delete</button>
        </div>
    `;
    postCardContainer.append(cardDiv);
};

// Ajax >> Asynchronous JavaScript And XML.

// XML >> extensible markup language 
// Before json is introduced we use xml for storing the data.

// AJAX allows web pages to be updated asynchronously by exchanging data with a web server behind the scenes. This means that it is possible to update parts of a web page, without reloading the whole page.

// Methods for the communication between the fornt end and back end:-
    // 1. get >> To get data from the database we use get method.
    // 2. post >> To store data to the database we use post method.
    // 3. patch and put >>
            // In patch method we can update the whole object key value pair or maybe one or two value.
            // In put method we can update only the specific whole object using id. 
    // 4. delete >> To delete data from sever side as well as client side.


let postUrl = `https://jsonplaceholder.typicode.com/posts`;
let postArr = [];

const onEditHandler = (ele) => {
    let editObjId = ele.closest(".card").dataset.id;
    sessionStorage.setItem("updateId", editObjId);
    let singleObjUrl = `${postUrl}/${editObjId}`;
    let res = makeApiCall("GET", singleObjUrl,null);
    cl(res);// here we get the result undefined because of the asynchronous behaviour of the javascript before the res getting the response cl(res) is executed
    submitBtn.classList.add("d-none");
    updateBtn.classList.remove("d-none");
}

const onUpdateHandler = (eve) => {
    // cl(eve);
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
    };
    let updateId = sessionStorage.getItem("updateId");
    let updateUrl = `${postUrl}/${updateId}`;
    // cl(updateId);
    makeApiCall("PATCH", updateUrl,obj);
    submitBtn.classList.remove("d-none");
    updateBtn.classList.add("d-none");
    postForm.reset();

    let currentCardChild = document.querySelector(`[data-id="${updateId}"]`).children;
    // cl(currentCardChild);
    currentCardChild[0].innerHTML = `<h3>${obj.title}</h3>`;
    currentCardChild[1].innerHTML = `${obj.body}`;
    
    // The patch api is executed successfully but as we are working on the dummy data so it will not change but we can see in the network tab that the status is 200 and we can see the object we send in the payload
};

const onDeleteHandler = (ele) => {
    let deleteCard = ele.closest(".card");
    // cl(deleteId);
    let deleteUrl = `${postUrl}/${deleteCard.dataset.id}`;
    makeApiCall("DELETE", deleteUrl);
    deleteCard.remove();
};

// let xhr = new XMLHttpRequest(); 

// To send a request to a server, we can use the open() and send() methods of the XMLHttpRequest object:

// xhr.open("METHOD","URL",BOOLEAN) >> it has three parameter
    // 1st parameter is method for what type of request we have to do. It is in uppercase.(i.e get,patch/put,post,delete)
    // 2nd parameter is the base url
    // 3rd parameter is boolean value by default it is true. It is used to tell js engine for async behaviour or non async behaviour.

// xhr.open("GET", postUrl);
// xhr.send();

// when we login in any side we get the barrer token we store this barrer token in the local storage.
// after login we will call multiple api's to get or post or delete the data to access that data we use this barrer token it tells that this person is valid user he can get access to the data. For every api call to get success we use barrer token as header to get access to data.

// xhr.onload = function(){
//     // cl(this.response)// 'this' keyword represent the xhr object and response gives the response which we get from the backend
//     // cl(this.status);// status code
//     cl(this.readyState);
//     if(this.status === 200 || this.status === 201){
//         postArr = JSON.parse(this.response);
//         cl(postArr);
//         templating(postArr);
//     }
// }

const makeApiCall = (method,apiUrl,obj) => {
    let xhr = new XMLHttpRequest();
    xhr.open(method, apiUrl);
    xhr.onload = function(){
        // cl(this.response);
        if(this.status === 200){
            postArr = JSON.parse(this.response);
            if(Array.isArray(JSON.parse(this.response))){
                templating(postArr);
            }else if(method === "GET"){
                // return this.response // we can not use this becuase of the line no 64 editHandler cl(res) to overcome from that problem we write the following code
                titleControl.value = postArr.title;
                contentControl.value = postArr.body;
            };// we put this if else condition because in edit when we click on the edit button the we get the response as single obj and in that we don't want to again run the templating function.
        }else if(this.status === 201){
            createCard(obj);
        };// we put this if else if condition because in the 200 (i.e get api call) we want to run the templating while in the post (i.e post api call) we want to create the card.
    };
    xhr.send(JSON.stringify(obj));
};
makeApiCall("GET", postUrl,null);// we send null because we don't any operations regarding the obj 

// status code >>
    // 200 >> If the api call for get data is successful then we get status code as 200.
    // 201 >> If the api call for post data is successful then we get status code as 201.

    // 400 >> If the status code is related to 400 then your api call is failed.

// The api is in some state while calling them (i.e. readyState)
    // 0 >> api call is unsend >> xhr object is created but open method is not called yet.
    // 1 >> open method is called.
    // 2 >> send method is called.
    // 3 >> data is loading >> server is loading our request
    // 4 >> done >> request is processed and response is ready.

const onFormHandler = (eve) => {
    eve.preventDefault();
    let obj = {
        title : titleControl.value,
        body : contentControl.value,
        userId : Math.ceil(Math.random() * 10)
    }
    // cl(obj);
    eve.target.reset();

    // xhr.open("POST", postUrl);
    // xhr.send(JSON.stringify(obj));
    // xhr.onload = function(){
    //     if(this.status === 200 || this.status === 201){
    //         cl(xhr.status);
    //         cl(xhr.response);
    //         obj.id = JSON.parse(this.response).id;// we get response in json format
    //         cl(obj);
    //         postArr.push(obj);
    //         // templating(postArr);//not an proper way here we create all cards again just to create one card
    //         createCard(obj);// we create only one card and then append to the postCardContainer.
    //     };
    // };
    // we use this functions because in any function their should be only one dependency power should be decenteralize 

    makeApiCall("POST", postUrl, obj);
};



postForm.addEventListener("submit",onFormHandler);
updateBtn.addEventListener("click", onUpdateHandler);