migrate((db) => {
  const collection = new Collection({
    "id": "bwe6kex0ulql710",
    "created": "2023-01-29 17:41:16.534Z",
    "updated": "2023-01-29 17:41:16.534Z",
    "name": "sets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "wozy6k77",
        "name": "author",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "qrcmty2k",
        "name": "title",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": 100,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "zmjqmedt",
        "name": "description",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": 200,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "qmgyqigb",
        "name": "content",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      }
    ],
    "listRule": "@request.auth.id != \"\" && author = @request.auth.id ",
    "viewRule": "@request.auth.id != \"\"",
    "createRule": "@request.auth.id != \"\"",
    "updateRule": "@request.auth.id != \"\" && author = @request.auth.id",
    "deleteRule": "@request.auth.id != \"\" && author = @request.auth.id",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710");

  return dao.deleteCollection(collection);
})
