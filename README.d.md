# Docker 搭建私有链

## 下载以太坊镜像
```shell
docker pull ethereum/client-go:latest
```

## 创建虚拟网络
```shell
docker network create -d bridge --subnet=172.18.0.0/24 ethnet
```
其中`bridge`为网络类型-桥接模式，`ethnet`为网络名称。
`--subnet=网关/掩码`

## 创建两个账户容器
* 使用`Docker iamges`，查看镜像image id
* 这里查询到的imageid是`0ff9026cac94`
```shell
C:\Users\Administrator>docker images
REPOSITORY           TAG       IMAGE ID       CREATED      SIZE
ethereum/client-go   latest    0ff9026cac94   2 days ago   66.7MB
```
* 创建容器
```shell
docker run -d -it --name container1 --network ethnet --ip 172.18.0.5 -v C:/D/Docker/test01:/test -p 8546:8545 -p 30304:30303  --entrypoint /bin/sh ethereum/client-go
```
其中`--name`容器名称,`--network`指定网络名称，`--ip`指定ip地址，`-v`指定挂载的目录，`-p`指定端口映射，`--entrypoint`指定容器启动时执行的命令。

这里在创建第二个容器
```shell
docker run -d -it --name container2 --network ethnet --ip 172.18.0.6 -v C:/D/Docker/test01:/test -p 8545:8545 -p 30303:30303  --entrypoint /bin/sh ethereum/client-go
```

## 进入容器命令行

* 通过 docker ps 命令查看容器id
```
C:\Users\Administrator>docker ps
CONTAINER ID   IMAGE                COMMAND     CREATED             STATUS             PORTS                                                                   NAMES
5bbf2fa34455   0ff9026cac94         "/bin/sh"   About an hour ago   Up About an hour   8546/tcp, 30303/udp, 0.0.0.0:8546->8545/tcp, 0.0.0.0:30304->30303/tcp   container2
ee78004c4eed   ethereum/client-go   "/bin/sh"   About an hour ago   Up About an hour   0.0.0.0:8545->8545/tcp, 0.0.0.0:30303->30303/tcp, 8546/tcp, 30303/udp   container1
```

传入对应的容器ID `CONTAINER ID`
这里进入容器1来演示
```shell
docker attribs 5bbf2fa34455
```

## 搭建私有链

这里会用到一个文件`genesis.json`，这个文件是用来初始化创世区块的。
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


提前将这个文件放到挂载目录下，方便初始化
初始化命令：
`--datadir` 指定数据存储目录
```shell
geth --datadir data01  init genesis.json
```
在第二个容器中同样的初始化
```shell
geth --datadir data02  init genesis.json
```

初始化完成后，进入例如`data01`对应的文件夹中实现下一步

## 创建创世区块

`--networkid` 指定网络ID，这里要一致
`--http` 开启http服务
`--http.port` 指定http服务端口
`-http.addr` 指定http服务ip
`--http.api` 指定http服务开放的api
`--port` 指定p2p通信端口

```shell
geth --datadir data01 --networkid 88 --http --http.port "8545" -http.addr 172.18.0.5 --http.api eth,web3,miner,personal,net --port 30303 --nat extip:172.18.0.5 console --nodiscover --allow-insecure-unlock --rpc.enabledeprecatedpersonal
```
第二个容器中同样执行，但是要换下ip，区块名
```shell
geth --datadir data02 --networkid 88 --http --http.port "8545" -http.addr 172.18.0.6 --http.api eth,web3,miner,personal,net --port 30303 --nat extip:172.18.0.6 console --nodiscover --allow-insecure-unlock --rpc.enabledeprecatedpersonal
```

执行后正常来说会进入到console界面

## 创建账户
```shell
personal.newAccount("11")
```
第二个容器中同样
## 启动p2p网络
```shell
admin.newAccount("11")
```

在这个console里
可以通过`admin.peers`查看当前连接的节点,`admin.nodeInfo` 



### 进入第二个容器，在创建账户后，执行
查看当前节点信息`admin.nodeInfo.enode`查看enode信息，复制这个内容`enode://**************************@172.18.0.6:30303?discport=0`
复制这个enode到第一个容器中，在第一个容器中执行
```shell
admin.addPeer("enode://**************************@172.18.0.6:30303?discport=0")
```

`admin.peers`可以看到连接的节点

## 启动挖矿

在第二个容器中执行
```shell
miner.start()
```
