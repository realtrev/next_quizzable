migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = "parent.author.id = @request.auth.id"
  collection.viewRule = "@request.auth.id != \"\""
  collection.createRule = "parent.author.id = @request.auth.id"
  collection.updateRule = "parent.author.id = @request.auth.id"
  collection.deleteRule = "parent.author.id = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = null
  collection.viewRule = null
  collection.createRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
