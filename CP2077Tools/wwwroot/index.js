var api = "http://api.app.local";
$(document).on({    // 禁用游览器默认行为
    dragleave:function(e){      //拖离
        e.preventDefault();
    },
    drop:function(e){           //拖后放
        e.preventDefault();
    },
    dragenter:function(e){      //拖进
        e.preventDefault();
    },
    dragover:function(e){       //拖来拖去
        e.preventDefault();
    }
});

$(document).ready(function () {
    $(".testBtn").click(function () {
        $.get(api+"/api/hi",function (red) {
            console.log(red);
        })
    });
    $(".about").click(function () {
        // //在这里面输入任何合法的js语句
        layer.open({
            type: 1 //Page层类型
            ,area: ['550px', '350px']
            ,title: '关于'
            ,shade: 0.6 //遮罩透明度
            ,maxmin: false //允许全屏最小化
            ,anim: 1 //0-6的动画形式，-1不开启
            ,content: '<div style="padding:20px;">'+
                '<p>作者 By：小莫 (<span class="buy-me-coffee" onclick="buyMeCoffee()">请我喝咖啡</span>)</p>'+
                '<p>发布地址：<a href="https://mod.3dmgame.com/mod/171654" target="_blank">Mod站</a></p>'+
                '<p>解包内核：https://github.com/rfuzzo/CP77Tools [By:WolvenKit]</p>'+
                '<p>工具源码：https://github.com/3DMXM/Cyberpunk2077Tools</p>'+
                '<p>=========================================</p>'+
                '<p>感谢WolvenKit的开源项目</p>'+
                '<p>如果您对2077的Mod感兴趣，可以考虑加入我们：https://bbs.3dmgame.com/thread-5838764-1-1.html</p>'+
                '<p>使用框架：<a href="https://github.com/NetDimension/NanUI" target="_blank">NanUI</a> | ' +
                '<a href="https://layer.layui.com/" target="_blank">LayUi.Layer</a> | '+
                '<a href="https://api.mtyqx.cn/" target="_blank">墨天逸随机图片</a>'+
                '</p></div>'
        });
    });
    // 隐藏
    $(".hide").click(function () {
        var type = $(this).attr('type');
        if (type == "toHide"){
            $(".container").fadeOut();
            $(this).attr('type',"toShow");

            $(".toShow").show();
            $(".toHide").hide();
        }else {
            $(".container").fadeIn();
            $(this).attr('type',"toHide");

            $(".toHide").show();
            $(".toShow").hide();
        }
    });
    // 刷新
    $(".refresh").click(function () {
        location.reload();
    });
    // 关闭
    $(".close").click(function () {
        if (confirm("您确定要关闭吗?如果有在正在解包的文件,将被停止")){
            $.post(api + "/api/closeApp",function (red) {
                console.log(red);
            });
        }
    });
    // 选择文件
    $(".Select-file").change(function () {
        var file = $(this).prop('files');
        // var FilePathList = [];
        StartLoading()
        for (var i = 0; i < file.length; i++){
            var data = new FormData();
            data.append('file', file[i]);
            var aj = $.ajax({
                url:api+"/api/SelectFile",
                type: 'POST',
                data: data,
                processData : false,
                async: false,
                dataType: "json",
                success:function (red) {
                    // 返回的数据
                    if (red.code == "00"){
                        Stoploading();
                        $("#file-path").val(red.filePath[0]);
                        if (i>0){
                            showFileList2(file[i],red.filePath[0],false);
                        }else {
                            showFileList2(file[i],red.filePath[0]);
                        }
                    }else {
                        alert(red.msg)
                    }
                }
            });
        }
    })
    // 拖拽区域
    var box = document.getElementById('area');
    box.addEventListener("drop",
        function(e) {
            e.preventDefault(); //取消默认浏览器拖拽效果
            var fileList = e.dataTransfer.files; //获取文件对象
            //检测是否是拖拽文件到页面的操作
            if (fileList.length == 0) {
                return false;
            }
            //检测文件格式是否正确
            if (fileList[0].name.indexOf('.archive') === -1) {
                alert("请选择.archive文件");
                return false;
            }
            StartLoading() ;    // 显示加载动画
            for (var i = 0; i < fileList.length;i++){
                var data = new FormData();
                data.append('file', fileList[i]);
                var FilePath = "";
                var aj = $.ajax({
                    url:api+"/api/SelectFile",
                    type: 'POST',
                    data: data,
                    processData : false,
                    async: false,
                    dataType: "json",
                    success:function (red) {
                        // 返回的数据
                        Stoploading();  // 停止加载动画
                        if (i>0){
                            showFileList2(fileList[i],red.filePath[0],false);
                        }else {
                            showFileList2(fileList[i],red.filePath[0]);
                        }
                    }
                });
            }
        },
        false);

    // 提取选中的文件
    $(".ExtractSelectedFile").click(function () {
        if (!CheckFile()){
            return;
        }
        var fileList = [];
        var FilePath = $("#file-path").val();
        $(".file-list-ltem-checkbox:checked").each(function() {
            // fileList.push($(this).attr("file-hash"));
            fileList.push($(this).attr("file-path"));
        });
        var ExtractFolder = $(".export-path-text").val();
        var data = {
            FileList:fileList,
            ExtractFolder:ExtractFolder,
            FilePath:FilePath,
        }
        $.post(api+"/api/ExtractAllFile",JSON.stringify(data),function (red) {
            console.log(red)
        })
    });
    // 提取全部文件
    $(".ExtractAllFile").click(function () {
        if (!CheckFile()){
            return;
        }

        var fileList = [];
        var FilePath = $("#file-path").val();

        $(".file-list-ltem-checkbox").each(function() {
            // fileList.push($(this).attr("file-hash"));
            fileList.push($(this).attr("file-path"));
        });

        var ExtractFolder = $(".export-path-text").val();
        var data = {
            FileList:fileList,
            ExtractFolder:ExtractFolder,
            FilePath:FilePath,
        }
        $.post(api+"/api/ExtractAllFile",JSON.stringify(data),function (red) {
            console.log(red);
        });
    });
    CheckUpdates(); //检测更新
});


