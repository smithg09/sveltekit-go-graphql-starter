package category

import (
	db "github.com/smithg09/core/internal/actor/db/sql"
	categoryQuerier "github.com/smithg09/core/internal/module/category/category-querier"
)

type categoryModule struct {
	service CategoryService
}

func NewCategoryModule(db db.DB) *categoryModule {
	querier := categoryQuerier.New(db.GetDB())
	repository := NewPostgresCategoryRepository(querier)
	loader := NewCategoryDataloader(repository)
	service := NewCategoryService(repository, loader)
	return &categoryModule{
		service: service,
	}
}

func (m *categoryModule) GetService() CategoryService {
	return m.service
}
