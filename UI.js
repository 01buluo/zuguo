"ui";

importClass(java.net.HttpURLConnection);
importClass(java.net.URL);
importClass(java.io.File);
importClass(java.io.FileOutputStream);
importClass(android.graphics.Color);

console.clear();
ui.主题颜色 = "#FFC0CB";
ui.标题 = "学习四合一测试版pro(从疫情中走出，专心于工作)";
ui.副标题 = "让各位从疫情走出来专心于工作";
ui.公告 = "1.仅供个人测试使用（四合一）pro全新上线\n2.群里找最新版本：学习减压4+1pro.apk下载，卸载老版本后重新安卓！\n3.试用期过后，请赞助获取卡密（Q群3：758116397，加群获得最新apk和资料）。\n4.root去除截图权限版适合最新版，适用于手机root或虚拟机或模拟器通过模块去除截图限制等。\n5.全面调整脚本地址，请复制新连接下载更新" + "https://gitee.com/djh010/xuexiqiangguo---xxqg/blob/master/%E5%AD%A6%E4%B9%A0%E5%87%8F%E5%8E%8B4+1pro_2.3.0_sign.apk";

var vip = 1;//VIP权限自由开关
var color = "#FF4FB3FF";

ui.statusBarColor("#FF4FB3FF")

ui.layout(
    <drawer id="drawer">
        <vertical>
            <appbar>
                <toolbar id="toolbar" bg="#ff4fb3ff" title="学习测试四合一PRO"/>
                <tabs id="tabs" bg="#ff4fb3ff"/>
            </appbar>
            <viewpager id="viewpager">
                <frame>
                <vertical>
                           <horizontal>
                             <vertical>
                                {/* 脚本公告配置区域 */}
                             <vertical>
                                <text gravity='center' text='公告' w='*' h='auto' textSize='18sp' textColor='#ffffff' padding='10dp' bg='{{ui.主题颜色}}'></text>
                                <text padding='10dp' text='{{ui.公告}}'></text>
                             </vertical>
                         </vertical>
                     </horizontal>
               </vertical>
              </frame>, "setTing"        
            </viewpager>
        </vertical>
    </drawer>
);

ui.update.visibility = 8;

http.__okhttp__.setTimeout(10000);


var GLOBAL_CONFIG = storages.create("GLOBAL_CONFIG");
var TTXS_PRO_CONFIG = storages.create("TTXS_PRO_CONFIG");
var STUDY_CONFIG = storages.create("STUDY_CONFIG");
var BAIDUAPI = storages.create("BAIDUAPI");
var execution = "";
var thread = null;
Initialize();

// 版本更新检查
var apkurl = "https://gitee.com/djh010/xuexiqiangguo---xxqg/blob/master/%E5%AD%A6%E4%B9%A0%E5%87%8F%E5%8E%8B4+1pro_2.3.0_sign.apk";
var latest_version = "2.2.0";
if (GLOBAL_CONFIG.get("NO_UPDATE", 0) && (app.versionName != latest_version)) {
    ui.update.visibility = 0;
    ui.update.setText("点击更新至最新版v" + latest_version);
} else if (app.versionName != latest_version) {
    checkversion();
}
// 监听心跳失败事件
pjysdk.event.on("heartbeat_failed", function(hret) {
    toastLog(hret.message);
    if (hret.code === 10214) {
        sleep(200);
        exit();  // 退出脚本
        return
    }
    log("心跳失败，尝试重登...")
    sleep(2000);
    let login_ret = pjysdk.CardLogin();
    if (login_ret.code == 0) {
        log("重登成功");
        var vip = 1;
    } else {
        toastLog(login_ret.message);  // 重登失败
        sleep(200);
        exit();  // 退出脚本
    }
});

// 当脚本正常或者异常退出时会触发exit事件
events.on("exit", function(){
    pjysdk.CardLogout(); // 调用退出登录
    log("结束运行");
});



