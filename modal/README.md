# Modal

## Run modal within Poetry managed env

```
poetry run modal
```

## First time env creation

```
poetry run modal environment create staging
```

## Dev & deployment

### Run local entrypoint

```
poetry run modal run metricsubs_modal.main
```

### Deploy to Modal

Deploy to staging

```
poetry run modal deploy metricsubs_modal.main --env staging
```

Deploy to prod

```
poetry run modal deploy metricsubs_modal.main --env main
```

## Volume management

```
poetry run modal volume ls metricsubs-data --env staging /youtube/
```
