migrate((db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("tuhh8uszczpb6z2");

  return dao.deleteCollection(collection);
}, (db) => {
  const collection = new Collection({
    "id": "tuhh8uszczpb6z2",
    "created": "2023-01-26 21:41:08.585Z",
    "updated": "2023-01-26 21:41:08.585Z",
    "name": "sets",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "trlpfzs4",
        "name": "title",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": 50,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "up4y3c9g",
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
        "id": "ajdpeuj8",
        "name": "reviews",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "wjelqwqf",
        "name": "content",
        "type": "json",
        "required": false,
        "unique": false,
        "options": {}
      },
      {
        "system": false,
        "id": "bhhsi1lb",
        "name": "owner",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": true
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
