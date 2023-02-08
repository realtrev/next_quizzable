migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.viewRule = ""

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("98dvnfcmjgu8ht4")

  collection.viewRule = null

  return dao.saveCollection(collection)
})