//创建按键的点击事件
ui.denglu.click(function() {
    threads.start(function(){
        pjysdk.SetCard(ui.bh_kami.getText().toString());
        let login_ret = pjysdk.CardLogin();
        if (login_ret.code == 0) {
            // 登录成功，后面写你的业务代码
            // console.show();
            console.log('欢迎你使用本脚本');
            toast('欢迎你使用本脚本');
            var vip = 1;
        
        } else {
            // 登录失败提示
            toast(login_ret.message);
        }
    });
});
//创建按键的点击事件
ui.denglu.on('click', () => {
   // ui.storage.put("bh_kami", ui.bh_kami.text());
    threads.start(ui.pjyLoginFun);
});
ui.获取剩余时长.click(function(){
    console.log('当前卡密使用剩余时长:' + pjysdk.GetTimeRemaining() + '秒');
    if(pjysdk.GetTimeRemaining() > 100 )vip = 1;
    toast('当前卡密使用剩余时长:' + pjysdk.GetTimeRemaining() + '秒');
})
ui.pjyLoginFun = function () {
    //登陆线程
    ui.run(() => {
        ui.endTime.setText("登陆中...");
    });
    let kami = ui.bh_kami.text();
    if (kami != "" && kami != null) {
        console.info("读取到了卡密:%s", kami);
        //开始判断卡密是否过期
        pjysdk.SetCard(kami);
        pjyUser = pjysdk.CardLogin();
    } else {
        console.info("未读取到卡密，开始试用登陆");
        pjyUser = pjysdk.TrialLogin();
    }
    ui.run(function(){
        if (pjyUser.code == 0) {
            ui.endTime.setText(pjyUser.result.expires);
        } else {
            ui.endTime.setText(pjyUser.message);
        }
    });
}



// 创建选项菜单(右上角)
ui.emitter.on("create_options_menu", menu => {
    menu.add("日志");
    menu.add("关于");
    menu.add("Github");
    menu.add("V2.33.0下载");
});

// 监听选项菜单点击
ui.emitter.on("options_item_selected", (e, item) => {
    switch (item.getTitle()) {
        case "日志":
            app.startActivity("console");
            break;
        case "关于":
            alert("关于", "学习测试四合一PRO v" + latest_version + "\n  新Q群：758116397");
            break;
        case "Github":
            app.openUrl("https://gitee.com/djh010/xuexiqiangguo---xxqg/blob/master/%E5%AD%A6%E4%B9%A0%E5%87%8F%E5%8E%8B4+1pro_2.3.0_sign.apk");
            break;
        case "V2.33.0下载":
            app.openUrl("https://android-apps.pp.cn/fs08/2021/12/28/3/110_f37c420b0944cb7b9f60a2ad9b5518d2.apk?yingid=web_space&packageid=500730793&md5=664bb7bdcae57be189fc86100f4371c4&minSDK=21&size=191654161&shortMd5=1fee0bd160d08108a9d9e5f4773ce741&crc32=3879122865&did=ad484a175e19d0928044435e24bf03cb");
            break;
    }
    e.consumed = true;
});
activity.setSupportActionBar(ui.toolbar);

// 设置滑动页面的标题
ui.viewpager.setTitles(["首页"]);
// 让滑动页面和标签栏联动
ui.tabs.setupWithViewPager(ui.viewpager);

// 脚本选择监听
var script_chosen_Listener = new android.widget.AdapterView.OnItemSelectedListener({
    onItemSelected: function (parent, view, position, id) {
        toastLog('选择脚本：\n' + ui.script_chosen.getSelectedItem());
        if (ui.script_chosen.getSelectedItemPosition() == 0) {
            ui.ttxs.visibility = 8;
            ui.study.visibility = 8;
            ui.ttxs_pro.visibility = 0;
           
        }
        else if (ui.script_chosen.getSelectedItemPosition() == 1) {
            ui.ttxs.visibility = 8;
            ui.study.visibility = 8;
            ui.ttxs_pro.visibility = 0;
           
        }
        else if (ui.script_chosen.getSelectedItemPosition() == 2) {
            ui.ttxs_pro.visibility = 8;
            ui.study.visibility = 8;
            ui.ttxs.visibility = 0; 
        }
        else if (ui.script_chosen.getSelectedItemPosition() == 3) {
            ui.ttxs_pro.visibility = 8;
            ui.ttxs.visibility = 8;
            ui.study.visibility = 0;
        }
        GLOBAL_CONFIG.put("script_chosen", ui.script_chosen.getSelectedItemPosition());
    }
})
ui.script_chosen.setOnItemSelectedListener(script_chosen_Listener);

