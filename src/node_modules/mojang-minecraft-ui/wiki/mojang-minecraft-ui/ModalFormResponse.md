ModalFormResponse Class
=======================

### In this article

- [Extends](#extends)
- [Properties](#properties)

Extends
-------

- [*FormResponse*](FormResponse.md)

Returns data about player responses to a modal form.

Properties
----------

### **formValues**

`read-only formValues: any[];`

An ordered set of values based on the order of controls specified by
ModalFormData.

Type: *any*

### **isCanceled**

`read-only isCanceled: boolean;`

If true, the form was canceled by the player (e.g., they selected the
pop-up X close button).

Type: *boolean*
