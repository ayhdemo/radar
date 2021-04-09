import warnings
warnings.filterwarnings('ignore')
import matplotlib.pyplot as plt
# font = FontProperties(fname=r"C:\Windows\Fonts\simhei.ttf", size=14)
import math
import numpy as np
import csv
import json


plt.rcParams['font.sans-serif'] = ['SimHei']

plt.rcParams['axes.unicode_minus'] = False


T_interval=30   #获取卫星位置的时间间隔  秒
Num=100         #获取卫星位置的坐标点的个数
Orbital_altitude=300  #轨道高度,可获取  km
Theta=42.78     #轨道倾角

Lambda_e=116.2  #地面站所在地的纬度
Phi = 39.56     #地面站所在地的纬度
f = 30          #f表示电磁波的频率 单位（GHz）
# d = 370000      #电磁波传输距离 单位（m）
R = 6371004     #地球半径 单位（m）
water_Vapour_Density = 100 #water_Vapour_Density表示的是水蒸气密度
weather = 1 #当前的天气状况，晴天为1，雨天为0
yValue = []   #信号的幅度值

#计算卫星与地面站之间的距离
#三个参数分别是：地球站纬度，地球站经度，卫星站纬度，卫星站经度，卫星高度
def distance(e_latitude, e_longitude, s_latitude, s_longitude, s_altitude):
    #计算卫星在地面投影点与地面站之间的距离
    dis = []
    for i in range(len(e_longitude)):
        C = np.sin(e_latitude[i]) * np.sin(s_latitude[i]) * np.cos(e_longitude[i] - s_longitude[i]) + np.cos(e_latitude[i]) * np.cos(s_latitude[i])
        d = (s_altitude[i] + R)*(s_altitude[i] + R) + R*R - 2*(s_altitude[i] + R)*R*C
        dis.append(d)
    return dis

#计算多普勒频移
def doppler_frequency_shift(f_c,Latitude_Of_Ground_Station,h):
    #f_c为载波频率, , 三维坐标（x, y, z）
    # lt, _ = xyz2Latitude()
    #lt地面站终端纬度
    f_Dopple_list=[]
    R = 6371393 #地球半径 单位m
    h = h*1000 #轨道高度(天宫一号) 单位m
    gamma = 80 #为地面站仰角
    c = 299792458 #光速
    mu = 398601.58e9 #多普勒常数
    # psi卫星和地球站连线在过星下点的切平面上的投影与星下点沿纬度线方向的切线之间的夹角
    psi = np.arctan((-43803/math.pi)*np.sqrt(mu/math.pow(R+h, 3)))
    for i in range(len(Latitude_Of_Ground_Station)):
        #为两节点相对运动速度，在星地链路中即为卫星与地面站之间的相对运动速度
        Vd = np.sqrt((mu*R*R)/math.pow(R+h,3))*np.cos(gamma)*np.sin(psi)-((2*math.pi)/86164)*R*np.cos(Latitude_Of_Ground_Station[i])*np.cos(gamma)*np.cos(psi)
        f_Dopple = f_c * Vd / c
        f_Dopple_list.append(f_Dopple)
    return f_Dopple_list


# def loss_Of_Free_Space(d,Pr,D,yitaR,f):    #自由空间损耗-----》损耗之前的信号功率
def loss_of_Free_space(d, f):
    Lp = []
    #d表示电磁波传输距离，Pr雷达接收信号功率，D雷达天线直径 yitaR 接收天线效率 f表示电磁波的频率
    c=3e8   #光速 米/秒
    lamda=c/f  #电磁波的波长
    # Lp=np.square(4*np.pi*d/lamda)  #自由空间的传播损耗
    # Gr=(np.square(np.pi*D)*yitaR)/np.square(lamda)  #雷达的天线增益
    # PtGt=Pr*Lp/Gr
    for i in range(len(d)):
        L_p=32.44 + 20 * math.log10(d[i]) + 20 * math.log10(f)  # d表示的是Km   f的单位是MhZ ，注意单位转换
        Lp.append(L_p)
    return Lp    #单位为dB


    #计算大气损耗。f表示的是电磁波频率（GHz），theta是地面站天线波束仰角、 water_Vapour_Density表示的是水蒸气密度, weather是当前的天气状况，晴天为1，雨天为0
    #lambda_e是地面站所在地的经度 phi是地面站所在地的纬度 lambda_s是卫星的经度