// 用户勾选无障碍服务的选项时，跳转到页面让用户去开启 
// android.permission.SYSTEM_ALERT_WINDOW
ui.autoService.on("check", function (checked) {
    if (checked && auto.service == null) {
        app.startActivity({
            action: "android.settings.ACCESSIBILITY_SETTINGS"
        });
    }
    if (!checked && auto.service != null) {
        auto.service.disableSelf();
    }
});

// 悬浮窗权限
ui.consoleshow.on("check", function (checked) {
    if (checked && !floaty.checkPermission()) {
        app.startActivity({
            packageName: "com.android.settings",
            className: "com.android.settings.Settings$AppDrawOverlaySettingsActivity",
            data: "package:" + context.getPackageName(),
        });
    }
});

// 当用户回到本界面时，resume事件会被触发
ui.emitter.on("resume", function () {
    // 此时根据无障碍服务的开启情况，同步开关的状态
    ui.autoService.checked = auto.service != null;
    ui.consoleshow.checked = floaty.checkPermission();
});

// 打开日志
ui.log.click(function () {
    app.startActivity("console");
});

// APP更新检测
ui.update.click(function () {
    if (app.versionName != latest_version) {
        GLOBAL_CONFIG.put("NO_UPDATE", 0);
        checkversion();
    } else {
        toast("当前已经是最新版本！");
    }
});

// 下载并运行所选脚本
ui.start.click(function () {
    threads.shutDownAll();
    if (thread != null && thread.isAlive()) {
        alert("注意", "脚本正在运行，请结束之前进程");
        return;
    }
    threads.start(function () {
        //let url = 'https://gh-proxy.com/https://raw.githubusercontent.com/sec-an/Better-Auto-XXQG/main/' + ui.script_chosen.getSelectedItemPosition() + '.js';
        let url = 'https://ghproxy.com/https://github.com/sawdjh010/jianya/blob/main/'+ui.script_chosen.getSelectedItemPosition()+'.js';
        if (vip == 1)
        {execution = engines.execScript("学习测试4合1pro", http.get(url).body.string());
        toast('目前处于开放试用阶段') 
        }
        else {toast('请检查是否卡密已过（试用）期或者未输入卡密登录激活') 
            }
    });
});

// 保存学习测试四合一pro脚本设置
ui.ttxs_pro_save.click(function () {
    TTXS_PRO_CONFIG.put("watchdog", ui.ttxs_pro_watchdog.getText() + "");
    TTXS_PRO_CONFIG.put("slide_verify", ui.ttxs_pro_slide_verify.getText() + "");
    TTXS_PRO_CONFIG.put("fast_mode", ui.ttxs_pro_fast_mode.isChecked());
    TTXS_PRO_CONFIG.put("ddtong", ui.ttxs_pro_ddtong.isChecked());
    TTXS_PRO_CONFIG.put("weixin_kaiguan", ui.ttxs_pro_kaiguan.isChecked());
    TTXS_PRO_CONFIG.put("is_exit", ui.ttxs_pro_is_exit.isChecked());
    TTXS_PRO_CONFIG.put("pinglun", ui.ttxs_pro_pinglun.isChecked());
    TTXS_PRO_CONFIG.put("shipin", ui.ttxs_pro_shipin.isChecked());
    TTXS_PRO_CONFIG.put("wenzhang", ui.ttxs_pro_wenzhang.isChecked());
    TTXS_PRO_CONFIG.put("meiri", ui.ttxs_pro_meiri.isChecked());
    TTXS_PRO_CONFIG.put("meizhou", ui.ttxs_pro_meizhou.getSelectedItemPosition());
    TTXS_PRO_CONFIG.put("zhuanxiang", ui.ttxs_pro_zhuanxiang.getSelectedItemPosition());
    TTXS_PRO_CONFIG.put("tiaozhan", ui.ttxs_pro_tiaozhan.isChecked());
    TTXS_PRO_CONFIG.put("ocr_choice", ui.ttxs_pro_ocr_choice.getSelectedItemPosition());
    TTXS_PRO_CONFIG.put("ocr_maxtime", ui.ttxs_pro_ocr_maxtime.getText() + "");
    TTXS_PRO_CONFIG.put("duizhan_mode", ui.ttxs_pro_duizhan_mode.getSelectedItemPosition());
    TTXS_PRO_CONFIG.put("jisu", ui.ttxs_pro_jisu.getText() + "");
    TTXS_PRO_CONFIG.put("guaji", ui.ttxs_pro_guaji.isChecked());
    TTXS_PRO_CONFIG.put("siren", ui.ttxs_pro_siren.isChecked());
    TTXS_PRO_CONFIG.put("dacuo_num", ui.ttxs_pro_dacuo_num.getText() + "");
    TTXS_PRO_CONFIG.put("shuangren", ui.ttxs_pro_shuangren.isChecked());
    TTXS_PRO_CONFIG.put("bendi", ui.ttxs_pro_bendi.isChecked());
    TTXS_PRO_CONFIG.put("yundong", ui.ttxs_pro_yundong.isChecked());
    TTXS_PRO_CONFIG.put("dingyue", ui.ttxs_pro_dingyue.getSelectedItemPosition());
    TTXS_PRO_CONFIG.put("pushplus", ui.ttxs_pro_pushplus.getText() + "");
    TTXS_PRO_CONFIG.put("yl_on", ui.ttxs_pro_yl_on.isChecked());
    TTXS_PRO_CONFIG.put("yinliang", ui.ttxs_pro_yinliang.getText() + "");
    TTXS_PRO_CONFIG.put("zhanghao", ui.ttxs_pro_zhanghao.getText() + "");

    toastLog("学习测试四合一pro配置保存成功！");
});

