migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.createRule = "@request.auth.id != \"\" && @request.data.author = @request.auth.id"
  collection.deleteRule = "@request.auth.id != \"\" && author = @request.auth.id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.createRule = null
  collection.deleteRule = null

  return dao.saveCollection(collection)
})