def loss_Of_Atmospheric(f, lambda_s,lambda_e,phi, water_Vapour_Density, weather):
    hs = 0 # hs为地面站的平均海拔高度，默认为0
    La=0  #大气损耗
    r0=0  #电波在干燥空气的损耗 每千米
    rw=0  #电波在水蒸气中传播的损耗 每千米
    h0=0  #干燥空气的等效高度
    hw=0  #水蒸气的等效高度
    T=15   #基准温度
    #theta是地面站天线波束仰角
    theta = np.tan((np.cos(lambda_s-lambda_e)*np.cos(phi)-0.1513)/(np.sqrt(1-np.square(np.cos(lambda_s-lambda_e))*np.square(np.cos(phi)))))
    if weather == 1:
        hw0 = 1.6
    else:
        hw0 = 2.1
    if f<10:
        r0=0
        rw=0
    elif f>10 and f<57:
        r0=(7.19e-3+(6.09/(np.square(f)+0.227))+(4.81/np.square(f-57)+1.50))*f*f*0.001   #dB/km
        h0=6  #单位km
        rw=(0.05+0.0021*water_Vapour_Density+3.6/(np.square(f-22.2)+8.5)+
            10.6/(np.square(f-183.3)+9.0)+8.9/(np.square(f-325.4)+26.3))*f*f*water_Vapour_Density*1e-4
        hw=hw0*(1+(3.0/(np.square(f-22.2)+5))+(5.0/(np.square(f-183.3)+6))+(2.5/(np.square(f-325.4)+4)))
    #在57到63中间，由于损耗很大，不用于通信
    elif f>63 and f<350:
        r0 = [3.79e-7*f + (0.625 / (np.square(f-63) + 1.59)) + (0.028 / np.square(f - 118) + 1.47)] * (f+198) * (f+198) * 0.001  # dB/km
        h0 = 6+40/(np.square(f-118.7)+1)
        rw = (0.05 + 0.0021 * water_Vapour_Density + 3.6 / (np.square(f - 22.2) + 8.5) +
              10.6 / (np.square(f - 183.3) + 9.0) + 8.9 / (
              np.square(f - 325.4) + 26.3)) * f * f * water_Vapour_Density * 1e-4
        hw = hw0 * (
        1 + (3.0 / (np.square(f - 22.2) + 5)) + (5.0 / (np.square(f - 183.3) + 6)) + (2.5 / (np.square(f - 325.4) + 4)))
    else:  #超过该频段的损失，唯有直接计算，定义为0？？？？
        r0 = 0
        rw = 0
    #当温度升高时候，损耗修正：
    r0=r0-r0*(T-15)/100
    rw = rw - rw * (T - 15) / 100
    h0=h0+h0*(T-15)*0.2/100
    hw = hw + hw * (T - 15) * 2 / 100
    #大气折射时的等效地球半径
    Re=6370*4/3   #单位Km
    x=np.sqrt(np.square(math.sin(theta))+2*hs/Re)
    #求解损耗路径
    if theta>10:
        La=(r0*h0*math.exp(-hs/h0)+rw*hw)/math.sin(theta)
    else:
        g_h0 = 0.661 * x + 0.339 * math.sqrt(x * x + 5.5*h0/Re)
        g_hw = 0.661 * x + 0.339 * math.sqrt(x * x + 5.5 * hw / Re)
        La = (r0 * h0 * math.exp(-hs / h0) + rw * hw) / g_h0+rw*hw/g_hw
    return La     #单位是dB


#由卫星以及地球站的经纬度计算接收方位角、仰角和极化角  phi_s/phi_e 卫星经度/地球站经度  beta_s/beta_e 卫星纬度/地球站纬度
def angle_calculation(phi_s,phi_e,beta_s,beta_e):
    E=(math.atan(((math.cos((phi_s-phi_e)*np.pi/180)*math.cos(beta_e*np.pi/180)-0.15)/math.sqrt(1-math.pow(((math.cos((phi_s-phi_e)*np.pi/180))*(math.cos(beta_e*np.pi/180))),2)))))*180/np.pi  #仰角
    A=(math.atan((math.tan((phi_s-phi_e)*np.pi/180))/math.sin(beta_e*np.pi/180)))*180/np.pi  #方位角
    P=(math.atan(math.sin((phi_s-phi_e)*np.pi/180)/math.tan(beta_e*np.pi/180)))*180/np.pi  #馈源极化角
    E = round(E, 2)
    A = round(A, 2)
    P = round(P, 2)
    return E,A,P

