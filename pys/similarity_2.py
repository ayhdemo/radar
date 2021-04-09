#from __future__ import division
import numpy as np
import math
import datetime
import time
import pymysql
import AHP11

host="39.99.228.169"
port=63306
user="radar"
password="6C275462A17"


def Euclidean(a,b):    #欧氏距离
    if a==None:
        euc=0
    elif b==None:
        euc=0
    else:
        squ=(a[0]-b[0])*(a[0]-b[0])+(a[1]-b[1])*(a[1]-b[1])
        euc=math.sqrt(squ)
        euc=('%.4f'%(1/euc))
    return euc


def namestrmatch(target,lib):    #字符串匹配
    if target==None:
        sim=0
    elif lib==None:
        sim=0
    else:
        ltar=len(target)
        llib=len(lib)
        lmin=min([ltar,llib])
        lmax=max([ltar,llib])
        n=0
        for aa in range(0,lmin):
            if target[aa]==lib[aa]:
                n=n+1
        sim=n/lmax
    return sim




def mashi_distance(x,y):    #马氏距离
    # print(x)
    # print(y)
    if x==None:
        d2=0
    elif y==None:
        d2=0
    else:
        if x!=y:
            #马氏距离要求样本数要大于维数，否则无法求协方差矩阵
            #此处进行转置，表示10个样本，每个样本2维
            X=np.vstack([x,y])
            XT=X.T
            #方法一：根据公式求解
            S=np.cov(X)  #两个维度之间协方差矩阵
            SI = np.linalg.inv(S) #协方差矩阵的逆矩阵
            #马氏距离计算两个样本之间的距离，此处共有4个样本，两两组合，共有6个距离。
            n=XT.shape[0]
            d1=[]
            for i in range(0,n):
                for j in range(i+1,n):
                    delta=XT[i]-XT[j]
                    d=np.sqrt(np.dot(np.dot(delta,SI),delta.T))
                    d1.append(d)
            d2=min(d1)
        else:
            d2=2
        d2=(1/d2)
    return d2

def time_similarity(event_time,lib_time):  #时间匹配
    y=1
    m=1
    d=1
    h=1
    mi=1
    s=1
    if event_time[0:3]==lib_time[0:3]:
        year=1
    else:
        year=0
    if event_time[4:5]==lib_time[4:5]:
        month=1
    else:
        month=0
    if event_time[6:7]==lib_time[6:7]:
        day=1
    else:
        day=0
    if event_time[8:9]==lib_time[8:9]:
        hour=1
    else:
        hour=0
    if event_time[10:11]==lib_time[10:11]:
        minute=1
    else:
        minute=0
    if event_time[12:13]==lib_time[12:13]:
        second=1
    else:
        second=0
    a=y*year+m*month+d*day+h*hour+mi*minute+s*second
    return a

def strmatch(inputstr,libstr):  #字符串匹配
    if inputstr!=None:
        if libstr!=None:
            if inputstr == libstr:
                si=1
            else:
                si=0
        else:
            si=0
    else:
        si=0
    return si

def similar_all(input,library,value):   #"""相似度计算主函数"""
    result= {}
    eve=len(library)
    a=0
    for ii in range(0,eve):
        pipei = library[ii]
        if input[0]!=pipei[0]:
            result[a,0] =pipei[0]                        #?
            euc=Euclidean([input[4],input[5]], [pipei[4],pipei[5]])     #欧氏距离
            result[a,1] = euc
            radarname=namestrmatch(input[8],pipei[8])             #雷达型号
            result[a, 2] = radarname
            radarfeature=mashi_distance([input[10],input[14],input[18]],[pipei[10],pipei[14],pipei[18]])   #特征向量
            result[a, 3] = radarfeature
            radarusage=strmatch(input[26],pipei[26])           #雷达用途
            result[a, 4] = radarusage
            radartime=time_similarity(input[2].strftime("%Y%m%d%H%M%S"),pipei[2].strftime("%Y%m%d%H%M%S"))   #雷达开机时间
            result[a, 5] = radartime
            radarsystem=strmatch(input[25],pipei[25])             #雷达系统
            result[a, 6] = radarsystem
            a=a+1
    print(result)
    fin_result = similar(result,value)

    return fin_result



def similar(date,value):     #"""相似度最终值计算"""
    w1=value[0]
    w2 = value[1]
    w3 = value[2]
    w4 = value[3]
    w5 = value[4]
    w6 = value[5]
    result=[]
    jishu=int(len(date)/7)
    for aa in range(0,jishu):
        sample=[date[aa,0],date[aa,1],date[aa,2],date[aa,3],date[aa,4],date[aa,5],date[aa,6]]
        final_simi= w1*float(sample[1])+w2*float(sample[2])+w3*float(sample[3])+w4*float(sample[4])+w5*float(sample[5])+w6*float(sample[6])
        result.append([int(sample[0]),final_simi,float(sample[1]),float(sample[2]),float(sample[3]),float(sample[4]),float(sample[5]),float(sample[6])])
    return result



def read_mysql_all():    #"""调用整个数据库"""
    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')
    #获取游标
    cur=conn.cursor()

    cur.execute("select * from sigs;")
    #while 1:
    res=cur.fetchall()
        # if res is None:
             #表示已经取完结果集
        #     break
    print (res)
    print(len(res))
    print(res[0][9])
    cur.close()
    conn.commit()
    conn.close()
    print('sql执行成功')
    # print(res[0][30])
    # time=res[0][30]
    # print(type(time))
    # trans=time.strftime("%Y%m%d%H%M%S")
    # print(trans)
    return res


