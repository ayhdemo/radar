
from math import radians, cos, sin, asin, sqrt
from numpy import *
import numpy as np

def main():
  print('-'*50)
  print("输入：")
  print("1. 输入13x13的判断矩阵，主要考虑的13项辐射源参数有：脉冲重复频率、相对距离、带宽、载频、脉宽、雷达天线方向图的波束带宽、雷达的工作状态...；")
  print("2. 输入辐射源参数矩阵(固定13列，每个雷达的13项参数占据一整行)。 ")
  print("输出：以百分制为评判标准的目标雷达威胁分数。")
  print("用法：输入判断矩阵和辐射源参数矩阵，经过AHP算法得到输入辐射源的威胁值评分。")
  print('-'*50)

class AHP:

  """
  相关信息的传入和准备
  """

  def __init__(self, array):
    ## 记录矩阵相关信息
    self.array = array
    ## 记录矩阵大小
    self.n = array.shape[0]
    # 初始化RI值，用于一致性检验
    self.RI_list = [0, 0, 0.58, 0.90, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.52, 1.54, 1.56, 1.58, 1.59]
    # 矩阵的特征值和特征向量
    self.eig_val, self.eig_vector = np.linalg.eig(self.array)
    # 矩阵的最大特征值
    self.max_eig_val = np.max(self.eig_val)
    # 矩阵最大特征值对应的特征向量
    self.max_eig_vector = self.eig_vector[:, np.argmax(self.eig_val)].real
    # 矩阵的一致性指标CI
    self.CI_val = (self.max_eig_val - self.n) / (self.n - 1)
    # 矩阵的一致性比例CR
    self.CR_val = self.CI_val / (self.RI_list[self.n - 1])


  """
  一致性判断
  """

  def test_consist(self):
    # 打印矩阵的一致性指标CI和一致性比例CR
    print("判断矩阵的CI值为：" + str(self.CI_val))
    print("判断矩阵的CR值为：" + str(self.CR_val))
    # 进行一致性检验判断
    if self.n == 2: # 当只有两个子因素的情况
      print("仅包含两个子因素，不存在一致性问题")
    else:
      if self.CR_val < 0.1: # CR值小于0.1，可以通过一致性检验
        print("判断矩阵的CR值为" + str(self.CR_val) + ",通过一致性检验")
        return True
      else: # CR值大于0.1, 一致性检验不通过
        print("判断矩阵的CR值为" + str(self.CR_val) + "未通过一致性检验")
        return False

  """
  算术平均法求权重
  """

  def cal_weight_by_arithmetic_method(self):
    # 求矩阵的每列的和
    col_sum = np.sum(self.array, axis=0)
    # 将判断矩阵按照列归一化
    array_normed = self.array / col_sum
    # 计算权重向量
    array_weight = np.sum(array_normed, axis=1) / self.n
    # 打印权重向量
    print("算术平均法计算得到的权重向量为：\n", array_weight)
    # 返回权重向量的值
    return array_weight


class JS:
  """
  目标辐射源参数计算
  """
  def __init__(self, array):
    ## 分类记录辐射源信息
    self.c1, self.c2, self.c3, self.c4, self.c5, self.c6, self.c7, self.c8, self.c9, self.c10, self.c11, self.c12, self.c13 = \
      b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7], b[8], b[9], b[10], b[11], b[12]


  """
  计算辐射源权重矩阵
  """
  def jisuan(self):
    # 载频
    function_1 = np.vectorize(u_x1)
    d1 = function_1(self.c1)
    d1 = np.array(d1)

    d2 = function_1(self.c2)
    d2 = np.array(d2)

    d3 = function_1(self.c3)
    d3 = np.array(d3)

    #  脉冲重复周期
    function_2 = np.vectorize(u_x2)
    d4 = function_2(self.c4)
    d4 = np.array(d4)

    d5 = function_2(self.c5)
    d5 = np.array(d5)

    d6 = function_2(self.c6)
    d6 = np.array(d6)

    #脉冲宽度
    function_3 = np.vectorize(u_x3)
    d7 = function_3(self.c7)
    d7 = np.array(d7)

    d8 = function_3(self.c8)
    d8 = np.array(d8)

    d9 = function_3(self.c9)
    d9 = np.array(d9)

    # 相对距离
    d10 = u_x4(10, 1, self.c10, self.c11)
    d10 = np.array(d10)

    # 雷达的类型和用途
    d12 = np.array(self.c12)
    d13 = np.array(self.c13)

    z1 = np.vstack((d1, d2, d3))
    z2 = np.vstack((d4, d5, d6))
    z3 = np.vstack((d7, d8, d9))
    z4 = d10
    z5 = np.vstack((d12, d13))

    return z1,z2,z3,z4,z5



