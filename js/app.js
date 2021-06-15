
(function () {

  // ADD Task Elements
  const taskInput = document.getElementById("new-task");
  const addButton = document.getElementById("add-task-btn");
  const addErrorElement = document.getElementById("add-error");

  // List Elements
  const incompleteTasksHolder = document.getElementById("incomplete-tasks");
  const completedTasksHolder = document.getElementById("completed-tasks");

  // Common Task Methods

  const elementIndex = (element) => {
    const parentElement = Array.from(element.parentNode.children);
    return parentElement.indexOf(element);
  }

  const getListContainer = function (isTodoItem) {
    return isTodoItem ? incompleteTasksHolder : completedTasksHolder;
  }

  const checkInputValidation = function (element, value) {
    // Check for validation add/removal
    if (value) element.classList.add('hide');
    else element.classList.remove('hide');

    return !!value;
  }

  const handleNoData = function (isTodoItem) {
    const listContainer = getListContainer(isTodoItem);
    const hasNoChildren = listContainer.children.length == 0;

    const parentContainer = listContainer.parentNode;
    const noItemElement = parentContainer.querySelector('.no-item');
    if (hasNoChildren)
      noItemElement.classList.remove('hide');
    else
      noItemElement.classList.add('hide');
  }

  const createTaskElement = function (taskName, isTodoItem) {
    // task completion checkbox generation
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = !isTodoItem;
    // checkBox.checked=true; 
    // Content Div html generation
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("item-content");

    const itemLabel = document.createElement("label");
    itemLabel.classList.add("item-label");
    itemLabel.innerText = taskName;

    const itemInput = document.createElement("input");
    itemInput.type = "text";
    itemInput.classList.add("form-control");

    contentDiv.appendChild(itemLabel);
    contentDiv.appendChild(itemInput);

    // Action btns html generation
    const actionBtnsDiv = document.createElement("div");
    actionBtnsDiv.classList.add("action-btns");

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit");
    editBtn.innerText = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerText = "Delete";

    const saveBtn = document.createElement("button");
    saveBtn.classList.add("save");
    saveBtn.innerText = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.classList.add("cancel");
    cancelBtn.innerText = "Cancel";

    actionBtnsDiv.appendChild(editBtn);
    actionBtnsDiv.appendChild(deleteBtn);
    actionBtnsDiv.appendChild(saveBtn);
    actionBtnsDiv.appendChild(cancelBtn);

    // Wrapper generation
    const itemWrapperElement = document.createElement("div");
    itemWrapperElement.classList.add("item-wrapper");

    itemWrapperElement.appendChild(checkBox);
    itemWrapperElement.appendChild(contentDiv);
    itemWrapperElement.appendChild(actionBtnsDiv);

    // Error block element
    const errorElement = document.createElement("div");
    errorElement.innerText = "Task name is required.";
    errorElement.classList.add("error");
    errorElement.classList.add("hide");

    // Main Task row generation
    const listItem = document.createElement("li");
    listItem.appendChild(itemWrapperElement);
    listItem.appendChild(errorElement);

    // Add to Incomplete task list
    const listContainer = getListContainer(isTodoItem);
    listContainer.appendChild(listItem);

    return listItem;
  };

  const bindTaskEvents = function (taskListItem, isTodoItem) {
    const checkBox = taskListItem.querySelector("input[type=checkbox]");
    const inputBox = taskListItem.querySelector("input[type=text]");
    const editButton = taskListItem.querySelector("button.edit");
    const deleteButton = taskListItem.querySelector("button.delete");
    const saveButton = taskListItem.querySelector("button.save");
    const cancelButton = taskListItem.querySelector("button.cancel");


    inputBox.addEventListener("keyup", function (e) {
      if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        updateTask(this);
      } else if (e.code === "Escape") {
        toggleEditTask(this);
      } else {
        const value = e.target.value;

        const listItem = this.closest("li");
        const errorElement = listItem.querySelector('.error');
        checkInputValidation(errorElement, value);
      }
    });

    editButton.onclick = function () {
      toggleEditTask(this)
    };

    deleteButton.onclick = function () {
      deleteTask(this, isTodoItem)
    };

    saveButton.onclick = function () {
      updateTask(this, isTodoItem);
    };

    cancelButton.onclick = function () {
      toggleEditTask(this);
    };

    checkBox.onchange = function () {
      toggleTaskStatus(this, isTodoItem);
    };
  };

  // Add Task Methods
  const addTask = function () {
    const newTaskName = taskInput.value;

    // Validate
    const isValid = checkInputValidation(addErrorElement, newTaskName);
    if (!isValid) return;

    // Create New Task Element
    const listItem = createTaskElement(newTaskName, true);

    // Attach event to Elements
    bindTaskEvents(listItem, true);

    // Clear Input
    taskInput.value = "";

    // Store in localstorage
    storeNewTask(newTaskName);

    // Handle no data message
    handleNoData(true);
  };

  addButton.addEventListener("click", addTask);
  taskInput.addEventListener("keyup", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
      addTask();
    } else {
      const value = e.target.value;
      checkInputValidation(addErrorElement, value);
    }
  });


  // List Task Action methods

  const toggleEditTask = function (element) {
    const listItem = element.closest("li");
    const editInput = listItem.querySelector("input[type=text]");
    const label = listItem.querySelector("label");
    const errorElement = listItem.querySelector(".error");

    const containsEditModeClass = listItem.classList.contains("editMode");
    if (!containsEditModeClass) {
      editInput.value = label.innerText;

      setTimeout(function () {
        editInput.focus();
      }, 0);
    } else {
      errorElement.classList.add('hide');
    }

    listItem.classList.toggle("editMode");
  };

  const updateTask = function (element, isTodoItem) {
    const listItem = element.closest("li");
    const inputBox = listItem.querySelector("input[type=text]");
    const taksLabel = listItem.querySelector(["label[class='item-label'"]);
    const errorElement = listItem.querySelector('.error');
    const updatedTaskName = inputBox.value;

    // Validate
    const isValid = checkInputValidation(errorElement, updatedTaskName);
    if (!isValid) return;

    const index = elementIndex(listItem);

    if (isTodoItem) updateIncompletedTaskItem(index, updatedTaskName);
    else updateCompletedTaskItem(index, updatedTaskName);

    taksLabel.innerText = updatedTaskName;
    listItem.classList.toggle("editMode");
  }

  const deleteTask = function (element, isTodoItem) {
    const confirmDeletion = confirm("Are you sure you want to delete this item?");
    if (confirmDeletion) {
      const listItem = element.closest("li");

      // Remove from localstorage
      const index = elementIndex(listItem);
      if (isTodoItem) removeItemFromIncompletedTasksList(index);
      else removeItemFromCompletedTasksList(index);

      // Remove from localstorage
      const ul = listItem.parentNode;
      ul.removeChild(listItem);

      // Handle no data message
      handleNoData(isTodoItem);
    }

  };

  const toggleTaskStatus = function (element, isTodoItem) {
    const listItem = element.closest("li");

    //remove and store task
    const index = elementIndex(listItem);

    if (isTodoItem) markAsCompletedTask(index);
    else markAsIncompletedTask(index);

    // Remove from DOM
    const listContainer = isTodoItem ? completedTasksHolder : incompleteTasksHolder;
    listContainer.appendChild(listItem);

    // Bind Events 
    bindTaskEvents(listItem, !isTodoItem);

    // Handle no data for both list
    handleNoData(true);
    handleNoData(false);
  };


  // On load Method
  const renderTasksList = function (tasksList, isTodoItem) {
    for (let i = 0; i < tasksList.length; i++) {
      const task = tasksList[i];
      const listItem = createTaskElement(task.taskName, isTodoItem);

      // Attach event to Elements
      bindTaskEvents(listItem, isTodoItem);
    }

    // Handle no data message
    handleNoData(isTodoItem);
  };

  const initialize = function () {
    const incompletedTasksList = getIncompletedTasksList();
    renderTasksList(incompletedTasksList, true);

    const completedTasksList = getCompletedTasksList();
    renderTasksList(completedTasksList, false);
  }

  initialize();
})();