def mysql_state_inquire():    #'''数据查询'''

    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')
    cursor = conn.cursor()
    query = ("select * from sigs where state=1 order by state")
    print(query)
    cursor.execute(query)
    worldList = []
    for (sigs) in cursor:
        worldList.append(sigs)
    cursor.close()
    conn.close()
    print(worldList)
    if worldList!=[]:
        return worldList[0]
    else:
        return worldList


def key_update(key):    #相似度参数更新
    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')
    cursor = conn.cursor()
    query = ("select * from settings where `key`='%s'order by `key`"%(pymysql.escape_string(key)))
    print(query)
    cursor.execute(query)
    worldList = []
    for (sigs) in cursor:
        worldList.append(sigs[2])
    cursor.close()
    conn.close()
    print(worldList)
    if worldList != []:
        return worldList[0]
    else:
        return worldList

def list_update(name_id):    #状态更新
    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')
    cur = conn.cursor()
    '''更新单条数据'''
    update = cur.execute("update sigs set state=9 where id='%s'"%(int(name_id)))
    print('修改后受影响的行数为：', update)
    # 查询一条数据
    #cur.execute('select * from sigs where id = "kongsh";')
    #print(cur.fetchone())
    cur.close()
    conn.commit()
    conn.close()
    print('sql执行成功')

def level_update(AHP_level,id):
    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')
    cur = conn.cursor()
    '''更新单条数据'''
    update = cur.execute("update sigs set `level`='%s' where id='%s'" % (AHP_level,int(id)))
    print('修改后受影响的行数为：', update)
    # 查询一条数据
    # cur.execute('select * from sigs where id = "kongsh";')
    # print(cur.fetchone())
    cur.close()
    conn.commit()
    conn.close()
    print('sql执行成功')



def tiqu(data,number):     #最大值提取
    judge=[]
    result_tiqu=[]
    l=len(data)
    for bb in range(0,l):
        judge.append(data[bb][1])
    print(judge)
    temp = []
    Inf = 0
    for i in range(number):
        temp.append(judge.index(max(judge)))
        judge[judge.index(max(judge))] = Inf
    # temp.sort()
    for cc in range(0,len(temp)):
        result_tiqu.append(data[temp[cc]])
    print(temp)
    return result_tiqu



def insert_sql(insert,single_id):    #数据库写入
    l=len(insert)
    print(insert[0])
    time=datetime.datetime.now()
    trans=time.strftime("%Y-%m-%d %H:%M:%S")
    conn = pymysql.connect(host=host, port=port, user=user, password=password)
    conn.select_db('radar-new')

    cur = conn.cursor()  # 获取游标

    insert = cur.execute("insert into results(sig_id,pre_sig_id,score,s1,s2,s3,s4,s5,s6,created_at,updated_at)"
    "values(%s,%s,%s,%s,%s,%s,%s,%s,%s,str_to_date(\'%s\','%%Y-%%m-%%d %%H:%%i:%%s'),str_to_date(\'%s\','%%Y-%%m-%%d %%H:%%i:%%s'))"
    %(single_id,insert[0],insert[1],insert[2],insert[3],
      insert[4],insert[5],insert[6],insert[7],trans,trans))
    print('添加语句受影响的行数：', insert)

    cur.close()
    conn.commit()
    conn.close()
    print('sql执行成功')

def AHP_prepare(data):
    canshu=[]
    canshu.append(data[10])
    if data[11]!=None:
        canshu.append(data[11])
    else:
        canshu.append(data[10])
    if data[12]!=None:
        canshu.append(data[12])
    else:
        canshu.append(data[10])
    canshu.append(data[14])
    if data[15] != None:
        canshu.append(data[15])
    else:
        canshu.append(data[14])
    if data[16] != None:
        canshu.append(data[16])
    else:
        canshu.append(data[14])
    canshu.append(data[18])
    if data[19] != None:
        canshu.append(data[19])
    else:
        canshu.append(data[18])
    if data[20] != None:
        canshu.append(data[20])
    else:
        canshu.append(data[18])
    canshu.append(data[4])
    canshu.append(data[5])
    canshu.append(data[8])
    canshu.append(data[26])
    res=str(canshu)
    return res




def main():

    while 1:
        readsingle=mysql_state_inquire()
        value=[]

        if readsingle!=[]:
            readlib=read_mysql_all()
            for yy in range(1, 7):
                key = "s" + str(yy)
                print(key)
                value_update = key_update(key)
                value.append(float(value_update))
            result = similar_all(readsingle, readlib,value)
            # print(result)
            # print(result[1][1])
            pre_insert=tiqu(result,10)
            print("preinsert")
            print(pre_insert)
            print(readsingle[0])
            for xx in range(0,len(pre_insert)):
                insert_sql(pre_insert[xx],readsingle[0])

            AHP_canshu = AHP_prepare(readsingle)
            print(AHP_canshu)
            print(type(AHP_canshu))
            weixie = AHP11.AHP_main(AHP_canshu)
            level_update(weixie,readsingle[0])
            list_update(readsingle[0])
        time.sleep(5)

main()

