## Setup PostgreSQL
### Spin Up the Environment
```zsh
docker-compose up -d
```

### Create Table
#### Connect to PostgreSQL
```zsh
docker exec -it health-check-api-postgres-1 psql -U postgres -d health_check_api
```

#### Create `task` Table
```sql
CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  brief VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

#### Verify Table Creation
```sql
\d task
```

#### Insert Sample Data
```sql
INSERT INTO task (brief, description) VALUES
('Sample Task 1', 'This is the description for sample task 1.'),
('Sample Task 2', 'This is the description for sample task 2.');
```

#### Verify Data Insertion
```sql
SELECT * FROM task;
```