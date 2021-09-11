uvicorn main:app --reload
python -m pip install -r requirements.txt 
--upgrade --user

```python
os.environ.get('DB_CONNECT_STRING', "mssql+pymssql://sa:YourStrong!Passw0rd@localhost:9487/jkf?charset=utf8") 
```