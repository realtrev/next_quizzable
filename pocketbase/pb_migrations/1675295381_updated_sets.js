migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.viewRule = "(visibility = \"public\" && published = true)\n||\n(visibility = \"unlisted\" && published = true)\n||\n(visibility = \"private\" && author = @request.auth.id)"
  collection.updateRule = "author = @request.auth.id\n&&\n(\n(published = true && @request.data.published != false)\n  ||\n(published = false && @request.data.published = true)\n  ||\n(@request.data.published:isset = false)\n)\n&& @request.data.card.parent = id"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bwe6kex0ulql710")

  collection.viewRule = null
  collection.updateRule = null

  return dao.saveCollection(collection)
})
