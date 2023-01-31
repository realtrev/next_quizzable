migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "728kocbc",
    "name": "favoriteSets",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": 25,
      "collectionId": "bwe6kex0ulql710",
      "cascadeDelete": false
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5mb6d6z3",
    "name": "sets",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "bwe6kex0ulql710",
      "cascadeDelete": false
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("_pb_users_auth_")

  // remove
  collection.schema.removeField("728kocbc")

  // remove
  collection.schema.removeField("5mb6d6z3")

  return dao.saveCollection(collection)
})