// 重置学习测试四合一pro脚本设置
ui.ttxs_pro_reset.click(function () {
    TTXS_PRO_CONFIG.put("watchdog", "1800");
    ui.ttxs_pro_watchdog.setText(TTXS_PRO_CONFIG.get("watchdog"));
    TTXS_PRO_CONFIG.put("slide_verify", "300");
    ui.ttxs_pro_slide_verify.setText(TTXS_PRO_CONFIG.get("slide_verify"));
    TTXS_PRO_CONFIG.put("fast_mode", false);
    ui.ttxs_pro_fast_mode.setChecked(TTXS_PRO_CONFIG.get("fast_mode"));
    TTXS_PRO_CONFIG.put("ddtong", false);
    ui.ttxs_pro_ddtong.setChecked(TTXS_PRO_CONFIG.get("ddtong"));
    TTXS_PRO_CONFIG.put("weixin_kaiguan", true);
    ui.ttxs_pro_kaiguan.setChecked(TTXS_PRO_CONFIG.get("weixin_kaiguan"));
    TTXS_PRO_CONFIG.put("is_exit", true);
    ui.ttxs_pro_is_exit.setChecked(TTXS_PRO_CONFIG.get("is_exit"));
    TTXS_PRO_CONFIG.put("pinglun", true);
    ui.ttxs_pro_pinglun.setChecked(TTXS_PRO_CONFIG.get("pinglun"));
    TTXS_PRO_CONFIG.put("shipin", true);
    ui.ttxs_pro_shipin.setChecked(TTXS_PRO_CONFIG.get("shipin"));
    TTXS_PRO_CONFIG.put("wenzhang", true);
    ui.ttxs_pro_wenzhang.setChecked(TTXS_PRO_CONFIG.get("wenzhang"));
    TTXS_PRO_CONFIG.put("meiri", true);
    ui.ttxs_pro_meiri.setChecked(TTXS_PRO_CONFIG.get("meiri"));
    TTXS_PRO_CONFIG.put("meizhou", 0);
    ui.ttxs_pro_meizhou.setSelection(TTXS_PRO_CONFIG.get("meizhou"));
    TTXS_PRO_CONFIG.put("zhuanxiang", 0);
    ui.ttxs_pro_zhuanxiang.setSelection(TTXS_PRO_CONFIG.get("zhuanxiang"));
    TTXS_PRO_CONFIG.put("tiaozhan", true);
    ui.ttxs_pro_tiaozhan.setChecked(TTXS_PRO_CONFIG.get("tiaozhan"));
    TTXS_PRO_CONFIG.put("ocr_choice", 0);
    ui.ttxs_pro_ocr_choice.setSelection(TTXS_PRO_CONFIG.get("ocr_choice"));
    TTXS_PRO_CONFIG.put("ocr_maxtime", "5000");
    ui.ttxs_pro_ocr_maxtime.setText(TTXS_PRO_CONFIG.get("ocr_maxtime"));
    TTXS_PRO_CONFIG.put("duizhan_mode", 0);
    ui.ttxs_pro_duizhan_mode.setSelection(TTXS_PRO_CONFIG.get("duizhan_mode"));
    TTXS_PRO_CONFIG.put("jisu", "0");
    ui.ttxs_pro_jisu.setText(TTXS_PRO_CONFIG.get("jisu"));
    TTXS_PRO_CONFIG.put("guaji", true);
    ui.ttxs_pro_guaji.setChecked(TTXS_PRO_CONFIG.get("guaji"));
    TTXS_PRO_CONFIG.put("siren", true);
    ui.ttxs_pro_siren.setChecked(TTXS_PRO_CONFIG.get("siren"));
    TTXS_PRO_CONFIG.put("dacuo_num", "2");
    ui.ttxs_pro_dacuo_num.setText(TTXS_PRO_CONFIG.get("dacuo_num"));
    TTXS_PRO_CONFIG.put("shuangren", true);
    ui.ttxs_pro_shuangren.setChecked(TTXS_PRO_CONFIG.get("shuangren"));
    TTXS_PRO_CONFIG.put("bendi", true);
    ui.ttxs_pro_bendi.setChecked(TTXS_PRO_CONFIG.get("bendi"));
    TTXS_PRO_CONFIG.put("yundong", true);
    ui.ttxs_pro_yundong.setChecked(TTXS_PRO_CONFIG.get("yundong"));
    TTXS_PRO_CONFIG.put("dingyue", 0);
    ui.ttxs_pro_dingyue.setSelection(TTXS_PRO_CONFIG.get("dingyue"));
    TTXS_PRO_CONFIG.put("pushplus", "");
    ui.ttxs_pro_pushplus.setText(TTXS_PRO_CONFIG.get("pushplus"));
    TTXS_PRO_CONFIG.put("yl_on", true);
    ui.ttxs_pro_yl_on.setChecked(TTXS_PRO_CONFIG.get("yl_on"));
    TTXS_PRO_CONFIG.put("yinliang", "0");
    ui.ttxs_pro_yinliang.setText(TTXS_PRO_CONFIG.get("yinliang"));
    TTXS_PRO_CONFIG.put("zhanghao", "");
    ui.ttxs_pro_zhanghao.setText(TTXS_PRO_CONFIG.get("zhanghao"));

    toastLog("学习测试四合一pro配置恢复默认！");
});

