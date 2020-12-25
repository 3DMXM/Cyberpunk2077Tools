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
    // 隐藏
    $(".hide").click(function () {
        var type = $(this).attr('type');
        if (type == "toHide"){
            $(".container").fadeOut();
            $(this).attr('type',"toShow");
        }else {
            $(".container").fadeIn();
            $(this).attr('type',"toHide");
        }
    });
    // 刷新
    $(".refresh").click(function () {
        location.reload();
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
                        debugger
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
            for (var i = 0; i < fileList.length;i++){
                StartLoading() ;    // 显示加载动画
                var data = new FormData();
                data.append('file', fileList[i]);
                var FilePath = "";
                var aj = $.ajax({
                    url:api+"/api/SelectFile",
                    type: 'POST',
                    data: data,
                    processData : false,
                    dataType: "json",
                    success:function (red) {
                        // 返回的数据
                        Stoploading();  // 停止加载动画
                        // $("#file-path").val(red.filePath[0]);
                        FilePath = red.filePath[0];
                        showFileList2(fileList,FilePath);
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
    return true;
}