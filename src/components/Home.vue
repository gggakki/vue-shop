<template>
    
    <el-container class="home-container">
        
        <!-- 头部 -->
        <el-header>
            <div>
                <img src="../assets/logo03.png" alt="">
                <span>后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <!-- 侧边栏菜单 -->
                <el-menu background-color="#304156" text-color="#fff" 
                active-text-color="#57A8CD" unique-opened
                    :collapse="isCollapse"
                    :collapse-transition="false"
                    router :default-active="activePath">
                    <!-- 一级菜单 -->
                    <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单模板 -->
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path+''" v-for="subItem in item.children" :key="subItem.id"
                        @click="saveNavState('/' + subItem.path)"
                        >
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span>{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>

                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧内容 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    export default {
        data() {
            return {
                //左侧菜单数据
                menuList: [],
                iconsObj: {
                    '125': 'iconfont icon-user',
                    '103': 'iconfont icon-tijikongjian',
                    '101': 'iconfont icon-shangpin',
                    '102': 'iconfont icon-danju',
                    '145': 'iconfont icon-baobiao'

                },
                isCollapse: false,
                //被激活的地址
                activePath:''
            }

        },
        created() {
            this.getMenuList()
            this.activePath = window.sessionStorage.getItem('activePath')
        },
        methods: {
            logout() {
                window.sessionStorage.clear()
                this.$router.push('/login')
            },
            //获取所有菜单
            async getMenuList() {
                const { data: res } = await this.$http.get('menus')
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.menuList = res.data
                // console.log(res)

            },
            //点击按钮 切换折叠展开
            toggleCollapse() {
                this.isCollapse = !this.isCollapse
            },
            //保存链接激活状态
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath)
                this.activePath = activePath
            }
        }

    }

</script>

<style lang="less" scoped>
    .home-container {
        height: 100%;
    }

    .el-header {
        padding-left: 0;
        display: flex;
        justify-content: space-between;
        background-color: #283a50;
        color: #e2dcdc;
        font-size: 20px;

    }

    .el-header div {
        display: flex;
        align-items: center;
    }

    .el-header div span {
        margin-left: 15px;
    }

    .el-header img {
        width: 60px;
        height: 100%;
    }

    .el-aside {
        background-color: #304156;
    }

    .el-aside .el-menu {
        border-right: none;
    }

    .el-main {
        background-color: #eaedf1;
    }

    .iconfont {
        margin-right: 10px;
    }

    .toggle-button {
        background-color: #5d7a9b;
        font-size: 10px;
        line-height: 24px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.2em;
        cursor: pointer;
    }
</style>