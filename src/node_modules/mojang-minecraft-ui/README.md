mojang-minecraft-ui Module
==========================

View mojang-minecraft-ui wiki website [click here](https://docs.microsoft.com/en-us/minecraft/creator/scriptapi/mojang-minecraft-ui/mojang-minecraft-ui)

### In this article

- [Classes](#classes)

The `mojang-minecraft-ui` module contains types for expressing simple
dialog-based user experiences.

- ActionForms contain a list of buttons with captions and images that
  can be used for presenting a set of options to a player.
- MessageForms are simple two-button message experiences that are
  functional for Yes/No or OK/Cancel questions.
- ModalForms allow for a more flexible \"questionnaire-style\" list of
  controls that can be used to take input.

These APIs are expressed as \"builder style\" to allow you to create
quick forms in code. For example, this code creates an action button
form:
```js
const form = new ActionFormData()
                .title("Months")
                .body("Choose your favorite month!")
                .button("January")
                .button("February")
                .button("March")
                .button("April")
                .button("May");

form.show(players[0]).then((response) => {
  if (response.selection === 3) {
    dimension.runCommand("say I like April too!");
  }
});
```
NOTE: A dependency reference to this module must be declared within the
`manifest.json` file of your behavior pack. The module identifier UUID
is `2BD50A27-AB5F-4F40-A596-3641627C635E`.

For example:
```json
 "dependencies": [
      {
        "uuid": "b26a4d4c-afdf-4690-88f8-931846312678",
        "version": [ 0, 1, 0 ]
      },
      {
        "uuid": "6f4b6893-1bb6-42fd-b458-7fa3d0c89616",
        "version": [ 0, 1, 0 ]
      },
      {
        "uuid": "2BD50A27-AB5F-4F40-A596-3641627C635E",
        "version": [ 0, 1, 0 ]
      }
    ]
```

Classes
-------

- [ActionFormData](./wiki/mojang-minecraft-ui/ActionFormData.md)
- [ActionFormResponse](./wiki/mojang-minecraft-ui/ActionFormResponse.md)
- [FormResponse](./wiki/mojang-minecraft-ui/FormResponse.md)
- [MessageFormData](./wiki/mojang-minecraft-ui/MessageFormData.md)
- [MessageFormResponse](./wiki/mojang-minecraft-ui/MessageFormResponse.md)
- [ModalFormData](./wiki/mojang-minecraft-ui/ModalFormData.md)
- [ModalFormResponse](./wiki/mojang-minecraft-ui/ModalFormResponse.md)
