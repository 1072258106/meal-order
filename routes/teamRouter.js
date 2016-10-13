/**
 * 团队页路由管理
 */

'use strict';

var express = require('express');
var router = express.Router();
var db = require('../database/model');
var util = require('./routerUtil');

router.get('/team', function (req, res) {
    if (!util.authentication(req, res)) return;
    let username = req.session.user.username;
    //TODO 应该是获取团队成员包含该角色的团队
    let queryObj = {
        creatorName: username,
        //members: [username],
        isDeleted: false
    };

    db.teamModel.find(queryObj, (err, result) => {
        console.log(result);
        if (err) {
            return console.error(err);
        }
        res.render('team', {
            title: '团队页',
            username: username,
            nav: 'team',
            teamList: result
        });
    });
});

router.get('/team/add', (req, res) => {
    if (!util.authentication(req, res)) return;

    res.render('team-add', {
        title: '创建团队',
        nav: 'team',
        username: req.session.user.username
    })
});
router.post('/team/add', (req, res) => {
    if (!util.authentication(req, res)) return;
    let userName = req.session.user.username;
    let teamInfo = req.body;
    teamInfo.isDeleted = false;
    teamInfo.creatorName = userName;
    teamInfo.createTime = new Date();
    teamInfo.updaterName = userName;
    teamInfo.updateTime = new Date();

    new db.teamModel(teamInfo).save((err, data) => {
        if (err) {
            res.send({
                success: false,
                message: '创建失败'
            });
            return false;
        }
        res.send({
            success: true,
            message: '创建成功'
        });
    });
});

/**
 * 获取当前用户创建的菜单
 */
router.get('/team/getRelatedMenu', (req, res) => {
    if (!util.authentication(req, res)) return;

    let queryObj = {
        creatorName: req.session.user.username,
        isDeleted: false
    };
    db.menuModel.find(queryObj, (err, result) => {
        if (err) {
            res.send({
                status: 500,
                message: '失败',
                menus: result
            });
           return console.error(err);
        }
        res.send({
            status: 200,
            message: '成功',
            menus: result
        });
    });
});


module.exports = router;