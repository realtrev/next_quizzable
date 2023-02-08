package main

import (
	"log"
    "net/http"

    "github.com/labstack/echo/v5"
    "github.com/pocketbase/pocketbase"
    "github.com/pocketbase/pocketbase/apis"
    "github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/models"
)

func main() {
	app := pocketbase.New()

	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.AddRoute(echo.Route{
			Method: http.MethodGet,
			Path:   "/api/hello",
			Handler: func(c echo.Context) error {
				return c.String(http.StatusOK, "Hello world!")
			},
			Middlewares: []echo.MiddlewareFunc{
				apis.ActivityLogger(app),
				// apis.RequireAdminAuth(),
			},
		})

		return nil
	})

	// create a new route at /api/auth/user that returns the current user info
	app.OnBeforeServe().Add(func(e *core.ServeEvent) error {
		e.Router.GET("/api/auth/user", func(c echo.Context) error {
			authRecord, _ := c.Get(apis.ContextAuthRecordKey).(*models.Record)
			if authRecord == nil {
				return apis.NewForbiddenError("Only auth records can access this endpoint", nil)
			}

			return c.JSON(http.StatusOK, authRecord)
		})

		return nil
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}