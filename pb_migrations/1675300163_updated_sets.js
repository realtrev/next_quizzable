migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.updateRule = "author = @request.auth.id\n&&\n(\n(published = true && @request.data.published = true)\n  ||\n(published = false)\n)\n&&\n(\n  @request.data.cards.set.id = id\n  ||\n  @request.data.cards:length = 0\n  ||\n  @request.data.cards:isset = false\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.updateRule = null

  return dao.saveCollection(collection)
})
