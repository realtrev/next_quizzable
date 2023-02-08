migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.listRule = "author = @request.auth.id || (visibility = \"public\" && published = true)"
  collection.viewRule = "(visibility = \"public\" && published = true) || (visibility = \"unlisted\" && published = true) || (visibility = \"private\" && author = @request.auth.id)"
  collection.createRule = "author = @request.auth.id"
  collection.updateRule = "author = @request.auth.id\n&&\n(\n(published = true && @request.data.published != false)\n  ||\n(published = false && @request.data.published = true)\n  ||\n(@request.data.published:isset = false)\n)"

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "li4m61zl",
    "name": "termLanguage",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "english",
        "español",
        "math",
        "deutsch",
        "français",
        "官話",
        "latina"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "0fjujdz9",
    "name": "definitionLanguage",
    "type": "select",
    "required": true,
    "unique": false,
    "options": {
      "maxSelect": 1,
      "values": [
        "english",
        "español",
        "math",
        "deutsch",
        "français",
        "官話",
        "latina"
      ]
    }
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qpr1k6mj",
    "name": "published",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "axvb5eyc",
    "name": "cards",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "maxSelect": null,
      "collectionId": "98dvnfcmjgu8ht4",
      "cascadeDelete": true
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null

  // remove
  collection.schema.removeField("li4m61zl")

  // remove
  collection.schema.removeField("0fjujdz9")

  // remove
  collection.schema.removeField("qpr1k6mj")

  // remove
  collection.schema.removeField("axvb5eyc")

  return dao.saveCollection(collection)
})
