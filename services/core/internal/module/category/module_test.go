package category_test

import (
	"testing"

	"github.com/smithg09/core/internal/module/category"
	"github.com/smithg09/core/mocks"
	"github.com/stretchr/testify/assert"
)

type moduleFixture struct {
	mocks struct {
		db    *mocks.DB
		sqlDb *mocks.SqlDB
	}
}

func newModuleFixture(t *testing.T) *moduleFixture {
	f := &moduleFixture{}
	f.mocks.db = mocks.NewDB(t)
	f.mocks.sqlDb = mocks.NewSqlDB(t)
	return f
}

func TestModule(t *testing.T) {
	f := newModuleFixture(t)
	f.mocks.db.EXPECT().GetDB().Return(f.mocks.sqlDb)
	categoryModule := category.NewCategoryModule(f.mocks.db)
	categoryService := categoryModule.GetService()
	assert.Implements(t, (*category.CategoryService)(nil), categoryService)
}
