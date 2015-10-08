$(document).ready(function(){
    
    var url_succeed = "";
    var loc = window.location.pathname;
    var config_loc = loc.replace("/index.html", "/config.xml");
    console.log(loc);
    
    // Config laden
        $.get(
            'config.xml',
            {},
            function (data) {
                var url = $(data).find("URL").text();
                var teamdomain = $(data).find("Team-Domain").text();
                var html = "";
                
                if(url == ""){
                    var error = "";
                    url_succeed = false;
                    console.log("Keine URL angegeben");
                    error += "<p class='error' id='error_text_1'>Achtung! Sie haben in der <a class='error_link' href='" + config_loc + "'>Config.xml</a> keine Slackbot URL angegeben, dadurch kann das Webinterface nichts senden</h1>";
                    
                    $("#error-container").html(error);
                }else{
                    url_succeed = true;
                }
                
                if(teamdomain != ""){
                    html += '<a href="' + teamdomain + '"><img src="images/slackbot_192.png" alt="Slackbot Icon"></a>';
                }else{
                    html += '<img src="images/slackbot_192.png" alt="Slackbot Icon">';
                }
                
                $("#image-container").html(html);
                
            });

    $('#submit').click(function(){

        // Config laden
        $.get(
            'config.xml',
            {},
            function (data) {
                var url = $(data).find("URL").text();
                var teamdomain = $(data).find("Team-Domain").text();

                if(url_succeed == false){
                    document.write("<style type'text/css'>.error_link {color: blue; text-decoration: none;} .error_link:hover {text-decoration: underline;}</style>");
                    document.write('<p style="color: red">Weil sie in der <a class="error_link" href="' + config_loc + '">Config.xml</a> keine Slackbot URL angegeben, kann das Webinterface nichts senden</p> <br> <br> <button onclick="window.location.href=\'index.html\'">Zur&uuml;ck</button>');
                    return false;
                }
                
                // Textfelder auslesen
                var channel = $('input[name=channel]').val();
                var message = $('textarea[name=message]').val();

                // Fehlermeldung wenn Channel leer bleibt
                if(channel == ""){
                    document.write("<p style='color: red'>Bitte Channel angeben</p> <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
                    return false;
                }

                // Fehlermeldung wenn Message leer bleibt
                if(message == ""){
                    document.write("<p style='color: red'>Bitte Nachricht angeben</p> <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
                    return false;
                }


                // Fehlermeldung falls einer trotz Warunung # im Channelnamen verwendet hat
                if(channel.match("#")){
                   document.write("<p style='color: red'>Channelnamen bitte ohne #</p> <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
                    return false;
                }

                // Slackbot URL zusammensetzung
                sburl = url + "&channel=%23" + channel;

                // HTTP POST Request
                $.ajax({
                 type: "POST",
                 url: sburl,
                 data: message,
                 success: function(xml, textStatus, xhr) {
                     if(xml.match("ok")) {
                         document.write("<p style=\"color=\"green\">Deine Nachricht wurde gesendet</p>  <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
                         return false;
                     }
                 },
                 statusCode: {
                        500: function(xhr) {
                            if(xhr.responseText.match("channel_not_found")){
                                document.write("<p style='color: red'>Dieser Channel konnte nicht gefunden werden</p> <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
                            }
                        }
                    }
                });
            });

        return false;
    });



});
