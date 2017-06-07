//  Global variables declared for enter and escape keys.
var enter_key = 13;
var esc_key = 27;
//  todoModel object represents the model of this app.
var todoModel = {
    todos: [],
    countTodos: function () {
        var totalTodos = this.todos.length;
        var completedTodos = 0;
        //  Gets the number of completed todos.
        this.todos.forEach(function (todo) {
            if (todo.completed === true) {
                completedTodos++;
            }
        });
        return {
            totalTodos: totalTodos,
            completedTodos: completedTodos
        };
    },
    createTodo: function (todoText) {
        var alertBox = document.getElementById("alert-box");
        //  We trim the users todo input before adding it to our data array.
        var trimmedTodoText = todoText.trim();
        if (trimmedTodoText) {
            this.todos.push({
                todoText: trimmedTodoText,
                completed: false
            });
            alertBox.textContent = "";
        } else {
            alertBox.textContent = "Please enter something";
            setTimeout(function () {
                alertBox.textContent = "";
            }, 3000);
        }
    },
    changeTodo: function (position, todoText) {
        this.todos[position].todoText = todoText;
    },
    deleteTodo: function (position) {
        this.todos.splice(position, 1);
    },
    //  Takes in todo item position and switches the boolean value of the completed status.
    toggleCompleted: function (position) {
        //  Grabs the todo item from the array and sets it to the todo variable.
        var todo = this.todos[position];
        //  Switches the boolean value of the completed status.
        todo.completed = !todo.completed;
    },
    toggleAll: function () {
        var totalTodos = this.todos.length;
        var completedTodos = 0;

        //  Gets the number of completed todos.
        this.todos.forEach(function (todo) {
            if (todo.completed === true) {
                completedTodos++;
            }
        });

        this.todos.forEach(function (todo) {
            //  Case 1: If everything's true, make everything false.
            if (completedTodos === totalTodos) {
                todo.completed = false;
                //  Case 2: Otherwise, make everything true.
            } else {
                todo.completed = true;
            }
        });
    },
    isMobileDevice: function () {
        return (
            typeof window.orientation !== "undefined" ||
            navigator.userAgent.indexOf("IEMobile") !== -1
        );
    }
};

//  controller object represents the controller of this app.
var controller = {
    createTodo: function () {
        var createTodoTextInput = document.getElementById("createTodoTextInput");
        todoModel.createTodo(createTodoTextInput.value);
        createTodoTextInput.value = "";
        view.displayTodos();
    },
    createTodoEntered: function () {
        var inputElement = document.getElementById("createTodoTextInput");
        if (inputElement.value && event.keyCode === enter_key) {
            // On mobile, defocuses input to hide soft keyboard so user can see their entered todo item.
            if (todoModel.isMobileDevice()) {
                inputElement.blur();
            }
            this.createTodo();
        }
        view.displayTodos();
    },
    updateKeyup: function (updateInputElement) {
        var id = updateInputElement.parentNode.getAttribute("id");
        var newUpdateInputValue = updateInputElement.value;
        if (updateInputElement.value && event.keyCode === enter_key) {
            this.changeTodo(id, newUpdateInputValue);
        }
        if (event.keyCode === esc_key) {
            //  Very important line. If the updateInputElement.value is not reset to the original value, then updateFocusOut method would still run and update the data even when esc key is pressed.
            updateInputElement.value = todoModel.todos[id].todoText;
            view.displayTodos();
        }
    },
    updateFocusOut: function (updateInputElement) {
        var id = updateInputElement.parentNode.getAttribute("id");
        var newUpdateInputValue = updateInputElement.value;
        if (updateInputElement.value) {
            this.changeTodo(id, newUpdateInputValue);
        } else {
            controller.deleteTodo(id);
        }
    },
    changeTodo: function (id, value) {
        todoModel.changeTodo(id, value);
        view.displayTodos();
    },
    deleteTodo: function (position) {
        todoModel.deleteTodo(position);
        view.displayTodos();
    },
    updatingMode: function (todoLabelElement) {
        var updateBoxElement = todoLabelElement.parentNode.querySelector(
            ".updateBox"
        );
        view.toggleHide(todoLabelElement);
        view.toggleHide(updateBoxElement);
        updateBoxElement.focus();
    },
    mobileUpdatingMode: function (editButtonElement) {
        var updateBoxElement = editButtonElement.parentNode.querySelector(
            ".updateBox"
        );
        var todoLabelElement = editButtonElement.parentNode.querySelector(
            ".todoLabel"
        );
        view.toggleHide(todoLabelElement);
        view.toggleHide(updateBoxElement);
    },
    //  The controller for the todo item toggle. Takes the argument 'this' from the toggle check box in the DOM.
    toggleCompleted: function (toggleElement) {
        //  Gets the id from the parent (<li>) of the toggle check box and passes it to the toggleCompleted in the model. toggleCompleted switches the boolean value in the actual todo item object.
        todoModel.toggleCompleted(toggleElement.parentNode.getAttribute("id"));
        //  Runs the view.displayTodos() to update the DOM so the user can see the changes.
        view.displayTodos();
    },
    toggleAll: function () {
        todoModel.toggleAll();
        view.displayTodos();
    }
};

