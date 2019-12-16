<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="./../assets/logo.jpg" alt="">
            </div>
            <!-- 登录表单 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input type="password" v-model="loginForm.password" prefix-icon="iconfont icon-3702mima">
                    </el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button @click="login" type="info">登录</el-button>
                    <el-button @click="resetLoginForm" type="warning">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

</template>

<script>
    export default {
        name: 'Login',
        data() {
            return {
                loginForm: {
                    username: 'admin',
                    password: '123456'
                },
                // 表单验证规则对象
                loginFormRules: {
                    // 验证用户名
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    // 验证密码
                    password: [{ required: true, message: '请输入登陆密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
                }
            }
        },

        methods: {
            // 重置登录表单
            resetLoginForm() {
                // console.log(this)
                this.$refs.loginFormRef.resetFields();
            },
            login() {
                this.$refs.loginFormRef.validate(async valid => {
                    if (!valid) return;
                    const { data: res } = await this.$http.post('login', this.loginForm)
                    if (res.meta.status !== 200) return this.$message.error('登录失败')
                    this.$message.success('登录成功')
                    //将登录成功后的 token 保存到sessionStorage中   
                    window.sessionStorage.setItem("token", res.data.token)
                    //通过编程路由跳转到后台主页 /home
                    this.$router.push('/home')
                });
            }
        }
    }
</script>

<style lang="less" scoped>
    .login_container {
        height: 100%;
        background-color: #2b4b6b;
    }

    .login_box {
        position: absolute;
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);

    }

    .avatar_box {
        position: absolute;
        left: 50%;
        transform: translate(-50%, -50%);
        border: 1px solid #eee;
        border-radius: 50%;
        height: 130px;
        width: 130px;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
    }

    .avatar_box img {
        border-radius: 50%;
        width: 100%;
        height: 100%;
        background-color: #eee;
    }

    .login_form {
        padding: 0 20px;
        width: 100%;
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
    }

    .btns {
        display: flex;
        justify-content: flex-end;
    }
</style>