// 保存study脚本设置
ui.study_save.click(function () {
    STUDY_CONFIG.put("article", ui.study_article.isChecked());
    STUDY_CONFIG.put("video", ui.study_video.getSelectedItemPosition());
    STUDY_CONFIG.put("meiri", ui.study_meiri.isChecked());
    STUDY_CONFIG.put("tiaozhan", ui.study_tiaozhan.isChecked());
    STUDY_CONFIG.put("checkbox_01", ui.study_checkbox_01.isChecked());
    STUDY_CONFIG.put("checkbox_02", ui.study_checkbox_02.isChecked());
    STUDY_CONFIG.put("checkbox_03", ui.study_checkbox_03.isChecked());
    STUDY_CONFIG.put("shuangren", ui.study_shuangren.isChecked());

    STUDY_CONFIG.put("huakuaidelay", ui.study_huakuaidelay.getText() + "");
    STUDY_CONFIG.put("select", ui.study_select.getSelectedItemPosition());
    STUDY_CONFIG.put("selectm", ui.study_selectm.getSelectedItemPosition());
    STUDY_CONFIG.put("select_01", ui.study_select_01.getSelectedItemPosition());
    STUDY_CONFIG.put("xianzhi", ui.study_xianzhi.isChecked());
    STUDY_CONFIG.put("another", ui.study_another.getText() + "");
    STUDY_CONFIG.put("stronger", ui.study_stronger.getSelectedItemPosition());

    STUDY_CONFIG.put("ssub", ui.study_ssub.getSelectedItemPosition());
    STUDY_CONFIG.put("diandian", ui.study_diandian.isChecked());
    STUDY_CONFIG.put("alltime", ui.study_alltime.getText() + "");
    STUDY_CONFIG.put("time1", ui.study_time1.getText() + "");
    STUDY_CONFIG.put("time2", ui.study_time2.getText() + "");
    STUDY_CONFIG.put("Token", ui.study_Token.getText() + "");

    toastLog("STUDY配置保存成功！");
});

