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
function updateTitle(title)
{
    var elm = document.getElementsByTagName('title')[0];
    elm.innerHTML = title;
}

// change URL, when menu item clicked
function followLink(link) {
    history.pushState({title:link.innerHTML, href:link.href}, null, link.href);
    updateTitle(link.innerHTML);
}

$(document).ready(function() {
    // form validation
    $('#save').on('click', function() {  // validate form, when submit button clicked
        $('[type=text]').each(function() {
            if (!$(this).val().length) {
                $(this).closest('.form-group').addClass('has-error');
                $(this).next('span').remove();
                $(this).after('<span class="error">Это поле обязательно для заполнения!</span>');
            } else {
                
            }
        });
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