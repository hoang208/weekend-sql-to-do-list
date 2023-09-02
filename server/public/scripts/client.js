console.log( 'js' );

$(document).ready( function(){
  console.log( 'JQ' );
  setupClickListeners();
  getTasks();
}); 
// end doc ready

function setupClickListeners() {
    $( '#new-todo-submit' ).on( 'click', addTask);
    $('#todocontainer').on('click', '.complete-button', completeTask)
  };
//end setupClickListeners

//GET
function getTasks() {
    console.log( 'in getTasks' );
    // ajax call to server to get tasks
    $.ajax({
        type: 'GET',
        url: '/tasks'
    }).then(function(response) {
        console.log(response);
        renderTasks(response);
    }).catch(function(error){
        console.log('error in GET', error);
    });
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
        isComplete: false
    };

    //ajax call to server to send task
    if (newTask.task) {
        $.ajax({
            type: 'POST',
            url: '/tasks',
            data: newTask,
            }).then(function(response) {
            console.log('Response from server.', response);
            getTasks();
            $('#new-todo-input').val('')
            }).catch(function(error) {
            console.log('Error in POST', error)
            alert('Unable to add task at this time. Please try again later.');
            });
    } else {
        alert("Please input a to-do item.")
    }
};
//end addTask


//PUT
function completeTask() {
    console.log('in updateTask');
    let idToUpdate=$(this).parent().parent().data('id');

    //ajax call to server to update
    $.ajax({
        method: 'PUT',
        url: `/tasks/${idToUpdate}`,
        data: idToUpdate
    }).then(
        (response) => {
            console.log("update task worked, task id:", idToUpdate);
            getTasks();
            $(this).addClass("complete");
            $(this).parent().parent().addClass("complete");
            $(this).parent().next().children('.todoitem').addClass("complete");
        }
    ).catch(
        (error) => {
            alert('Error on updating task:', error);
        }
    )
}