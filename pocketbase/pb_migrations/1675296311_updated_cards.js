migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = null
  collection.viewRule = "set.author = @request.auth.id && set.visibility != \"private\""
  collection.createRule = "set.author.id = @request.auth.id"
  collection.updateRule = "set.author.id = @request.auth.id"
  collection.deleteRule = "set.author.id = @request.auth.id"

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "28apayop",
    "name": "set",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "bwe6kex0ulql710",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = "parent.author.id = @request.auth.id"
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "28apayop",
    "name": "parent",
    "type": "relation",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "collectionId": "bwe6kex0ulql710",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
})
