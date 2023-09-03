// console.log( 'js' );

$(document).ready( function(){
//   console.log( 'JQ' );
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
    // console.log( 'in getTasks' );
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
    // console.log("in renderTasks")
    $('#todocontainer').empty();

    //Append based on if task is complete or note
    for (let task of tasks) {
        if (!task.isComplete) {
            let $newToDo=$(`
                 <div class="todo">
                    <div class="todoitem">
                        <h5>${task.task}</h5>
                        <small class="text-body-secondary">Added on ${task.dateAdded} at ${task.timeAdded}</small>
                    </div>
                    <div class="buttons">
                        <button class="complete-button btn btn-outline-success">Complete</button>
                        <button class="delete-button btn btn-outline-danger">Delete</button>
                    </div>
                </div>
            `);
            $newToDo.data('id', task.id);
            $('#todocontainer').append($newToDo); 
        } else if (task.isComplete) {
            let $newToDo=$(`
                 <div class="todo complete">
                    <div class="todoitem complete">
                        <h5><del>${task.task}</del></h5>
                        <small class="text-body-secondary">Completed on ${task.dateCompleted} at ${task.timeCompleted}</smalln>
                    </div>
                    <div class="buttons">
                        <button class="complete-button complete btn btn-outline-success">Complete</button>
                        <button class="delete-button btn btn-outline-danger">Delete</button>
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
    // console.log( 'in addTask');

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
                swal('Unable to add task at this time. Please try again later.');
            })
    } else {
        swal("Please input a to-do item.")
    }
};
//end addTask


//PUT
function completeTask() {
    // console.log('in updateTask');
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
            swal('Error on updating task:', error);
        })
};
//end completeTask

//DELETE
function deleteTask() {
    // console.log('in deleteTask');
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover this task!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      }) .then((willDelete) => {
        if (willDelete) {
            let idToDelete = $(this).parent().parent().data('id');
            $.ajax({
                method: 'DELETE',
                url: `/tasks/${idToDelete}` // We pass the id to the server in url as a url parameter
                }).then(results => {
                    console.log('delete successful, this to-do no longer exists: ', idToDelete);
                    getTasks();
                }).catch(error => {
                    swal("Error on delete, id:", idToDelete);
                })
          swal("Your task has been deleted!", {
            icon: "success",
          });
        } else {
          swal("Your task is safe!");
        }
    });
};
//end deleteTask

//get current date and time
function getTime() {
    // console.log('in getTime')
    let date = new Date();
    let currentDate=((date.toLocaleString('en-US', {year: "2-digit", month: "2-digit", day: "2-digit"})));
    let currentTime=((date.toLocaleString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true })))
    // console.log(currentDate);
    // console.log(currentTime);
    $('#date').text(currentDate)
    $('#time').text(currentTime)
};
//end getTime