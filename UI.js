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

http.__okhttp__.setTimeout(10000);

var GLOBAL_CONFIG = storages.create("GLOBAL_CONFIG");
var TTXS_PRO_CONFIG = storages.create("TTXS_PRO_CONFIG");
var STUDY_CONFIG = storages.create("STUDY_CONFIG");
var BAIDUAPI = storages.create("BAIDUAPI");
var execution = "";
var thread = null;
// 版本更新检查
var apkurl = "https://gitee.com/djh010/xuexiqiangguo---xxqg/blob/master/%E5%AD%A6%E4%B9%A0%E5%87%8F%E5%8E%8B4+1pro_2.3.0_sign.apk";
var latest_version = "2.2.0";
if (GLOBAL_CONFIG.get("NO_UPDATE", 0) && (app.versionName != latest_version)) {
    ui.update.visibility = 0;
    ui.update.setText("点击更新至最新版v" + latest_version);
} else if (app.versionName != latest_version) {
    checkversion();
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


