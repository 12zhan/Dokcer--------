# Docker的安装

## Window环境
### 下载安装包
[https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

### 启动DockerDesktop
手动启动DockerDesktop，以启动服务，一边接下来操作
直到进入是下图的样子，就是服务启动成功了，初次启动耗费时间较长，耐性等待
![Alt text](/assets/1.png)
### 配置镜像加速器
#### 阿里云镜像加速器

## Linux环境
### 程序安装
#### Ubuntu
```shell
apt-get update && apt-get install docker.io
```
#### CentOS
```shell
yum update && yum install docker
```
### 换源
```shell
sudo vim /etc/docker/daemon.json
```
在`daemon.json`文件添加内容
```json
"registry-mirrors": ["https://dockerhub.azk8s.cn"]
```
文件修改成功后需要重启Docker服务
```shell
# 如果你用的servie 管理的服务
servie docker restart
# 如果你用的systemctl 管理的服务
systemctl restart docker
```

### 启动Docker服务
```shell
# 如果你用的servie 管理的服务
servie docker start
# 如果你用的systemctl 管理的服务
systemctl start docker
```

## Mac OS
### 程序安装
```shell
brew cask install docker
```
### 换源
进入`Docker Desktop` Gui程序,Perferences，在左侧导航菜单选择 Docker Engine，在右侧输入栏编辑 json 文件。将`https://****.mirror.aliyuncs.com`加到"registry-mirrors"的数组里，点击 Apply & Restart按钮，等待Docker重启并应用配置的镜像加速器。
![Alt text](/assets/2.png)