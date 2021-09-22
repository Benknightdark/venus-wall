
import os
from celery import Celery
from dotenv import load_dotenv
import pymssql
from sklearn.feature_extraction.text import TfidfTransformer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import jieba
import re
load_dotenv()
os.environ.setdefault('CELERY_CONFIG_MODULE', 'celery_config')
app = Celery('text_similarity_worker')
app.config_from_envvar('CELERY_CONFIG_MODULE')


def get_similarity_sentence(titles,articleid,tfidf):
    print('[查詢文章]:{}'.format(titles[articleid]))
    cosine_similarities = cosine_similarity(tfidf[articleid], tfidf).flatten()
    related_docs_indices = cosine_similarities.argsort()[-2::-1]
    idx_list = list(filter(lambda x: (cosine_similarities[x] > 0.3) & (
        cosine_similarities[x] < 1), related_docs_indices))[:5]
    for idx in idx_list:
        print('[相似內容]:{} {}'.format(titles[idx], cosine_similarities[idx]))


@app.task(autoretry_for=(Exception,),     max_retries=20,
          retry_backoff=True,
          retry_backoff_max=60)
def update_web_page_similarity(id):
    conn = pymssql.connect('db', 'sa', 'YourStrong!Passw0rd', "beauty_wall")
    cursor = conn.cursor(as_dict=True)
    cursor.execute(
        'SELECT *  FROM [beauty_wall].[dbo].[Item] A WHERE WebPageID=%s', id)
    row = cursor.fetchall()
    re_punctuation = "[^\w\s]"
    corpus = []
    titles = []
    for article in row:
        titles.append(article['Title'])
        pre_process_content = re.sub(re_punctuation, " ", article['Title'])
        corpus_data = ' '.join(jieba.cut_for_search(pre_process_content))
        corpus.append(corpus_data)
    vectorizer = CountVectorizer()
    X = vectorizer.fit_transform(corpus)
    transformer = TfidfTransformer()
    tfidf = transformer.fit_transform(X)
    for i in range(len(titles)):
        get_similarity_sentence(titles,i,tfidf) 
        print('--------------------------') 
    print(len(titles))       


if __name__ == "__main__":
    app.start()