#将字符串数组转换为数值型
def str_to_float(strList):
    float_list=[]
    for i in range(len(strList)):
        if i==0:
            continue
        else:
            float_list.append(float(strList[i]))
    return float_list

#获取csv文件里的卫星经纬度数据
def get_data(file_path):
    label1='Satellite_Longitude'
    label2='Satellite_Latitude'
    label3='Singal_Power'
    label4='LongitudeOfRadar'
    label5='LatitudeOfRadar'
    label6='AltitudeOfSatellite'
    with open(file_path, 'r') as file:
        reader = csv.DictReader(file)
        Satellite_Longitude = [row[label1] for row in reader]  #卫星经度
        # print(Satellite_Longitude)
        for i in range(len(Satellite_Longitude)):
            Satellite_Longitude[i]=float(Satellite_Longitude[i])
        # print(Satellite_Longitude)
        file.seek(0)
        satellite_Latitude=[row[label2] for row in reader]     #卫星纬度
        satellite_Latitude = str_to_float(satellite_Latitude)
        # print(satellite_Latitude)
        file.seek(0)
        singal_Power=[row[label3] for row in reader]           #功率
        singal_Power = str_to_float(singal_Power)
        # print(singal_Power)
        file.seek(0)
        longitude_Of_Ground_Station=[row[label4] for row in reader]  #地面站经度
        longitude_Of_Ground_Station = str_to_float(longitude_Of_Ground_Station)
        # print(longitude_Of_Ground_Station)
        file.seek(0)
        Latitude_Of_Ground_Station = [row[label5] for row in reader]  #地面站纬度
        Latitude_Of_Ground_Station = str_to_float(Latitude_Of_Ground_Station)
        # print(Latitude_Of_Ground_Station)
        file.seek(0)
        Altitude_Of_satellite = [row[label6] for row in reader]  #卫星高度
        Altitude_Of_satellite = str_to_float(Altitude_Of_satellite)
        # print(Altitude_Of_satellite)


    return Satellite_Longitude,satellite_Latitude,singal_Power,longitude_Of_Ground_Station,Latitude_Of_Ground_Station,Altitude_Of_satellite

def getAngleList(Satellite_Longitude, satellite_Latitude, singal_Power, longitude_Of_Ground_Station, Latitude_Of_Ground_Station):
    elevation=[]  #仰角的集合
    azimuth=[]  #方位角的集合
    polar=[]  #极化角的集合
    for i in range(len(Satellite_Longitude)):
        e,a,p=angle_calculation(Satellite_Longitude[i],longitude_Of_Ground_Station[i],
                                satellite_Latitude[i],Latitude_Of_Ground_Station[i])
        elevation.append(e)
        azimuth.append(a)
        polar.append(p)
    return elevation,azimuth,polar

def loss_Of_Atmospheric_list(f,Satellite_Longitude,longitude_Of_Ground_Station, Latitude_Of_Ground_Station, water_Vapour_Density, weather):
    lossof_Atmospheric_list=[]
    for i in range(len(Latitude_Of_Ground_Station)):
        loss=loss_Of_Atmospheric(f,Satellite_Longitude[i],longitude_Of_Ground_Station[i], Latitude_Of_Ground_Station[i], water_Vapour_Density, weather)
        lossof_Atmospheric_list.append(loss)
    return lossof_Atmospheric_list

def addLossPower(lossofFreeSpace, lossof_Atmospheric_list, P):
    power_add_loss=[]
    for i in range(len(P)):
        power=P[i]+ lossofFreeSpace[i] + lossof_Atmospheric_list[i]
        power_add_loss.append(power)
    return power_add_loss

