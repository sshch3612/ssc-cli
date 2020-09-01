(function(_D) {
    let _self = {};
    let UIsize = 1920;
    _self.resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
    _self.Html = _D.getElementsByTagName("html")[0];
    _self.widthProportion = function() {
        let p = Number((_D.body && _D.body.clientWidth || _self.Html.offsetWidth) / UIsize).toFixed(3);
        return p > 1.067 ? 1.067 : p < 0.444 ? 0.444 : p;
    };
    _self.changePage = function() {
        let docEl = document.documentElement;
        let clientWidth = docEl.clientWidth;
        if (!clientWidth || clientWidth < 1365) {
            _self.Html.setAttribute("style", "font-size:" + 1366 / 1920 * 100 + "px !important");
            return;
        }
        _self.Html.setAttribute("style", "font-size:" + _self.widthProportion() * 100 + "px !important");
    };
    _self.changePage();
    if (!document.addEventListener) return;
    window.addEventListener(_self.resizeEvt, _self.changePage, false);
    document.addEventListener("DOMContentLoaded", _self.changePage, false);
})(document);
