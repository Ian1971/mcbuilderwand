ActionFormData Class
=====================
Builds a simple player form with buttons that let the player take
action.

Methods
-------

- [constructor](#constructor)
- [body](#body)
- [button](#button)
- [show](#show)
- [title](#title)

### **constructor**

`new ActionFormData()`

Creates a new modal form builder.

#### Returns [*ActionFormData*](ActionFormData.md)

### **body**

`body(bodyText: string): ActionFormData`

Method that sets the body text for the modal form.

#### **Parameters**

- **bodyText**: *string*

#### Returns [*ActionFormData*](ActionFormData.md)

### **button**

`button(text: string, iconPath?: string): ActionFormData`

Adds a button to this form with an icon from a resource pack.

#### **parameters**

- **text**: *string*
- **iconPath**?: *string* = `null`

#### Returns [*ActionFormData*](ActionFormData.md)

### **show**

`show(player: mojang-minecraft.Player): Promise<ActionFormResponse>`

Creates and shows this modal popup form. Returns asynchronously when the
player confirms or cancels the dialog.

#### **Parameters**

- **player**:
  [*mojang-minecraft.Player*](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/player)

  Player to show this dialog to.

#### **Returns** Promise\<[*ActionFormResponse*](ActionFormResponse.md)\>

### **title**

`title(titleText: string): ActionFormData`

This builder method sets the title for the modal dialog.

#### **Parameters**

- **titleText**: *string*

#### **Returns** [*ActionFormData*](ActionFormData.md)