"""
计算公式
"""
# 载频
def u_x1(x):
  if x <= 1000:
    x = 0.1
  elif 1000 < x <= 2000:
    x = 0.3
  elif 2000 < x <= 8000:
    x = 0.6
  else:
    x = 1
  return x

# 脉冲重复周期
def u_x2(x):
  if x <= 1000:
    x = 0.3
  elif 1000 < x < 10000:
    x = 0.6
  else:
    x = 0.1
  return x

# 脉冲宽度
def u_x3(x):
  u3 = 1/(1 + (0.1*x)**2)
  return u3

# 相对距离
def u_x4(lon1, lat1, lon2, lat2):  # 经度1，纬度1，经度2，纬度2 （十进制度数）

  lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
  dlon = lon2 - lon1
  dlat = lat2 - lat1
  a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
  c = 2 * asin(sqrt(a))
  r = 6371
  return c * r * 1000

# 雷达型号
def u_x5(x):
  key_list = ['A', 'T', 'N', 'P']
  z = 0
  if any(key in x for key in key_list):
    z = 1
  if z == 1:
    x = 1
  else:
    x = 0.5
  return x

# 雷达用途
def u_x6(x):
  result1 = "制导" in x
  result2 = "搜索" in x
  if result1== True:
    x = 1
  elif result2 == False:
    x = 0.6
  else:
    x = 0.3
  return x


def AHP_main(data):
  global b
# if __name__ == "__main__":
  main()
  # 输入判断矩阵
  # 载频子判断矩阵
  a1 = np.array([[1, 1 / 5, 1 / 3], [5, 1, 3], [3, 1 / 3, 1]])
  # 脉冲重复周期子判断矩阵
  a2 = np.array([[1, 2, 3],[1 / 2, 1, 2], [1 / 3, 1 / 2, 1]])
  # 脉冲宽度子判断矩阵
  a3 = np.array([[1, 1 / 2, 2], [2, 1, 3], [1 / 2, 1 / 3, 1]])
  # 雷达型号、用途子判断矩阵
  a5 = np.array([[1, 2], [1 /2, 1]])
  # 总判断矩阵
  a = np.array([[1, 2, 1, 4, 2], [1 / 2, 1, 1/ 3, 1, 1], [1, 3, 1, 2, 1 / 3],
                [1 / 4, 1, 1 / 2, 1, 1 / 3], [1 / 2, 1, 1, 3, 1]])

  #b = input("请输入辐射源参数:\n")
  b=data
  b = b.replace('[', ' ')
  b = b.replace(']', ' ')
  b = ''.join(b.split())
  c = b.split(",")
  New_c12 = u_x5(c[11])
  New_c13 = u_x6(c[12])
  c[11] = New_c12
  c[12] = New_c13
  b = np.array(c)
  b = [float(i) for i in b]
  print(b)
  print()

  z1,z2,z3,z4,z5 = JS(b).jisuan()

  # 一致性检测
  #AHP(a).test_consist()

  # 算术平均法求权重
  w1 = AHP(a1).cal_weight_by_arithmetic_method()
  w2 = AHP(a2).cal_weight_by_arithmetic_method()
  w3 = AHP(a3).cal_weight_by_arithmetic_method()
  w4 = [1]
  w5 = AHP(a5).cal_weight_by_arithmetic_method()
  w = AHP(a).cal_weight_by_arithmetic_method()

  # 转置
  # w2 = np.transpose(w1)
  # print(w2)

  # 矩阵乘法
  R1 = np.dot(w1, z1)
  R2 = np.dot(w2, z2)
  R3 = np.dot(w3, z3)
  R4 = np.dot(w4, z4)
  R5 = np.dot(w5, z5)

  R = [R1, R2, R3, R4 / 14000000, R5]
  R6 = np.transpose(R)
  R7 = np.dot(w, R)

  # 百分制
  max = np.max(R7)
  print(R7)
  result = (max / 0.86843425)*100
  print("威胁度评分:")
  print(result)
  return result
