<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图 -->
        <el-card>
            <!-- 添加角色按钮区  -->
            <el-row>
                <el-col>
                    <el-button type="primary">添加角色</el-button>
                </el-col>
            </el-row>
            <!-- 角色列表 -->
            <el-table :data="rolelist" stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom', i1 === 0 ?'bdtop' : '','vcenter']"
                            v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">
                                    {{item1.authName}}
                                </el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过 for 循环嵌套渲染二级权限 -->
                                <el-row :class="[i2 === 0?'' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children"
                                    :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag closable type="success" @close="removeRightById(scope.row,item2.id)">
                                            {{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                                            closable @close="removeRightById(scope.row,item3.id)">{{item3.authName}}
                                        </el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <pre>{{scope.row}}</pre>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index"></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作" width="300px">
                    <template slot-scope="scope">
                        <el-button @click="" type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                        <el-button type="warning" icon="el-icon-setting" size="mini"
                            @click="showSetRightDialog(scope.row)">
                            分配权限
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 分配权限的对话框 -->
        <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all
                :default-checked-keys="defKeys" ref="treeRef"></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRight">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                //所有角色列表数据
                rolelist: [],
                //控制分配权限对话框的显示与隐藏
                setRightDialogVisible: false,
                //所有权限的数据
                rightsList: [],
                //树形控件的绑定对象
                treeProps: {
                    label: 'authName',
                    children: 'children'
                },
                //默认选中的节点 id值数组
                defKeys: [],
                //当前将分配权限角色的id
                roleId: ''
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            //获取所有角色列表
            async getRolesList() {
                const { data: res } = await this.$http.get('roles')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取角色列表失败')
                }
                this.rolelist = res.data
                console.log(this.rolelist)
            },
            //根据 id 删除对应的权限
            async removeRightById(role, rightId) {
                //弹框提示用户是否删除
                const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).catch(err => err)
                if (confirmResult !== 'confirm') {
                    return this.$message.info('取消了删除')
                }
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) {
                    return this.$message.error('删除权限失败')
                }
                //直接把返回的数据赋值给 children 防止列表刷新
                //this.getRolesList()
                role.children = res.data
            },
            //展示分配权限的对话框
            async showSetRightDialog(role) {

                this.roleId = role.id
                //获取所有权限数据
                const { data: res } = await this.$http.get('rights/tree')
                if (res.meta.status !== 200) {
                    return this.$message.error('获取权限失败')
                }
                //获取到的权限数据保存到 data 中

                this.rightsList = res.data


                //递归获取三级节点的Id
                this.getLeafKeys(role, this.defKeys)

                this.setRightDialogVisible = true
            },
            //通过递归的形式，获取角色下所有三级权限 id 并保存到 defKeys 数组中
            getLeafKeys(node, arr) {
                //如果当前 node 节点不包含 children 属性 则是三级节点
                if (!node.children) {
                    return arr.push(node.id)
                }
                node.children.forEach(item =>
                    this.getLeafKeys(item, arr))
            },
            //监听分配权限对话框的关闭事件
            setRightDialogClosed() {
                this.defKeys = []
            },
            //点击为角色分配权限
            async allotRight() {
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]

                const idStr = keys.join(',')

                const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
                if (res.meta.status !== 200) {
                    return this.$message.error('分配权限失败')
                }
                this.$message.success('分配权限成功')
                this.getRolesList()
                this.setRightDialogVisible = false
            }
        }

    }
</script>

<style scoped>
    .el-tag {
        margin: 7px;
    }

    .bdtop {
        border-top: 1px solid #eee;
    }

    .bdbottom {
        border-bottom: 1px solid #eee;
    }

    .vcenter {
        display: flex;
        align-items: center;
    }
</style>