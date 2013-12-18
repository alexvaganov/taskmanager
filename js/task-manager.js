/**
 * Created by .
 * User: eXtaZzy
 * Date: 16.12.13
 * Time: 18:57
 * To change this template use File | Settings | File Templates.
 */

var editableTask = null; // global variable of task, which is changing now

/* Sets the active menu item, show corresponding block */
function setActiveMenuItem(link, hiddenBlock) {
    $('#add-task').hide();
    $('#change-task').hide();
    $('#ready-tasks').hide();
    $('#not-ready-tasks').hide();
    $(link).closest('ul').children().removeClass('active'); // remove class 'active'  from all list items
    $(link).parent().attr('class', 'active'); // add class 'active' in current list item
    $(hiddenBlock).show();
}

/* Clear input text fields */
function clearFields() {
    $('[type=text]').val('');
}

function validateDate(value) {
    var dateArr = value.split(".");
    dateArr[1] -= 1;
    var date = new Date(dateArr[2], dateArr[1], dateArr[0]);
    if ((date.getFullYear() == dateArr[2]) && (date.getMonth() == dateArr[1]) && (date.getDate() == dateArr[0])) {
        return true;
    }
    return false;
}

/* Update title, when URL is changed */
function updateTitle(title) {
    var elm = document.getElementsByTagName('title')[0];
    elm.innerHTML = title;
}

/* Change URL, when menu item clicked */
function followLink(link) {
    history.pushState({title:link.innerHTML, href:link.href}, null, link.href);
    updateTitle(link.innerHTML);
}

/* Get page param from URL */
function parseFirstUrlParam() {
   var pageParam = 0;
   var $_GET = window.location.search.substring(1).split("&");
      if ($_GET[0]) {
        pageParam = $_GET[0];
      }
   return pageParam;
}


/* Show edit form with values to change task */
function showEditPanel(elem) {
    var textToChange = $(elem).nextAll('.shell').children('.name').text(); // find text of span class='name' by edit link
    var dateToChange = $(elem).nextAll('.shell').children('.date').text(); // find text of span class='date' by edit link

    editableTask = $(elem).parent();

    // add values and clean errors
    $('#changeTaskName').val(textToChange).closest('.form-group').removeClass('has-error');
    $('#changeTaskName').next('span').remove();
    $('#changeTaskDate').val(dateToChange).closest('.form-group').removeClass('has-error');
    $('#changeTaskDate').next('span').remove();
    $('#change-task').show();
}

/* Create task with CRUD buttons */
function addTask(value, isComplete) {
    var spanMain, li, recentLi,
        taskName, taskDate,
        spanName, spanDate;
    
    var cbComplete = $('<input type="checkbox" />');
    var delTask = $('<a href="" title="Удалить" class="del" />').text('X');
    var editTask = $('<a href="" title="Редактировать" class="edit" />').text('Р');

    if (!value) { // if new task is created
        taskName = $('#taskName').val();
        taskDate = $('#taskDate').val();
        spanDate = $('<span class="date"/>').text(taskDate);
        spanName = $('<span class="name"/>').text(taskName);
        spanMain = $('<span class="shell"/>').append(spanName).append(spanDate);
        li = $('<li class="task" />')
                            .append(delTask)
                            .append(editTask)
                            .append(cbComplete)
                            .append(spanMain); // add task pats to 'li' element

        recentLi = $('<li />').append(spanMain.clone());
        recentLi.appendTo('#recently-added');
    } else { // data load from local storage
        spanMain = $('<span class="shell"/>').append(value);
        li = $('<li class="task" />')
                       .append(delTask)
                       .append(editTask)
                       .append(cbComplete)
                       .append(spanMain);
    }

    // checkbox event
    cbComplete.on('click', function() {
        moveTask(li, cbComplete.prop('checked'));
    }).prop('checked', isComplete);

    // delete link event
    delTask.on('click', function() {
        li.remove();
        saveLists();
        return false;
    });

    // edit link event
    editTask.on('click', function() {
        showEditPanel(this);
        return false;
    });
    moveTask(li, isComplete);
}

/* Move task to ready or not-ready lists */
function moveTask(li, isComplete) {
    var containner = isComplete ? '#list-ready' : '#list-not-ready';
    li.appendTo(containner);
    saveLists();
}

