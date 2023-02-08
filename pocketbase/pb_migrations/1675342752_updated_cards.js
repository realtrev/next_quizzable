migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = "set.author = @request.auth.id || (set.published = true && set.visibility = \"public\")"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.listRule = null

  return dao.saveCollection(collection)
})