#插值函数 插入两个值
def insert_data(xs, ys):
    # print("the length of xs:", len(xs))
    x = [xs[i] for i in range(len(xs))]
    y = [ys[i] for i in range(len(ys))]
    #左边插值
    indmax_y = y.index(max(y))
    indmax_x = x.index(max(x))

    # print("indmax_y, indmax_x", indmax_y, indmax_x)
    #将横坐标最大值与纵坐标最大值的横坐标相减得到dia
    dia_x = max(x) - x[indmax_y]
    insert_left_x = x[indmax_y] - dia_x
    insert_left_y = y[indmax_x]
    x.append(insert_left_x)
    y.append(insert_left_y)

    #在中间插入数值
    insert_leftmid_x = x[indmax_y] - dia_x*0.8
    insert_leftmid_y = insert_left_y + (y[indmax_y] - insert_left_y)*0.8
    x.append(insert_leftmid_x)
    y.append(insert_leftmid_y)

    #右边插值
    #左边插值
    indmax_y = y.index(max(y))
    indmax_x = x.index(min(x))
    #将最大值的横坐标与横坐标最大值相减得到dia
    dia_x = max(x) - x[indmax_y]
    insert_right_x = x[indmax_y] + dia_x
    insert_right_y = y[indmax_x]
    x.append(insert_right_x)
    y.append(insert_right_y)
    #在中间插入数值
    insert_rightmid_x = x[indmax_y] + dia_x*0.8
    insert_rightmid_y = insert_right_y + (y[indmax_y] - insert_right_y)*0.8
    x.append(insert_rightmid_x)
    y.append(insert_rightmid_y)
    return x, y


