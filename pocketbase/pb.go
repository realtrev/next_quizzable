package main

import (
	"fmt"
	"log"
    "net/http"

    "github.com/labstack/echo/v5"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
	"github.com/TwiN/go-away"

	"encoding/json"
	"io/ioutil"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/quizzable/hello",
			Handler: func(c echo.Context) error {
				return c.String(http.StatusOK, "Hello world!")
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})

	// create a new route at /api/auth/user that returns the current user info
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.PUT("/api/quizzable/auth/user", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				// respond with 401 Unauthorized
				return c.JSON(http.StatusUnauthorized, map[string]interface{}{
					"code": http.StatusUnauthorized,
					"message": "You are not allowed to perform this request.",
					"data": map[string]interface{}{},
				})
			}

			return c.JSON(http.StatusOK, authRecord)
		})

		return nil
	})

	// Create a new route at /api/sets/:set/visibility that updates the visibility of a set.
	// Allowed values are "public" and "private" and "unlisted"
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPut,
			Path:   "/api/quizzable/sets/:setId/visibility",
			Handler: func(c echo.Context) error {
				record, err := app.Dao().FindRecordById("sets", c.PathParam("setId"))
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to get the specified content.",
						"data": map[string]interface{}{},
					})
				}

				if record == nil {
					return c.JSON(http.StatusNotFound, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The specified content was not found.",
						"data": map[string]interface{}{},
					})
				}

				// check if the user is allowed to update the record
				authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
				// if the user is not authenticated or the user is not the owner of the record, return 401 Unauthorized
				// if the authRecord.Id is equal to the author key of the record, then the user is allowed to update the record
				fmt.Println(authRecord)
				fmt.Println(record)
				if authRecord == nil || authRecord.Get("id") != record.Get("author") {
					return c.JSON(http.StatusUnauthorized, map[string]interface{}{
						"code": http.StatusUnauthorized,
						"message": "You are not allowed to perform this request.",
						"data": map[string]interface{}{},
					})
				}

				// Create a map to store the request body data
				bodyMap := map[string]interface{}{}

				// Read the request body
				b, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the request body into the map
				if err := json.Unmarshal(b, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "visibility" key data from the map
				visibility, ok := bodyMap["visibility"].(string)
				if !ok || (visibility != "public" && visibility != "private" && visibility != "unlisted") {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility value is invalid. Allowed values are \"public\", \"private\" and \"unlisted\".",
						"data": map[string]interface{}{},
					})
				}

				// Update the visibility of the record
				record.Set("visibility", visibility)

				// Save the record
				if err := app.Dao().SaveRecord(record); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to update the visibility of the specified set.",
						"data": map[string]interface{}{},
					})
				}

				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "The visibility of the specified set was updated successfully.",
					"data": record,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})

	// new POST route at /api/quizzable/sets/ that creates a new set. check if the title or description contains profanity using goaway.isProfane("string")
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/quizzable/sets",
			Handler: func(c echo.Context) error {
				// Create a map to store the request body data
				// incoming data structure is { "title": "string", "description": "string", "visibility": "string", "author": "string" }
				// author is required, all other fields are optional

				bodyMap := map[string]interface{}{}

				// Read the request body
				b, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the request body into the map
				if err := json.Unmarshal(b, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "author" key data from the map
				title, ok := bodyMap["author"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The author value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "title" key data from the map
				title, ok = bodyMap["title"].(string)
				if !ok {
					title = ""
				}

				// Get the "description" key data from the map
				description, ok := bodyMap["description"].(string)
				if !ok {
					description = ""
				}

				// If no visibility is specified, set it to "public", if it is specified, check if it is valid
				visibility, ok := bodyMap["visibility"].(string)
				// if visibility is undefined, set it to "public"
				if !ok {
					visibility = "public"
				} else {
					// if visibility is defined, check if it is valid
					if visibility != "public" && visibility != "private" && visibility != "unlisted" {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The visibility value is invalid. Allowed values are \"public\", \"private\" and \"unlisted\".",
							"data": map[string]interface{}{},
						})
					}
				}

				// check for profanity in title and description
				if goaway.IsProfane(title) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				if goaway.IsProfane(description) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The description contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// find "set" collection
				collection, err := app.Dao().FindCollectionByNameOrId("sets")
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the set.",
						"data": map[string]interface{}{},
					})
				}

				// Create a new record
				record := models.NewRecord(collection)
				record.Set("title", title)
				record.Set("description", description)
				record.Set("visibility", visibility)

				// Get the author from the request context
				author, ok := c.Get(apis.ContextAuthRecordKey).(*models.Record)
				if !ok {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the set. (author not found)",
						"data": map[string]interface{}{},
					})
				}

				record.Set("author", author.Id)

				// Save the record
				if err := app.Dao().SaveRecord(record); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the set.",
						"data": map[string]interface{}{},
					})
				}

				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "The set was created successfully.",
					"data": record,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})

	// new PUT route at /api/quizzable/sets/:setId that updates the set with the given ID
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPut,
			Path:   "/api/quizzable/sets/:setId",
			Handler: func(c echo.Context) error {
				// Check if the user can edit the set
				authData := c.Get(apis.ContextAuthRecordKey).(*models.Record)

				// Get the set from the database
				set, err := app.Dao().FindRecordById("sets", c.PathParam("setId"))
				if err != nil {
					return c.JSON(http.StatusNotFound, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The set was not found.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the user can edit the set
				if set.Get("author").(string) != authData.Id {
					return c.JSON(http.StatusForbidden, map[string]interface{}{
						"code": http.StatusForbidden,
						"message": "You do not have permission to edit this set.",
						"data": map[string]interface{}{},
					})
				}

				// Get the request body
				body, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the request body into the map
				bodyMap := map[string]interface{}{}
				if err := json.Unmarshal(body, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the title is valid, and not profane
				title := bodyMap["title"].(string)
				if goaway.IsProfane(title) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the description is valid, and not profane
				description := bodyMap["description"].(string)
				if goaway.IsProfane(description) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The description contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the visibility is valid
				visibility, ok := bodyMap["visibility"].(string)
				if ok && visibility != "public" && visibility != "private" {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility is invalid.",
						"data": map[string]interface{}{},
					})
				}

				if !ok {
					visibility = "public"
				}

				// Update the set
				set.Set("title", title)
				set.Set("description", description)
				set.Set("visibility", visibility)

				// Save the set
				if err := app.Dao().SaveRecord(set); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to update the set.",
						"data": map[string]interface{}{},
					})
				}

				// Return the set
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "The set was updated successfully.",
					"data": set,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})

	// Create a new POST route at /api/quizzable/sets/:setId/cards/ that creates a new card
	// The card should create a new record in the "cards" collection, and add the card's ID to the "cards" array in the set's record
	// The card should set the parentSet field to the set's ID
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/quizzable/sets/:setId/cards",
			Handler: func(c echo.Context) error {
				// find the set with the given ID
				set, err := app.Dao().FindRecordById("sets", c.PathParam("setId"))
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The set was not found.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the set is owned by the user
				// Get the author from the request context
				author, ok := c.Get(apis.ContextAuthRecordKey).(*models.Record)
				if !ok {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the card. (author not found)",
						"data": map[string]interface{}{},
					})
				}

				if set.Get("author").(string) != author.Id {
					return c.JSON(http.StatusForbidden, map[string]interface{}{
						"code": http.StatusForbidden,
						"message": "You do not have permission to create a card in this set.",
						"data": map[string]interface{}{},
					})
				}

				// Create a map to store the request body data
				// incoming data structure is { "term": "string", "definition": "string", image: <image> }

				bodyMap := map[string]interface{}{}

				// Read the request body
				b, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the request body into the map
				if err := json.Unmarshal(b, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "term" key data from the map
				term, ok := bodyMap["term"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The term value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "definition" key data from the map
				definition, ok := bodyMap["definition"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The definition value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// check for profanity in term and definition
				if goaway.IsProfane(term) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The term contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				if goaway.IsProfane(definition) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The definition contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// ignore the image for now


				cards, err := app.Dao().FindCollectionByNameOrId("cards")
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the card.",
						"data": map[string]interface{}{},
					})
				}

				// create a new record in the "cards" collection
				card := models.NewRecord(cards)
				card.Set("term", term)
				card.Set("definition", definition)
				card.Set("set", set.Id)

				// Save the record
				if err := app.Dao().SaveRecord(card); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "An error occurred while trying to create the card.",
						"data": map[string]interface{}{},
					})
				}

				// add the card's ID to the "cards" array in the set's record
				set.Set("cards", append(set.Get("cards").([]string), card.Id))

				// Save the record
				if err := app.Dao().SaveRecord(set); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to create the card.",
						"data": map[string]interface{}{},
					})
				}

				// Return the card's ID
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "The card was created successfully.",
					"data": card,
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})

	// Create a new PUT route to update a card
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPut,
			Path:   "/api/quizzable/sets/:setId/cards/:cardId",
			Handler: func(c echo.Context) error {
				// get authenticated user
				authData, ok := c.Get(apis.ContextAuthRecordKey).(*models.Record)
				if !ok {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "A problem occurred while trying to get the user.",
						"data": map[string]interface{}{},
					})
				}

				// find the set with the given ID
				set, err := app.Dao().FindRecordById("sets", c.PathParam("setId"))
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The set was not found.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the user is the author of the set
				if set.Get("author").(string) != authData.Id {
					return c.JSON(http.StatusUnauthorized, map[string]interface{}{
						"code": http.StatusUnauthorized,
						"message": "You are not authorized to update this card.",
						"data": map[string]interface{}{},
					})
				}

				// Get the request body
				b, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the request body into a map
				var bodyMap map[string]interface{}
				if err := json.Unmarshal(b, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "term" key data from the map
				term, ok := bodyMap["term"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The term value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Get the "definition" key data from the map
				definition, ok := bodyMap["definition"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The definition value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// ignore the image for now

				// find the card with the given ID
				card, err := app.Dao().FindRecordById("cards", c.PathParam("cardId"))
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The card was not found.",
						"data": map[string]interface{}{},
					})
				}

				// update the card's term and definition
				card.Set("term", term)
				card.Set("definition", definition)

				// Save the record
				if err := app.Dao().SaveRecord(card); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to update the card.",
						"data": map[string]interface{}{},
					})
				}

				// Return the card's ID
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "The card was updated successfully.",
					"data": map[string]interface{}{
						"card": card,
					},
				})
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				apis.RequireAdminOrRecordAuth(),
			},
		})

		return nil
	})


	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}