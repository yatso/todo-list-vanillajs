//  todoList object represents the model of this app.
var todoList = {
  todos: [],
  addTodo: function(todoText) {
    this.todos.push({
      todoText: todoText,
      completed: false
    });
  },
  changeTodo: function(position, todoText) {
    this.todos[position].todoText = todoText;
  },
  deleteTodo: function(position) {
    this.todos.splice(position, 1);
  },
  //  Takes in todo item position and switches the boolean value of the completed status.
  toggleCompleted: function(position) {
    //  Grabs the todo item from the array and sets it to the todo variable.
    var todo = this.todos[position];
    //  Switches the boolean value of the completed status.
    todo.completed = !todo.completed;
  },
  toggleAll: function() {
    var totalTodos = this.todos.length;
    var completedTodos = 0;
    
    //  Gets the number of completed todos.
    this.todos.forEach(function(todo) {
      if (todo.completed === true) {
        completedTodos++;
      }
    });
    
    this.todos.forEach(function(todo) {
      //  Case 1: If everything's true, make everything false.
      if (completedTodos === totalTodos) {
        todo.completed = false;
      //  Case 2: Otherwise, make everything true.
      } else {
        todo.completed = true;
      }
    });
  }
};

//  handlers object represents the controller of this app.
var handlers = {
  addTodo: function() {
    var addTodoTextInput = document.getElementById('addTodoTextInput');
    todoList.addTodo(addTodoTextInput.value);
    addTodoTextInput.value = '';
    view.displayTodos();
  },
  addTodoEntered: function() {
    var inputElement = document.getElementById("addTodoTextInput");
    if (inputElement.value && event.keyCode === 13) {
      this.addTodo();
    }
  },
	changeEntered: function(editInputElement) {
    var id = editInputElement.parentNode.getAttribute('id');
    var newEditInputValue = editInputElement.value;
    if (editInputElement.value && event.keyCode === 13) {
      this.changeTodo(id, newEditInputValue);
    }
  },
  changeTodo: function(id, value) {
    todoList.changeTodo(id, value);
    view.displayTodos();
  },
  deleteTodo: function(position) {
    todoList.deleteTodo(position);
    view.displayTodos();
  },
  editingMode: function(todoLabelElement) {
    var editBoxElement = todoLabelElement.parentNode.querySelector('.editBox');
    view.toggleHide(todoLabelElement);
    view.toggleHide(editBoxElement);
  },
  //  The controller for the todo item toggle. Takes the argument 'this' from the toggle check box in the DOM.
  toggleCompleted: function(toggleElement) {
    //  Gets the id from the parent (<li>) of the toggle check box and passes it to the toggleCompleted in the model. toggleCompleted switches the boolean value in the actual todo item object.
    todoList.toggleCompleted(toggleElement.parentNode.getAttribute('id'));
  
    //  Runs the view.displayTodos() to update the DOM so the user can see the changes.
    view.displayTodos();
  },
  toggleAll: function() {
    todoList.toggleAll();
    view.displayTodos();
  }  
};

//  view object represents the view of this app.
var view = {
  displayTodos: function() {
    //  grabs the <ul> element and sets it to todosUl variable.
    var todosUl = document.querySelector('ul');
    //  Clears out the content inside <ul> to make sure we're starting clean.
    todosUl.innerHTML = '';
    
    //  Note that the 'this' argument in the forEach method is to bind 'this' for the callback function so it has access to the view object inside the callback.
    todoList.todos.forEach(function(todo, position) {
      //  Creates an li element
      var todoLi = document.createElement('li');
      
      //  Builds the checkbox
      var toggleCheckbox = document.createElement('input');
      toggleCheckbox.type = 'checkbox';
      toggleCheckbox.setAttribute('onchange', 'handlers.toggleCompleted(this)');
      
			// Builds the editBox
      var editBox = document.createElement('input');
      editBox.classList.add('editBox','hide');
      editBox.type = 'text';
      editBox.value = todo.todoText;
      editBox.setAttribute('onkeyup', 'handlers.changeEntered(this)');
			
      // Builds the todo item text label
      var todoItemLabel = document.createElement('label');
      todoItemLabel.setAttribute('ondblclick', 'handlers.editingMode(this)');
      todoItemLabel.textContent = todo.todoText;
      
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
			// Add the text box with todos text after the todo text node.
			todoLi.appendChild(editBox);
      //  Adds the delete button as a child to the created <li> element by running the createDeleteButton method.
      todoLi.appendChild(this.createDeleteButton());
      //  Adds the finalized <li> element as a child of the <ul> element.
      todosUl.appendChild(todoLi);
    }, this);
  },
  toggleHide: function(selectedElement) {
    //  Toggles the hide class which shows or hides the element being passed in.
    selectedElement.classList.toggle('hide');
  },
  createDeleteButton: function() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'deleteButton';
    return deleteButton;
  },
  setUpEventListeners: function() {
    var todosUl = document.querySelector('ul');

    todosUl.addEventListener('click', function(event) {
      //  Get the element that was clicked on.
      var elementClicked = event.target;

      //  Check if elementClicked is a delete button.
      if (elementClicked.className === 'deleteButton') {
        handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
      }
    });
  }
};

view.setUpEventListeners();
