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
 4.form element 完成，包括file，date等
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

  tree item

	tree item的当前点击状态处理(当前选中状态处理)，tree的parent的替换以及点击状态的处理
	form 重置时 files的不能为空问题处理
	排序时未能显示排序的标识

	开始对后端进行处理
  然后是后端对应前端的改造，去除client（首先是user，然后是cms，然后是商城，然后是crm，然后考虑其他）
