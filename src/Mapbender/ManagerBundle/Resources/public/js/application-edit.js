$(function() {
    $("button.layerset-action" ).bind("click", function(e) {
        document.location.href = $(this).attr("data-href");
        return false;
    });
    
    $("ul.elements" ).sortable({
        connectWith: "ul.elements",
        items: "li:not(.dummy)",
        distance: 20,
        stop: function( event, ui ) {
            $(ui.item).parent().find("li").each(function(idx, elm){
                window.console && console.log(idx, elm);
                if($(elm).attr("data-href")===$(ui.item).attr("data-href")){
                    window.console && console.log(idx, elm, $(elm).parent().find("li.dummy").length);
                    $.ajax({
                        url: $(ui.item).attr("data-href"),
                        type: "POST",
                        data: {
                            number: idx - $(elm).parent().find("li.dummy").length,
                            region: $(ui.item).parent().attr("data-region")
                        },
                        success: function(data, textStatus, jqXHR){
                            if(data.error && data.error !== ''){
                                document.location.href = document.location.href;
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown ){
                            document.location.href = document.location.href;
                        }
                    });
                }
            });
        }
    });
    $('ul.elements input[type="checkbox"]').click(function() {
        $.ajax({
            url: $(this).attr("data-href"),
            type: "POST",
            data: {
                enabled: $(this).is(":checked")
            },
            success: function(data, textStatus, jqXHR){
                if(data.error && data.error !== ''){
                    document.location.href = document.location.href;
                }
            },
            error: function(jqXHR, textStatus, errorThrown ){
                document.location.href = document.location.href;
            }
        });
    });
    $('ul.layerset input[type="checkbox"]').click(function() {
        $.ajax({
            url: $(this).attr("data-href"),
            type: "POST",
            data: {
                enabled: $(this).is(":checked")
            },
            success: function(data, textStatus, jqXHR){
                if(data.error && data.error !== ''){
                    document.location.href = document.location.href;
                }
            },
            error: function(jqXHR, textStatus, errorThrown ){
                document.location.href = document.location.href;
            }
        });
    });
    $("ul.layerset" ).sortable({
        connectWith: "ul.layerset",
        items: "li:not(.header)",
        distance: 20,
        stop: function( event, ui ) {
            $(ui.item).parent().find("li").each(function(idx, elm){
                if($(elm).attr("data-id")===$(ui.item).attr("data-id")){
                    window.console && console.log($(ui.item).parent());
                    $.ajax({
                        url: $(ui.item).attr("data-href"),
                        type: "POST",
                        data: {
                            number: idx - $(elm).parent().find("li.header").length,
                            new_layersetId: $(elm).parent().attr("data-id")
                        },
                        success: function(data, textStatus, jqXHR){
                            if(data.error && data.error !== ''){
                                document.location.href = document.location.href;
                            }
                        },
                        error: function(jqXHR, textStatus, errorThrown ){
                            document.location.href = document.location.href;
                        }
                    });
                }
            });
        }
    });
    $("ul.layercollection ul").each(function(){
        $(this).sortable({
            cursor: "move",
            connectWith: "ul.layercollection",
            items: "li:not(.header,.root,.dummy)",
            distance: 20,
            stop: function( event, ui ) {
                $(ui.item).parent().find("li").each(function(idx, elm){
                    if($(elm).attr("data-id")===$(ui.item).attr("data-id")){
                    
                        $.ajax({
                            url: $(ui.item).attr("data-href"),
                            type: "POST",
                            data: {
                                number: idx - $("ul.layercollection li.header").length, // idx - header
                                id: $(ui.item).attr("data-id")
                            },
                            success: function(data, textStatus, jqXHR){
                                if(data.error && data.error !== ''){
                                    document.location.href = document.location.href;
                                }
                            },
                            error: function(jqXHR, textStatus, errorThrown ){
                                document.location.href = document.location.href;
                            }
                        });
                    }
                });
            }
        })
    });
    $('ul.layercollection li.node span.colactive:first input[type="checkbox"]').bind("change", function(e){
        if($(this).attr("checked") === "checked"){
            $(this).parent().parent().parent().parent().find('span.colactive input[type="checkbox"]').attr("checked", true).attr("disabled", false);
        }else{
            $(this).parent().parent().parent().parent().find('span.colactive input[type="checkbox"]').attr("checked", false).attr("disabled", true);
            $(this).attr("disabled", false);
        }
    })
    $('ul.layercollection div.group button.groupon').bind("click", function(e){
        var className = $(this).parent().attr('class');
        $('ul.layercollection li span.'+className+' input[type="checkbox"]').each(function(index) {
            if($(this).attr("disabled") !== "disabled"){
                $(this).attr("checked", true);
            }
        });
        return false;
    });
    $('ul.layercollection div.group button.groupoff').bind("click", function(e){
        var className = $(this).parent().attr('class');
        $('ul.layercollection li span.'+className+' input[type="checkbox"]').each(function(index) {
            if($(this).attr("disabled") !== "disabled"){
                $(this).attr("checked", false);
            }
        });
        return false;
    });




    // Layout - Elements ---------------------------------------------------------------------------
    function loadElementFormular(){
        var url = $(this).attr("href");

        if(url){
            $.ajax({
                url: url,
                type: "POST",
                success: function(data){
                   $("#popupContent").wrap('<div id="contentWrapper"></div>').hide();
                   $("#contentWrapper").append('<div id="popupSubContent"></div>');
                   $("#popupSubContent").append(data);
                   var subTitle = $("#popupSubContent").find("#form_title").val();
                   $("#popupSubTitle").text(" - New " + subTitle);
                   $("#popup").find(".buttonOk, .buttonBack").show();
                }
            });
        }

        return false;
    }

    $(".addElement").bind("click", function(){
        if(!$('body').data('mbPopup')) {
            $("body").mbPopup();
            $("body").mbPopup('addButton', "Back", "button buttonBack left", function(){

                $("#popupSubContent").remove();
                $("#popupSubTitle").text("");
                $("#popup").find(".buttonOk, .buttonBack").hide();
                $("#popupContent").show();

            }).mbPopup('showAjaxModal', 
                              {title:"Select Element"},
                              $(this).attr("href"), 
                              function(){ //ok click
                                $("#elementForm").submit();

                                return false;
                              },
                              null,
                              function(){  //afterLoad
                                var popup = $("#popup");

                                popup.find(".buttonOk, .buttonBack").hide();
                                popup.find(".chooseElement").on("click", loadElementFormular)
                              });
        }
        return false;
    });





    // Layers --------------------------------------------------------------------------------------

});