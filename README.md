# kindlePush

kindle 图书推送

-------------------
- [x] server:
mqtt服务器，作为消息传输的中介

- [x] file
文件服务器，存储文件，并通过mqtt与web服务器交换文件

- [x] web
web服务器，提供页面访问，实现crud、临时性文件服务、文件生命周期控制

- [x] mail
邮件服务器，提供实际邮件发送（已经抽象了一个sendMail函数了）

---------------
2018年8月4日

截至15点59分，完成了通过发起http请求，向kindle实现推送的功能

---------------------
2018年8月5日

要完成的功能：
- Web服务器的文件缓存算法
- 文件服务器在树莓派上的搭建
- 数据库脚本编写

------------------------
2018年8月6日
要完成的功能：
- 新增书籍的接口开发
- 基于vue的pwa+spa框架踩坑

-------------------------
2018年8月7日-9日
前端页面开发

在学习完证从前，暂停项目开发

---------------------------
2018年9月8日
开源至github，文件服务器转用腾讯云cos
后期将追加前端功能