// 重置study脚本设置
ui.study_reset.click(function () {
    STUDY_CONFIG.put("article", true);
    STUDY_CONFIG.put("video", 0);
    STUDY_CONFIG.put("meiri", true);
    STUDY_CONFIG.put("tiaozhan", true);
    STUDY_CONFIG.put("checkbox_01", true);
    STUDY_CONFIG.put("checkbox_02", true);
    STUDY_CONFIG.put("checkbox_03", true);
    STUDY_CONFIG.put("shuangren", true);
    ui.study_article.setChecked(STUDY_CONFIG.get("article"));
    ui.study_video.setSelection(STUDY_CONFIG.get("video"));
    ui.study_meiri.setChecked(STUDY_CONFIG.get("meiri"));
    ui.study_tiaozhan.setChecked(STUDY_CONFIG.get("tiaozhan"));
    ui.study_checkbox_01.setChecked(STUDY_CONFIG.get("checkbox_01"));
    ui.study_checkbox_02.setChecked(STUDY_CONFIG.get("checkbox_02"));
    ui.study_checkbox_03.setChecked(STUDY_CONFIG.get("checkbox_03"));
    ui.study_shuangren.setChecked(STUDY_CONFIG.get("shuangren"));

    STUDY_CONFIG.put("huakuaidelay", "300");
    STUDY_CONFIG.put("select", 0);
    STUDY_CONFIG.put("selectm", 0);
    STUDY_CONFIG.put("select_01", 0);
    STUDY_CONFIG.put("xianzhi", false);
    STUDY_CONFIG.put("another", "1");
    STUDY_CONFIG.put("stronger", 0);
    ui.study_huakuaidelay.setText(STUDY_CONFIG.get("huakuaidelay"));
    ui.study_select.setSelection(STUDY_CONFIG.get("select"));
    ui.study_selectm.setSelection(STUDY_CONFIG.get("selectm"));
    ui.study_select_01.setSelection(STUDY_CONFIG.get("select_01"));
    ui.study_xianzhi.setChecked(STUDY_CONFIG.get("xianzhi"));
    ui.study_another.setText(STUDY_CONFIG.get("another"));
    ui.study_stronger.setSelection(STUDY_CONFIG.get("stronger"));

    STUDY_CONFIG.put("ssub", 0);
    STUDY_CONFIG.put("diandian", false);
    STUDY_CONFIG.put("alltime", "2000");
    STUDY_CONFIG.put("time1", "61");
    STUDY_CONFIG.put("time2", "6");
    STUDY_CONFIG.put("Token", "");
    ui.study_ssub.setSelection(STUDY_CONFIG.get("ssub"));
    ui.study_diandian.setChecked(STUDY_CONFIG.get("diandian"));
    ui.study_alltime.setText(STUDY_CONFIG.get("alltime"));
    ui.study_time1.setText(STUDY_CONFIG.get("time1"));
    ui.study_time2.setText(STUDY_CONFIG.get("time2"));
    ui.study_Token.setText(STUDY_CONFIG.get("Token"));

    toastLog("STUDY配置恢复默认！");
});

ui.study_baidusave.click(function () {
    check_baidu_api();
});

ui.study_baidureset.click(function () {
    BAIDUAPI.put("AK", "");
    BAIDUAPI.put("SK", "");
    ui.study_AK.setText(BAIDUAPI.get("AK", ""));
    ui.study_SK.setText(BAIDUAPI.get("SK", ""));
    toastLog("百度API恢复默认！");
});

ui.study_baiduregister.click(function () {
    app.openUrl("https://cloud.baidu.com/doc/OCR/s/dk3iqnq51");
});

