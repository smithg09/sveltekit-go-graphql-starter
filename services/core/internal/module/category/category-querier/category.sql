-- name: CreateOne :one
INSERT INTO category (name, slug, status, created_at, updated_at)
VALUES ($1, $2, $3, NOW(), NOW())
RETURNING *;

-- name: GetOneById :one
SELECT * FROM category
WHERE id = $1;

-- name: GetMany :many
SELECT *
FROM category
WHERE
  (
    (sqlc.narg('name_eq')::text IS NOT NULL AND name = sqlc.narg('name_eq'))
    OR
    (sqlc.narg('name_regex')::text IS NOT NULL AND name ~* sqlc.narg('name_regex')::text)
    OR
    (sqlc.narg('name_eq')::text IS NULL AND sqlc.narg('name_regex') IS NULL)
  )
  AND
  (
    (sqlc.narg('slug_eq')::text IS NOT NULL AND slug = sqlc.narg('slug_eq'))
    OR
    (sqlc.narg('slug_regex')::text IS NOT NULL AND slug ~* sqlc.narg('slug_regex')::text)
    OR
    (sqlc.narg('slug_eq')::text IS NULL AND sqlc.narg('slug_regex') IS NULL)
  )
  AND
  (
    status = sqlc.narg('status') OR sqlc.narg('status') IS NULL
  )
ORDER BY
  CASE WHEN sqlc.narg('sort_query')::text = 'name__asc' THEN name END ASC,
  CASE WHEN sqlc.narg('sort_query')::text = 'name__desc' THEN name END DESC,
  CASE WHEN sqlc.narg('sort_query')::text = 'created_at__asc' THEN created_at END ASC,
  CASE WHEN sqlc.narg('sort_query')::text = 'created_at__desc' THEN created_at END DESC,
  CASE WHEN sqlc.narg('sort_query')::text = 'updated_at__asc' THEN updated_at END ASC,
  CASE WHEN sqlc.narg('sort_query')::text = 'updated_at__desc' THEN updated_at END DESC,
  CASE WHEN sqlc.narg('sort_query')::text = 'status__asc' THEN status END ASC,
  CASE WHEN sqlc.narg('sort_query')::text = 'status__desc' THEN status END DESC
LIMIT sqlc.narg('limit') OFFSET sqlc.narg('offset');

-- name: GetManyByIds :many
SELECT * FROM category
WHERE id = ANY($1::uuid[]);

-- name: UpdateOneById :one
UPDATE category SET
  name = coalesce(sqlc.narg(name), name),
  slug = coalesce(sqlc.narg(slug), slug),
  status = coalesce(sqlc.narg(status), status),
  updated_at = now()
WHERE id = sqlc.arg(id) RETURNING *;

-- name: DeleteOne :exec
DELETE FROM category
WHERE id = $1;
