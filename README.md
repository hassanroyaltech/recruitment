# Elevatus React App

### How do I get set up?

```
# Copy env file
cp example.env.staging .env

# Build image
docker-compose build

# Run container
docker-compose up
```

### Directory Structure

```
src/
  api/*
  assets/*
  components/
    modals/*
    footers/*
    headers/*
    navbars/*
    cards/*
  pages/
    evarec/*
    evassess/*
    evabrand/*
    ...
  store/* (redux)
  utils/ (useful functions and constants
    functions/*
    constants/*
```
