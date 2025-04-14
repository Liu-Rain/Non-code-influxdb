docker compose \
    --file .docker/docker-compose.yaml \
    --project-directory	./ \
    --project-name influxdb-pg02 \
    --env-file .env/influxdb.dev.env \
    --env-file .env/grafana.dev.env \
    --env-file .env/server.dev.env \
    up \
    --build \
    --watch
