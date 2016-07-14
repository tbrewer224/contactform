'use strict';

//create 'empty' arrays
function AddressBook() {
    this.knownKeys = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
    this.addresses = [];
}

//create empty ID
AddressBook.prototype = {
    newId: function () {

        //this sets "id" to 1 if there are no ids
        if (this.addresses.length == 0) return 1;
        return (

            //this gets the current id and adds another empty object/id
            Math.max.apply(null, this.addresses.map(function (address) {
                return address.id;
            })) + 1
        );
    },

    //add a contact
    addContact: function (contact) {

        //for the last ID created above populate the contact details for that contact
        contact.id = this.newId();
        this.addresses.push(contact);
    },

    //get a contact
    getContact: function (id) {
        return this.addresses.find(function (contact) {
            return contact.id === id;
        });
    }
};

function AddressForm() {
    this.inputFieldIds = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
}


AddressForm.prototype = {
    collectFormData: function () {

        //match input fields to IDs, add to output array... not sure what this is doing
        var output = {};
        this.inputFieldIds.forEach(function (element) {

            //this helps display contacts based on their ids when a user clicks a name... the code below is specialized / object oriented
            output[element] = $('#' + element).val();
        });
        return output;
    },

    //reset all the value to empty
    clearFormData: function () {
        this.inputFieldIds.forEach(function (element) {
            $('#' + element).val('');
        });
    },

    //validate whether first / last name are empty
    validateFormData: function (contact) {
        //if the first name and the last name are empty
        if (!contact.firstName || !contact.lastName) return false;
        return true;
    }
};

//create new arrays
var addressBook = new AddressBook();
var addressForm = new AddressForm();

//make text look pretty
function prettifyFieldName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
}

function renderContacts(addressBook) {
    //clear unordered list
    $('.contacts-list ul').empty();
    //cycle through all the contacts in the addressBook and list them out
    addressBook.addresses.forEach(function (contact) {
        $('.contacts-list ul').append("<li><a href='#' class='show-contact' id='" + contact.id + "-show-contact'>" + contact.firstName + " " + contact.lastName + "</a></li>");
    });
}

//this shows the contact details when a contact is clicked in the ul
function createDetailHtml(addressBook, contact) {
    var html = '';
    addressBook.knownKeys.forEach(function (keyName) {
        if (contact[keyName]) {
            html += "<li><strong>" + prettifyFieldName(keyName) + ": </strong>" + contact[keyName] + "</li>";
        }
    });
    $('#contact-detail-info').html(html);
};

//this throws an error message if the user doesn't enter all the correct information (see below)
function showError(msg, fadeTime) {
    fadeTime = fadeTime || 2000;
    $('.feedback p').text(msg).fadeIn(1000, function () {
        setTimeout(function () {
            $('.feedback p').fadeOut(1000);
        }, fadeTime);
    });
};

$(function () {
    $('button#add-contact').click(function (e) {
        //javascript will handle the form.
        e.preventDefault();
        //this sets the contact var to whatever the collectFormData function has collected.
        var contact = addressForm.collectFormData();

        //validation
        if (addressForm.validateFormData(contact)) {
            addressBook.addContact(contact);
            addressForm.clearFormData();
            renderContacts(addressBook);
        } else {
            showError("You must enter a first and last name.");
        }

    });

    $('.contacts-list').on('click', '.show-contact', function (e) {
        e.preventDefault();
        var contact = addressBook.getContact(parseInt(e.target.id));
        createDetailHtml(addressBook, contact);
    });
});
