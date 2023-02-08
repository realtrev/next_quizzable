migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xgo8ztj7tb6mjd3")

  collection.viewRule = "user.id = @request.auth.id"
  collection.createRule = "(\n  @request.data.flashcardsKnown.set.id = parentSet.id\n  ||\n  @request.data.flashcardsKnown:length = 0\n)\n&&\n(\n  @request.data.flashcardsUnknown.set.id = parentSet.id\n  ||\n  @request.data.flashcardsKnown:length = 0\n)"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("xgo8ztj7tb6mjd3")

  collection.viewRule = null
  collection.createRule = null

  return dao.saveCollection(collection)
})
