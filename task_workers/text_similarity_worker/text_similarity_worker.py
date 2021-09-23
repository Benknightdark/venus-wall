
import os
from celery import Celery
from dotenv import load_dotenv
import pymssql
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import jieba
import re
import uuid
load_dotenv()
os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')
app = Celery('text_similarity_worker')
app.config_from_envvar('CELERY_CONFIG_MODULE')


def get_similarity_sentence(titles, articleid, tfidf):
    print('[查詢文章]:{}'.format(titles[articleid]['title']))
    cosine_similarities = cosine_similarity(
        tfidf[articleid], tfidf).flatten()
    related_docs_indices = cosine_similarities.argsort()[-2::-1]
    idx_list = list(filter(lambda x: (cosine_similarities[x] > 0.3) & (
        cosine_similarities[x] < 1), related_docs_indices))[:5]
    suggest_titles = []
    for idx in idx_list:
        print('[相似內容]:{} {}'.format(
            titles[idx]['title'], cosine_similarities[idx]))
        suggest_titles.append({'titleData':titles[idx],'ratio':cosine_similarities[idx]})
    return suggest_titles

# autoretry_for=(Exception,),     max_retries=20,
#           retry_backoff=True,
#           retry_backoff_max=60
@app.task()
def update_web_page_similarity(id):
    conn = pymssql.connect('db', 'sa', 'YourStrong!Passw0rd', "beauty_wall")
    cursor = conn.cursor(as_dict=True)
    cursor.execute(
        'SELECT *  FROM [beauty_wall].[dbo].[Item] A WHERE WebPageID=%s AND Enable=1', id)
    row = cursor.fetchall()
    re_punctuation = "[^\w\s]"
    corpus = []
    titles = []
    for article in row:
        titles.append({'title': article['Title'], 'id': article['ID']})
        pre_process_content = re.sub(re_punctuation, " ", article['Title'])
        corpus_data = ' '.join(jieba.cut_for_search(pre_process_content))
        corpus.append(corpus_data)
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(corpus)
    transformer = TfidfTransformer()
    tfidf = transformer.fit_transform(X)
    sql_array=[]
    delete_sql_string=f'''
    DELETE FROM [dbo].[WebPageSimilarity] WHERE WebPageID=N'{id}'    
    '''
    sql_array.append(delete_sql_string)
    for i in range(len(titles)):
        suggest_titles=get_similarity_sentence(titles, i, tfidf)
        print(len(suggest_titles))
        print('--------------------------')
        for s in suggest_titles:
            sql=f'''
            INSERT INTO [dbo].[WebPageSimilarity]
            ([ID]
           ,[WebPageID]
           ,[TargetItemID]
           ,[SimilarityItemID]
           ,[SimilarityItemTitle]
           ,[SimilarityRation])
            VALUES (
                N'{str(uuid.uuid4())}',
                N'{id}',
                N'{titles[i]['id']}',
                N'{s['titleData']['id']}',
                N'{s['titleData']['title']}',
                {s['ratio']}
            )
            '''
            sql_array.append(sql)
    sql_string='\n'.join(sql_array) 
    insert_cursor = conn.cursor()
    insert_cursor.execute(sql_string)
    conn.commit()
    conn.close()
    return
      


if __name__ == "__main__":
    app.start()
