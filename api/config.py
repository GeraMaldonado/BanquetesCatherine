import os
import dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text

dotenv.load_dotenv()


ORACLE_USER = os.getenv("ORACLE_USER")
ORACLE_PASSWORD = os.getenv("ORACLE_PASSWORD")
ORACLE_PORT = os.getenv("ORACLE_PORT")
ORACLE_SID = os.getenv("ORACLE_SID")

DATABASE_URL = f"oracle+oracledb://{ORACLE_USER}:{ORACLE_PASSWORD}@127.0.0.1:{ORACLE_PORT}/?service_name={ORACLE_SID}"
