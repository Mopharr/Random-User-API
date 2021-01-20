version = "3.0.0";
counter = 0;
lego = "";
legoMode = false;

function onLoaded() {
    getAUser();
    $(".update").html("Version " + version);
    checkForUpdates();
    var a = new CSInterface,
        c = a.hostEnvironment.appName;
    "FLPR" != c && loadJSX();
    for (var b = ["PHXS"], d = 0; d < b.length; d++) {
        var e = b[d];
        if (0 <= c.indexOf(e) && (e = document.getElementById("btn_" + e))) e.disabled = !1
    }
    updateThemeWithAppSkinInfo(a.hostEnvironment.appSkinInfo);
    a.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, onAppThemeColorChanged);
}

function updateThemeWithAppSkinInfo(a) {
    var c = a.panelBackgroundColor.color;
    document.body.bgColor = toHex(c);
    var b = (new CSInterface).hostEnvironment.appName;
    "PHXS" == b && addRule("ppstyle", "button, select, input[type=button], input[type=submit]", "border-radius:3px;");
    "PHXS" == b || ("PPRO" == b || "PRLD" == b) || (addRule("ppstyle", ".default", "font-size:" + a.baseFontSize + "px; color:" + reverseColor(c) + "; background-color:" + toHex(c, 20)), addRule("ppstyle", "button", "border-color: " + toHex(panelBgColor, -50)))
}

function addRule(a, c, b) {
    if (a = document.getElementById(a)) a = a.sheet, a.addRule ? a.addRule(c, b) : a.insertRule && a.insertRule(c + " { " + b + " }", a.cssRules.length)
}

function reverseColor(a, c) {
    return toHex({
        red: Math.abs(255 - a.red),
        green: Math.abs(255 - a.green),
        blue: Math.abs(255 - a.blue)
    }, c)
}

function toHex(a, c) {
    function b(a, c) {
        var b = !isNaN(c) ? a + c : a;
        0 > b ? b = 0 : 255 < b && (b = 255);
        b = b.toString(16);
        return 1 == b.length ? "0" + b : b
    }
    var d = "";
    if (a) with(a) d = b(red, c) + b(green, c) + b(blue, c);
    return "#" + d
}

function onAppThemeColorChanged(a) {
    a = JSON.parse(window.__adobe_cep__.getHostEnvironment()).appSkinInfo;
    updateThemeWithAppSkinInfo(a)
}

function loadJSX() {
    var a = new CSInterface,
        c = a.getSystemPath(SystemPath.EXTENSION) + "/jsx/";
    a.evalScript('$._ext.evalFiles("' + c + '")')
}

function evalScript(a, c) {
    (new CSInterface).evalScript(a, c)
}

function getAUser() {
    $("#new-user").addClass("active");

    if ($("#men").hasClass("active")) {
        var gender = "&gender=male";
    } else if ($("#both").hasClass("active")) {
        var gender = "";
    } else {
        var gender = "&gender=female";
    }
    $.ajax({
        url: "https://randomuser.me/api/?" + lego + "extension=true" + gender,
        dataType: "json",
        success: function(a) {
            a.error || (a = a.results[0].user, $(".photo img").attr("src", a.picture.replace("portraits/", "portraits/med/")), $(".new-user").removeClass("active"), $("#name").html(a.name.first + " " + a.name.last), $(".control").removeAttr("disabled"), $(".counter").html(++counter + " user" + ((counter == 1) ? "" : "s") + " generated this session"), evalScript("$._random_image.save('" + a.picture + "')"))
        }
    })
}

function addImage() {
    evalScript("$._random_image.open()")
}

function insertAndClip() {
    evalScript("$._image.clip()")
};

function menButton() {
    if (!$("#men").hasClass("active")) {
        $("#men").addClass("active");
        $("#women").removeClass("active");
        $("#both").removeClass("active");
        getAUser();
    }
}

function bothButton() {
    if (!$("#both").hasClass("active")) {
        $("#men").removeClass("active");
        $("#both").addClass ("active");
        $("#women").removeClass("active");
        getAUser();
    }
}

function womenButton() {
    if (!$("#women").hasClass("active")) {
        $("#men").removeClass("active");
        $("#both").removeClass("active");
        $("#women").addClass("active");
        getAUser();
    }
}

function thumbButton() {
    if (!$("#thumb").hasClass("active")) {
        $("#thumb").addClass("active");
        $("#medium").removeClass("active");
        $("#large").removeClass("active");
    }
}

function mediumButton() {
    if (!$("#medium").hasClass("active")) {
        $("#thumb").removeClass("active");
        $("#medium").addClass("active");
        $("#large").removeClass ("active");
    }
}

function largeButton() {
    if (!$("#large").hasClass("active")) {
        $("#thumb").removeClass("active");
        $("#medium").removeClass("active");
        $("#large").addClass("active");
    }
}

function checkForUpdates() {
    $.ajax({
        type: "POST",
        cache: false,
        data: {
                "version": version,
                "2015+": true
            },
        url: "https://randomuser.me/download/version.php",
        dataType: "json",
        success: function(a) {
            setTimeout(function () {
                if (version != a.version) {
                        $(".update").html("<font color='#89c63c'>Version " + a.version + " is now available!</font>");
                }
            }, 1000);
        }
    })
}

function legoButton() {
    if (!legoMode) {
        lego = "lego&";
        $("#legoText").html("Lego mode activated");
        $("#men").attr("disabled", true);
        $("#both").attr("disabled", true);
        $("#women").attr("disabled", true);
        legoMode = true;
    } else {
        lego = "";
        $("#legoText").html("Lego mode deactivated");
        $("#men").removeAttr("disabled");
        $("#both").removeAttr("disabled");
        $("#women").removeAttr("disabled");
        legoMode = false;
    }
    getAUser();
}
