# 以太坊搭建
## 1. 安装Geth镜像
```shell
Docker pull ethereum/client-go
```
等待Geth容器镜像下载完成
![](/assets/3.png)

## 2. 创建以太坊网络
* -d
  > 指定Docker网络类型，有`bridge`、`overlay`。其中`bridge`指的桥接模式，`overlay`则是覆盖网络模式。
* --subnet
  > 指定Docker网络的子网。
* ethnet
  > 指定Docker网络的名字。
```shell
docker network create -d bridge --subnet=172.18.0.0/24 ethnet
```
查询docker中已经有的虚拟网络
```shell
docker network ls
```
![](/assets/4.png)
查询网络信息
指定网络名字，例如：`ethnet`
```shell
docker network inspect ethnet
```
![](/assets/5.png)

## 3. 创建以太坊节点
* -d、-it
  > 指定容器运行方式，有`-d`和`-it`两种。`-d`指的是后台运行，`-it`指的是交互式运行。
* --name
  > 指定容器名字。
* --network
  > 指定容器所属的网络。
* --ip
  > 指定容器IP。
* -v
  > 指定容器挂载的数据卷。主机目录路径:容器目录路径。
* -p
  > 指定容器端口映射。
* --entrypoint
  > 指定容器入口文件。
```shell
docker run -d -it --name container1 --network ethnet --ip 172.18.0.5 -v C:/D/Docker/test01:/test -p 8546:8545 -p 30304:30303  --entrypoint /bin/sh ethereum/client-go
```

## 4. 进入容器
```shell
docker exec -it container1 /bin/bash
```

## 5. 初始化以太坊节点
下面用到的初始化文件`genesis.json`
```json
{
    "config": {
        "chainId": 88,
        "homesteadBlock": 0,
        "eip150Block": 0,
        "eip155Block": 0,
        "eip158Block": 0,
        "byzantiumBlock": 0,
        "constantinopleBlock": 0,
        "petersburgBlock": 0,
        "istanbulBlock": 0,
        "berlinBlock": 0,
        "londonBlock": 0
    },
    "alloc": {},
    "coinbase": "0x0000000000000000000000000000000000000000",
    "difficulty": "0x20000",
    "extraData": "",
    "gasLimit": "0x2fefd8",
    "nonce": "0x0000000000000042",
    "mixhash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
    "timestamp": "0x00"
}
```
提前把文件创建在挂载目录`\test`，方便使用该文件
cd到`\test`目录下，初始化以太坊节点
* --datadir
  > 指定以太坊节点数据存储目录。
```shell
geth --datadir data01 init genesis.json
```

## 6. 启动以太坊节点
需要先进入以太坊节点目录`data01`
* --datadir
  > 指定以太坊节点数据存储目录。
* --networkid
  > 指定以太坊网络ID。
* --http
  > 启用HTTP-RPC接口。
* --http.port
  > 指定HTTP-RPC接口监听的端口。
* -http.addr
  > 指定HTTP-RPC接口监听的IP地址。
* --http.api
  > 指定HTTP-RPC接口提供的API。
* --port
  > 指定P2P网络监听的端口。
* --nat
  > 指定网络地址转换类型。
* --nodiscover
  > 禁用节点发现机制。
* --allow-insecure-unlock
  > 允许使用不安全的账户解锁方式。
* --rpc.enabledeprecatedpersonal
  > 启用已弃用的personal模块。
```shell
geth --datadir data01 --networkid 88 --http --http.port "8545" -http.addr 172.18.0.5 --http.api eth,web3,miner,personal,net --port 30303 --nat extip:172.18.0.5 console --nodiscover --allow-insecure-unlock --rpc.enabledeprecatedpersonal
```
## 7. 启动以太坊客户端

### 创建用户
确保使用上面指令成功，已经进入console控制台

`>`
```shell
personal.newAccount("123456")
```
### 查询节点信息
