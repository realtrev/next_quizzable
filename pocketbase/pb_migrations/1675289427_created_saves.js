migrate((db) => {
  const collection = new Collection({
    "id": "xgo8ztj7tb6mjd3",
    "created": "2023-02-01 22:10:27.435Z",
    "updated": "2023-02-01 22:10:27.435Z",
    "name": "saves",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tavprv7n",
        "name": "user",
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
        "id": "nzqhe1l0",
        "name": "parentSet",
        "type": "relation",
        "required": true,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "collectionId": "bwe6kex0ulql710",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "wauzybp8",
        "name": "flashcardsKnown",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "98dvnfcmjgu8ht4",
          "cascadeDelete": false
        }
      },
      {
        "system": false,
        "id": "terkke1u",
        "name": "flashcardsUnknown",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "98dvnfcmjgu8ht4",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "iw2ahaqn",
        "name": "learnCardsKnown",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "98dvnfcmjgu8ht4",
          "cascadeDelete": true
        }
      },
      {
        "system": false,
        "id": "kgygmrvb",
        "name": "learnCardsUnknown",
        "type": "relation",
        "required": false,
        "unique": false,
        "options": {
          "maxSelect": null,
          "collectionId": "98dvnfcmjgu8ht4",
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
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("xgo8ztj7tb6mjd3");

  return dao.deleteCollection(collection);
})
