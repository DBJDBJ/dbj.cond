jQuery.print = function (message, insertionType) {
    /*
    example: http://api.jquery.com/keyup/
    insertionType is jQuery method name. append(), prepend(), value(), html()
    Defualt is "append".
requires:
<style>
#print-output {
  width: 100%;
}
.print-output-line {
  white-space: pre;
  padding: 5px;
  font-family: monaco, monospace;
  font-size: .7em;
}
</style>
 */
    if (typeof (message) == 'object') {
        var string = '{<br />',
            values = [],
            counter = 0;
        $.each(message, function (key, value) {
            if (value && value.nodeName) {
                var domnode = '&lt;' + value.nodeName.toLowerCase();
                domnode += value.className ? ' class="' + value.className + '"' : '';
                domnode += value.id ? ' id="' + value.id + '"' : '';
                domnode += '&gt;';
                value = domnode;
            }
            values[counter++] = key + ': ' + value;
        });
        string += values.join(',<br />');
        string += '<br />}';
        message = string;
    }

    var $output = $('#print-output');

    if ($output.length === 0) {
        $output = $('<div id="print-output" />').appendTo('body');
    }

    var $newMessage = $('<div class="print-output-line" />');
    $newMessage.html(message);
    insertionType = insertionType || 'append';
    $output[insertionType]($newMessage);
};