// 读取脚本设置
function Initialize() {
    ui.script_chosen.setSelection(GLOBAL_CONFIG.get("script_chosen", 0));

    ui.ttxs_pro_watchdog.setText(TTXS_PRO_CONFIG.get("watchdog", "1800"));
    ui.ttxs_pro_slide_verify.setText(TTXS_PRO_CONFIG.get("slide_verify", "300"));
    ui.ttxs_pro_fast_mode.setChecked(TTXS_PRO_CONFIG.get("fast_mode", false));
    ui.ttxs_pro_ddtong.setChecked(TTXS_PRO_CONFIG.get("ddtong", false));
    ui.ttxs_pro_kaiguan.setChecked(TTXS_PRO_CONFIG.get("weixin_kaiguan", true));
    ui.ttxs_pro_is_exit.setChecked(TTXS_PRO_CONFIG.get("is_exit", true));
    ui.ttxs_pro_pinglun.setChecked(TTXS_PRO_CONFIG.get("pinglun", true));
    ui.ttxs_pro_shipin.setChecked(TTXS_PRO_CONFIG.get("shipin", true));
    ui.ttxs_pro_wenzhang.setChecked(TTXS_PRO_CONFIG.get("wenzhang", true));
    ui.ttxs_pro_meiri.setChecked(TTXS_PRO_CONFIG.get("meiri", true));
    ui.ttxs_pro_meizhou.setSelection(TTXS_PRO_CONFIG.get("meizhou", 0));
    ui.ttxs_pro_zhuanxiang.setSelection(TTXS_PRO_CONFIG.get("zhuanxiang", 0));
    ui.ttxs_pro_tiaozhan.setChecked(TTXS_PRO_CONFIG.get("tiaozhan", true));
    ui.ttxs_pro_ocr_choice.setSelection(TTXS_PRO_CONFIG.get("ocr_choice", 0));
    ui.ttxs_pro_ocr_maxtime.setText(TTXS_PRO_CONFIG.get("ocr_maxtime", "5000"));
    ui.ttxs_pro_duizhan_mode.setSelection(TTXS_PRO_CONFIG.get("duizhan_mode", 0));
    ui.ttxs_pro_jisu.setText(TTXS_PRO_CONFIG.get("jisu", "0"));
    ui.ttxs_pro_guaji.setChecked(TTXS_PRO_CONFIG.get("guaji", true));
    ui.ttxs_pro_siren.setChecked(TTXS_PRO_CONFIG.get("siren", true));
    ui.ttxs_pro_dacuo_num.setText(TTXS_PRO_CONFIG.get("dacuo_num", "2"));
    ui.ttxs_pro_shuangren.setChecked(TTXS_PRO_CONFIG.get("shuangren", true));
    ui.ttxs_pro_bendi.setChecked(TTXS_PRO_CONFIG.get("bendi", true));
    ui.ttxs_pro_yundong.setChecked(TTXS_PRO_CONFIG.get("yundong", true));
    ui.ttxs_pro_dingyue.setSelection(TTXS_PRO_CONFIG.get("dingyue", 0));
    ui.ttxs_pro_pushplus.setText(TTXS_PRO_CONFIG.get("pushplus", ""));
    ui.ttxs_pro_yl_on.setChecked(TTXS_PRO_CONFIG.get("yl_on", true));
    ui.ttxs_pro_yinliang.setText(TTXS_PRO_CONFIG.get("yinliang", "0"));
    ui.ttxs_pro_zhanghao.setText(TTXS_PRO_CONFIG.get("zhanghao", ""));

    ui.study_article.setChecked(STUDY_CONFIG.get("article", true));
    ui.study_video.setSelection(STUDY_CONFIG.get("video", 0));
    ui.study_meiri.setChecked(STUDY_CONFIG.get("meiri", true));
    ui.study_tiaozhan.setChecked(STUDY_CONFIG.get("tiaozhan", true));
    ui.study_checkbox_01.setChecked(STUDY_CONFIG.get("checkbox_01", true));
    ui.study_checkbox_02.setChecked(STUDY_CONFIG.get("checkbox_02", true));
    ui.study_checkbox_03.setChecked(STUDY_CONFIG.get("checkbox_03", true));
    ui.study_huakuaidelay.setText(STUDY_CONFIG.get("huakuaidelay", "300"));
    ui.study_shuangren.setChecked(STUDY_CONFIG.get("shuangren", true));
    ui.study_select.setSelection(STUDY_CONFIG.get("select", 0));
    ui.study_selectm.setSelection(STUDY_CONFIG.get("selectm", 0));
    ui.study_select_01.setSelection(STUDY_CONFIG.get("select_01", 0));
    ui.study_xianzhi.setChecked(STUDY_CONFIG.get("xianzhi", false));
    ui.study_another.setText(STUDY_CONFIG.get("another", "1"));
    ui.study_stronger.setSelection(STUDY_CONFIG.get("stronger", 0));
    ui.study_AK.setText(BAIDUAPI.get("AK", ""));
    ui.study_SK.setText(BAIDUAPI.get("SK", ""));
    ui.study_ssub.setSelection(STUDY_CONFIG.get("ssub", 0));
    ui.study_diandian.setChecked(STUDY_CONFIG.get("diandian", false));
    ui.study_alltime.setText(STUDY_CONFIG.get("alltime", "2000"));
    ui.study_time1.setText(STUDY_CONFIG.get("time1", "61"));
    ui.study_time2.setText(STUDY_CONFIG.get("time2", "6"));
    ui.study_Token.setText(STUDY_CONFIG.get("Token", ""));
}