let getUrl = function(flie) {
    let url = ''
    if (window.createObjectURL!=undefined) { // basic
        url = window.createObjectURL(flie) ;
    }else if (window.webkitURL!=undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(flie) ;
    }else if (window.URL!=undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(flie) ;
    }
    return url
}

//  格式化文件大小
function renderSize(value){
    if(null==value||value==''){
        return "0 Bytes";
    }
    var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
    var index=0,
        srcsize = parseFloat(value);
    index=Math.floor(Math.log(srcsize)/Math.log(1024));
    var size =srcsize/Math.pow(1024,index);
    //  保留的小数位数
    size=size.toFixed(2);
    return size+unitArr[index];
}

function showFileList2(fileList,FilePath,clearEmt = true) {
    var html = "";
    var fileListItem = "";
    // for (var i = 0; i < fileList.length ; i++) {
        var FileData = fileList;
        fileListItem += "<li class=\"file-list-item ripple\">" +
            "   <label>" +
            "       <input type='checkbox' name='fileList' class='file-list-ltem-checkbox' file-path='" + FilePath + "'>" +
            "       <div class='file-list-ltem-data'>" +
            "           <div class=\"file-list-item-name\">" + FileData.name + "</div>" +
            "           <div class=\"file-list-item-size\">" + renderSize(FileData.size) + "</div>" +
            "       </div>" +
            "    </label>" +
            "</li>";
    // }
    html += " <div class=\"file-list\">" +
        "     <li class=\"file-list-item th\">" +
        "       <div class='file-list-ltem-th-checkbox' style='text-align: center'>选择</div>"+
        "       <div class='file-list-ltem-data'>"+
        "           <div class=\"file-list-item-name\">文件</div>" +
        "           <div class=\"file-list-item-size\" style='text-align: center'>大小</div>" +
        "       </div>" +
        "     </li>" +
                fileListItem +
        "     </div>";

    // 判断是清空还是添加
    if (clearEmt) {
        var nexmoeItem = $(".file-list-nexmoe");
        nexmoeItem.empty();
        nexmoeItem.append(html);
    }else {
        var fileList = $(".file-list");
        fileList.append(fileListItem);
    }
}

