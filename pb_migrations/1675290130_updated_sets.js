migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "frroxczm",
    "name": "visibility",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "public",
        "private",
        "unlisted"
      ]
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  // remove
  collection.schema.removeField("frroxczm")

  return dao.saveCollection(collection)
})
