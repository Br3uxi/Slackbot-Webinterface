$(document).ready(function(){

    $('#submit').click(function(){

        // Config laden
        $.get(
            'config.xml',
            {},
            function (data) {
                var url = $(data).find("URL").text();

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
                         document.write("<p>Deine Nachricht wurde gesendet</p>  <br> <br> <button onclick=\"window.location.href='index.html'\">Zur&uuml;ck</button>");
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
