from sqlalchemy import create_engine, text, Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationships
from jinja2 import Environment, PackageLoader, FileSystemLoader, Template

import os
SQLALCHEMY_DATABASE_URL = "mssql+pymssql://sa:YourStrong!Passw0rd@localhost:9487/jkf?charset=utf8"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(
    autocommit=False, autoflush=False, future=True, bind=engine)
Base = declarative_base()

def get_table_relationships():
    with engine.connect() as con:
        sql_string = text(f'''
            SELECT
                fk.name 'FKName',
                tp.name 'TargetTableName',
				tsc.name as TargetSchemaName,
                cp.name AS 'TargetColName',
                tr.name 'ForienTableName',
                cr.name 'ForienColName',
				rsc.name 'ForienSchemaName'
         
            FROM 
                sys.foreign_keys fk
            INNER JOIN 
                sys.tables tp ON fk.parent_object_id = tp.object_id
            inner join 
                sys.schemas tsc on tp.schema_id=tsc.schema_id
            INNER JOIN 
                sys.tables tr ON fk.referenced_object_id = tr.object_id
            inner join 
                sys.schemas rsc on tr.schema_id=rsc.schema_id
            INNER JOIN 
                sys.foreign_key_columns fkc ON fkc.constraint_object_id = fk.object_id
            INNER JOIN 
                sys.columns cp ON fkc.parent_column_id = cp.column_id AND fkc.parent_object_id = cp.object_id
            INNER JOIN 
                sys.columns cr ON fkc.referenced_column_id = cr.column_id AND fkc.referenced_object_id = cr.object_id            
        ''')
        rs = con.execute(sql_string)
        data = [dict(r) for r in rs]
        return data


def get_table_columns(schema_name, table_name):
    with engine.connect() as con:
        sql_string = text(f'''
                SELECT  SUBSTRING( b.CONSTRAINT_NAME, 1,2 ) AS CONSTRAINT_NAME,A.*
				FROM INFORMATION_SCHEMA.COLUMNS A
				LEFT JOIN information_schema.KEY_COLUMN_USAGE B on a.TABLE_NAME=B.TABLE_NAME and A.TABLE_SCHEMA=B.TABLE_SCHEMA and A.COLUMN_NAME=B.COLUMN_NAME
				WHERE A.TABLE_SCHEMA=N'{schema_name}' AND A.TABLE_NAME = N'{table_name}'
         ''')
        rs = con.execute(sql_string)
        data = [dict(r) for r in rs]
        return data


def get_all_tables():
    with engine.connect() as con:
        sql_string = text(
            "SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE  TABLE_TYPE='BASE TABLE'")
        rs = con.execute(sql_string)
        data = [dict(r) for r in rs]
        return data


all_tables = get_all_tables()
all_relation_ship = get_table_relationships()
for table in all_tables:
    print(f"{table['TABLE_SCHEMA']}.{table['TABLE_NAME']}")
    columns = get_table_columns(table['TABLE_SCHEMA'], table['TABLE_NAME'])
    table['columns'] = columns
    table['relationships'] = []
    table['collections'] = []
    # relationships
    relation = list(filter(lambda v: v['TargetTableName'] == table['TABLE_NAME']
                    and v['TargetSchemaName'] == table['TABLE_SCHEMA'], all_relation_ship))
    if len(relation) > 0:
        for rel in relation:
            check_column = list(
                filter(lambda v: v['COLUMN_NAME'] == rel['TargetColName'], table['columns']))[0]
            table['columns'].remove(check_column)
            rel['DATA_TYPE'] = check_column['DATA_TYPE']
            table['relationships'].append(rel)
    # collections
    collection = list(filter(lambda v: v['ForienTableName'] == table['TABLE_NAME']
                      and v['ForienSchemaName'] == table['TABLE_SCHEMA'], all_relation_ship))
    if len(collection) > 0:
        for col in collection:
            check_column = list(
                filter(lambda v: v['COLUMN_NAME'] == col['ForienColName'], table['columns']))[0]
            table['collections'].append(col)
template_string = '''
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from . import base
from sqlalchemy.dialects.mssql import \
    BIGINT, BINARY, BIT, CHAR, DATE, DATETIME, DATETIME2, \
    DATETIMEOFFSET, DECIMAL, FLOAT, IMAGE, INTEGER, JSON, MONEY, \
    NCHAR, NTEXT, NUMERIC, NVARCHAR, REAL, SMALLDATETIME, \
    SMALLINT, SMALLMONEY, SQL_VARIANT, TEXT, TIME, \
    TIMESTAMP, TINYINT, UNIQUEIDENTIFIER, VARBINARY, VARCHAR
{% for  idata in tables -%}
class {{idata['TABLE_NAME']}}(base.Base):
    __tablename__ = "{{idata['TABLE_NAME']}}"
    {% for  col in idata['columns'] -%}
    {% if col['CONSTRAINT_NAME']=='PK' %}
    {% if col['DATA_TYPE']=='nvarchar' %}
        {{col['COLUMN_NAME']}} = Column({{col['DATA_TYPE'].upper()}}({{None if  col['CHARACTER_MAXIMUM_LENGTH']==-1 else  col['CHARACTER_MAXIMUM_LENGTH']}}), primary_key=True, index=True)
    {% else %}
        {{col['COLUMN_NAME']}} = Column({{col['DATA_TYPE'].upper()}}, primary_key=True, index=True)
    {% endif %}
    {% else %}
        {% if col['DATA_TYPE']=='int' %}
    {{col['COLUMN_NAME']}} = Column(TINYINT)
        {% elif col['DATA_TYPE']=='nvarchar' %}
    {{col['COLUMN_NAME']}} = Column({{col['DATA_TYPE'].upper()}}({{None if  col['CHARACTER_MAXIMUM_LENGTH']==-1 else  col['CHARACTER_MAXIMUM_LENGTH']}}))
        {% else %}
    {{col['COLUMN_NAME']}} = Column({{col['DATA_TYPE'].upper()}})
        {% endif %}
    {% endif %}
    {% endfor %}

    {% for  col in idata['relationships'] -%}
    {{col['TargetColName']}} = Column({{col['DATA_TYPE'].upper()}}, ForeignKey("{{col['ForienTableName']}}.{{col['ForienColName']}}"))
    {% endfor %}

    # ForeignKey 
    {% for  col in idata['relationships'] -%}
    {{col['TargetTableName']}}{{col['TargetColName']}}_U = relationship("{{col['ForienTableName']}}", back_populates="{{idata['TABLE_NAME']}}")
    {% endfor %} 

    # collections
    {% for  col in idata['collections'] -%}
    {{col['TargetTableName']}} = relationship("{{col['TargetTableName']}}", back_populates="{{col['TargetTableName']}}{{col['TargetColName']}}_U")
    {% endfor %}   
{% endfor %}
'''
base_model_template_string = f'''
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
SQLALCHEMY_DATABASE_URL = "{SQLALCHEMY_DATABASE_URL}"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
'''
model_template_output = Template(template_string).render(tables=all_tables)
base_model_template_output = Template(base_model_template_string).render()

if not os.path.exists('models'):
    os.makedirs('models')
model_file = open(f"models/models.py", "w+")
model_file.write(model_template_output)
model_file.close()

model_file = open(f"models/base.py", "w+")
model_file.write(base_model_template_output)
model_file.close()