// 检查百度API
function check_baidu_api() {
    thread = threads.start(function () {
        let AK = String(ui.study_AK.getText());
        let SK = String(ui.study_SK.getText());
        var res = http.post(
            'https://aip.baidubce.com/oauth/2.0/token', {
                grant_type: 'client_credentials',
                client_id: AK,
                client_secret: SK
            }
        ).body.json();
        if ("error" in res) {
            toastLog("API Key或Secret Key存在错误");
            console.log(AK);
            console.log(SK);
            ui.study_AK.setText(BAIDUAPI.get("AK", ""));
            ui.study_SK.setText(BAIDUAPI.get("SK", ""));
            BAIDUAPI.put("AK", "");
            BAIDUAPI.put("SK", "");
        } else {
            toastLog("API Key、Secret Key正确，且已缓存");
            BAIDUAPI.put("AK", AK);
            BAIDUAPI.put("SK", SK);
        }
    });
}

// APP更新提示
function checkversion() {
    var releaseNotes = "版本 v" + latest_version + "\n" +
        "更新日志:\n" +
        "* 1.基于AutoX v6.3.4重新打包\n" +
        "* 2.调整默认OCR为Google ML kIT OCR"
    dialogs.build({
            title: "发现新版本",
            content: releaseNotes,
            positive: "立即下载",
            negative: "取消",
            neutral: "浏览器下载",
            checkBoxPrompt: "不再提示",
            cancelable: false
        })
        .on("positive", () => {
            download(apkurl);
        })
        .on("neutral", () => {
            app.openUrl(apkurl);
        })
        .on("check", (checked) => {
            GLOBAL_CONFIG.put("NO_UPDATE", 1);
        }).show();
}

// 打开下载进度面板
function download(url) {
    downloadDialog = dialogs.build({
        title: "正在下载...",
        progress: {
            max: 100,
            showMinMax: true
        },
        autoDismiss: false,
        cancelable: false
    }).show();
    startDownload(url);
}

// 下载apk的主方法体
function startDownload(url) {
    threads.start(function () {
        var path = files.cwd() + "/new.apk";
        let apkFile = new File(path);
        var conn = new URL(url).openConnection();
        conn.connect();
        let is = conn.getInputStream();
        let length = conn.getContentLength();
        let fos = new FileOutputStream(apkFile);
        let count = 0;
        let buffer = java.lang.reflect.Array.newInstance(java.lang.Byte.TYPE, 1024);
        while (true) {
            var p = ((count / length) * 100);
            let numread = is.read(buffer);
            count += numread;
            // 下载完成
            if (numread < 0) {
                toast("下载完成");
                downloadDialog.dismiss();
                downloadDialog = null;
                break;
            }
            // 更新进度条
            downloadDialog.setProgress(p);
            fos.write(buffer, 0, numread);
        }
        fos.close();
        is.close();
        //自动打开进行安装
        app.viewFile(path);
    })
}


console.info("；全面调整脚本地址，请复制新连接下载更新" + "https://gitee.com/djh010/xuexiqiangguo---xxqg/blob/master/%E5%AD%A6%E4%B9%A0%E5%87%8F%E5%8E%8B4+1pro_2.3.0_sign.apk");
console.info("或者群里找最新版本：学习减压4+1pro.apk  下载，卸载老版本后重新安卓");