// 显示文件列表
// function showFileList(fileList) {
//     var html = "";
//     var fileListItem = "";
//     for (var i = 0; i < fileList.length ; i++){
//         var FileData = fileList[i];
//         fileListItem += "<li class=\"file-list-item ripple\">" +
//             "   <label>"+
//             "       <input type='checkbox' name='fileList' class='file-list-ltem-checkbox' file-hash='"+FileData.FileHash+"'>"+
//             "       <div class='file-list-ltem-data'>" +
//             "           <div class=\"file-list-item-name\">"+FileData.FileValue+"</div>" +
//             "           <div class=\"file-list-item-size\">"+renderSize(FileData.size)+"</div>" +
//             "       </div>" +
//             "    </label>"+
//             "</li>" ;
//     }
//     html += " <div class=\"file-list\">" +
//         "     <li class=\"file-list-item th\">" +
//         "       <div class='file-list-ltem-th-checkbox' style='text-align: center'>选择</div>"+
//         "       <div class='file-list-ltem-data'>"+
//         "           <div class=\"file-list-item-name\">文件</div>" +
//         "           <div class=\"file-list-item-size\" style='text-align: center'>大小</div>" +
//         "       </div>" +
//         "     </li>" +
//               fileListItem +
//         "     </div>";
//     var nexmoeItem = $(".file-list-nexmoe");
//     nexmoeItem.empty();
//     nexmoeItem.append(html);
// }

//显示加载页面
function StartLoading() {
    $(".loding").fadeIn();
}
// 隐藏加载页面
function Stoploading() {
    $(".loding").fadeOut();
}
// 检查导出目录是否为空
function checkExportPath() {
    var path = $(".export-path-text").val();
    if (path == ""){
        return false;
    }else {
        return true;
    }
}
// 检查是否添加文件
function CheckFileList() {
    var fileList = $(".file-list-ltem-checkbox").length;
    if (fileList >0){
        return true;
    }else {
        return false;
    }
}
// 提取文件时进行检查
function CheckFile() {
    if (!CheckFileList()){
        alert("您还未添加文件,请先添加文件后再进行提取操作")
        return false;
    }
    if (!checkExportPath()){
        if (!confirm("您还未填入导出路径,若没有指定导出目录，将默认导出到文件所在目录，是否继续？")){
            $(".export-path-text").focus();
            return false;
        }
    }
    alert("即将开始提取游戏文件,请确保有足够的磁盘空间！");
    return true;
}

function CheckUpdates() {
    $.post(api+"/api/CheckUpdates",function (red) {
        if (red.nowVersion <red.newVersion){
            if (confirm("检查到新版本,是否进行更新？")){
                $.get(api+"/api/openDownloadUrl",function (red) {
                    console.log(red)
                })
            }
        }else {
            console.log("当前已是最新版本")
        }
    })
}
function buyMeCoffee() {
    layer.open({
        type:1,
        area:['300px', '400px'],
        title:'请我喝杯咖啡',
        resize:false,
        scrollbar:false,
        content:'<div class="donate-box"><div class="meta-pay text-center"><strong>这个作者已经懒到不想动了<br/>或许一杯咖啡可以给他点动力</strong></div><div class="qr-pay text-center"><img class="pay-img" id="alipay_qr" src="img/zfb.png"><img class="pay-img d-none" id="wechat_qr" src="img/wx.png"></div><div class="choose-pay text-center mt-2"><input id="alipay" type="radio" name="pay-method" checked><label for="alipay" class="pay-button"><img src="img/alipay.png"></label><input id="wechatpay" type="radio" name="pay-method"><label for="wechatpay" class="pay-button"><img src="img/wechat.png"></label></div></div>'
    });
    $('.choose-pay input[type="radio"]').click(function(){
        var id= $(this).attr('id');
        if(id=='alipay'){$('.qr-pay #alipay_qr').removeClass('d-none');$('.qr-pay #wechat_qr').addClass('d-none')};
        if(id=='wechatpay'){$('.qr-pay #alipay_qr').addClass('d-none');$('.qr-pay #wechat_qr').removeClass('d-none')};
    });
}