/* Change task in task-list */
function changeTask() {
    var taskName = $('#changeTaskName').val();
    var taskDate = $('#changeTaskDate').val();
    var spanDate = $('<span class="date"/>').text(taskDate);
    var spanName = $('<span class="name"/>').text(taskName);
    var spanMain = $('<span class="shell"/>').append(spanName).append(spanDate);
    editableTask.children('span.shell').remove();
    editableTask.append(spanMain);
    saveLists();
    $('#change-task').hide();
}

/* Check for existence of local storage */
function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

/* Save lists to local storage */
function saveLists() {
    var readyTasks = [],
        notReadyTasks = [],
        elemText;

        $('#list-not-ready span.shell').each(function(i, el) {
            elemText = $(el).html();
            notReadyTasks.push(elemText);
        });
        $('#list-ready span.shell').each(function(i, el) {
            elemText = $(el).html();
            readyTasks.push(elemText);
        });
    if (isLocalStorageAvailable()) {
        localStorage.setItem('readyTasks', JSON.stringify(readyTasks));
        localStorage.setItem('notReadyTasks', JSON.stringify(notReadyTasks));
    }
}

/* Load tasks from local storage */
function loadLists() {
    var readyTasks = [],
        notReadyTasks = [];

    if (isLocalStorageAvailable()) { // if browser has local storage
        readyTasks = JSON.parse(localStorage.getItem('readyTasks')); // get saved ready tasks list
        notReadyTasks = JSON.parse(localStorage.getItem('notReadyTasks')); // het saved not-ready tasks list

        if (readyTasks) {
            for (var i = 0; i < readyTasks.length; i++) {
                addTask(readyTasks[i], true); // add task to DOM
            }
        }
        if (notReadyTasks) {
            for (var i = 0; i < notReadyTasks.length; i++) {
                addTask(notReadyTasks[i], false); // add task to DOM
            }
        }
    }
}

/* Load page from URL history */
$(window).bind('popstate', function() {
    var pageParam = parseFirstUrlParam();
    switch(pageParam) {
        case "add-task":
            setActiveMenuItem($('#add-task-link'), '#add-task');
        break;
        case "ready-tasks":
            setActiveMenuItem($('#ready-link'), '#ready-tasks');
        break;
        case "not-ready-tasks":
            setActiveMenuItem($('#not-ready-link'), '#not-ready-tasks');
        break;
        default:
            setActiveMenuItem($('#add-task-link'), '#add-task');
        break;
    }
});


$(document).ready(function() {
    loadLists(); // load tasks from local storage

    $('.datepicker').datepicker({
        format: 'dd.mm.yyyy'
    }).on('changeDate', function(){
        $(this).next('span').remove();
        $(this).closest('.form-group').removeClass('has-error');
    });

    // form validation
    $('#save').on('click', function() {  // validate form, when save button clicked
        var isError = false;
        $('#add-task [type=text]').each(function() { //validate add-task form
            if (!$(this).val().length) {
                isError = true;
                $(this).closest('.form-group').addClass('has-error');
                $(this).next('span').remove();
                $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
            }
        });

        if (!isError) {
            addTask();
            clearFields();
            $('#recently-added').show();
        }
        return false;
    });

    $('#change').on('click', function() {  // validate form, when change button clicked
        var isError = false;
        $('#change-task [type=text]').each(function() {
            if (!$(this).val().length) {
                isError = true;
                $(this).closest('.form-group').addClass('has-error');
                $(this).next('span').remove();
                $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
            }
        });

        if (!isError) {
            changeTask();
            clearFields();
        }
        return false;
    });

    $('[type=text]').blur(function() { // validate field, when focus is lost
        if (!$(this).val().length) {
            $(this).closest('.form-group').addClass('has-error');
            $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
        } else {
            if ($(this).attr('class') == 'form-control datepicker') {
                var isDate = validateDate($(this).val());
                if (!isDate) {
                    $(this).closest('.form-group').addClass('has-error');
                    $(this).after('<span class="error">Дата не существует, либо задан неверный формат!</span>');
                }
            }
        }
    });
    $('[type=text]').focus(function() { // clean field error, when focus is on
        $(this).next('span').remove();
        $(this).closest('.form-group').removeClass('has-error')
    });

    // show ready task list
    $('#ready-link').click(function() {
        setActiveMenuItem(this, '#ready-tasks');
        followLink(this);
        return false;
    });

    // show not-ready task list
    $('#not-ready-link').click(function() {
        setActiveMenuItem(this, '#not-ready-tasks');
        followLink(this);
        return false;
    });

    // show block of adding task
    $('#add-task-link').click(function() {
        setActiveMenuItem(this, '#add-task');
        followLink(this);
        return false;
    });
});