migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("mx0328hefazh105");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "mx0328hefazh105",
    "created": "2023-01-30 19:43:54.696Z",
    "updated": "2023-01-30 19:43:54.696Z",
    "name": "test",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "5g6wdv6y",
        "name": "options",
        "type": "select",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "option1",
            "option2",
            "option3"
          ]
        }
      },
      {
        "system": false,
        "id": "gknijjql",
        "name": "relations",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 3,
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
