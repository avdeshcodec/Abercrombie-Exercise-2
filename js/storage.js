// LocalStorage Keys
const incompleteTasksListKey = 'incompleteTasksList';
const completedTasksListKey = 'completedTasksList';

// Add Task Method
const storeNewTask = function (taskName) {
    const newTaskObj = {
        taskName: taskName,
        createdTimestamp: Date.now()
    };

    const tasksList = getListData(incompleteTasksListKey);
    tasksList.push(newTaskObj);

    storeList(incompleteTasksListKey, tasksList);
}

// Get List Methods
const getIncompletedTasksList = function () {
    return getListData(incompleteTasksListKey);
}

const getCompletedTasksList = function () {
    return getListData(completedTasksListKey);
}

// Remove item Methods
const removeItemFromIncompletedTasksList = function (index) {
    const tasksList = getIncompletedTasksList();
    tasksList.splice(index, 1);
    storeList(incompleteTasksListKey, tasksList);
}

const removeItemFromCompletedTasksList = function (index) {
    const tasksList = getCompletedTasksList();
    tasksList.splice(index, 1);
    storeList(completedTasksListKey, tasksList);

}

// Change status Methods
const markAsCompletedTask = function (index) {
    const incompletedtasksList = getIncompletedTasksList();
    const task = incompletedtasksList[index];
    removeItemFromIncompletedTasksList(index);


    const completedtasksList = getCompletedTasksList();
    completedtasksList.push(task);
    storeList(completedTasksListKey, completedtasksList);
}

const markAsIncompletedTask = function (index) {
    const completedtasksList = getCompletedTasksList();
    const task = completedtasksList[index];
    removeItemFromCompletedTasksList(index);


    const inCompletedtasksList = getIncompletedTasksList();
    inCompletedtasksList.push(task);
    storeList(incompleteTasksListKey, inCompletedtasksList);
}

// Update Item Methods
const updateIncompletedTaskItem = function (index, taskName) {
    const inCompletedTasksList = getIncompletedTasksList();
    inCompletedTasksList[index].taskName = taskName;

    storeList(incompleteTasksListKey, inCompletedTasksList);
}

const updateCompletedTaskItem = function (index, taskName) {
    const completedTasksList = getCompletedTasksList();
    completedTasksList[index].taskName = taskName;

    storeList(completedTasksListKey, completedTasksList);
}

// Common Methods
const getListData = function (key) {
    try {
        const json = localStorage.getItem(key);
        if (json) return JSON.parse(json);
    } catch (error) {
        console.log('Error while parsing json');
    }
    return [];
}

const storeList = function (key, tasksList) {
    localStorage.setItem(key, JSON.stringify(tasksList));
}