class Fit():
    def __init__(self, xs, ys, xs_insert, ys_insert, loss_all, f_Dopple):
        '''
        :param xs: 输入数据的特征集合
        :param ys: 输入数据的标签集合
        '''
        self.xs, self.ys = xs, ys
        self.xs_insert,self.ys_insert = xs_insert, ys_insert
        self.theta = None # 模型参数
        self.loss_all = loss_all
        self.f_Dopple = f_Dopple

    def get_augmented_matrix(self,matrix, b):
        row, col = np.shape(matrix)
        matrix = np.insert(matrix, col, values=b, axis=1)
        return matrix

    # 取出增广矩阵的系数矩阵（第一列到倒数第二列）

    def get_matrix(self,a_matrix):
        return a_matrix[:, :a_matrix.shape[1] - 1]

    # 选列主元，在第k行后的矩阵里，找出最大值和其对应的行号和列号

    def get_pos_j_max(self,matrix, k):
        max_v = np.max(matrix[k:, :])
        pos = np.argwhere(matrix == max_v)
        i, _ = pos[0]
        return i, max_v

    # 矩阵的第k行后，行交换

    def exchange_row(self,matrix, r1, r2, k):
        matrix[[r1, r2], k:] = matrix[[r2, r1], k:]
        return matrix

    # 消元计算(初等变化)

    def elimination(self,matrix, k):
        row, col = np.shape(matrix)
        for i in range(k + 1, row):
            m_ik = matrix[i][k] / matrix[k][k]
            matrix[i] = -m_ik * matrix[k] + matrix[i]
        return matrix

    # 回代求解

    def backToSolve(self,a_matrix):
        matrix = a_matrix[:, :a_matrix.shape[1] - 1]  # 得到系数矩阵
        b_matrix = a_matrix[:, -1]  # 得到值矩阵
        row, col = np.shape(matrix)
        x = [None] * col  # 待求解空间X
        # 先计算上三角矩阵对应的最后一个分量
        x[-1] = b_matrix[col - 1] / matrix[col - 1][col - 1]
        # 从倒数第二行开始回代x分量

        for _ in range(col - 1, 0, -1):
            i = _ - 1
            sij = 0
            xidx = len(x) - 1
            for j in range(col - 1, i, -1):
                sij += matrix[i][j] * x[xidx]
                xidx -= 1
            x[xidx] = (b_matrix[i] - sij) / matrix[i][i]
        return x

    # 求解非齐次线性方程组：ax=b

    def solve_NLQ(self,a, b):
        a_matrix = self.get_augmented_matrix(a, b)
        for k in range(len(a_matrix) - 1):
            # 选列主元
            max_i, max_v = self.get_pos_j_max(self.get_matrix(a_matrix), k=k)
            # 如果A[ik][k]=0，则矩阵奇异退出
            if a_matrix[max_i][k] == 0:
                print('矩阵A奇异')
                return None, []
            if max_i != k:
                a_matrix = self.exchange_row(a_matrix, k, max_i, k=k)
            # 消元计算
            a_matrix = self.elimination(a_matrix, k=k)
        # 回代求解
        X = self.backToSolve(a_matrix)
        return a_matrix, X
    '''
    最小二乘法多项式拟合曲线
    '''
    # 生成带有噪点的待拟合的数据集合
    def init_fx_data(self,xs,ys):
        # 待拟合曲线f(x) = sin2x * [(x^2 - 1)^3 + 0.5]
        xs = np.arange(-1, 1, 0.01)  # 200个点
        ys = [((x ** 2 - 1) ** 3 + 0.5) * np.sin(x * 2) for x in xs]
        ys1 = []
        for i in range(len(ys)):
            z = np.random.randint(low=-10, high=10) / 100  # 加入噪点
            ys1.append(ys[i] + z)
        return xs, ys1

    # 计算最小二乘法当前的误差

    def last_square_current_loss(self,xs, ys, A):
        error = 0.0
        for i in range(len(xs)):
            y1 = 0.0
            for k in range(len(A)):
                y1 += A[k] * xs[i] ** k
            error += (ys[i] - y1) ** 2
        return error
    # 迭代解法：最小二乘法+梯度下降法

    def last_square_fit_curve_Gradient(self,xs, ys, order, iternum=1000, learn_rate=0.001):
        A = [0.0] * (order + 1)
        for r in range(iternum + 1):
            for k in range(len(A)):
                gradient = 0.0
                for i in range(len(xs)):
                    y1 = 0.0
                    for j in range(len(A)):
                        y1 += A[j] * xs[i] ** j
                    gradient += -2 * (ys[i] - y1) * xs[i] ** k  # 计算A[k]的梯度
                A[k] = A[k] - (learn_rate * gradient)  # 更新A[k]的梯度
            # 检查误差变化
            if r % 100 == 0:
                error = self.last_square_current_loss(xs=xs, ys=ys, A=A)
                # print('最小二乘法+梯度下降法：第{}次迭代，误差下降为：{}'.format(r, error))
        return A

    # 数学解法：最小二乘法+求解线性方程组
    def last_square_fit_curve_Gauss(self,xs, ys, order):
        X, Y = [], []
        # 求解偏导数矩阵里，含有xi的系数矩阵X
        for i in range(0, order + 1):
            X_line = []
            for j in range(0, order + 1):
                sum_xi = 0.0
                for xi in xs:
                    sum_xi += xi ** (j + i)
                X_line.append(sum_xi)
            X.append(X_line)
        # 求解偏导数矩阵里，含有yi的系数矩阵Y
        for i in range(0, order + 1):
            Y_line = 0.0
            for j in range(0, order + 1):
                sum_xi_yi = 0.0
                for k in range(len(xs)):
                    sum_xi_yi += (xs[k] ** i * ys[k])
                Y_line = sum_xi_yi
            Y.append(Y_line)
        a_matrix, A = self.solve_NLQ(np.array(X), Y)  # 高斯消元：求解XA=Y的A
        # A = np.linalg.solve(np.array(X), np.array(Y))  # numpy API 求解XA=Y的A
        error = self.last_square_current_loss(xs=xs, ys=ys, A=A)
        return A

    # 可视化多项式曲线拟合结果
    def draw_fit_curve(self,xs, ys, A, order):
        # print(len(xs))
        fig = plt.figure()
        ax = fig.add_subplot(111)
        # fit_xs, fit_ys = np.arange(min(xs) * 0.8, max(xs) * 0.8, 0.01), []
        fit_xs, fit_ys = np.arange(min(self.xs_insert)*0.95, max(self.xs_insert)*1.2, 0.01), []
        fit_xs_output = []
        # print(len(fit_xs))
        for i in range(0, len(fit_xs)):
            y = 0.0
            for k in range(0, order + 1):
                y += (A[k] * fit_xs[i] ** k)
            if y >= 0:
                fit_xs_output.append(fit_xs[i])
                fit_ys.append(y)
        # print(fit_xs)
        # print(fit_ys)
        ax.plot(fit_xs_output, fit_ys, color='g', linestyle='-', marker='', label='多项式拟合曲线')
        ax.plot(xs, ys, color='m', linestyle='', marker='.', label='曲线真实数据')

        text = plt.text(x=-18,  # 文本x轴坐标
                        y=0,  # 文本y轴坐标
                        s="传输损耗:{}dB \n 多普勒频移:{}".format(self.loss_all, self.f_Dopple),  # 文本内容
                        ha="center", va="center",
                        bbox=dict(boxstyle="round",
                                  ec=(1., 0.5, 0.5),
                                  fc=(1., 0.8, 0.8),
                                  )) # 字体属性字典

        # plt.title(s='最小二乘法拟合多项式N={}的函数曲线f(x)'.format(order),label='fe')

        # plt.xlim(min(xs)*0.98, max(xs)*1.03)
        plt.xlim(min(xs)*0.6, max(xs)*2)

        # 把x轴的刻度范围设置为-0.5到11，因为0.5不满一个刻度间隔，所以数字不会显示出来，但是能看到一点空白

        # plt.ylim(min(ys)*0.95, max(ys)*1.05)
        plt.ylim(0, max(ys) * 1.05)
        # 把y轴的刻度范围设置为-5到110，同理，-5不会标出来，但是能看到一点空白
        plt.legend()
        plt.show()

