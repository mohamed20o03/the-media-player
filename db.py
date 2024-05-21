import sqlite3
from typing import List, Tuple, Any

class SQLiteDB:
    def __init__(self, db_name: str , schema_file : str):
        self.db_name = db_name
        self.connection = None
        self.schema_file = schema_file
        self.create_table()

    def _connect(self):
        """Establish a connection to the SQLite database."""
        self.connection = sqlite3.connect(self.db_name)
        print(f"Connected to {self.db_name}")

    def _disconnect(self):
        """Close the connection to the SQLite database."""
        if self.connection:
            self.connection.close()
            self.connection = None
            print(f"Disconnected from {self.db_name}")
    
    def execute_query(self, query: str, params: Tuple = ()) -> None:
        """Execute a single query without returning results (e.g., INSERT, UPDATE, DELETE)."""
        try:
            self._connect()
            with self.connection:
                cursor = self.connection.cursor()
                cursor.execute(query, params)
                self.connection.commit()
                print(f"Executed query: {query} with params: {params}")
        except Exception as e:
            print(f"Error executing query: {query} with params: {params}")
            print(f"Error details: {e}")
        finally:
            self._disconnect()
    def fetch_all(self, query: str, params: Tuple = ()) -> List[Tuple[Any]]:
        """Fetch all results from a SELECT query."""
        cursor = self.connection.cursor()
        cursor.execute(query, params)
        results = cursor.fetchall()
        print(f"Fetched {len(results)} records from query: {query} with params: {params}")
        return results

    def fetch_one(self, query: str, params: Tuple = ()) -> Tuple[Any]:
        """Fetch a single result from a SELECT query."""
        cursor = self.connection.cursor()
        cursor.execute(query, params)
        result = cursor.fetchone()
        print(f"Fetched one record from query: {query} with params: {params}")
        return result

    def create_table(self) -> None:
        """Create a table from a CREATE TABLE SQL statement."""
        self._connect()
        with open( self.schema_file, 'r') as f:
            schema_queries = f.read()
            self.connection.executescript(schema_queries)
            

  