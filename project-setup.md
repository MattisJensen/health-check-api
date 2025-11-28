## Setup PostgreSQL
The [docker-compose.yaml](./docker-compose.yaml) file sets up a PostgreSQL database toegther with the health-check-api service.

### Spin Up the Environment
#### Start Docker Containers
```zsh
docker-compose up -d
```

#### Stop Docker Containers
```zsh
docker-compose down
```

### Access Endpoints
#### Without Parameters
- Entire Health Check: [http://localhost:3000/api/health](http://localhost:3000/api/health)

#### With Parameters
- Database Connection Health Check: [http://localhost:3000/api/health?query=database](http://localhost:3000/api/health?query=database)
- Data Existence in `task` Table Health Check: [http://localhost:3000/api/health?query=data](http://localhost:3000/api/health?query=data)


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

#### Delete Sample Data
```sql
DELETE FROM task;
```

#### Delete `task` Table
```sql
DROP TABLE task;
```