def get_fittedData(xs_insert,A):
    # fit_xs, fit_ys = np.arange(min(self.xs_insert) * 0.95, max(self.xs_insert) * 1.2, 0.01), []
    # for i in range(0, len(fit_xs)):
    #     y = 0.0
    #     for k in range(0, order + 1):
    #         y += (A[k] * fit_xs[i] ** k)
    #     fit_ys.append(y)
    fit_xs, fit_ys = np.arange(min(xs_insert) * 0.95, max(xs_insert)*1.2, 0.01), []
    fit_xs_output=[]
    # print(len(fit_xs))
    for i in range(0, len(fit_xs)):
        y = 0.0
        for k in range(0, order + 1):
            y += (A[k] * fit_xs[i] ** k)
        if y>=0:
            fit_xs_output.append(fit_xs[i])
            fit_ys.append(y)
    return fit_xs_output,fit_ys

def get_bandwidth_of_threedb(fit_xs,fit_ys,A):
    print(A)
    B=A.copy()
    fit_ys_max=max(fit_ys)
    # print(fit_ys_max)
    threeDB=fit_ys_max/2.0
    B[0] = B[0] - threeDB
    #对系数进行反转求解零点
    hcnt = int(math.floor(len(B) / 2))
    tmp = 0
    for i in range(hcnt):
        tmp = B[i]
        B[i] = B[-(i + 1)]
        B[-(i + 1)] = tmp

    a1 = np.array(B)
    fit_ys_max_index=fit_ys.index(fit_ys_max)   #获取最大值的索引
    angle=fit_xs[fit_ys_max_index]   #获取最大功率的角度
    print('----最大功率所在的角度----')
    print(angle)
    b = np.roots(a1)
    # print(b)
    r=np.real(b)
    distance_MaxRoot = [abs(r[i]-angle) for i in range(0, len(r))]
    min_distance=min(distance_MaxRoot)
    return min_distance*2

def significant(data,number):
    mid_np = np.array(data)  # 列表转数组
    mid_np_2f = np.round(mid_np, number)  # 对数组中的元素保留两位小数
    list_new = list(mid_np_2f)  # 数组转列表
    return list_new


