migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("po58c5xgx3mlv6z");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "po58c5xgx3mlv6z",
    "created": "2023-01-30 19:24:19.296Z",
    "updated": "2023-01-30 19:24:19.296Z",
    "name": "nljj",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "mvqcnu3s",
        "name": "field",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false
        }
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
})
