console.log( 'js' );

$(document).ready( function(){
  console.log( 'JQ' );
  setupClickListeners();
  getTasks();
  getTime();
}); 
// end doc ready

//update time
setInterval(getTime, 60000)

function setupClickListeners() {
    $('#new-todo-submit').on('click', addTask);
    $('#todocontainer').on('click', '.complete-button', completeTask);
    $('#todocontainer').on('click', '.delete-button', deleteTask)
  };
//end setupClickListeners

//GET
function getTasks() {
    console.log( 'in getTasks' );
    // ajax call to server to get tasks
    $.ajax({
        type: 'GET',
        url: '/tasks'
        }).then(response => {
            console.log(response);
            renderTasks(response);
        }).catch(error => {
            console.log('error in GET', error);
        })
};
// end getTasks

//RENDER
function renderTasks(tasks) {
    console.log("in renderTasks")
    $('#todocontainer').empty();

    //Append based on if task is complete or note
    for (let task of tasks) {
        if (!task.isComplete) {
            let $newToDo=$(`
                 <div class="todo">
                    <div class="todoitem">
                        <p>${task.task}</p>
                        <span>Added on ${task.dateAdded} at ${task.timeAdded}
                    </div>
                    <div class="buttons">
                        <button class="complete-button">Complete</button>
                        <button class="delete-button">Delete</button>
                    </div>
                </div>
            `);
            $newToDo.data('id', task.id);
            $('#todocontainer').append($newToDo); 
        } else if (task.isComplete) {
            let $newToDo=$(`
                 <div class="todo complete">
                    <div class="todoitem complete">
                        <p>${task.task}</p>
                        <span>Completed on ${task.dateCompleted} at ${task.timeCompleted}</span>
                    </div>
                    <div class="buttons">
                        <button class="complete-button complete">Complete</button>
                        <button class="delete-button">Delete</button>
                    </div>
                </div>
            `);
            $newToDo.data('id', task.id);
            $('#todocontainer').append($newToDo);
        }
    }
};
//end renderTasks

//POST
function addTask(event) {
    event.preventDefault();
    console.log( 'in addTask');

    let newTask = {
        task: $('#new-todo-input').val(),
        isComplete: false,
        dateAdded: $('#date').text(),
        timeAdded: $('#time').text(),
        dateCompleted: null,
        timeCompleted: null,
    };

    //ajax call to server to send task
    if (newTask.task) {
        $.ajax({
            type: 'POST',
            url: '/tasks',
            data: newTask,
            }).then(response => {
                console.log('Response from server.', response);
                getTasks();
                $('#new-todo-input').val('')
            }).catch(error => {
                console.log('Error in POST', error)
                alert('Unable to add task at this time. Please try again later.');
            })
    } else {
        alert("Please input a to-do item.")
    }
};
//end addTask


//PUT
function completeTask() {
    console.log('in updateTask');
    let idToUpdate=$(this).parent().parent().data('id');

    let dateToUpdate= {
        dateCompleted: $('#date').text(),
        timeCompleted: $('#time').text(),
    }
    //ajax call to server to update
    $.ajax({
        method: 'PUT',
        url: `/tasks/${idToUpdate}`,
        data: dateToUpdate
        }).then(response => {
            console.log("update task worked, task id:", idToUpdate);
            getTasks();
            $(this).addClass("complete");
            $(this).parent().parent().addClass("complete");
            $(this).parent().next().children('.todoitem').addClass("complete");
        }).catch(error => {
            alert('Error on updating task:', error);
        })
};
//end completeTask

//DELETE
function deleteTask() {
    console.log('in deleteTask');
    let idToDelete = $(this).parent().parent().data('id');

    $.ajax({
        method: 'DELETE',
        url: `/tasks/${idToDelete}` // We pass the id to the server in url as a url parameter
        }).then(results => {
            console.log('delete successful, this to-do no longer exists: ', idToDelete);
            getTasks();
        }).catch(error => {
            alert("Error on delete, id:", idToDelete);
        })
};
//end deleteTask

//get current date and time
function getTime() {
    console.log('in getTime')
    let date = new Date();
    let currentDate=((date.toLocaleString('en-US', {year: "2-digit", month: "2-digit", day: "2-digit"})));
    let currentTime=((date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })))
    console.log(currentDate);
    console.log(currentTime);
    $('#date').text(currentDate)
    $('#time').text(currentTime)
};
//end getTime