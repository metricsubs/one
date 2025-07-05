# Modal

## Run modal within Poetry managed env

```
poetry run modal
```


## Run local entrypoint

```
poetry run modal run metricsubs_modal.main
```

## Deploy to Modal

Deploy to staging

```
poetry run modal deploy metricsubs_modal.main --env staging
```

Deploy to prod

```
poetry run modal deploy metricsubs_modal.main --env main
```
