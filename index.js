'use strict';

var REG = /<(script|style|template)(?: ([^>]+))?>([\s\S]*)<\/\1>/gi;
var LANG_REG = /\blang=['"]?([^'" ]+)['"]?/, SCOPED_REG = /\bscoped\b/;
var TEMPLATE = feather.util.read(__dirname + '/template.tpl');
var SCOPE = feather.util.read(__dirname + '/scope.tpl');

module.exports = function(content, file){
    var script = '', tpl = '', style = '', needScoped = false, mid = feather.util.md5(file.id);

    content.toString().replace(REG, function(all, tag, property, cont){
        if(cont.trim() == '') return;

        if(tag == 'script'){
            script = cont;
        }else if(tag == 'template'){
            tpl = cont;
        }else{
            var ext = 'css';

            if(property){
                ext = property.match(LANG_REG);
                ext = ext ? ext[1] || 'css' : 'css';
            }

            //生成一个临时文件进行css编译
            var css = feather.file.wrap(feather.project.getProjectPath() + file.subpathNoExt + '_.' + ext);
            css.cache = file.cache;
            css.setContent(cont);
            feather.compile(css);

            if(needScoped = SCOPED_REG.test(property)){
                cont = css.getContent().trim();
                cont = cont.replace(/((?:^|\})\s*)([^\{]+)/g, function(all, start, selector){
                    selector = selector.split(/\s*,\s*/).map(function(item){
                        item = item.trim();

                        if(item[0] == '@'){
                            return item;
                        }

                        item = item.split(/\s+/);
                        var a = item[0].split(':');
                        a[0] = a[0] + '[data-' + mid + ']';
                        a = a.join(':');
                        item[0] = a;
                        return item.join(' ');
                    }).join(',');

                    return start + selector;
                });

                css.setContent(cont);
            }

            css.links.forEach(function(f){
                file.addLink(f);
            });

            css._mtime = file.getMtime();
            css.getMtime = function(){
                return this._mtime;
            };

            file.derived.push(css);
            file.addRequire(css.id);
        }
    });

    if(!script && !tpl){
        return content;
    }

    if(tpl){
        //exports.default 支持后续es6编译
        script += TEMPLATE.replace('${tpl}', JSON.stringify(tpl));

        if(needScoped){
            script += SCOPE.replace('${id}', mid);
        }
    }

    return script;
};