//  view object represents the view of this app.
var view = {
    displayTodos: function () {
        //  grabs the <ul> element and sets it to todosUl variable.
        var todosUl = document.querySelector("ul");
        //  Clears out the content inside <ul> to make sure we're starting clean.
        todosUl.innerHTML = "";
        //  Note that the 'this' argument in the forEach method is to bind 'this' for the callback function so it has access to the view object inside the callback.
        todoModel.todos.forEach(function (todo, position) {
            //  Creates an li element
            var todoLi = document.createElement("li");
            //  Builds the checkbox
            var toggleCheckbox = document.createElement("input");
            toggleCheckbox.type = "checkbox";
            toggleCheckbox.classList.add("todo-check-box");
            toggleCheckbox.setAttribute(
                "onchange",
                "controller.toggleCompleted(this)"
            );

            //  Builds the updateBox
            var updateBox = document.createElement("input");
            updateBox.classList.add("updateBox", "hide");
            updateBox.type = "text";
            updateBox.value = todo.todoText;
            updateBox.setAttribute("onkeyup", "controller.updateKeyup(this)");
            updateBox.setAttribute("onfocusout", "controller.updateFocusOut(this)");
            //  Builds the todo item text label
            var todoItemLabel = document.createElement("label");
            todoItemLabel.setAttribute("onclick", "controller.updatingMode(this)");
            todoItemLabel.textContent = todo.todoText;
            todoItemLabel.classList.add("todoLabel");
            //  Builds the mobile edit button
            var mobileEditButton = document.createElement("button");
            mobileEditButton.setAttribute(
                "onclick",
                "controller.mobileUpdatingMode(this)"
            );
            mobileEditButton.textContent = "Edit";
            mobileEditButton.classList.add("hide", "editButton");
            //  Removes hide class on mobile edit button if mobile is detected as true
            if (todoModel.isMobileDevice()) {
                mobileEditButton.classList.remove("hide");
            }
            //  Toggles the strikethrough class when user clicks checkbox or toggle all.
            if (todo.completed === true) {
                todoItemLabel.classList.add("todos-strikethrough");
            } else {
                todoItemLabel.classList.remove("todos-strikethrough");
            }
            //  Sets the position of the forEach loop as the id for the todoLi element we're building.
            todoLi.id = position;
            //  Displays checked or unchecked for checkbox depending on todo item completed status.
            if (todo.completed === true) {
                toggleCheckbox.checked = true;
            } else {
                toggleCheckbox.checked = false;
            }
            //  Adds the built-up toggleCheckbox as a child of the <li> element.
            todoLi.appendChild(toggleCheckbox);
            //  Adds the built-up todo item label as a child of the <li> element.
            todoLi.appendChild(todoItemLabel);
            //  Add the text box with todos text after the todo text node.
            todoLi.appendChild(updateBox);
            // Add the mobile edit button here
            // todoLi.appendChild(mobileEditButton);
            //  Adds the delete button as a child to the created <li> element by running the createDeleteButton method.
            todoLi.appendChild(this.createDeleteButton());
            // Adds the finalized <li> element in the beginning of the <ul> as a child of the <ul> element.
            todosUl.insertBefore(todoLi, todosUl.childNodes[0]);
        }, this);
        //  Shows the toggleAll button if there's at least one todo. Hides it if there's no todos.
        var toggleAllButton = document.querySelector("#toggle-all-btn");
        if (todoModel.countTodos().totalTodos > 0) {
            toggleAllButton.classList.remove("hide");
        } else {
            toggleAllButton.classList.add("hide");
        }
        //  Shows the create todo button if user types something. Once user removes their input or enter a new todo, it will disappear.
        var createTodoButton = document.querySelector("#create-todo-btn");
        var inputElement = document.getElementById("createTodoTextInput");
        if (inputElement.value) {
            createTodoButton.classList.remove("hide");
        } else {
            createTodoButton.classList.add("hide");
        }
    },
    toggleHide: function (selectedElement) {
        //  Toggles the hide class which shows or hides the element being passed in.
        selectedElement.classList.toggle("hide");
    },
    toggleTutorialDiv: function () {
        var tutorialDiv = document.querySelector('.tutorial-div');
        this.toggleHide(tutorialDiv);
    },
    createDeleteButton: function () {
        var deleteButton = document.createElement("button");
        deleteButton.textContent = "x";
        deleteButton.className = "deleteButton";
        return deleteButton;
    },
    setUpEventListeners: function () {
        var todosUl = document.querySelector("ul");

        todosUl.addEventListener("click", function (event) {
            //  Get the element that was clicked on.
            var elementClicked = event.target;

            //  Check if elementClicked is a delete button.//  Global variables declared for enter and escape keys.
            if (elementClicked.className === "deleteButton") {
                controller.deleteTodo(parseInt(elementClicked.parentNode.id));
            }
        });
    }
};

view.setUpEventListeners();