if __name__ == '__main__':
    file_path='pys/position_data.csv'
    Satellite_Longitude, satellite_Latitude, singal_Power, \
    longitude_Of_Ground_Station, Latitude_Of_Ground_Station, Altitude_Of_satellite = get_data(file_path)  # 获取数据
    elevation,azimuth,polar=getAngleList( Satellite_Longitude, satellite_Latitude, singal_Power, \
                                          longitude_Of_Ground_Station, Latitude_Of_Ground_Station)   #计算仰角、方位角、极化角

    # 计算多普勒频移 单位(dB)
    f_Dopple_list = doppler_frequency_shift(f,Latitude_Of_Ground_Station,Orbital_altitude)
    d = distance(Latitude_Of_Ground_Station, longitude_Of_Ground_Station, satellite_Latitude,\
                 Satellite_Longitude, Altitude_Of_satellite)
    # 自由空间损耗 单位(dB)
    lossofFreeSpace = loss_of_Free_space(d, f)
    # 大气损耗(不同经纬度不同) 单位(dB)
    lossof_Atmospheric_list = loss_Of_Atmospheric_list(f, Satellite_Longitude, longitude_Of_Ground_Station, \
                                                       Latitude_Of_Ground_Station, water_Vapour_Density, weather)
    #损耗与多普勒频移
    # print("功率损耗：", lossofFreeSpace, "\n", lossof_Atmospheric_list)
    # print("多普勒频移:", f_Dopple_list)
    #计算损失前的功率
    power= [lossofFreeSpace[i] + lossof_Atmospheric_list[i] + singal_Power[i] for i in range(0,len(lossofFreeSpace))]
    order =2 # 拟合的多项式项数
    xs=azimuth
    ys=power

    xs_insert, ys_insert = insert_data(xs, ys)

    print('------获取的原始方位角------')
    print(xs)
    print('------加上损耗后的功率------')
    print(ys)


    fit = Fit(xs, ys,xs_insert, ys_insert, lossofFreeSpace, f_Dopple_list[0])
    A = fit.last_square_fit_curve_Gauss(xs=xs, ys=ys, order=order)
    print("拟合的多项式系数：")
    print(A)

    fit_xs, fit_ys = get_fittedData(xs_insert, A)
    print('------拟合需要的方位角------')
    print(fit_xs)
    print('------拟合需要的功率------')
    print(fit_ys)

    threedb = get_bandwidth_of_threedb(fit_xs, fit_ys, A)
    print('-----3db带宽------')
    print(threedb)
    explain=[]
    explain.append({ "name":"拟合采用参数" ,"value": str(significant(A,2))})
    explain.append({"name": "波束宽度", "value": str('%.2g' % threedb) + "度"})
    explain.append({"name": "自由空间损耗", "value": str(significant(lossof_Atmospheric_list,2)) + "dB"})
    explain.append({"name": "大气损耗", "value": str(significant(lossof_Atmospheric_list,2)) + "dB"})
    explain.append({"name": "多普勒频移", "value": str(significant(f_Dopple_list,8)) + "Hz"})
    explain.append({"name": "卫星高度", "value": str(Altitude_Of_satellite) + "度"})
    explain.append({"name": "卫星纬度", "value": str(satellite_Latitude) + "度"})
    explain.append({"name": "卫星经度", "value": str(Satellite_Longitude) + "度"})
    explain.append({"name": "目标纬度", "value": str(Latitude_Of_Ground_Station) + "度"})
    explain.append({"name": "目标经度", "value": str(longitude_Of_Ground_Station) + "度"})
    # explain = explain + "【自由空间损耗】" + str(significant(lossofFreeSpace,2)) + "dB\n"
    # explain = explain + "【大气损耗】" + str(significant(lossof_Atmospheric_list,2)) + "dB\n"
    # explain = explain + "【多普勒频移】" + str(significant(f_Dopple_list,8)) + "Hz\n"
    # explain = explain + "【卫星高度】" + str(Altitude_Of_satellite) + "度\n"
    # explain = explain + "【卫星纬度】" + str(satellite_Latitude) + "度\n"
    # explain = explain + "【卫星经度】" + str(Satellite_Longitude) + "度\n"
    # explain = explain + "【目标纬度】" + str(Latitude_Of_Ground_Station) + "度\n"
    # explain = explain + "【目标经度】" + str(longitude_Of_Ground_Station) + "度\n"

    print(explain)
    data = {}
    data["xs"] = xs
    data["ys"] = ys
    data["fit_xs"] = fit_xs
    data["fit_ys"] = fit_ys
    data["param"] = A
    data["content"] = explain
    filename = 'pys/fanyan.json'
    with open(filename, 'w', encoding='utf-8') as file_obj:
        json.dump(data, file_obj, ensure_ascii=False, indent=2)


    # fit.draw_fit_curve(xs=xs, ys=ys, A=A, order=order)  # 可视化多项式曲线拟合结果

















