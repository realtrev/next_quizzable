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

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}