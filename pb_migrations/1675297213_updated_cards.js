migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3ji1ccv1",
    "name": "term",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dbjdkd0j",
    "name": "definition",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "3ji1ccv1",
    "name": "term",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "dbjdkd0j",
    "name": "definition",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
