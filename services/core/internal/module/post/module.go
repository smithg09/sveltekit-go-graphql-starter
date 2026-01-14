package post

import (
	db "github.com/smithg09/core/internal/actor/db/sql"
	postQuerier "github.com/smithg09/core/internal/module/post/post-querier"
)

type postModule struct {
	service PostService
}

func NewPostModule(db db.DB) *postModule {
	querier := postQuerier.New(db.GetDB())
	repository := NewPostgresPostRepository(querier)
	loader := NewPostDataloader(repository)
	service := NewPostService(repository, loader)
	return &postModule{
		service: service,
	}
}

func (m *postModule) GetService() PostService {
	return m.service
}
