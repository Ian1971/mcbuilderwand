MessageFormData Class
=====================

### In this article

- [Methods](#methods)

Builds a simple two-button modal dialog.

Methods
-------

- [constructor](#constructor)
- [body](#body)
- [button1](#button1)
- [button2](#button2)
- [show](#show)
- [title](#title)

### constructor

`new MessageFormData()`

Creates a new modal form builder.

#### **Returns** [*MessageFormData*](MessageFormData.md)

### body

`body(bodyText: string): MessageFormData`

Method that sets the body text for the modal form.

#### **Parameters**

- **bodyText**: *string*

#### **Returns** [*MessageFormData*](MessageFormData.md)

### button1

`button1(text: string): MessageFormData`

Method that sets the text for the first button of the dialog.

#### **Parameters**

- **text**: *string*

#### **Returns** [*MessageFormData*](MessageFormData.md)

### button2

`button2(text: string): MessageFormData`

This method sets the text for the second button on the dialog.

#### **Parameters**

- **text**: *string*

#### **Returns** [*MessageFormData*](MessageFormData.md)

### **show**

`show(player: mojang-minecraft.Player): Promise<MessageFormResponse>`

Creates and shows this modal popup form. Returns asynchronously when the
player confirms or cancels the dialog.

#### **Parameters**

- **player**:
  [*mojang-minecraft.Player*](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft/player)

  Player to show this dialog to.

#### **Returns** Promise\<[*MessageFormResponse*](MessageFormResponse.md)\>

### **title**

`title(titleText: string): MessageFormData`

This builder method sets the title for the modal dialog.

#### **Parameters**

- **titleText**: *string*

#### **Returns** [*MessageFormData*](MessageFormData.md)
