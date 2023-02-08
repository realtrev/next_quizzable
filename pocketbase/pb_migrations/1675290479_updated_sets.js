migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.listRule = "(visibility = \"public\") || (author = @request.auth.id)"
  collection.viewRule = "(visibility = \"public\") || (visibility = \"unlisted\") || (visibility = \"private\" && author = @request.auth.id)"
  collection.updateRule = "author = @request.auth.id"
  collection.deleteRule = "author = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.listRule = null
  collection.viewRule = null
  collection.updateRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
