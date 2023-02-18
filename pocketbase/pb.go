package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"

	goaway "github.com/TwiN/go-away"
	"github.com/labstack/echo/v5"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"

	"encoding/json"
	"io/ioutil"
)

// UTILS

func contains(s []string, str string) bool {
	for _, v := range s {
		if v == str {
			return true
		}
	}

	return false
}

// MAIN
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

	// new POST route at /api/quizzable/sets/ that creates a new set. check if the title or description contains profanity using goaway.isProfane("string")
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPost,
			Path:   "/api/quizzable/sets",
			Handler: func(c echo.Context) error {
				// Check if the user can edit the set
				authData := c.Get(apis.ContextAuthRecordKey).(*models.Record)

				// Find the set collection
				setCollection, err := app.Dao().FindCollectionByNameOrId("sets")
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An error occurred while trying to get the specified content.",
						"data": map[string]interface{}{},
					})
				}

				// Create a new record
				set := models.NewRecord(setCollection)

				set.Set("author", authData.Get("id"))
				set.Set("visibility", "public")
				set.Set("title", "(draft)")
				set.Set("published", false)
				set.Set("termLanguage", "english")
				set.Set("definitionLanguage", "english")

				// Get the body data
				body, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the body data
				bodyMap := map[string]interface{}{}
				if err := json.Unmarshal(body, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Set published to the value of the "published" key in the body data
				published, ok := bodyMap["published"].(bool)
				if ok {
					set.Set("published", published)
				}

				// Check if the title is valid
				title, ok := bodyMap["title"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title is invalid.",
						"data": map[string]interface{}{},
					})
				}

				if goaway.IsProfane(title) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the description is valid
				description, ok := bodyMap["description"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The description is invalid.",
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

				// Check if the visibility is valid
				visibility, ok := bodyMap["visibility"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility is invalid.",
						"data": map[string]interface{}{},
					})
				}

				if visibility != "public" && visibility != "private" && visibility != "unlisted" {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility is invalid. It must be either public, private, or unlisted.",
						"data": map[string]interface{}{},
					})
				}

				// Loop over each card in expand.cards and check if it is valid. If the card has no ID, create a new card and add it to the set's cards array
				// Create new map from expand object of bodyMap, which is currently marshalled as a string
				expand, ok := bodyMap["expand"].(map[string]interface{})
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid. Invalid expand data.",
						"data": map[string]interface{}{},
					})
				}


				// Create a list of card from the marshalled string of expand.cards
				cards, ok := expand["cards"].([]interface{})

				// Reset the cards array
				set.Set("cards", []string{})

				cardIds := []string{}

				// Loop over each card in expand.cards and check if it is valid. If the card has no ID, create a new card and add it to the set's cards array
				for _, card := range cards {
					// Check if the term is valid
					cardData, ok := card.(map[string]interface{})
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data.",
							"data": map[string]interface{}{},
						})
					}

					// Check that the "set" field is valid, which must be the same as the ID of the set
					cardSetId, ok := cardData["set"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data, a child card of this set does not have a valid set field.",
							"data": map[string]interface{}{},
						})
					}

					// If the set Id is not the same as the set's ID, and its not unset (meaning its a new card), return an error
					if cardSetId != set.Get("id").(string) && cardSetId != "" {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data, a child card of this set does not have a valid parent set field.",
							"data": map[string]interface{}{},
						})
					}

					// Check the term and definition for profanity
					// Term
					term, ok := cardData["term"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data.",
							"data": map[string]interface{}{},
						})
					}

					if goaway.IsProfane(term) {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. A card term contains profanity, for card with term " + term + ".",
							"data": map[string]interface{}{},
						})
					}

					// Definition
					definition, ok := cardData["definition"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data for card with term " + term + ".",
							"data": map[string]interface{}{},
						})
					}

					if goaway.IsProfane(definition) {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. A card definition contains profanity, for card with definition " + definition + ".",
							"data": map[string]interface{}{},
						})
					}

					// If the card has no ID (empty string), create a new card and add it to the set's cards array
					// Otherwise, update the card with the new data
					cardId, ok := cardData["id"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data. for card with term " + term + " and definition " + definition + ".",
							"data": map[string]interface{}{},
						})
					}

					if cardId == "" {

						cardCollection, err := app.Dao().FindCollectionByNameOrId("cards")
						if err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not find card collection.",
								"data": map[string]interface{}{},
							})
						}

						record := models.NewRecord(cardCollection)
						record.Set("term", term)
						record.Set("definition", definition)
						record.Set("set", set.Get("id").(string))

						// Save the card
						if err := app.Dao().SaveRecord(record); err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not create card with term " + term + " and definition " + definition + ".",
								"data": map[string]interface{}{},
							})
						}

						// Add the card's ID to the set's cards array
						cardIds = append(cardIds, record.Get("id").(string))

						fmt.Println("Created new card with ID " + record.Get("id").(string))
						fmt.Println("Term: " + term)
						fmt.Println("Definition: " + definition)
						fmt.Println("Set: " + set.Get("id").(string))
					} else {
						record, err := app.Dao().FindRecordById("cards", cardId)
						if err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not find card with ID " + cardId,
								"data": map[string]interface{}{},
							})
						}

						record.Set("term", term)
						record.Set("definition", definition)
						record.Set("set", set.Get("id").(string))

						// Update the card
						if err := app.Dao().SaveRecord(record); err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not update card with ID " + cardId,
								"data": map[string]interface{}{},
							})
						}

						// Add the card's ID to the set's cards array
						cardIds = append(cardIds, record.Get("id").(string))

						fmt.Println("Updated card with ID " + record.Get("id").(string))
						fmt.Println("Term: " + term)
						fmt.Println("Definition: " + definition)
						fmt.Println("Set: " + set.Get("id").(string))
					}
					fmt.Println(cardIds)
				}
				fmt.Println("Done with cards")

				set.Set("title", title)
				set.Set("description", description)
				set.Set("cards", cardIds)

				// Save the set
				if err := app.Dao().SaveRecord(set); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An internal server error occurred. Could not save set with ID " + set.Get("id").(string),
						"data": map[string]interface{}{},
					})
				}

				// Return the set
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "Successfully updated set with ID " + set.Get("id").(string),
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

	// new PUT route at /api/quizzable/sets/:setId that updates the set with the provided data
	// Data will contain { title, description, visibility, author, cards }
	// When updating the set, the cards must be looped through and updated individually, as well as checked for profanity
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodPut,
			Path:   "/api/quizzable/sets/:setId",
			Handler: func(c echo.Context) error {
				// Check if the user can edit the set
				authData := c.Get(apis.ContextAuthRecordKey).(*models.Record)

				// Find the set with the given ID
				set, err := app.Dao().FindRecordById("sets", c.PathParam("setId"))
				if err != nil {
					return c.JSON(http.StatusNotFound, map[string]interface{}{
						"code": http.StatusNotFound,
						"message": "The set was not found.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the user is the author of the set
				if set.Get("author").(string) != authData.Id {
					return c.JSON(http.StatusForbidden, map[string]interface{}{
						"code": http.StatusForbidden,
						"message": "You are not the author of this set.",
						"data": map[string]interface{}{},
					})
				}

				// Get the body data
				body, err := ioutil.ReadAll(c.Request().Body)
				if err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Unmarshal the body data
				bodyMap := map[string]interface{}{}
				if err := json.Unmarshal(body, &bodyMap); err != nil {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid.",
						"data": map[string]interface{}{},
					})
				}


				// Check if the title is valid
				title, ok := bodyMap["title"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title is invalid.",
						"data": map[string]interface{}{},
					})
				}

				if goaway.IsProfane(title) {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The title contains profanity.",
						"data": map[string]interface{}{},
					})
				}

				// Check if the description is valid
				description, ok := bodyMap["description"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The description is invalid.",
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

				// Check if the visibility is valid
				visibility, ok := bodyMap["visibility"].(string)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility is invalid.",
						"data": map[string]interface{}{},
					})
				}

				// Set published to the value of the "published" key in the body data
				// If the set is published, it cannot be unpublished
				published, ok := bodyMap["published"].(bool)
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The published value is invalid.",
						"data": map[string]interface{}{},
					})
				}

				if published && !set.Get("published").(bool) {
					// Check if the title length is greater than 0
					if len(title) == 0 {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "Cannot publish a set with an empty title.",
							"data": map[string]interface{}{},
						})
					}

					// If the set is valid to be published, set the published value to true
					set.Set("published", true)
				}

				if visibility != "public" && visibility != "private" && visibility != "unlisted" {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The visibility is invalid. It must be either public, private, or unlisted.",
						"data": map[string]interface{}{},
					})
				}

				// Loop over each card in expand.cards and check if it is valid. If the card has no ID, create a new card and add it to the set's cards array
				// Create new map from expand object of bodyMap, which is currently marshalled as a string
				expand, ok := bodyMap["expand"].(map[string]interface{})
				if !ok {
					return c.JSON(http.StatusBadRequest, map[string]interface{}{
						"code": http.StatusBadRequest,
						"message": "The request body is invalid. Invalid expand data.",
						"data": map[string]interface{}{},
					})
				}


				// Create a list of card from the marshalled string of expand.cards
				cards, ok := expand["cards"].([]interface{})

				// Reset the cards array
				set.Set("cards", []string{})

				cardIds := []string{}

				// Loop over each card in expand.cards and check if it is valid. If the card has no ID, create a new card and add it to the set's cards array
				for i, card := range cards {
					// Get the card data
					cardData, ok := card.(map[string]interface{})
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data.",
							"data": map[string]interface{}{},
						})
					}

					// Check that the "set" field is valid, which must be the same as the ID of the set
					cardSetId, ok := cardData["set"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data, a child card of this set does not have a valid set field.",
							"data": map[string]interface{}{},
						})
					}

					// If the card has no ID (empty string), create a new card and add it to the set's cards array
					// Otherwise, update the card with the new data
					cardId, ok := cardData["id"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card ID for card " + strconv.Itoa(i) + ".",
							"data": map[string]interface{}{},
						})
					}

					// If the card is already added to the cardIds array, skip it
					if contains(cardIds, cardId) {
						continue
					}

					// Check if the user is deleting the card. "isDeleted" is a custom field that is not part of the card schema
					isDeleted, ok := cardData["isDeleted"].(bool)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data, a child card of this set does not have a valid isDeleted field.",
							"data": map[string]interface{}{},
						})
					}

					// If the card is deleted, skip it
					if isDeleted {
						// Get from the database and delete it
						card, err := app.Dao().FindRecordById("cards", cardId)
						if err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An error occurred while deleting a card with ID " + cardId + ".",
								"data": map[string]interface{}{},
							})
						}

						// Delete the card
						err = app.Dao().DeleteRecord(card)
						// End this loop iteration, because we don't want to add this card to the set's cards array
						fmt.Println("Deleted card with ID " + cardId)
						continue
					}

					// If the set Id is not the same as the set's ID, and its not unset (meaning its a new card), return an error
					if cardSetId != set.Get("id").(string) && cardSetId != "" {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data, a child card of this set does not have a valid parent set field.",
							"data": map[string]interface{}{},
						})
					}

					// Check the term and definition for profanity
					// Term
					term, ok := cardData["term"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data.",
							"data": map[string]interface{}{},
						})
					}

					if goaway.IsProfane(term) {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. A card term contains profanity, for card with term " + term + ".",
							"data": map[string]interface{}{},
						})
					}

					// Definition
					definition, ok := cardData["definition"].(string)
					if !ok {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. Invalid card data for card with term " + term + ".",
							"data": map[string]interface{}{},
						})
					}

					if goaway.IsProfane(definition) {
						return c.JSON(http.StatusBadRequest, map[string]interface{}{
							"code": http.StatusBadRequest,
							"message": "The request body is invalid. A card definition contains profanity, for card with definition " + definition + ".",
							"data": map[string]interface{}{},
						})
					}

					if cardId == "" {

						cardCollection, err := app.Dao().FindCollectionByNameOrId("cards")
						if err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not find card collection.",
								"data": map[string]interface{}{},
							})
						}

						record := models.NewRecord(cardCollection)
						record.Set("term", term)
						record.Set("definition", definition)
						record.Set("set", set.Get("id").(string))

						// Save the card
						if err := app.Dao().SaveRecord(record); err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not create card with term " + term + " and definition " + definition + ".",
								"data": map[string]interface{}{},
							})
						}

						// Add the card's ID to the set's cards array
						cardIds = append(cardIds, record.Get("id").(string))

						fmt.Println("Created new card with ID " + record.Get("id").(string))
						fmt.Println("Term: " + term)
						fmt.Println("Definition: " + definition)
						fmt.Println("Set: " + set.Get("id").(string))
					} else {
						record, err := app.Dao().FindRecordById("cards", cardId)
						if err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not find card with ID " + cardId,
								"data": map[string]interface{}{},
							})
						}

						record.Set("term", term)
						record.Set("definition", definition)
						record.Set("set", set.Get("id").(string))

						// Update the card
						if err := app.Dao().SaveRecord(record); err != nil {
							return c.JSON(http.StatusInternalServerError, map[string]interface{}{
								"code": http.StatusInternalServerError,
								"message": "An internal server error occurred. Could not update card with ID " + cardId,
								"data": map[string]interface{}{},
							})
						}

						// Add the card's ID to the set's cards array
						cardIds = append(cardIds, record.Get("id").(string))

						fmt.Println("Updated card with ID " + record.Get("id").(string))
						fmt.Println("Term: " + term)
						fmt.Println("Definition: " + definition)
						fmt.Println("Set: " + set.Get("id").(string))
					}
					fmt.Println(cardIds)
				}
				fmt.Println("Done with cards")

				set.Set("title", title)
				set.Set("description", description)
				set.Set("cards", cardIds)

				// Save the set
				if err := app.Dao().SaveRecord(set); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An internal server error occurred. Could not save set with ID " + set.Get("id").(string),
						"data": map[string]interface{}{},
					})
				}

				// Return the set
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "Successfully updated set with ID " + set.Get("id").(string),
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

	// new DELETE /api/quizzable/sets/:id
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: "DELETE",
			Path: "/api/quizzable/sets/:setId",
			Handler: func(c echo.Context) error {
				// Get the set ID
				setId := c.PathParam("setId")

				// Find the set
				set, err := app.Dao().FindRecordById("sets", setId)
				if err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An internal server error occurred. Could not find set with ID " + setId,
						"data": map[string]interface{}{},
					})
				}

				// Make sure the user is authorized to delete the set
				authData := c.Get(apis.ContextAuthRecordKey).(*models.Record)

				if authData.Id != set.Get("owner").(string) {
					return c.JSON(http.StatusUnauthorized, map[string]interface{}{
						"code": http.StatusUnauthorized,
						"message": "You are not authorized to delete this set.",
						"data": map[string]interface{}{},
					})
				}

				// Delete the set
				if err := app.Dao().DeleteRecord(set); err != nil {
					return c.JSON(http.StatusInternalServerError, map[string]interface{}{
						"code": http.StatusInternalServerError,
						"message": "An internal server error occurred. Could not delete set with ID " + setId,
						"data": map[string]interface{}{},
					})
				}

				// Return the set
				return c.JSON(http.StatusOK, map[string]interface{}{
					"code": http.StatusOK,
					"message": "Successfully deleted set with ID " + setId,
					"data": map[string]interface{}{},
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