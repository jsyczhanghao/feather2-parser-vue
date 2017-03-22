(function(){ 
var css = __CSS__;
var styleEl = document.createElement('style'); 
document.getElementsByTagName('head')[0].appendChild(styleEl); 
 
if(styleEl.styleSheet){ 
    if(!styleEl.styleSheet.disabled){ 
        styleEl.styleSheet.cssText = css; 
    } 
}else{ 
    try{ 
        styleEl.innerHTML = css 
    }catch(e){ 
        styleEl.innerText = css; 
    } 
} 
})();