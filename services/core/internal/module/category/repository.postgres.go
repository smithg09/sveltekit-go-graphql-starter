package category

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/google/uuid"
	"github.com/gosimple/slug"
	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
	categoryQuerier "github.com/smithg09/core/internal/module/category/category-querier"
)

var ErrCategoryNotFound = fmt.Errorf("category is not found")

type postgresCategoryRepository struct {
	querier categoryQuerier.Querier
	logger  zerolog.Logger
}

func NewPostgresCategoryRepository(querier categoryQuerier.Querier) *postgresCategoryRepository {
	return &postgresCategoryRepository{
		querier: querier,
		logger: log.
			With().
			Str("module", "category").
			Str("provider", "repository").
			Logger(),
	}
}

func (r *postgresCategoryRepository) CreateOne(ctx context.Context, data CreateDto) (*Category, error) {
	s := data.Name
	if data.Slug != nil {
		s = *data.Slug
	}
	s = slug.Make(s)
	params := categoryQuerier.CreateOneParams{
		Name:   data.Name,
		Slug:   s,
		Status: string(data.Status),
	}
	qm, err := r.querier.CreateOne(ctx, params)
	if err != nil {
		r.logger.
			Error().
			Err(err).
			Str("method", "CreateOne").
			Str("category", "call querier.CreateOne").
			Send()
		return nil, err
	}
	return r.buildModelFromQuerier(qm)
}

func (r *postgresCategoryRepository) GetOneById(ctx context.Context, id uuid.UUID) (*Category, error) {
	model, err := r.querier.GetOneById(ctx, id)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return nil, ErrCategoryNotFound
		}
		r.logger.
			Error().
			Err(err).
			Str("method", "getOneById").
			Str("event", fmt.Sprintf("failed to get category: %v", err)).
			Send()
		return nil, err
	}
	return r.buildModelFromQuerier(model)
}

func (r *postgresCategoryRepository) GetMany(ctx context.Context, where *WhereDto) ([]Category, error) {
	querierParams := categoryQuerier.GetManyParams{}
	if where != nil {
		if where.Name != nil {
			if where.Name.Eq != nil {
				querierParams.NameEq = sql.NullString{Valid: true, String: *where.Name.Eq}
			}
			if where.Name.Regex != nil {
				querierParams.NameRegex = sql.NullString{Valid: true, String: *where.Name.Regex}
			}
		}
		if where.Slug != nil {
			if where.Slug.Eq != nil {
				querierParams.SlugEq = sql.NullString{Valid: true, String: *where.Slug.Eq}
			}
			if where.Slug.Regex != nil {
				querierParams.SlugRegex = sql.NullString{Valid: true, String: *where.Slug.Regex}
			}
		}
		if where.Status != nil {
			status := string(*where.Status)
			querierParams.Status = sql.NullString{String: status, Valid: true}
		}
		orderBy := "created_at"
		sortOrder := "desc"
		if where.Sort != nil {
			orderBy = where.Sort.SortBy
			if where.Sort.SortOrder != nil {
				sortOrder = string(*where.Sort.SortOrder)
			}
		}
		querierParams.SortQuery = sql.NullString{Valid: true, String: fmt.Sprintf("%s__%s", orderBy, sortOrder)}
		if where.Pagination != nil {
			querierParams.Limit = sql.NullInt32{Valid: true, Int32: int32(where.Pagination.Limit)}
			querierParams.Offset = sql.NullInt32{Valid: true, Int32: int32(where.Pagination.Skip)}
		}
	}
	models, err := r.querier.GetMany(ctx, querierParams)
	if err != nil {
		r.logger.
			Error().
			Err(err).
			Str("method", "GetMany").
			Str("category", "call querier.GetMany").
			Send()
		return nil, err
	}
	items := make([]Category, len(models))
	for i, model := range models {
		qi, _ := r.buildModelFromQuerier(model)
		items[i] = *qi
	}
	return items, err
}

func (r *postgresCategoryRepository) GetManyByIds(ctx context.Context, ids []uuid.UUID) ([]*Category, error) {
	models, err := r.querier.GetManyByIds(ctx, ids)
	if err != nil {
		r.logger.
			Error().
			Err(err).
			Str("method", "GetManyByIds").
			Str("category", "call querier.GetManyByIds").
			Send()
		return nil, err
	}
	items := make([]*Category, len(models))
	for i, model := range models {
		qi, _ := r.buildModelFromQuerier(model)
		items[i] = qi
	}
	return items, err
}

func (r *postgresCategoryRepository) UpdateOneById(ctx context.Context, id uuid.UUID, data UpdateDto) (*Category, error) {
	params := categoryQuerier.UpdateOneByIdParams{}
	params.ID = id
	if data.Name != nil {
		params.Name = sql.NullString{Valid: true, String: *data.Name}
	}
	if data.Slug != nil {
		params.Slug = sql.NullString{Valid: true, String: *data.Slug}
	}
	if data.Status != nil {
		params.Status = sql.NullString{Valid: true, String: string(*data.Status)}
	}
	qData, err := r.querier.UpdateOneById(ctx, params)
	if err != nil {
		r.logger.
			Error().
			Err(err).
			Str("method", "UpdateOneById").
			Str("category", "call querier.UpdateOneById").
			Send()
		return nil, err
	}
	return r.buildModelFromQuerier(qData)
}

func (r *postgresCategoryRepository) DeleteOne(ctx context.Context, id uuid.UUID) error {
	return r.querier.DeleteOne(ctx, id)
}

func (r *postgresCategoryRepository) buildModelFromQuerier(qm categoryQuerier.Category) (*Category, error) {
	return &Category{
		Id:        qm.ID,
		Name:      qm.Name,
		Slug:      qm.Slug,
		Status:    CategoryStatus(qm.Status),
		CreatedAt: qm.CreatedAt.Time,
		UpdatedAt: qm.UpdatedAt.Time,
	}, nil
}
