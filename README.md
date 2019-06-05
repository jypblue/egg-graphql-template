# vue-single-template

> Boss 组 Vue 单页模板

## 用法

``` bash
$ npm install -g git+ssh://git@gitlab.yit.com:10022/web/boss-cli.git
  npm install -g git+http://gitlab.yit.com/web/boss-cli.git
  npm install -g @boss/boss-cli  --registry=https://nexus3.yit.com/repository/npm-public/
$ boss init single yit-project
$ cd yit-project
$ npm install
$ npm run dev
```

模板默认拉取的是`master` 分支

## 模板配置项

1. name: 项目名称
2. description: 项目描述
3. author: 项目新建作者邮箱
4. appId: 项目唯一id
5. appKey: 项目localStorage的唯一名称
6. cdnName: 项目的CDN名称
7. devEnv: 项目初始化默认开发环境变量
8. autoInstall: 是否默认安装

## 注意

- 后续新模板项目可以参考本项目
- 本模板目前还有待完善，如果发现不好的地方亦或者有什么好的想法，欢迎大家积极提出，共同维护
- 介绍本模板项目的README.md 在 template 文件夹下
- 配置项问题在meta.js中
