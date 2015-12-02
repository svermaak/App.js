'use strict';

var context = SP.ClientContext.get_current();
var user = context.get_web().get_currentUser();

// This code runs when the DOM is ready and creates a context object which is needed to use the SharePoint object model
$(document).ready(function () {
    getUserName(function (userName) {
        if (userName.length > 0) {
            $('#message').text('Hello ' + userName);
        }
    });
});

function getUserName(callback) {
    context.load(user);
    context.executeQueryAsync(OnSuccess, OnFailure);

    function OnSuccess(sender, args) {
        var userName;

        try {
            userName = user.get_title()
        }
        catch (err) {
            userName = '';
        }

        callback(userName);
    }

    function OnFailure(sender, args) {
        callback('');
    }
}

//// This function prepares, loads, and then executes a SharePoint query to get the current users information
//function getUserName() {
//    context.load(user);
//    context.executeQueryAsync(onGetUserNameSuccess, onGetUserNameFail);
//}

//// This function is executed if the above call is successful
//// It replaces the contents of the 'message' element with the user name
//function onGetUserNameSuccess() {
//    $('#message').text('Hello ' + user.get_title());
//}

//// This function is executed if the above call fails
//function onGetUserNameFail(sender, args) {
//    alert('Failed to get user name. Error:' + args.get_message());
//}

// This function return value of a parameter by name
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// Get the ID parameter
function getID(url) {
    try {
        //Find start
        var startPos = url.indexOf("?ID=");
        if (startPos == -1) {
            return 0;
        }

        //Find end
        var endPos = url.indexOf("&", startPos);
        if (endPos == -1) {
            endPos = url.length;
        }

        //Remove '?ID='
        startPos = startPos + 4;

        //Return ID
        return url.substring(endPos, startPos);
    }
    catch (err) {

    }
    return 0;
}

//Add value/text to dropdown list
function addToDropdown(name, value, text) {
    $(name).append($('<option/>').val(value).html(text));
}

function getItemColumns(listName, itemID, columns, callback) {
    //Get current app web context
    var ctx = SP.ClientContext.get_current();
    var spWEB = ctx.get_web();

    //Get reference to the list
    var oList = spWEB.get_lists().getByTitle(listName);

    //Get reference to the ChainApprovalTasks item
    var oListItem = oList.getItemById(itemID);

    //Loads item
    ctx.load(oListItem);

    //Execute query
    ctx.executeQueryAsync(function () { onQuerySucceeded(oListItem, columns) }, onQueryFailed);

    //Get item data
    function onQuerySucceeded(oListItem, columns) {
        var taskItemData = Object.create(null)

        for (var key in columns) {
            try {
                taskItemData[key] = oListItem.get_item(key);
            }
            catch (err) {
                taskItemData[key] = '';
            }
        }

        callback(taskItemData);
    }
    function onQueryFailed(sender, args) {
        //Send back null object
        var taskItemData = Object.create(null)
        //alert('Error: ' + args.get_message() + '\n' + args.get_stackTrace());
        callback(taskItemData);
    }
}
