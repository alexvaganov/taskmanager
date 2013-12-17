/**
 * Created by .
 * User: eXtaZzy
 * Date: 16.12.13
 * Time: 18:57
 * To change this template use File | Settings | File Templates.
 */

// sets the active menu item, show corresponding block
function setActiveMenuItem(link, hiddenBlock) {
    $('#add-task').hide();
    $('#ready-tasks').hide();
    $('#not-ready-tasks').hide();
    $(link).closest('ul').children().removeClass('active'); // remove class 'active'  from all list items
    $(link).parent().attr('class', 'active'); // add class 'active' in current list item
    $(hiddenBlock).show();
}

// update title, when change URL
function updateTitle(title) {
    var elm = document.getElementsByTagName('title')[0];
    elm.innerHTML = title;
}

// change URL, when menu item clicked
function followLink(link) {
    history.pushState({title:link.innerHTML, href:link.href}, null, link.href);
    updateTitle(link.innerHTML);
}

// get page param from URL
function parseFirstUrlParam() {
    var pageParam = 0;
    var $_GET = window.location.search.substring(1).split("&");
    if ($_GET[0]) {
        pageParam = $_GET[0];
    }
    return pageParam;
}

// load page from URL history
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

// add task to non-ready-list and recently-added-list
function addTask() {
    var taskName = $('#inputTask').val();
    var taskDate = $('#inputDate').val();
    var spanDate = $('<span class="date"/>').text(taskDate);
    var spanMain = $('<span class="body"/>').text(taskName).append(spanDate);
    var cbComplete = $('<input type="checkbox" />');
    var delTask = $('<a href="" class="del" />').text('X');
    var li = $('<li class="task" />').append(delTask).append(cbComplete).append(spanMain);

    var recentLi = $('<li />').append(spanMain.clone());

    cbComplete.on('click', function() {
        moveTask(li, cbComplete.prop('checked'));
    });
    delTask.on('click', function() {
        li.remove();
        return false;
    });
    recentLi.appendTo('#recently-added');
    moveTask(li);
}

function moveTask(li, isComplete) {
        var containner = isComplete ? '#list-ready' : '#list-not-ready';
        li.appendTo(containner);
}




$(document).ready(function() {
    // form validation
    var isError = false;
    $('#save').on('click', function() {  // validate form, when submit button clicked
        $('[type=text]').each(function() {
            if (!$(this).val().length) {
                isError = true;
                $(this).closest('.form-group').addClass('has-error');
                $(this).next('span').remove();
                $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
            }
        });
        if (!isError) {
            addTask();
            $('#recently-added').show();
        }
        return false;
    });
    $('[type=text]').blur(function() { // validate field, when focus is lost
        if (!$(this).val().length) {
            $(this).closest('.form-group').addClass('has-error');
            $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
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