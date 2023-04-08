<template>
    <div id="#app">
        <div id='title' >
            <div>
                <div>我是一个logo</div>
                  <a-menu v-model="activePath" mode="horizontal" class="menu" @select="menuClick"
                    :default-selected-keys="activePath">
                    <a-menu-item key="/home"> <a-icon type="mail" />首页 </a-menu-item>
                    <a-menu-item key="/sort"> <a-icon type="mail" />分类</a-menu-item>
                    <a-menu-item key="/post"> <a-icon type="mail" />论坛</a-menu-item>
                </a-menu>
                <a-input-search placeholder="请输入关键词" style="width: 18rem;" @search="onSearch" :v-model="homeSearch" />
                <div v-if="!username">
                    <a-button type="link" ghost size="large" @click="loginFormShow">
                        登录
                    </a-button>
                    <a-button type="link" ghost size="large" @click="registerFormShow">
                        注册
                    </a-button>
                </div>
                <div v-else style="color: #fff;cursor: pointer;">
                    <a-dropdown :trigger="['click']">
                        <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                            {{ username }}，欢迎你 <a-avatar icon="user" :src="'http://' + user.pic" size="large" /><a-icon
                                type="down" />
                        </a>
                        <a-menu slot="overlay">
                            <a-menu-item key="0">
                                <a @click="editFormShow">修改信息</a>
                            </a-menu-item>
                            <a-menu-divider />
                            <a-menu-item key="1">
                                <a @click="loginFormShow">切换账号</a>
                            </a-menu-item>
                            <a-menu-item key="2">
                                <a @click="logout">退出登录</a>
                            </a-menu-item>
                        </a-menu>
                    </a-dropdown>
                </div>
            </div>
          
        </div>
        <div id="content" class="w">
            <router-view>
            </router-view>
        </div>
        <!-- 抽屉 -->
        <div>

            <a-drawer :title="isEdit ? '修改信息' : isRegister ? '注册' : '登录'" width="30%" :visible="visible"
                :body-style="{ paddingBottom: '80px' }" @close="onClose">
                <a-form-model layout="horizontal" ref="editForm" :model="editForm" :rules="editRules" v-if="isEdit">
                    <a-form-model-item prop="pic" style="display:flex;justify-content: center;">
                        <a-upload name="file" class="avatar-uploader" :show-upload-list="false"
                            :before-upload="beforeUpload" :customRequest="uploadImg">
                            <a-avatar icon="user" :src="'http://' + editForm.pic || user.pic"
                                style="cursor:pointer;width:5rem;height:5rem"></a-avatar>
                        </a-upload>
                    </a-form-model-item>
                    <a-form-model-item label="用户名" has-feedback prop="username">
                        <a-input v-model="editForm.username" allow-clear>
                            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item label="邮箱" has-feedback prop="email">
                        <a-input v-model="editForm.email" allow-clear>
                            <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                </a-form-model>

                <a-form-model layout="horizontal" ref="ruleForm" :model="ruleForm" :rules="rules" v-else>
                    <a-form-model-item label="用户名" has-feedback prop="userName">
                        <a-input v-model="ruleForm.userName" placeholder="请输入用户名" allow-clear>
                            <a-icon slot="prefix" type="user" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item label="密码" has-feedback prop="password">
                        <a-input-password v-model="ruleForm.password" type="password" placeholder="请输入密码" allow-clear>
                            <a-icon slot="prefix" type="lock" style="color:rgba(0,0,0,.25)" />
                        </a-input-password>
                    </a-form-model-item>
                    <a-form-model-item label="邮箱" v-if="isRegister" has-feedback prop="email">
                        <a-input v-model="ruleForm.email" placeholder="请输入邮箱" allow-clear>
                            <a-icon slot="prefix" type="mail" style="color:rgba(0,0,0,.25)" />
                        </a-input>
                    </a-form-model-item>
                    <a-form-model-item label="身份" v-else prop="isAdmin" has-feedback>
                        <a-select v-model="ruleForm.isAdmin" placeholder="请选择">
                            <a-select-option value="false">
                                用户
                            </a-select-option>
                            <a-select-option value="true">
                                管理员
                            </a-select-option>
                        </a-select>
                    </a-form-model-item>

                </a-form-model>
                <div :style="{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '.0125rem solid #e9e9e9',
                    padding: '.25rem .2rem',
                    background: '#fff',
                    textAlign: 'right',
                    zIndex: 1,
                }">
                    <a-button :style="{ marginRight: '1rem' }" @click="onClose">
                        取消
                    </a-button>
                    <a-button type="primary" @click="handleSubmit" :loading="loading">
                        {{ isRegister ? '注册' : isEdit ? '修改' : '登录' }}
                    </a-button>
                </div>
            </a-drawer>
        </div>

    </div>
