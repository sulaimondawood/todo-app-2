const input = document.querySelector(".input");
const form = document.querySelector(".form");
const submit = document.querySelector(".submit");
const parent = document.querySelector(".tasks__container");
const alert = document.querySelector(".alert");
let editElement = "";
let editStatus = false;
let editID;

if (editStatus) {
	parent.classList.add("active");
} else {
	parent.classList.remove("active");
}
//  DISPLAY LOCAL STORAGE
function displayLocalStorage() {
	let item = globalStorage();
	if (item.length > 0) {
		item.forEach((itemDisp) => {
			displayInputs(itemDisp.value, itemDisp.id);
		});
	}
}
// DOM CONTENT LOADED
window.addEventListener("DOMContentLoaded", displayLocalStorage);

function displayInputs(value, id) {
	const element = document.createElement("div");
	element.classList.add("task");

	element.setAttribute("data-id", id);
	// console.log(element.getAttribute(id));
	element.innerHTML = `		<div class="task__left">
	<img src="./icons/Group 17.svg" class="dots" alt="" />
	<p class="task__text">${value}</p>
</div>
<div class="btn__container">
	<button class="edit">
	<img src="./icons/vuesax.svg" class="ed" alt="" />
	<img src="./icons/vue.svg" class="edi" alt="" />
	</button>
	<button class="delete">
	<img src="./icons/trash.svg" class="del" alt="" />
	</button>`;

	parent.prepend(element);

	const taskTitle = document.querySelector(".task__title");
	taskTitle.textContent = parent.children.length >= 1 ? "Task Added" : "No Task";

	//edit btn
	const editBtn = element.querySelector(".edit");
	editBtn.addEventListener("click", function (e) {
		const curr = e.currentTarget.closest(".task");
		editID = curr.dataset.id;
		editElement =
			e.currentTarget.closest(".btn__container").previousElementSibling
				.lastElementChild;
		editStatus = true;
		input.value = editElement.textContent;

		submit.textContent = "Edit";

		// console.log(curr);
	});

	// delet btn
	const deleteBtn = element.querySelector(".delete");
	deleteBtn.addEventListener("click", function (e) {
		const curr = e.currentTarget.closest(".task");
		const id = curr.dataset.id;
		console.log(id);
		curr.remove();
		taskTitle.textContent =
			parent.children.length <= 0 ? "No Task" : "Task Added";
		console.log(curr);
		deleteFromLocalStorage(id);
	});
}

// GLOBAL LOCAL STORAGE RESPECTING DRY
function globalStorage() {
	return localStorage.getItem("list")
		? JSON.parse(localStorage.getItem("list"))
		: [];
}
// ADD TO LOCAL STORAGE
function addToLocalStorage(value, id) {
	const todo = { value, id };
	let item = globalStorage();
	console.log(item);
	item.push(todo);
	localStorage.setItem("list", JSON.stringify(item));
}
//EDIT FRO LOCAL STORAGE
function editIdFromLocalStorage(value, id) {
	let item = globalStorage();
	item = item.map((itemMap) => {
		if (itemMap.id === id) {
			itemMap.value = value;
		}
		return itemMap;
	});
	console.log(item);

	localStorage.setItem("list", JSON.stringify(item));
}
// DELETE FROM LOCAL STORAGE
function deleteFromLocalStorage(id) {
	let item = globalStorage();
	item = item.filter((itemSave) => {
		if (itemSave.id !== id) {
			return itemSave;
		}
	});
	localStorage.setItem("list", JSON.stringify(item));
}
// EDIT FUNCTION
function editTodo(e) {
	const curr = e.currentTarget.closest(".task__left").lastElementChild;
	console.log(curr);
}
// SET BACK TO DEFAULT FUNCTION
function setBackToDefault() {
	input.value = "";
	submit.textContent = "Add";
	editStatus = false;
}
// *******cLEAR DEFAULT FORM
function clearDefaultForm(e) {
	e.preventDefault();
	const value = input.value;
	const id = new Date().getTime().toString();

	if (value && !editStatus) {
		displayInputs(value, id);
		addToLocalStorage(value, id);
		setBackToDefault();
	} else if (value && editStatus) {
		console.log(true);
		editElement.textContent = input.value;
		editIdFromLocalStorage(input.value, editID);

		addToLocalStorage();
		setBackToDefault();
	} else {
		alert.textContent = "Please enter a task";
		alert.classList.add("alert__active");
		setTimeout(() => alert.classList.remove("alert__active"), 1000);
	}
}

form.addEventListener("submit", clearDefaultForm);
