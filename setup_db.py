import pymysql

try:
    conn = pymysql.connect(
        host="localhost",
        user="root",
        password="Umesh1234@#@"
    )
    cursor = conn.cursor()
    cursor.execute("CREATE DATABASE IF NOT EXISTS food CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    print("Database 'food' created or already exists.")
    cursor.close()
    conn.close()
except Exception as e:
    print(f"Error creating database: {e}")
