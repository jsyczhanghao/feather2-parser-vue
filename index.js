'use strict';

var REG = /<(script|style|template)>([\s\S]*?)<\/\1>/gi;
var CSS_TPL = feather.util.read(__dirname + '/css.tpl');

module.exports = function(content, file){
    var script = '', tpl = '', style = '';

    content.replace(REG, function(all, tag, cont){
        if(tag == 'script'){
            script = cont;
        }else if(tag == 'template'){
            tpl = cont;
        }else{
            if(cont.trim() == '') return;

            //生成一个临时文件进行css编译
            var css = feather.file.wrap(feather.project.getProjectPath() + file.subpathNoExt + '.css');
            css.setContent(cont);
            css.release = false;
            feather.compile(css);
            style = CSS_TPL.replace('__CSS__', JSON.stringify(css.getContent()));
        }
    });

    script = style + '\r\n' + script;

    if(tpl.trim() == '') return script;

    //exports.default 支持后续es6编译
    return 'var _vueTpl = ' + JSON.stringify(tpl) + ';\r\n' + script + '\r\nmodule.exports[\'default\'] ? (module.exports[\'default\'].template = _vueTpl)'
        + ' : (module.exports.template = _vueTpl)';
};