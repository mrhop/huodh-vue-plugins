creat some vue plugins
["table",
 "form",
"tab",
 "tree",
 "modal",
 "panel"]
 use bootstrap as the basic css



 遗留问题：
 1.tree 的状态保持，当重新刷新时，使用js  set cookie或者localstore是一个思路
 2.table的后续操作 【title的排序】
 4.form element 遗留，date element,file element 的v-on:change 的处理，不适用v-modal,同时 select 要给出一个X按钮用于清空selected
 5.tab 目前无法包裹vuex-state的数据，这个需要另行设计时考虑



 git的一些处理
 git config --global http.sslVerify false
 git config --local -e
 url = https: or url = git@
  代理的设置和取消
 git config --global https.proxy http://127.0.0.1:8087

 git config --global https.proxy https://127.0.0.1:8087

 git config --global --unset http.proxy

git remote add origin https://github.com/mrhop/xxx.git
git push -u origin master
 //更改git的remote url
 git remote set-url origin https://github.com/mrhop/XXX.git

git remote add origin https://github.com/mrhop/xxx.git
git push -u origin master

git init
git add README.md
git commit -m "first commit"
git remote add origin https://github.com/mrhop/xxx.git
git push -u origin master

 npm adduser
 mrhop
 npm publish
 npm unpublish
 node i --no-optional


 继续react的学习以及深入，并完成关联对策项目
 然后部分关联vuejs
