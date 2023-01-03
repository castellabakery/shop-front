import React, {useState} from 'react';
import {BrowserRouter, Link} from "react-router-dom";
import {UserOutlined} from '@ant-design/icons';
import {AppstoreOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons';
import {Avatar, Breadcrumb, Dropdown, Layout, Menu, Button} from 'antd';

import 'antd/dist/antd.css';
import './AdminContainer.css';
import './common.css';

import AdminRouter from "../../AdminRouter";
import * as MainAPI from '../../api/Main';
import {Message} from "../../../component";

const {Header, Content, Footer, Sider} = Layout;

function getItem(label, key, icon, children, type) {
    return {
        key,
        icon,
        children,
        label,
        type,
    };
}

const AdminContainer = function () {
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    const defaultLargeMenuItem = () => {
        MainAPI.sidemenu('').then(res => {
            setLargeMenuItem(
                (() => {
                    let menuTmp = [];
                    res.list.forEach(obj => {
                        menuTmp.push(
                            makeMenu(obj, '')
                        )
                    })
                    return menuTmp;
                })
            );
        }).catch(e => {
            // Message.error('일시적인 서버 오류입니다. 다시 시도해주세요. - ' + e.error.message);
            alert("일시적인 서버 오류입니다. 다시 시도해주세요.");
        });
    }
    const [largeMenuItem, setLargeMenuItem] = useState(defaultLargeMenuItem);

    const defaultAdminMenuItem = () => {
        MainAPI.mymenu('').then(res => {
            setAdminMenuItem(
                (() => {
                    let menuTmp = [];
                    res.list.forEach(obj => {
                        menuTmp.push({
                            key: obj.key,
                            label: (
                                <Link to={obj.labelLink}>{obj.labelName}</Link>
                            )
                        })
                    })
                    return menuTmp;
                })
            );
        }).catch(e => {
            // Message.error('일시적인 서버 오류입니다. 다시 시도해주세요. - ' + e.error.message);
            alert("일시적인 서버 오류입니다. 다시 시도해주세요.");
        });
    }
    const [adminMenuItem, setAdminMenuItem] = useState(defaultAdminMenuItem);

    const makeMenu = (obj) => {
        let result = [];
        if(obj != undefined && obj != null) {
            if(Array.isArray(obj)) {
                obj.forEach(item => {
                    result.push(
                        getItem(<Link to={(item.labelLink !== null && item.labelLink !== undefined ? item.labelLink : "#")}>{item.labelName}</Link>, item.key, <AppstoreOutlined/>, makeMenu(item.innerMenu, item.key), '')
                    )
                })
            } else {
                result = getItem(<Link to={(obj.labelLink !== null && obj.labelLink !== undefined ? obj.labelLink : "#")}>{obj.labelName}</Link>, obj.key, <AppstoreOutlined/>, makeMenu(obj.innerMenu, obj.key), '')
            }
        } else {
            result = '';
        }
        return result;
    }

    return (
        <div>
            {/*<BrowserRouter>*/}
                <Layout className="layout">
                    <Header>
                        <div className="header-container">
                            <div className="header-item logo">
                                <Link to={"/admin"}>
                                    <p className="logo-text">로고</p>
                                </Link>
                            </div>
                            <div className="header-item avatar">
                                <Dropdown placement="bottom" overlay={<Menu items={adminMenuItem}/>} trigger={"click"}>
                                    <Avatar size="large" icon={<UserOutlined/>}/>
                                </Dropdown>
                            </div>
                        </div>
                    </Header>
                    <Layout>
                        <Sider collapsible collapsed={collapsed}>
                            <div>
                                <Button
                                    type="primary"
                                    onClick={toggleCollapsed}
                                    style={{
                                        marginBottom: 16,
                                    }}
                                >
                                    {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                </Button>
                                <Menu
                                    mode="inline"
                                    theme="dark"
                                    items={largeMenuItem}
                                />
                            </div>
                        </Sider>
                        <Layout>
                            <Content style={{padding: '0 50px'}}>
                                <div className="menu-bread-crumb">
                                    <Breadcrumb style={{margin: '16px 0'}}>
                                    </Breadcrumb>
                                </div>
                                <div className="site-layout-content">
                                    <AdminRouter/>
                                </div>
                            </Content>
                        </Layout>
                    </Layout>
                    <Footer style={{textAlign: 'center'}}></Footer>
                </Layout>

            {/*</BrowserRouter>*/}
        </div>
    );
};

export default AdminContainer;