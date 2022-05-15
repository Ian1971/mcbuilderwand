MessageFormResponse Class
=========================

### In this article

- [Extends](#extends)
- [Properties](#properties)

Extends
-------

- [*FormResponse*](FormResponse.md)

Returns data about the player results from a modal message form.

Properties
----------

### **isCanceled**

`read-only isCanceled: boolean;`

If true, the form was canceled by the player (e.g., they selected the
pop-up X close button).

Type: *boolean*

### **selection**

`read-only selection: number;`

Returns the index of the button that was pushed.

Type: *number*