</template>

<script>
import { register_, login_, checkUserName_, edit_, getUserInfo_ } from '@/network/user.js'
import { upload_ } from '@/network/util.js'
export default {
    name: 'Home',
    data() {
        let checkPending1;
        let validateUsername = (rule, value, callback) => {
            clearTimeout(checkPending1);
            value.trim()
            if (!value) {
                return callback(new Error('请输入用户名！'));
            }
            checkPending1 = setTimeout(() => {
                if (value.length >= 20) {
                    return callback(new Error('用户名长度<20!'));
                } else {
                    if (this.isRegister) {
                        checkUserName_({ userName: value }).then(res => {
                            console.log(res);
                            if (res.data) {
                                callback()
                            } else {
                                return callback(new Error('用户名已被占用'));
                            }
                        }, err => {
                            console.log(err);
                        })
                    } else {
                        callback()
                    }
                }
            }, 1000);
        };
        let checkPending2
        let validatePass = (rule, value, callback) => {
            clearTimeout(checkPending2);
            if (value === '') {
                callback(new Error('密码不能为空！'));
            } else {
                checkPending2 = setTimeout(() => {
                    if (!/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{6,18}$/.test(value)) {
                        return callback(new Error('密码至少包含一个数字，一个大写字母，一个小写，一个特殊字符(#?!@$%^&*-)，长度在6~18之间'))
                    }
                    callback();
                }, 1500)

            }
        };
        let checkPending3
        let validateEmail = (rule, value, callback) => {
            clearTimeout(checkPending3);
            if (value === '') {
                callback(new Error('邮箱不能为空！'));
            } else {
                checkPending3 = setTimeout(() => {
                    if (!/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(.[a-zA-Z0-9_-]+)+$/.test(value)) {
                        return callback(new Error('请输入正确的邮箱格式!'))
                    }
                    callback();
                }, 1500)

            }
        };

        function getBase64(img, callback) {
            const reader = new FileReader();
            reader.addEventListener('load', () => callback(reader.result));
            reader.readAsDataURL(img);
        }
        return {
            user: {
                email: '',
                id: '',
                pic: '',
                role: '',
                userName: ''
            },
            loading: false,
            editRules: {
                username: [{ validator: validateUsername, trigger: 'change' }],
                pic: [],
                email: [{ validator: validateEmail, trigger: 'change' }],
            },
            editForm: {
                username: '',
                pic: '',
                email: ''
            },
            isEdit: false,
            username: '',
            homeSearch: '',
            activePath: ['/home'],
            ruleForm: {
                userName: '',
                password: '',
                email: '',
                isAdmin: undefined,
            },
            rules: {
                userName: [{ validator: validateUsername, trigger: 'change' }],
                password: [{ validator: validatePass, trigger: 'change' }],
                email: [{ validator: validateEmail, trigger: 'change' }],
                isAdmin: [{ required: true, message: '请选择身份', trigger: 'change' }],
            },
            visible: false,
            isRegister: false,
            spinning: false,
        }
    },
    created() {
        this.init()
    },
    mounted() {
        /* 刷新获取路由 */
        this.getActivePath()
    },
    methods: {
        init() {
            this.getUserInfo()
        },
        getActivePath() {
            setTimeout(() => {
                this.activePath = [this.$route.path]
            }, 200)

        },
        uploadImg(file) {
            const formData = new FormData()
            formData.append('file', file.file)
            upload_(formData).then(res => {
                if (res.success) {
                    this.editForm.pic = res.data.picUrl
                } else {
                    console.log(res);
                }
            }, err => {
                console.log(err);
            }).catch(err => {
                console.log(err);
            })
        },
        beforeUpload(file) {
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
            if (!isJpgOrPng) {
                this.$message.error('You can only upload JPG file!');
            }
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isLt2M) {
                this.$message.error('Image must smaller than 2MB!');
            }
            return isJpgOrPng && isLt2M;
        },
        getUserInfo() {
            this.username = sessionStorage.getItem('username')
            if (!this.username) {
                this.$message.info('请先进行登录！')
                return;
            }
            getUserInfo_().then(res => {
                if (res.code == 200) {
                    this.user = res.data
                    let { userName, email, pic } = res.data
                    this.editForm.username = userName
                    this.editForm.email = email
                    this.editForm.pic = pic
                } else {
                    console.log(res);
                }
            }, err => {
                console.log(err);
            })
        },
        edit() {
            this.$refs['editForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    console.log(this.editForm);
                    edit_(this.editForm).then(res => {
                        console.log(res);
                        if (res.success) {
                            this.$message.success(res.message)
                            this.onClose()
                            this.getUserInfo()
                            this.$router.go(0)
                        } else {
                            this.$message.error(res.message)
                        }
                    }, err => {
                        console.log(err);
                    }).finally(() => {
                        this.loading = false
                    });
                    // this.onClose()
                } else {
                    this.$message.error('请输入正确的信息！')
                    return false;
                }
            })
        },
        logout() {
            let that = this
            this.$confirm({
                okText: '确定',
                cancelText: '取消',
                title: '退出登录',
                content: '确定要退出登录吗？',
                onOk() {
                    sessionStorage.removeItem('username')
                    that.$router.go(0)
                },
                onCancel() { return; },
            });
        },
        onSearch() { },
        menuClick(item) {
            this.$router.push(item.key)
        },
        loginFormShow() {
            this.isEdit = false
            this.isRegister = false
            this.visible = true;
        },
        editFormShow() {
            this.isRegister = false
            this.isEdit = true
            this.visible = true;
        },
        registerFormShow() {
            this.isRegister = true
            this.visible = true;
        },
        onClose() {
            this.visible = false;
        },
        handleSubmit() {
            if (this.isEdit && !this.isRegister) {
                this.edit()
                return;
            }
            this.$refs['ruleForm'].validate(valid => {
                if (valid) {
                    this.loading = true
                    if (this.isRegister) {
                        this.register()
                        return;
                    }
                    else {
                        this.login()
                    }
                    // this.onClose()
                } else {
                    this.$message.error('请输入正确的信息！')
                    return false;
                }
            });

        },
        login() {
            const { userName, password, isAdmin } = this.ruleForm
            login_({ userName, password, isAdmin }).then(res => {
                if (res.code == 200) {
                    new Promise((resolve, reject) => {
                        sessionStorage.clear()
                        this.$message.success('登陆成功！')
                        sessionStorage.setItem('token', res.data.token)
                        sessionStorage.setItem('username', userName)
                        // this.$refs['ruleForm'].resetFields()
                        resolve()
                    }).then(res => {
                        this.$router.go('/home')
                    }, err => {
                        console.log(err);
                    })

                } else {
                    this.$message.error(res.message)
                    console.log(res);
                }

            }, err => {
                console.log(err);
            }).catch(err => {
                this.loading = false
                this.$message.error('登陆失败！请重试！')
            })
        },
        register() {
            this.spinning = true
            const { userName, password, email } = this.ruleForm
            register_({ userName, password, email }).then(res => {
                if (res.code == 200) {
                    new Promise((resolve, reject) => {
                        sessionStorage.clear()
                        this.$message.success('注册成功！')
                        sessionStorage.setItem('token', res.data.token)
                        sessionStorage.setItem('username', userName)
                        // this.$refs['ruleForm'].resetFields()
                        resolve()
                    }).then(res => {
                        this.$router.go('/home')
                    }, err => {
                        console.log(err);
                    })
                }
            }, err => {
                console.log(err);
            }).finally(() => {
                this.loading = false
            })
        }
    }
}
</script>
<style scoped>
.ant-btn-background-ghost.ant-btn-link{
    color:skyblue;
}
.ant-menu{
    background-color: transparent;
}
#title>div:nth-child(1) {
      height: 64px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

#title {
    box-shadow: 10px 1px 10px rgba(0, 0, 0, .9);
    position: fixed;
    width: 100%;
    z-index: 2;
    background-color: #fff;
}

#content {
 position: absolute;
 top:65px;
 bottom: 0;
 width: 100%;
}
</style>