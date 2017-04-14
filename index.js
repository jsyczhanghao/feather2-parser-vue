'use strict';

var REG = /<(script|style|template)>([\s\S]*)<\/\1>/gi;
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
            css.useMap = false;
            feather.compile(css);
            style = CSS_TPL.replace('__CSS__', JSON.stringify(css.getContent()));
        }
    });

    if(tpl.trim() != ''){
        //exports.default 支持后续es6编译
        script += ';var _vueTpl = ' + JSON.stringify(tpl) + ';module.exports[\'default\'] ? (module.exports[\'default\'].template = _vueTpl)'
        + ' : (module.exports.template = _vueTpl);';
    }

    if(style.trim() != ''){
        script += style;
    }

    return script;
};